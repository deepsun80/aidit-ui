'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/common/NonconformityProgress';

type Regulation = {
  name: string;
  date: string;
  notFound: number;
  total: number;
};

const allRegulations: Regulation[] = [
  { name: '21 CFR Part 11', date: '02/15/2025', notFound: 3, total: 20 },
  { name: '21 CFR Part 803', date: '03/22/2025', notFound: 8, total: 15 },
  { name: 'ISO 13485', date: '05/10/2025', notFound: 5, total: 18 },
  { name: 'ISO 9001', date: '06/30/2025', notFound: 2, total: 10 },
  { name: 'MDSAP Guidance', date: '04/01/2025', notFound: 8, total: 25 },
];

export default function RegulationList({
  setActiveRegulation,
}: {
  setActiveRegulation: (reg: Regulation) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState(allRegulations);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(allRegulations);
    } else {
      const lower = searchTerm.toLowerCase();
      setFiltered(
        allRegulations.filter((r) => r.name.toLowerCase().includes(lower))
      );
    }
  }, [searchTerm]);

  return (
    <>
      {/* Search */}
      <div className='flex justify-end mb-6 relative'>
        <div className='relative w-full max-w-sm'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Regulation'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-gray-400'
          />
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-sm shadow-md border border-gray-200 p-6'>
        <table className='min-w-full text-sm text-left text-gray-800'>
          <thead className='border-b border-gray-300'>
            <tr>
              <th className='py-2 pr-4 font-semibold'>Regulation</th>
              <th className='py-2 pr-4 font-semibold'>Last Audit Date</th>
              <th className='py-2 font-semibold'>Nonconformities</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg, idx) => (
              <tr key={idx} className='border-b border-gray-100'>
                <td className='py-4 pr-4'>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveRegulation(reg);
                    }}
                    className='text-blue-600 hover:underline'
                  >
                    {reg.name}
                  </a>
                </td>
                <td className='py-4 pr-4'>{reg.date}</td>
                <td className='py-4'>
                  <NonconformityProgress
                    notFoundCount={reg.notFound}
                    totalCount={reg.total}
                    barColor={
                      reg.notFound / reg.total <= 0.25
                        ? '#22c55e'
                        : reg.notFound / reg.total <= 0.5
                        ? '#F97316'
                        : '#DC2626'
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
