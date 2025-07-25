/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 📋 QuoteThumbnail
 *
 * Renders a summarized preview of a quote table, including line items, unit costs,
 * quantities, and totals. Shown in the ERP sidebar after quote generation, with
 * an option to confirm or edit.
 */

'use client';

import {
  EyeOpenIcon,
  Pencil1Icon,
  DownloadIcon,
  CheckCircledIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';

interface QuoteThumbnailProps {
  customer: string;
  project: string;
  product: string;
  quoteConfirmed: boolean;
  setQuoteConfirmed: (val: boolean) => void;
  quoteSheetData: Record<string, any>;
  onfetchQuote: () => void;
}

export default function QuoteThumbnail({
  customer,
  project,
  product,
  quoteConfirmed,
  setQuoteConfirmed,
  quoteSheetData,
  onfetchQuote,
}: QuoteThumbnailProps) {
  const {
    ['RFQ number']: rfqNumber,
    Units,
    Profit,
    ['Selling Price']: sellingPrice,
  } = quoteSheetData;

  return (
    <>
      <div className='mt-8 border border-gray-300 rounded-md p-4 bg-gray-50 relative'>
        {/* Top Action Buttons */}
        <div className='absolute top-2 right-2 flex gap-2'>
          <button
            onClick={onfetchQuote}
            className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'
          >
            <ReloadIcon className='w-4 h-4' />
          </button>
          <button className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'>
            <EyeOpenIcon className='w-4 h-4' />
          </button>
          <button className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'>
            <Pencil1Icon className='w-4 h-4' />
          </button>
          <button className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'>
            <DownloadIcon className='w-4 h-4' />
          </button>
        </div>

        {/* Quote Preview */}
        <div className='text-xs text-gray-800 leading-snug'>
          <div className='text-sm font-bold mb-2'>Quote Summary</div>
          <div>
            <span className='font-semibold'>Customer:</span> {customer}
          </div>
          <div>
            <span className='font-semibold'>Project:</span> {project}
          </div>
          <div>
            <span className='font-semibold'>Product:</span> {product}
          </div>
          <div className='mt-2'>
            <span className='font-semibold'>RFQ Unit:</span> {rfqNumber}
          </div>
          <div className='mt-2'>
            <span className='font-semibold'>Scope:</span> Manufacturing of
            custom medical devices per design specification, including
            procurement, production, and batch QC.
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Estimated Lead Time:</span> 6–8
            weeks
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Unit Order Quantity:</span> {Units}
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Total:</span> $
            {sellingPrice.toFixed(2)} USD
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Profit:</span> {Profit * 100}%
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      {!quoteConfirmed ? (
        <button
          onClick={() => setQuoteConfirmed(true)}
          className='mt-8 w-full py-1 px-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition'
        >
          <CheckCircledIcon className='inline-block mr-1' />
          Confirm Quote
        </button>
      ) : (
        <div className='mt-6 flex items-center gap-2 text-sm text-gray-800'>
          <CheckCircledIcon className='text-green-500 w-5 h-5' />
          Quote completed
        </div>
      )}
    </>
  );
}
