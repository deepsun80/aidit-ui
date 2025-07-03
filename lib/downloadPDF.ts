import { jsPDF } from 'jspdf';
import { QAReport, QA } from '@/types/qa';

export function handleDownloadPDF(
  qaList: QA[],
  report: QAReport,
  highlightNonconformities: boolean = false
) {
  if (!qaList || qaList.length === 0 || !report) return;

  const doc = new jsPDF();
  const margin = 10;
  const maxWidth = 180;
  let y = margin;

  // === Add Audit Metadata Header ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Audit ID: ${report.auditId}`, margin, y);
  y += 8;
  doc.text(`Requesting Entity: ${report.customer}`, margin, y);
  y += 8;
  doc.text(`Requested Date: ${report.date}`, margin, y);
  y += 8;

  // === Loop through Q/A items ===
  qaList.forEach((qa, index) => {
    const [rawQuestion, rawReference] = qa.question.split(' - ');
    const questionText = `${index + 1}: ${rawQuestion.trim()}`;
    const wrappedQuestion = doc.splitTextToSize(questionText, maxWidth);
    const referenceText = rawReference
      ? `Standard Reference: ${rawReference.trim()}`
      : null;
    const wrappedReference = referenceText
      ? doc.splitTextToSize(referenceText, maxWidth)
      : [];

    const lines = qa.answer.split('\n');
    const citationLine = lines.find((line) =>
      line.toLowerCase().startsWith('citation:')
    );
    const mainAnswerLines = lines.filter(
      (line) => !line.toLowerCase().startsWith('citation:')
    );
    const formattedAnswer = `A: ${mainAnswerLines.join('\n   ')}`;
    const wrappedAnswer = doc.splitTextToSize(formattedAnswer, maxWidth);
    const wrappedCitation = citationLine
      ? doc.splitTextToSize(citationLine, maxWidth)
      : [];

    const isNonconformity = qa.answer.trim().toLowerCase().startsWith('no');

    const requiredHeight =
      6 +
      wrappedQuestion.length * 6 +
      (referenceText ? wrappedReference.length * 6 + 2 : 0) +
      wrappedAnswer.length * 6 +
      (citationLine ? wrappedCitation.length * 6 + 2 : 0) +
      2;

    if (y + requiredHeight > 280) {
      doc.addPage();
      y = margin;
    }

    // Divider line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, 200, y);
    y += 8;

    // Question line
    doc.setFont('helvetica', 'bold');
    if (highlightNonconformities && isNonconformity) {
      doc.setTextColor(255, 0, 0); // red
      doc.text('•', margin, y);
      doc.setTextColor(0, 0, 0); // reset to black
      doc.text(wrappedQuestion, margin + 5, y);
    } else {
      doc.text(wrappedQuestion, margin, y);
    }
    y += wrappedQuestion.length * 6;

    if (referenceText) {
      doc.setFont('helvetica', 'italic');
      doc.text(wrappedReference, margin, y);
      y += wrappedReference.length * 6 + 1;
    }

    doc.setFont('helvetica', 'normal');
    doc.text(wrappedAnswer, margin, y);
    y += wrappedAnswer.length * 6;

    if (citationLine) {
      doc.setFont('helvetica', 'italic');
      doc.text(wrappedCitation, margin, y);
      y += wrappedCitation.length * 6;
    }
  });

  const fileName = `${report.auditId.replace(/\s+/g, '_')}_report.pdf`;
  doc.save(fileName);
}
