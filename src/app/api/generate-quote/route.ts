/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import XLSX_CALC from 'xlsx-calc';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'sample-data',
      'pricing_v2.xlsx'
    );
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // 🔁 Evaluate all formulas
    XLSX_CALC(workbook);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = sheetData[0] as string[];
    const row = sheetData[1] as any[];

    const result: Record<string, any> = {};
    headers.forEach((key, i) => {
      result[key] = row[i];
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Failed to read or evaluate spreadsheet:', err);
    return NextResponse.json(
      { error: 'Failed to read spreadsheet' },
      { status: 500 }
    );
  }
}
