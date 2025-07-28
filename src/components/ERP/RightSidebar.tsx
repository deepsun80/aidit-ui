/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 🪟 RightSidebar
 *
 * Dynamic sidebar that appears in the ERP interface when a node is selected.
 * Displays relevant workflows like CPQ or Batch Records, including steppers,
 * thumbnails, buttons, and analytics placeholders. Designed to adapt based on
 * the selected node label (e.g., "CPQ", "Batch Records").
 */

'use client';

import { useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import QuoteThumbnail from './QuoteThumbnail';
import QuoteAnalyticsChart from './QuoteAnalyticsChart';
import BatchRecordStepper from './BatchRecordStepper';
import BatchRecordThumbnail from './BatchRecordThumbnail';
import { RFQFields } from '@/types/rfq';
import { ReloadIcon } from '@radix-ui/react-icons';

type RightSidebarProps = {
  selectedNode: string;
  customer: string;
  project: string;
  product: string;
  onClose: () => void;
  // Quote states
  quoteStarted: boolean;
  quoteCompleted: boolean;
  quoteConfirmed: boolean;
  setQuoteConfirmed: (val: boolean) => void;
  // Batch states
  brStarted: boolean;
  setBrStarted: (val: boolean) => void;
  brCompleted: boolean;
  setBrCompleted: (val: boolean) => void;
  brConfirmed: boolean;
  setBrConfirmed: (val: boolean) => void;
  onGenerateQuote: () => void;
  onfetchQuote: () => void;
  rfqFields: RFQFields | null;
  fetchRFQ: () => void;
  quoteSheetData: Record<string, any> | null;
  downloadQuotePDF: () => void;
};

export default function RightSidebar({
  selectedNode,
  customer,
  project,
  product,
  onClose,
  quoteStarted,
  quoteCompleted,
  quoteConfirmed,
  setQuoteConfirmed,
  brStarted,
  setBrStarted,
  brCompleted,
  setBrCompleted,
  brConfirmed,
  setBrConfirmed,
  onGenerateQuote,
  onfetchQuote,
  rfqFields,
  fetchRFQ,
  quoteSheetData,
  downloadQuotePDF,
}: RightSidebarProps) {
  const isCPQ = selectedNode === 'CPQ';
  const isBatch = selectedNode === 'Batch Records';

  const [rfqSelected, setRfqSelected] = useState(false);
  const [rfqChoice, setRfqChoice] = useState('');

  return (
    <div className='absolute right-0 top-0 h-full w-1/4 bg-white border-l border-gray-300 shadow-lg z-50 flex flex-col'>
      {/* Header */}
      <div className='bg-gray-800 text-white px-4 py-3 flex justify-between items-start'>
        <div>
          <div className='text-lg font-bold'>{selectedNode}</div>
          <div className='text-sm text-orange-400'>{customer}</div>
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
          <QuoteAnalyticsChart customer={customer} />
        ) : !rfqSelected ? (
          <div className='flex flex-col gap-2 text-sm text-gray-700'>
            <label htmlFor='rfq-select' className='font-semibold'>
              Select RFQ
            </label>
            <select
              id='rfq-select'
              className='bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
              value={rfqChoice}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'TECO-061225') {
                  setRfqChoice(val);
                  setRfqSelected(true);

                  setTimeout(() => {
                    fetchRFQ();
                  }, 1000);
                }
              }}
            >
              <option value=''>-- Choose RFQ --</option>
              <option value='TECO-061225'>TECO-061225</option>
              <option value='STX-042224' disabled>
                STX-042224
              </option>
              <option value='FLEX-050124' disabled>
                FLEX-050124
              </option>
            </select>
          </div>
        ) : !rfqFields ? (
          <div className='flex h-full items-center justify-center'>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <ReloadIcon className='animate-spin text-blue-500 w-5 h-5' />
              CPQ Agent fetching RFQ data...
            </div>
          </div>
        ) : (
          <div className='space-y-1 text-sm text-gray-700 leading-snug'>
            <div className='font-semibold'>
              RFQ Number:{' '}
              <span className='text-gray-600'>{rfqFields.rfqNumber}</span>
            </div>
            <div>
              <span className='font-semibold'>Company:</span>{' '}
              {rfqFields.company}
            </div>
            <div>
              <span className='font-semibold'>Release Date:</span>{' '}
              {rfqFields.rfqReleaseDate}
            </div>
            <div>
              <span className='font-semibold'>Due Date:</span>{' '}
              {rfqFields.rfqDueDate}
            </div>
            <div>
              <span className='font-semibold'>Issued By:</span>{' '}
              {rfqFields.issuedBy}
            </div>
            <div>
              <span className='font-semibold'>Email:</span> {rfqFields.email}
            </div>
            <div>
              <span className='font-semibold'>Phone:</span> {rfqFields.phone}
            </div>
            <div>
              <span className='font-semibold'>Product:</span>{' '}
              {rfqFields.product}
            </div>
            <div>
              <span className='font-semibold'>Spec:</span>{' '}
              {rfqFields.specification}
            </div>
            <div>
              <span className='font-semibold'>Qty:</span> {rfqFields.orderQty}
            </div>
          </div>
        )}
      </div>

      {/* Workflow Section */}
      <div className='flex-1 px-4 py-4 overflow-auto'>
        {isCPQ && (
          <>
            {!quoteStarted ? (
              <button
                onClick={onGenerateQuote}
                className='w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition'
              >
                Generate Quote
              </button>
            ) : !quoteCompleted ? (
              <div className='flex flex-col items-center justify-center h-40 text-sm text-gray-700'>
                <ReloadIcon className='animate-spin text-blue-500 w-6 h-6 mb-2' />
                CPQ Agent updating pricing and building quote...
              </div>
            ) : (
              quoteSheetData && (
                <QuoteThumbnail
                  customer={customer}
                  project={project}
                  product={product}
                  quoteConfirmed={quoteConfirmed}
                  setQuoteConfirmed={setQuoteConfirmed}
                  quoteSheetData={quoteSheetData}
                  onfetchQuote={onfetchQuote}
                  downloadQuotePDF={downloadQuotePDF}
                />
              )
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
                    customer={customer}
                    project={project}
                    product={product}
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
