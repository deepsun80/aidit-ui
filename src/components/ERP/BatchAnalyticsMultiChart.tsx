/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Batch = {
  id: string;
  nonConformance: string | null;
};

type BatchAnalyticsMultiChartProps = {
  selectedBatches: Batch[];
};

// 🔁 Utility to get N unique random items
function getRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

export default function BatchAnalyticsMultiChart({
  selectedBatches,
}: BatchAnalyticsMultiChartProps) {
  // Define categories (non-conformance types)
  const categories = ['Missing Signature', 'Incorrect PO', 'Out of Tolerance'];

  // Split compliant and non-compliant
  const nonConformingBatches = selectedBatches.filter(
    (b) => b.nonConformance === 'yes'
  );

  // Generate stacked bar data
  const chartData = useMemo(() => {
    const dataPerCategory: Record<string, { batchId: string; page: number }[]> =
      {
        'Missing Signature': getRandomSubset(nonConformingBatches, 5).map(
          (batch) => ({
            batchId: batch.id,
            page: Math.floor(Math.random() * 10) + 1,
          })
        ),
        'Incorrect PO': [
          {
            batchId: nonConformingBatches[0]?.id,
            page: Math.floor(Math.random() * 10) + 1,
          },
          ...getRandomSubset(nonConformingBatches.slice(1), 1).map((batch) => ({
            batchId: batch.id,
            page: Math.floor(Math.random() * 10) + 1,
          })),
        ],
        'Out of Tolerance': getRandomSubset(nonConformingBatches, 1).map(
          (batch) => ({
            batchId: batch.id,
            page: 7,
          })
        ),
      };

    const allStacks = nonConformingBatches.map((batch, batchIdx) => {
      return {
        label: batch.id,
        data: categories.map((cat) =>
          dataPerCategory[cat].some((d) => d.batchId === batch.id) ? 1 : 0
        ),
        pageNumbers: categories.map((cat) => {
          const entry = dataPerCategory[cat].find(
            (d) => d.batchId === batch.id
          );
          return entry ? entry.page : null;
        }),
        backgroundColor: `hsl(${(batchIdx * 60) % 360}, 70%, 70%)`,
      };
    });

    return {
      labels: categories,
      datasets: allStacks.filter((stack) => stack.data.some((val) => val > 0)),
    };
  }, [nonConformingBatches]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: function (context: any) {
            const page = context.dataset.pageNumbers?.[context.dataIndex];
            return page ? `Page: ${page}` : '';
          },
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          max: 5,
        },
      },
    },
  };

  return (
    <div className='w-full px-2 flex flex-col gap-2'>
      <h2 className='text-sm font-bold text-gray-700'>Batch Comparison</h2>
      <div className='flex justify-between items-center text-xs text-gray-600'>
        <div className='flex items-center gap-2'>
          <ExclamationTriangleIcon className='w-4 h-4 text-red-500' />
          <span>
            {nonConformingBatches.length} Non-Conforming Batch
            {nonConformingBatches.length > 1 ? 'es' : ''} Processed
          </span>
        </div>
      </div>

      {/* Stacked Pareto-style Bar Chart */}
      <div className='mt-4'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
