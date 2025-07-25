import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate parsed RFQ fields from PDF
    const rfqFields = {
      company: 'Tecomatrix Medical',
      rfqReleaseDate: 'July 12, 2025',
      rfqDueDate: 'July 27, 2025',
      rfqNumber: 'TECO-061225',
      issuedBy: 'David Crossby',
      email: 'david.C@tecomatrix.com',
      phone: '512-200-1000',
      product: 'Varady Extractor',
      specification: 'P17773 Rev C',
      orderQty: 100,
    };

    return NextResponse.json(rfqFields);
  } catch (err) {
    console.error('RFQ generation error:', err);
    return NextResponse.json({ error: 'Failed to parse RFQ' }, { status: 500 });
  }
}
