/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { formatError } from '@lib/helpers';

const TEMP_UPLOAD_DIR = '/tmp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Only accept .xlsx files
    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return NextResponse.json(
        { error: 'Only .xlsx files are allowed' },
        { status: 400 }
      );
    }

    console.log('📥 Received file:', file.name);

    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);
    const safeFileName = file.name.replace(/\s+/g, '_');
    const filePath = path.join(TEMP_UPLOAD_DIR, safeFileName);
    await fs.writeFile(filePath, fileBuffer);

    console.log('📂 File saved at:', filePath);

    // Parse spreadsheet using SheetJS
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

    if (!rows || rows.length < 2) {
      return NextResponse.json(
        { error: 'No data rows found in spreadsheet' },
        { status: 400 }
      );
    }

    const [headerRow, ...dataRows] = rows;
    const questions = dataRows
      .map((row) => {
        const question = row[0]?.toString().trim();
        const reference = row[1]?.toString().trim() || '';
        if (!question) return null;
        return { question, reference };
      })
      .filter(Boolean);

    console.log('✅ Extracted questions from .xlsx:', questions.length);

    await fs.unlink(filePath);

    return NextResponse.json({
      message: 'File processed successfully',
      questions,
    });
  } catch (error) {
    console.error('❌ XLSX upload route failed:', error);
    return NextResponse.json(
      { error: formatError(error, 'Failed to process uploaded spreadsheet.') },
      { status: 500 }
    );
  }
}
