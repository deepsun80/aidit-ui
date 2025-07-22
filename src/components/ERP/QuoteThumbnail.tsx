'use client';

import {
  EyeOpenIcon,
  Pencil1Icon,
  DownloadIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';

interface QuoteThumbnailProps {
  project: ProjectProps;
  selectedNode: string;
  quoteConfirmed: boolean;
  setQuoteConfirmed: (val: boolean) => void;
}

type ProjectProps = {
  id: string;
  projectName: string;
  customer: string;
  address: string;
};

export default function QuoteThumbnail({
  project,
  selectedNode,
  quoteConfirmed,
  setQuoteConfirmed,
}: QuoteThumbnailProps) {
  return (
    <>
      <div className='mt-8 border border-gray-300 rounded-md p-4 bg-gray-50 relative'>
        {/* Top Action Buttons */}
        <div className='absolute top-2 right-2 flex gap-2'>
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
          <div className='text-sm font-bold mb-2'>Manufacturing Quote</div>
          <div>
            <span className='font-semibold'>Project:</span> {selectedNode}
          </div>
          <div>
            <span className='font-semibold'>Customer:</span> {project.customer}
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
            <span className='font-semibold'>Unit Price:</span> $28.75 USD
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Minimum Order Quantity:</span> 500
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Terms:</span> 50% upfront, 50% upon
            delivery
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
