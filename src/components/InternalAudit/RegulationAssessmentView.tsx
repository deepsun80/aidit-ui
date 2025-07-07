'use client';

import { CaretLeftIcon } from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/common/NonconformityProgress';

type Regulation = {
  name: string;
  date: string;
  notFound: number;
  total: number;
};

interface Assessment {
  auditId: string;
  date: string;
  notFound: number;
  total: number;
}

function generateMockHistory(reg: Regulation): Assessment[] {
  const baseDate = new Date(reg.date);
  const abbrev = reg.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const history: Assessment[] = [];

  // First item matches the regulation’s values exactly
  history.push({
    auditId: `${String(baseDate.getMonth() + 1).padStart(2, '0')}${String(
      baseDate.getDate()
    ).padStart(2, '0')}${baseDate.getFullYear()}${abbrev}`,
    date: baseDate.toLocaleDateString('en-US'),
    notFound: reg.notFound,
    total: reg.total,
  });

  // Generate the rest as random historical data
  for (let i = 1; i < 6; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i * 40);
    const dateStr = date.toLocaleDateString('en-US');
    const id = `${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}${date.getFullYear()}${abbrev}`;

    const total = Math.floor(Math.random() * 30 + 10);
    const notFound = Math.floor(Math.random() * (total * 0.3));

    history.push({
      auditId: id,
      date: dateStr,
      notFound,
      total,
    });
  }

  return history;
}

export default function RegulationAssessmentView({
  regulation,
  onRunAssessment,
  onBack,
  onViewReport,
}: {
  regulation: Regulation;
  onRunAssessment: () => void;
  onBack: () => void;
  onViewReport: (auditId: string, date: string) => void;
}) {
  const mockHistory = generateMockHistory(regulation);

  return (
    <div className='max-w-4xl mx-auto flex flex-col text-gray-900 gap-4'>
      {/* Header */}
      <div className='flex justify-between items-start'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900 mb-1'>
            {regulation.name} — Audit History
          </h2>
          <p className='text-sm text-gray-600'>
            Last Audit: <strong>{regulation.date}</strong>
          </p>
          <div className='mt-2'>
            <NonconformityProgress
              notFoundCount={regulation.notFound}
              totalCount={regulation.total}
              barColor={
                regulation.notFound / regulation.total <= 0.25
                  ? '#22c55e'
                  : regulation.notFound / regulation.total <= 0.5
                  ? '#F97316'
                  : '#DC2626'
              }
            />
          </div>
        </div>
        <button
          onClick={onBack}
          className='w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center'
          title='Back'
        >
          <CaretLeftIcon className='w-5 h-5' />
        </button>
      </div>

      {/* History Table */}
      <div className='bg-white shadow-md rounded-sm border border-gray-300 p-6'>
        <h3 className='text-md font-semibold text-gray-900 mb-4'>
          Assessment History
        </h3>
        <table className='min-w-full text-sm text-left text-gray-800'>
          <thead className='border-b border-gray-300'>
            <tr>
              <th className='py-2 pr-4 font-semibold'>Audit ID</th>
              <th className='py-2 pr-4 font-semibold'>Date</th>
              <th className='py-2 font-semibold'>Nonconformities</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item, idx) => (
              <tr key={idx} className='border-b border-gray-100'>
                <td className='py-3 pr-4'>
                  {idx === 0 ? (
                    <a
                      onClick={() => onViewReport(item.auditId, item.date)}
                      className='text-blue-600 hover:underline cursor-pointer'
                    >
                      {item.auditId}
                    </a>
                  ) : (
                    <a
                      href='#'
                      className='text-blue-600 hover:underline cursor-pointer'
                    >
                      {item.auditId}
                    </a>
                  )}
                </td>
                <td className='py-3 pr-4'>{item.date}</td>
                <td className='py-3'>
                  <NonconformityProgress
                    notFoundCount={item.notFound}
                    totalCount={item.total}
                    barColor={
                      item.notFound / item.total <= 0.25
                        ? '#22c55e'
                        : item.notFound / item.total <= 0.5
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

      {/* Button */}
      <div className='w-full flex justify-end'>
        <button
          onClick={onRunAssessment}
          className='text-sm px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 mt-4'
        >
          New Assessment
        </button>
      </div>
    </div>
  );
}
