'use client';

import dynamic from 'next/dynamic';
import { ReloadIcon } from '@radix-ui/react-icons';

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
  setActivePage: (page: string) => void;
};

export default function QMS({ setActivePage }: QMSProps) {
  return (
    <div className='h-full w-full px-6 py-4 relative'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-bold text-gray-900'>QMS</h1>
        <button
          onClick={() => setActivePage('dashboard')}
          className='text-xs text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition'
        >
          Back to Dashboard
        </button>
      </div>
      <QMSWorkflowCanvas onNodeClick={setActivePage} />
    </div>
  );
}
