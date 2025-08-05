'use client';

import { useState } from 'react';

type BatchYearSelectorProps = {
  onSelectionComplete: () => void;
};

export default function BatchYearSelector({
  onSelectionComplete,
}: BatchYearSelectorProps) {
  const [year, setYear] = useState('');

  const handleSelect = (value: string) => {
    setYear(value);
    if (value) {
      setTimeout(() => onSelectionComplete(), 0);
    }
  };

  return (
    <div className='flex flex-col gap-3 text-sm text-gray-700'>
      <div>
        <label htmlFor='year' className='font-semibold'>
          Select Year
        </label>
        <select
          id='year'
          value={year}
          onChange={(e) => handleSelect(e.target.value)}
          className='w-full bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
        >
          <option value=''>-- Choose Year --</option>
          {[2025, 2024, 2023, 2022].map((y) => (
            <option key={y} value={y} disabled={y !== 2025}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
