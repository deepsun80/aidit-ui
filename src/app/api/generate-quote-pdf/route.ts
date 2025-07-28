import { NextResponse } from 'next/server';
import { buildQuotePDF } from '@lib/buildQuotePDF';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteSheetData, rfqFields } = body;

    if (!quoteSheetData || !rfqFields) {
      return NextResponse.json(
        { error: 'Missing quoteSheetData or rfqFields' },
        { status: 400 }
      );
    }

    const doc = buildQuotePDF(quoteSheetData, rfqFields);

    // Output PDF as Uint8Array (Node-friendly)
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Quote_${rfqFields.rfqNumber.replace(
          /\s+/g,
          '_'
        )}.pdf`,
      },
    });
  } catch (err) {
    console.error('Error generating quote PDF:', err);
    return NextResponse.json(
      { error: 'Failed to generate quote PDF' },
      { status: 500 }
    );
  }
}
