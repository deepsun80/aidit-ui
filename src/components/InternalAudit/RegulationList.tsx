'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/common/NonconformityProgress';

type Regulation = {
  name: string;
  date: string;
  notFound: number;
  total: number;
  regulations: string;
  standards: string;
};

const allRegulations: Regulation[] = [
  {
    name: 'Quality System',
    date: '02/15/2025',
    notFound: 3,
    total: 10,
    regulations:
      '21 CFR 820.20(a), 21 CFR 820.20(c), 21 CFR 820.20(e), 21 CFR 820.40(b)',
    standards: 'ISO 9001/13485 5.3, 4.2.1, 4.2.2, 5.5.3',
  },
  {
    name: 'Purchasing Controls',
    date: '02/15/2025',
    notFound: 8,
    total: 15,
    regulations: '21 CFR 820.50, 21 CFR 820.100, 21 CFR 820.80',
    standards: 'ISO 9001/13485 7.4.1, 7.4.2, 7.4.3',
  },
  {
    name: 'Training',
    date: '02/15/2025',
    notFound: 5,
    total: 18,
    regulations: '21 CFR 820.25(e), 21 CFR 820.25(b)',
    standards: 'ISO 9001/13485 6.2.2',
  },
  {
    name: 'Document Controls',
    date: '02/15/2025',
    notFound: 2,
    total: 10,
    regulations: '21 CFR 820.40',
    standards: 'ISO 9001/13485 4.2.3, ',
  },
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
      <div className='flex justify-end mb-6 relative gap-2 items-center'>
        <div className='relative w-full max-w-sm'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Process'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-gray-400'
          />
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
        </div>

        {/* Add Regulation button */}
        <button
          className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
          title='Add Regulation'
        >
          <PlusIcon className='text-white w-5 h-5' />
        </button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-sm shadow-md border border-gray-200 p-6'>
        <table className='min-w-full text-sm text-left text-gray-800 table-fixed'>
          <thead className='border-b border-gray-300'>
            <tr>
              <th className='py-2 px-2 w-1/4 font-semibold break-words'>
                Process
              </th>
              <th className='py-2 px-2 w-1/4 font-semibold break-words'>
                Regulations
              </th>
              <th className='py-2 px-2 w-1/4 font-semibold break-words'>
                Standards
              </th>
              <th className='py-2 px-2 w-1/4 font-semibold break-words'>
                Last Audit Date
              </th>
              <th className='py-2 px-2 font-semibold'>Nonconformities</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg, idx) => (
              <tr key={idx} className='border-b border-gray-100'>
                <td className='py-4 px-2 break-words'>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (reg.name === 'Quality System') {
                        setActiveRegulation(reg);
                      }
                    }}
                    className='text-blue-600 hover:underline'
                  >
                    {reg.name}
                  </a>
                </td>
                <td className='py-4 px-2 break-words'>{reg.regulations}</td>
                <td className='py-4 px-2 break-words'>{reg.standards}</td>
                <td className='py-4 px-2 break-words'>{reg.date}</td>
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
