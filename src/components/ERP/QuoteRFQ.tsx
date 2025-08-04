'use client';

import { RFQFields } from '@/types/rfq';

type QuoteRFQProps = {
  rfqFields: RFQFields;
};

export default function QuoteRFQ({ rfqFields }: QuoteRFQProps) {
  return (
    <div className='space-y-2 text-sm text-gray-700 leading-snug'>
      {Object.entries({
        'RFQ Number': rfqFields.rfqNumber,
        Company: rfqFields.company,
        'Release Date': rfqFields.rfqReleaseDate,
        'Due Date': rfqFields.rfqDueDate,
        'Issued By': rfqFields.issuedBy,
        Email: rfqFields.email,
        Phone: rfqFields.phone,
        Product: rfqFields.product,
        Spec: rfqFields.specification,
        Qty: rfqFields.orderQty,
      }).map(([label, value]) => (
        <div key={label}>
          <span className='font-semibold'>{label}:</span> {value}
        </div>
      ))}
    </div>
  );
}
