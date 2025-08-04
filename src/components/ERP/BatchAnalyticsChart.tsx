/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  ArchiveIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BatchAnalyticsChart() {
  const totalBatches = 10;
  const compliantBatches = 7;
  const nonConformingBatches = totalBatches - compliantBatches;

  const nonConformanceList = [
    {
      id: 'BR-2025-0001',
      nonConformance: 1,
    },
    {
      id: 'BR-2025-0004',
      nonConformance: 3,
    },
    {
      id: 'BR-2025-0007',
      nonConformance: 2,
    },
  ];

  const doughnutData = {
    labels: ['Compliant', 'Non-Conforming'],
    datasets: [
      {
        label: 'Batch Quality',
        data: [compliantBatches, nonConformingBatches],
        backgroundColor: ['#bbf7d0', '#fecaca'], // green, red-tinted
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.label}: ${context.raw} batch${
              context.raw === 1 ? '' : 'es'
            }`,
        },
      },
    },
  };

  return (
    <div className='w-full px-2 flex flex-col gap-2'>
      <h2 className='text-sm font-bold text-gray-700'>Key Batch Metrics</h2>
      <div className='flex justify-between items-center text-xs text-gray-600'>
        <div className='flex items-center gap-2'>
          <ArchiveIcon className='w-4 h-4 text-gray-500' />
          <span>{totalBatches} Batches Processed</span>
        </div>
        <div className='flex items-center gap-2'>
          <CheckCircledIcon className='w-4 h-4 text-green-500' />
          <span>{compliantBatches} Compliant</span>
        </div>
        <div className='flex items-center gap-2'>
          <ExclamationTriangleIcon className='w-4 h-4 text-red-500' />
          <span>{nonConformingBatches} Non-Conforming</span>
        </div>
      </div>

      <div className='flex text-xs font-bold text-gray-700 m-2'>
        <div className='w-[40%] text-center'>Compliance Breakdown</div>{' '}
        <div className='w-[60%] text-center'>Non-Conformance Summary</div>
      </div>

      <div className='flex gap-4 items-start justify-between'>
        {/* Doughnut chart (smaller) */}
        <div className='w-[40%]'>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>

        {/* Table summary (larger) */}
        <div className='w-[60%] text-xs text-gray-700'>
          <div className='grid grid-cols-2 font-semibold text-gray-500 mb-1'>
            <div>Batch #</div>
            <div>Non-Conformance</div>
          </div>
          {nonConformanceList.map((item) => (
            <div
              key={item.id}
              className='grid grid-cols-2 py-2 gap-2 border-t border-gray-200 text-gray-800'
            >
              <div>
                <a
                  href='#'
                  className='text-blue-600 hover:underline cursor-pointer'
                >
                  {item.id}
                </a>
              </div>
              <div>{item.nonConformance}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
