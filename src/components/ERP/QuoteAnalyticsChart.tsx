/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 📊 QuoteAnalyticsChart
 *
 * (Placeholder) Component intended to display visual analytics for quote-related data
 * such as price trends, margins, or component breakdowns. Used inside the ERP sidebar
 * beneath the quote stepper.
 */

'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ArchiveIcon, BarChartIcon } from '@radix-ui/react-icons';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function QuoteAnalyticsChart() {
  const monthlyStats = [
    { month: 'Jan', orders: 10, value: 400 },
    { month: 'Feb', orders: 8, value: 300 },
    { month: 'Mar', orders: 12, value: 450 },
    { month: 'Apr', orders: 9, value: 380 },
    { month: 'May', orders: 11, value: 410 },
    { month: 'Jun', orders: 10, value: 390 },
    { month: 'Jul', orders: 10, value: 375 },
    { month: 'Aug', orders: 8, value: 300 },
    { month: 'Sep', orders: 9, value: 325 },
    { month: 'Oct', orders: 10, value: 360 },
    { month: 'Nov', orders: 7, value: 310 },
    { month: 'Dec', orders: 6, value: 300 },
  ];

  const data = {
    labels: monthlyStats.map((m) => m.month),
    datasets: [
      {
        label: 'Orders',
        data: monthlyStats.map((m) => m.orders),
        backgroundColor: [
          '#cbd5e1', // Jan - slate
          '#a5f3fc', // Jul - cyan
          '#d1d5db', // Feb - gray
          '#fcd34d', // Nov - soft gold
          '#bae6fd', // Jun - sky blue
          '#e2e8f0', // Mar - cool gray
          '#f3f4f6', // Apr - light gray
          '#fde68a', // Oct - amber
          '#e0f2fe', // May - light sky blue
          '#bbf7d0', // Aug - green
          '#fef9c3', // Sep - yellow
          '#fbcfe8', // Dec - pink
        ],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const { value, orders } = monthlyStats[index];
            return [`$${value} Total`, `${orders} Orders`];
          },
        },
      },
    },
  };

  return (
    <div className='w-full px-2 flex flex-col gap-2'>
      <h2 className='text-sm font-bold text-gray-700'>Key Statistics – 2025</h2>
      <div className='flex justify-between items-center text-xs text-gray-600'>
        <div className='flex items-center gap-2'>
          <ArchiveIcon className='w-4 h-4 text-gray-500' />
          <span>120 Total Orders</span>
        </div>
        <div className='flex items-center gap-2'>
          <BarChartIcon className='w-4 h-4 text-gray-500' />
          <span>$4,500 Total Profit</span>
        </div>
      </div>
      <div className='text-xs font-bold text-gray-700 text-center'>
        Orders per Month
      </div>
      <div className='h-50 w-50 m-auto'>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
