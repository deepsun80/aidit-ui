'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/common/NonconformityProgress';

interface RecordItem {
  id: string;
  customer: string;
  date: string;
  nonconformity: { notFound: number; total: number };
}

export default function RecordList({
  onStartNewAssessment,
}: {
  onStartNewAssessment: () => void;
}) {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    const customers = [
      'MedEquip Solutions',
      'SterileTech Corp',
      'BioPro Systems',
      'SterileTech Corp',
      'SterileTech Corp',
      'BioPro Systems',
      'BioPro Systems',
    ];

    const generateId = (i: number): string => {
      const letters = ['R', 'S', 'B'];
      const num = (100 + i).toString();
      const date = `07${10 + i}2025`;
      return `${letters[i % letters.length]}${num}-${date}`;
    };

    const makeDate = (id: string) => {
      const parts = id.split('-')[1];
      return `${parts.slice(0, 2)}/${parts.slice(2, 4)}/${parts.slice(4)}`;
    };

    const generated = customers.map((customer, i) => {
      const id = generateId(i);
      const total = Math.floor(Math.random() * 30 + 50);
      const notFound = Math.floor(Math.random() * (total * 0.3));
      return {
        id,
        customer,
        date: makeDate(id),
        nonconformity: { notFound, total },
      };
    });

    setRecords(generated);
  }, []);

  const filtered = records.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.date.includes(search)
  );

  return (
    <div className='text-gray-900 flex flex-col gap-4'>
      <div className='flex items-center gap-2 justify-end'>
        {/* Search bar */}
        <div className='relative max-w-sm w-full'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search Assessment'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-gray-400'
          />
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
        </div>

        {/* Add Batch Record button */}
        <button className='w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center'>
          <PlusIcon className='w-5 h-5' />
        </button>
      </div>

      <div className='bg-white rounded-sm shadow-md border border-gray-300 p-6'>
        <h3 className='text-md font-semibold text-gray-900 mb-4'>
          Assessment History
        </h3>
        <table className='min-w-full text-sm text-left text-gray-800'>
          <thead className='border-b border-gray-300'>
            <tr>
              <th className='py-2 pr-4 font-semibold'>ID</th>
              <th className='py-2 pr-4 font-semibold'>Customer</th>
              <th className='py-2 pr-4 font-semibold'>Date</th>
              <th className='py-2 font-medium'>Nonconformities</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const { notFound, total } = item.nonconformity;
              const percentage = total > 0 ? (notFound / total) * 100 : 0;
              const barColor =
                percentage <= 25
                  ? '#22c55e'
                  : percentage <= 50
                  ? '#F97316'
                  : '#DC2626';

              return (
                <tr key={i} className='border-b border-gray-100'>
                  <td className='py-4 pr-4'>
                    <a
                      href='#'
                      className='text-blue-600 hover:underline cursor-pointer'
                    >
                      {item.id}
                    </a>
                  </td>
                  <td className='py-4 pr-4'>{item.customer}</td>
                  <td className='py-4 pr-4'>{item.date}</td>
                  <td className='py-4'>
                    <NonconformityProgress
                      notFoundCount={notFound}
                      totalCount={total}
                      barColor={barColor}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className='w-full flex justify-end mt-4'>
        <button
          onClick={onStartNewAssessment}
          className='text-sm px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
        >
          New Assessment
        </button>
      </div>
    </div>
  );
}
