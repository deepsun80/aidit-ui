import { buildQuotePDF } from '@lib/buildQuotePDF';
import fs from 'fs';
import path from 'path';

// ⛳️ Sample test data
const rfqFields = {
  company: 'Tecomatrix Medical',
  rfqNumber: 'TECO-061225',
  rfqReleaseDate: 'July 12, 2025',
  rfqDueDate: 'July 27, 2025',
  issuedBy: 'David Crossby',
  email: 'david.C@tecomatrix.com',
  phone: '512-200-1000',
  product: 'Varady Extractor',
  specification: 'P17773 Rev C',
  orderQty: 100,
};

const quoteSheetData = {
  Specification: 'P17773 Rev C',
  Units: 100,
  ['Unit Price']: 12.825,
  ['Total Price']: 1282.5,
  Profit: 0.35,
};

// 🧪 Generate the PDF and save to disk
function testGeneratePDF() {
  const doc = buildQuotePDF(quoteSheetData, rfqFields);
  const pdfBytes = doc.output('arraybuffer');

  const outputPath = path.join(process.cwd(), 'test-quote.pdf');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  console.log(`✅ PDF saved to ${outputPath}`);
}

testGeneratePDF();
