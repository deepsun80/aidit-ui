/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from 'jspdf';

interface QuoteSheetData {
  [key: string]: any;
}

interface RFQFields {
  company: string;
  rfqNumber: string;
  rfqReleaseDate: string;
  rfqDueDate: string;
  issuedBy: string;
  email: string;
  phone: string;
  product: string;
  specification: string;
  orderQty: number;
}

export function buildQuotePDF(
  quoteSheetData: QuoteSheetData,
  rfqFields: RFQFields
) {
  const doc = new jsPDF();
  const margin = 15;
  let y = margin;

  // === Customer Info ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer`, margin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(rfqFields.company, margin + 30, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.text('5700 BeeCave Road', margin + 30, y);
  y += 5;
  doc.text('Austin Texas 78750', margin + 30, y);
  y += 8;

  doc.text(`Requested by: ${rfqFields.issuedBy}`, margin, y);
  y += 6;
  doc.text(`Date: ${rfqFields.rfqReleaseDate}`, margin, y);
  y += 5;
  doc.text(`Valid until: ${rfqFields.rfqDueDate}`, margin, y);
  y += 5;
  doc.text(`Quote #: Q4778`, margin, y);
  y += 5;
  doc.text(`Shipment: UPS Ground`, margin, y);
  y += 5;
  doc.text(`Term: 90 days`, margin, y);
  y += 10;

  // === Special Notes ===
  doc.setFont('helvetica', 'bold');
  doc.text('Special Notes and Instructions', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.text(`Price Quote issued as per RFQ number:`, margin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${rfqFields.rfqNumber}`, margin + 70, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.text(`Lead time - 4–6 weeks`, margin, y);
  y += 6;
  doc.text(`Please email your purchase order to`, margin, y);
  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.text(`Purchase@machinining.com`, margin, y);
  y += 10;

  // === Line Item Header ===
  doc.setFont('helvetica', 'bold');
  doc.text('Item', margin, y);
  doc.text('Description', margin + 20, y);
  doc.text('Qty (Ea)', margin + 95, y);
  doc.text('Unit Price', margin + 125, y);
  doc.text('Cost', margin + 155, y);
  y += 7;

  // === Line Item Data ===
  const {
    ['Specification']: spec,
    ['Units']: qty,
    ['Unit Price']: unitPrice,
    ['Total Price']: totalPrice,
  } = quoteSheetData;

  doc.setFont('helvetica', 'normal');
  doc.text('1', margin, y);
  doc.text(`${rfqFields.product} -`, margin + 20, y);
  y += 5;
  doc.text(`${spec}`, margin + 20, y);
  doc.text(`${qty}`, margin + 95, y);
  doc.text(`$${unitPrice.toFixed(2)}`, margin + 125, y);
  doc.text(`$${totalPrice.toFixed(2)}`, margin + 155, y);
  y += 10;

  // === Totals ===
  doc.setFont('helvetica', 'bold');
  doc.text(`Line Total: $${totalPrice.toFixed(2)}`, margin + 125, y);
  y += 6;
  doc.text(`Tax: $0.00`, margin + 125, y);
  y += 6;
  doc.text(`Total Amount: $${totalPrice.toFixed(2)}`, margin + 125, y);
  y += 12;

  // === Footer ===
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Certification Provided by Your Local Sales Representative',
    margin,
    y
  );
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.text(
    'Above information is not an invoice and only an estimate of service/goods described above.',
    margin,
    y
  );
  y += 5;
  doc.text(
    'Payment and shipment terms shall be confirmed prior to commencement of service/goods described in this quote.',
    margin,
    y
  );
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for your business!!', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.text(
    'Should you have any enquiries concerning this quote, please contact Phil Dybel at',
    margin,
    y
  );
  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.text('Phild@machinining.com', margin, y);

  // === Return PDF instance instead of saving ===
  return doc;
}
