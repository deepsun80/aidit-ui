'use client';

import { useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import QuoteStepper from './QuoteStepper';
import QuoteThumbnail from './QuoteThumbnail';
import QuoteAnalyticsChart from './QuoteAnalyticsChart';

type RightSidebarProps = {
  selectedNode: string;
  customer: string;
  onClose: () => void;
};

export default function RightSidebar({
  selectedNode,
  customer,
  onClose,
}: RightSidebarProps) {
  const [quoteStarted, setQuoteStarted] = useState(false);
  const [quoteCompleted, setQuoteCompleted] = useState(false);

  return (
    <div className='absolute right-0 top-0 h-full w-1/4 bg-white border-l border-gray-300 shadow-lg z-50 flex flex-col'>
      {/* Header */}
      <div className='bg-gray-800 text-white px-4 py-3 flex justify-between items-start'>
        <div>
          <div className='text-lg font-bold'>{selectedNode}</div>
          <div className='text-sm text-gray-300'>{customer}</div>
        </div>
        <button
          onClick={onClose}
          className='text-white hover:text-gray-300 w-10 h-10 flex items-center justify-end'
        >
          <Cross1Icon />
        </button>
      </div>

      {/* Analytics Placeholder */}
      <div className='px-4 py-4 border-b border-gray-200 h-[30%]'>
        {quoteCompleted ? (
          <QuoteAnalyticsChart customer={customer} />
        ) : (
          <div className='animate-pulse space-y-2'>
            <div className='h-4 bg-gray-200 rounded w-3/4' />
            <div className='h-4 bg-gray-200 rounded w-5/6' />
            <div className='h-4 bg-gray-200 rounded w-1/2' />
            <div className='h-4 bg-gray-200 rounded w-2/3' />
          </div>
        )}
      </div>

      {/* Quote Generation Section */}
      <div className='flex-1 px-4 py-4 overflow-auto'>
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
              <QuoteThumbnail selectedNode={selectedNode} customer={customer} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
