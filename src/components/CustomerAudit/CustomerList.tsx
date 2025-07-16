'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/common/NonconformityProgress';
import AlertPopover from '@/components/Dashboard/AlertPopover';

interface ReportTitle {
  id: string;
  customer: string;
}

interface AuditItem extends ReportTitle {
  date: string;
  nonconformity?: { notFound: number; total: number };
}

type Tab = 'pending' | 'recent' | 'scheduled';

const randomDates2025 = [
  '01162025',
  '02282025',
  '03072025',
  '04122025',
  '05162025',
  '06062025',
  '06222025',
  '07282025',
  '08022025',
  '09122025',
  '09202025',
  '10042025',
  '10272025',
  '11012025',
  '11162025',
  '12052025',
  '12202025',
  '12272025',
  '08062025',
  '03162025',
];

const customers = [
  'ABC Inc',
  'MedEquip Solutions',
  'Nova Diagnostics',
  'Pioneer Labs',
  'SterileTech Corp',
  'Helix Medical',
  'BioPro Systems',
  'Precision Devices',
  'Axis Medtech',
  'VitaGen Instruments',
];

const formatDateFromId = (id: string): string => {
  const mm = id.slice(0, 2);
  const dd = id.slice(2, 4);
  const yyyy = id.slice(4, 8);
  return `${mm}/${dd}/${yyyy}`;
};

const generateReportTitles = (): ReportTitle[] => {
  const titles: ReportTitle[] = [];
  for (let i = 0; i < 15; i++) {
    const dateCode = randomDates2025[i % randomDates2025.length];
    const customer = customers[i % customers.length];
    const abbrev = customer
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    titles.push({ id: `${dateCode}${abbrev}`, customer });
  }
  return titles;
};

const generateRandomAudits = (
  titles: ReportTitle[]
): Record<Tab, AuditItem[]> => {
  return {
    pending: titles.slice(0, 5).map(({ id, customer }) => ({
      id,
      customer,
      date: formatDateFromId(id),
      nonconformity: {
        notFound: Math.floor(Math.random() * 50),
        total: Math.floor(Math.random() * 50 + 51),
      },
    })),
    recent: titles.slice(5, 10).map(({ id, customer }) => {
      const total = Math.floor(Math.random() * 40 + 60);
      const maxNotFound = Math.floor(total * 0.25);
      return {
        id,
        customer,
        date: formatDateFromId(id),
        nonconformity: {
          notFound: Math.floor(Math.random() * (maxNotFound + 1)),
          total,
        },
      };
    }),
    scheduled: titles.slice(10, 15).map(({ id, customer }) => ({
      id,
      customer,
      date: formatDateFromId(id),
    })),
  };
};

export default function CustomerList({
  onStartNewAssessment,
}: {
  onStartNewAssessment: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTitles, setFilteredTitles] = useState<ReportTitle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      message: 'Pending audit with MedEquip Solutions due in a week.',
      type: 'warning',
    },
    {
      id: 2,
      message: 'Scheduled audit from ABC Inc due in a week, not started.',
      type: 'warning',
    },
  ]);
  const reportTitles = generateReportTitles();
  const [auditData, setAuditData] = useState<Record<Tab, AuditItem[]>>({
    pending: [],
    recent: [],
    scheduled: [],
  });

  useEffect(() => {
    setAuditData(generateRandomAudits(reportTitles));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTitles([]);
      return;
    }
    setIsSearching(true);
    const delay = setTimeout(() => {
      const filtered = reportTitles.filter(
        (item) =>
          item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTitles(filtered);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className='text-gray-900 gap-4'>
      {/* Search */}
      <div className='flex justify-end mb-6 relative'>
        <div className='relative w-full max-w-sm'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Audit'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-gray-400'
          />
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
          {isSearching ? (
            <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md z-10 flex items-center justify-center py-4'>
              <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            </div>
          ) : (
            filteredTitles.length > 0 && (
              <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md z-10'>
                {filteredTitles.map((item, idx) => (
                  <div
                    key={idx}
                    className='px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer'
                  >
                    {item.id} — {item.customer}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Wrapper and Button */}
      <div className='flex flex-col gap-4'>
        <div className='bg-white rounded-sm shadow-md border border-gray-300 p-6'>
          <div className='flex gap-6 border-b border-gray-200 mb-6'>
            {['pending', 'recent', 'scheduled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`pb-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab[0].toUpperCase() + tab.slice(1)} Audits
              </button>
            ))}
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left text-gray-800'>
              <thead className='border-b border-gray-300'>
                <tr>
                  <th className='py-2 pr-4 font-semibold'>Audit ID</th>
                  <th className='py-2 pr-4 font-semibold'>Requesting Entity</th>
                  <th className='py-2 pr-4 font-semibold'>Requested Date</th>
                  {activeTab !== 'scheduled' && (
                    <th className='py-2 font-medium'>Nonconformities</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {auditData[activeTab]?.map((item, idx) => {
                  const nc = item.nonconformity;
                  const notFound = nc?.notFound || 0;
                  const total = nc?.total || 0;
                  const percentage = total > 0 ? (notFound / total) * 100 : 0;
                  const barColor =
                    percentage <= 25
                      ? '#22c55e'
                      : percentage <= 50
                      ? '#F97316'
                      : '#DC2626';

                  return (
                    <tr key={idx} className='border-b border-gray-100'>
                      <td className='py-4 pr-4'>
                        <a
                          href='#'
                          onClick={(e) => e.preventDefault()}
                          className='text-blue-600 hover:underline'
                        >
                          {item.id}
                        </a>
                      </td>
                      <td className='py-4 pr-4'>{item.customer}</td>
                      <td className='py-4 pr-4'>{item.date}</td>
                      {nc && (
                        <td className='py-4'>
                          <NonconformityProgress
                            notFoundCount={notFound}
                            totalCount={total}
                            barColor={barColor}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Assessment Button */}
        <div className='w-full flex justify-end mt-4'>
          <button
            onClick={onStartNewAssessment}
            className='text-sm px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className='fixed bottom-6 right-6 z-50 flex flex-col gap-4'>
        {alerts.map((alert) => (
          <AlertPopover
            key={alert.id}
            message={alert.message}
            type={alert.type as 'success' | 'warning'}
            onClose={() =>
              setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
