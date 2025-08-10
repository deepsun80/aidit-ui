'use client';

import dynamic from 'next/dynamic';
import { ReloadIcon, DownloadIcon } from '@radix-ui/react-icons';

const QMSWorkflowCanvas = dynamic(
  () => import('@/components/QMS/QMSWorkflowCanvas'),
  {
    loading: () => (
      <div className='h-[80vh] flex items-center justify-center text-sm text-gray-700'>
        <div className='flex items-center gap-2'>
          <ReloadIcon className='animate-spin text-blue-500 w-5 h-5' />
          Loading QMS...
        </div>
      </div>
    ),
    ssr: false,
  }
);

type QMSProps = {
  setActivePage: React.Dispatch<
    React.SetStateAction<
      'customer-audit' | 'supplier-audit' | 'internal-audit' | 'erp' | 'qms'
    >
  >;
};

export default function QMS({ setActivePage }: QMSProps) {
  return (
    <div className='h-full w-full px-6 py-4 relative'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <div>
            <h2 className='text-lg font-bold text-gray-900'>
              American Medical Technologies
            </h2>
          </div>

          <div className='flex gap-6'>
            <div>
              <div className='text-xs text-gray-500'>
                Notified Body Cert Number
              </div>
              <div className='text-xs font-bold text-gray-800'>
                AJAE/10/1255
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500'>Cert Expiry Date</div>
              <div className='text-xs font-bold text-gray-800'>
                Dec 31, 2025
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500'>
                FDA Registration Number
              </div>
              <div className='text-xs font-bold text-gray-800'>2134823</div>
            </div>
          </div>
        </div>

        <button
          className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
          title='Export Wofkflow'
        >
          <DownloadIcon className='text-white w-5 h-5' />
        </button>
      </div>
      <QMSWorkflowCanvas onNodeClick={setActivePage} />
      {/* American Medical Technologies; Notified Body Cert NUmber: AJAE/10/1255; Cert Expiry Date: some date after 2025; FDA registration number: 2134823 */}
    </div>
  );
}
