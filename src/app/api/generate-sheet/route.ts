import { NextResponse } from 'next/server';
import path from 'path';
import ExcelJS from 'exceljs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rfqFields = body.rfqFields;

    if (!rfqFields) {
      return NextResponse.json({ error: 'Missing RFQ data' }, { status: 400 });
    }

    // 1. Load pricing_v2.xlsx from /public/sample-data
    const filePath = path.join(
      process.cwd(),
      'public',
      'sample-data',
      'pricing_v2.xlsx'
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    // 2. Write RFQ fields to the correct cells
    sheet.getCell('A2').value = rfqFields.specification;
    sheet.getCell('B2').value = rfqFields.rfqReleaseDate;
    sheet.getCell('C2').value = rfqFields.rfqDueDate;
    sheet.getCell('D2').value = rfqFields.rfqNumber;
    sheet.getCell('F2').value = rfqFields.orderQty;

    // 3. Save the updated workbook back to the same file
    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({ message: 'RFQ data written to spreadsheet.' });
  } catch (err) {
    console.error('Error writing to Excel:', err);
    return NextResponse.json(
      { error: 'Failed to write RFQ to spreadsheet' },
      { status: 500 }
    );
  }
}
