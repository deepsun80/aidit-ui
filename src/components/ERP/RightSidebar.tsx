'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import QuoteStepper from './QuoteStepper';
import QuoteThumbnail from './QuoteThumbnail';
import QuoteAnalyticsChart from './QuoteAnalyticsChart';
import BatchRecordStepper from './BatchRecordStepper';
import BatchRecordThumbnail from './BatchRecordThumbnail';

type RightSidebarProps = {
  selectedNode: string;
  project: ProjectProps;
  onClose: () => void;
  // Quote states
  quoteStarted: boolean;
  setQuoteStarted: (val: boolean) => void;
  quoteCompleted: boolean;
  setQuoteCompleted: (val: boolean) => void;
  quoteConfirmed: boolean;
  setQuoteConfirmed: (val: boolean) => void;
  // Batch states
  brStarted: boolean;
  setBrStarted: (val: boolean) => void;
  brCompleted: boolean;
  setBrCompleted: (val: boolean) => void;
  brConfirmed: boolean;
  setBrConfirmed: (val: boolean) => void;
};

type ProjectProps = {
  id: string;
  projectName: string;
  customer: string;
  address: string;
};

export default function RightSidebar({
  selectedNode,
  project,
  onClose,
  quoteStarted,
  setQuoteStarted,
  quoteCompleted,
  setQuoteCompleted,
  quoteConfirmed,
  setQuoteConfirmed,
  brStarted,
  setBrStarted,
  brCompleted,
  setBrCompleted,
  brConfirmed,
  setBrConfirmed,
}: RightSidebarProps) {
  const isCPQ = selectedNode === 'CPQ';
  const isBatch = selectedNode === 'Batch Records';

  return (
    <div className='absolute right-0 top-0 h-full w-1/4 bg-white border-l border-gray-300 shadow-lg z-50 flex flex-col'>
      {/* Header */}
      <div className='bg-gray-800 text-white px-4 py-3 flex justify-between items-start'>
        <div>
          <div className='text-lg font-bold'>{selectedNode}</div>
          <div className='text-sm text-orange-400'>{project.customer}</div>
        </div>
        <button
          onClick={onClose}
          className='text-white hover:text-gray-300 w-10 h-10 flex items-center justify-end'
        >
          <Cross1Icon />
        </button>
      </div>

      {/* Analytics */}
      <div className='px-4 py-4 border-b border-gray-200 h-[26%]'>
        {(isCPQ && quoteCompleted) || (isBatch && brCompleted) ? (
          <QuoteAnalyticsChart customer={project.customer} />
        ) : (
          <div className='animate-pulse space-y-2'>
            <div className='h-4 bg-gray-200 rounded w-3/4' />
            <div className='h-4 bg-gray-200 rounded w-5/6' />
            <div className='h-4 bg-gray-200 rounded w-1/2' />
            <div className='h-4 bg-gray-200 rounded w-2/3' />
          </div>
        )}
      </div>

      {/* Workflow Section */}
      <div className='flex-1 px-4 py-4 overflow-auto'>
        {isCPQ && (
          <>
            {!quoteStarted ? (
              <button
                onClick={() => setQuoteStarted(true)}
                className='w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition'
              >
                Generate Quote
              </button>
            ) : (
              <>
                <QuoteStepper onComplete={() => setQuoteCompleted(true)} />
                {quoteCompleted && (
                  <QuoteThumbnail
                    project={project}
                    quoteConfirmed={quoteConfirmed}
                    setQuoteConfirmed={setQuoteConfirmed}
                  />
                )}
              </>
            )}
          </>
        )}

        {isBatch && (
          <>
            {!brStarted ? (
              <button
                onClick={() => setBrStarted(true)}
                className='w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition'
              >
                Run Batch Record Check
              </button>
            ) : (
              <>
                <BatchRecordStepper onComplete={() => setBrCompleted(true)} />
                {brCompleted && (
                  <BatchRecordThumbnail
                    project={project}
                    batchConfirmed={brConfirmed}
                    setBatchConfirmed={setBrConfirmed}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
