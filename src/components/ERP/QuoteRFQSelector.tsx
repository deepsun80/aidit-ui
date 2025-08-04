'use client';

type QuoteRFQSelectorProps = {
  rfqChoice: string;
  setRfqChoice: (val: string) => void;
  setRfqSelected: (val: boolean) => void;
  fetchRFQ: () => void;
};

export default function QuoteRFQSelector({
  rfqChoice,
  setRfqChoice,
  setRfqSelected,
  fetchRFQ,
}: QuoteRFQSelectorProps) {
  return (
    <div className='flex flex-col gap-2 text-sm text-gray-700'>
      <label htmlFor='rfq-select' className='font-semibold'>
        Select RFQ
      </label>
      <select
        id='rfq-select'
        className='bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
        value={rfqChoice}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'TECO-061225') {
            setRfqChoice(val);
            setRfqSelected(true);
            setTimeout(fetchRFQ, 1000);
          }
        }}
      >
        <option value=''>-- Choose RFQ --</option>
        <option value='TECO-061225'>TECO-061225</option>
        <option value='STX-042224' disabled>
          STX-042224
        </option>
        <option value='FLEX-050124' disabled>
          FLEX-050124
        </option>
      </select>
    </div>
  );
}
