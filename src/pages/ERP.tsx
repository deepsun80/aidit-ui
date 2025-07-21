'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const WorkflowCanvas = dynamic(
  () => import('@/components/ERP/WorkflowCanvas'),
  {
    ssr: false,
  }
);

export default function ERP() {
  return (
    <div className='h-full w-full bg-gray-100 text-gray-900'>
      <h1 className='text-2xl font-bold mb-4'>ERP Workflow</h1>
      <div className='w-full h-[80vh] border border-gray-300 rounded-sm shadow bg-white'>
        <WorkflowCanvas />
      </div>
    </div>
  );
}
