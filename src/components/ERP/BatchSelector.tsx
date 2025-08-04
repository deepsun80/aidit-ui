// components/ERP/BatchSelector.tsx
'use client';

import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

interface BatchSelectorProps {
  selectedBatches: string[];
  setSelectedBatches: (val: string[]) => void;
}

const mockBatches = [
  { id: 'BR-2025-0001', nonConformance: 'yes' },
  { id: 'BR-2025-0002', nonConformance: 'no' },
  { id: 'BR-2025-0003', nonConformance: 'no' },
  { id: 'BR-2025-0004', nonConformance: 'yes' },
  { id: 'BR-2025-0005', nonConformance: 'no' },
  { id: 'BR-2025-0006', nonConformance: 'no' },
  { id: 'BR-2025-0007', nonConformance: 'yes' },
  { id: 'BR-2025-0008', nonConformance: 'no' },
  { id: 'BR-2025-0009', nonConformance: 'no' },
  { id: 'BR-2025-0010', nonConformance: 'no' },
  { id: 'BR-2025-0011', nonConformance: null },
  { id: 'BR-2025-0012', nonConformance: null },
];

export default function BatchSelector({
  selectedBatches,
  setSelectedBatches,
}: BatchSelectorProps) {
  return (
    <div className='flex flex-col gap-2 text-sm text-gray-700'>
      <div className='font-semibold'>Select Batch Records</div>
      <div className='grid grid-cols-2 gap-2'>
        {mockBatches.map((batch) => (
          <label key={batch.id} className='flex items-center gap-2'>
            <input
              type='checkbox'
              value={batch.id}
              checked={selectedBatches.includes(batch.id)}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedBatches((prev) =>
                  checked
                    ? [...prev, batch.id]
                    : prev.filter((id) => id !== batch.id)
                );
              }}
              className='accent-gray-700'
            />

            <span>{batch.id}</span>

            {batch.nonConformance === 'yes' && (
              <span className='text-red-500'>
                <CrossCircledIcon className='w-4 h-4' />
              </span>
            )}
            {batch.nonConformance === 'no' && (
              <span className='text-green-600'>
                <CheckCircledIcon className='w-4 h-4' />
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
