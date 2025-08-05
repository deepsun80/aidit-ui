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
import QuoteRFQSelector from './QuoteRFQSelector';
import QuoteRFQ from './QuoteRFQ';

import BatchRecordStepper from './BatchRecordStepper';
import BatchRecordThumbnail from './BatchRecordThumbnail';
import BatchAnalyticsMultiChart from './BatchAnalyticsMultiChart';
import BatchSelector from './BatchSelector';
import BatchRecordLoader from './BatchRecordLoader';
import BatchYearSelector from './BatchYearSelector';
import BatchAnalyticsSingleChart from './BatchAnalyticsSingleChart';

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
  selectedBatches: { id: string; nonConformance: string | null }[];
  setSelectedBatches: (
    val: { id: string; nonConformance: string | null }[]
  ) => void;
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
  selectedBatches,
  setSelectedBatches,
}: RightSidebarProps) {
  const isCPQ = selectedNode === 'CPQ';
  const isBatch = selectedNode === 'Batch Records';

  const [rfqSelected, setRfqSelected] = useState(false);
  const [rfqChoice, setRfqChoice] = useState('');

  const [bomSelected, setBomSelected] = useState(false);
  const [bomLoading, setBomLoading] = useState(false);

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
      <div className={`px-4 py-4 border-b border-gray-200 h-[32%]`}>
        {isCPQ && quoteCompleted ? (
          <QuoteAnalyticsChart />
        ) : isBatch && brCompleted ? (
          selectedBatches.length === 1 ? (
            <BatchAnalyticsSingleChart
              product={product}
              batchNumber={selectedBatches[0].id}
            />
          ) : (
            <BatchAnalyticsMultiChart
              selectedBatches={selectedBatches.map((b) => ({
                ...b,
                nonConformance: b.nonConformance ?? 'no',
              }))}
            />
          )
        ) : isBatch && !brStarted && !bomSelected ? (
          <BatchYearSelector
            onSelectionComplete={() => {
              setBomLoading(true);
              setBomSelected(true);
              setTimeout(() => {
                setBomLoading(false);
              }, 1500);
            }}
          />
        ) : isBatch && !brStarted && bomLoading ? (
          <>
            <BatchYearSelector
              onSelectionComplete={() => {
                setBomLoading(true);
                setBomSelected(true);
                setTimeout(() => {
                  setBomLoading(false);
                }, 1500);
              }}
            />
            <div className='flex h-full items-center justify-center'>
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <ReloadIcon className='animate-spin text-blue-500 w-5 h-5' />
                BR Agent fetching Batch Records...
              </div>
            </div>
          </>
        ) : isBatch && !brStarted && bomSelected ? (
          <>
            <BatchYearSelector
              onSelectionComplete={() => {
                setBomLoading(true);
                setBomSelected(true);
                setTimeout(() => {
                  setBomLoading(false);
                }, 1500);
              }}
            />
            <BatchSelector
              selectedBatches={selectedBatches}
              setSelectedBatches={setSelectedBatches}
            />
          </>
        ) : isBatch && brStarted && selectedBatches.length > 0 ? (
          <BatchRecordLoader />
        ) : !rfqSelected ? (
          <QuoteRFQSelector
            rfqChoice={rfqChoice}
            setRfqChoice={setRfqChoice}
            setRfqSelected={setRfqSelected}
            fetchRFQ={fetchRFQ}
          />
        ) : !rfqFields ? (
          <div className='flex h-full items-center justify-center'>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <ReloadIcon className='animate-spin text-blue-500 w-5 h-5' />
              CPQ Agent fetching RFQ data...
            </div>
          </div>
        ) : (
          <QuoteRFQ rfqFields={rfqFields} />
        )}
      </div>

      {/* Workflow Section */}
      <div className='flex-1 px-4 py-4 overflow-auto'>
        {isCPQ && (
          <>
            {!quoteStarted ? (
              <button
                onClick={onGenerateQuote}
                disabled={!rfqFields}
                className='w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed'
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
                disabled={selectedBatches.length === 0}
                className='w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                Run Batch Record Check
              </button>
            ) : (
              <>
                {brCompleted ? (
                  <BatchRecordThumbnail
                    customer={customer}
                    project={project}
                    product={product}
                    batchConfirmed={brConfirmed}
                    setBatchConfirmed={setBrConfirmed}
                    selectedBatches={selectedBatches}
                  />
                ) : (
                  <BatchRecordStepper
                    selectedBatches={selectedBatches}
                    onComplete={() => setBrCompleted(true)}
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
