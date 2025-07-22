/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface QuoteAnalyticsChartProps {
  customer: string;
}

export default function QuoteAnalyticsChart({
  customer,
}: QuoteAnalyticsChartProps) {
  const demoData = [
    { name: customer, rate: 72 },
    { name: 'MedCore Labs', rate: 55 },
    { name: 'AxisGenix Inc.', rate: 63 },
    { name: 'NovaForm Devices', rate: 41 },
  ];

  const data = {
    labels: demoData.map((item) => item.name),
    datasets: [
      {
        label: 'Quote to P.O. Conversion (%)',
        data: demoData.map((item) => item.rate),
        backgroundColor: demoData.map((item) =>
          item.name === customer ? 'rgb(249, 115, 22)' : 'rgb(191, 219, 254)'
        ),
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw}% conversion`,
        },
      },
    },
    scales: {
      x: {
        max: 100,
        ticks: { callback: (value: any) => `${value}%` },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className='w-full px-2'>
      <h2 className='text-sm font-semibold text-gray-700 mb-2'>
        Quote to P.O. Conversion
      </h2>
      <Bar data={data} options={options} height={140} />
    </div>
  );
}
