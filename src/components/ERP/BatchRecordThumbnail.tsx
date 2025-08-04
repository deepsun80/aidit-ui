/**
 * 📄 BatchRecordThumbnail
 *
 * Displays a preview of a generated batch record in table form, including key fields
 * such as product, batch number, and status. Embedded inside the ERP sidebar for
 * quick review before confirmation.
 */

'use client';

import {
  Pencil1Icon,
  DownloadIcon,
  CheckCircledIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';

interface BatchRecordThumbnailProps {
  customer: string;
  project: string;
  product: string;
  batchConfirmed: boolean;
  setBatchConfirmed: (val: boolean) => void;
  selectedBatches: string[];
}

export default function BatchRecordThumbnail({
  customer,
  project,
  product,
  batchConfirmed,
  setBatchConfirmed,
  selectedBatches,
}: BatchRecordThumbnailProps) {
  const questions = [
    {
      q: 'Is the certificate number called out in the batch record?',
      a: 'Yes, the certificate number is called out in the batch record. For example, "Certificate No: 59486-1" is mentioned in the document.',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Page: 1',
    },
    {
      q: 'What is the Customer Purchase Order number in the batch record Certificate of Compliance?',
      a: 'The Customer Purchase Order number in the batch record Certificate of Compliance is "P1012563".',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Page: 12',
    },
    {
      q: 'Is the Item number and correct revision number called out on the batch record Certificate of Compliance?',
      a: 'Yes, the item number and correct revision number are called out. The document specifies "DRW-01003-00 Rev. 07" for the alignment tube.',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Page: 7',
    },
    {
      q: 'Is the correct PO number issued by Supreme called out on the Certificate issued by NEE?',
      a: 'No. PO numbers 38321 and 40313 are mentioned, but it’s unclear if these match the one issued by Supreme.',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Pages: 7, 8, 9',
    },
    {
      q: 'Does the Item number on the Certificate of Compliance match the Final AQL Inspection sheet?',
      a: 'Yes, the Item number "DRW-01003-00" matches the Final AQL Inspection sheet in the batch record.',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Pages: 2 - 4',
    },
    {
      q: 'Does the batch record include Certificate of Conformance for Electropolishing?',
      a: 'Yes, it includes a Certificate of Compliance meeting ASTM B912 for Electropolishing with 0.0002" removal.',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Page: 7',
    },

    {
      q: 'Is there a tool called out for measuring diameter 0.1540 ±0.0005?',
      a: 'Yes, the tool "MIC-059 w/pin" is used. Measurements like 0.1536 and 0.1540 are recorded.',
      citation:
        'Batch Record example 1, File: BR101 - Batch Record example 1.pdf, Page: 3',
    },
  ];

  return (
    <>
      <div className='mt-4 border border-gray-300 rounded-md p-4 bg-gray-50 relative'>
        {/* Top Action Buttons */}
        <div className='absolute top-2 right-2 flex gap-2'>
          <button className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'>
            <Pencil1Icon className='w-4 h-4' />
          </button>
          <button className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'>
            <DownloadIcon className='w-4 h-4' />
          </button>
          <button className='bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-700 text-gray-700 hover:text-white transition'>
            <ChevronRightIcon className='w-4 h-4' />
          </button>
        </div>

        {/* Header */}
        <div className='text-xs text-gray-800 leading-snug'>
          <div className='text-sm font-bold mb-3'>
            {selectedBatches[0]} Report
          </div>

          <div className='flex justify-between gap-4'>
            {/* Left Side */}
            <div className='space-y-1'>
              <div>
                <span className='font-semibold'>Customer:</span> {customer}
              </div>
              <div>
                <span className='font-semibold'>Project:</span> {project}
              </div>
              <div>
                <span className='font-semibold'>Product:</span> {product}
              </div>
            </div>

            {/* Right Side */}
            <div className='space-y-1 text-right'>
              <div>
                <span className='font-semibold'>Qty Ordered:</span> 100
              </div>
              <div>
                <span className='font-semibold'>Qty Manufactured:</span> 80
              </div>
              <div>
                <span className='font-semibold'>Mfg Date:</span> Jul 24, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Q&A Content */}
        <div className='mt-4 text-xs text-gray-800 space-y-3'>
          {questions.map((item, idx) => (
            <div key={idx}>
              <div className='font-semibold'>
                {idx + 1}. {item.q}
              </div>
              <div
                className={`ml-2 ${
                  item.a.trim().startsWith('No')
                    ? 'text-red-600 font-semibold'
                    : ''
                }`}
              >
                {item.a}
              </div>
              <div className='ml-2 italic text-gray-500 mt-1'>
                Citation: {item.citation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      {!batchConfirmed ? (
        <button
          onClick={() => setBatchConfirmed(true)}
          className='mt-8 w-full py-1 px-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition'
        >
          <CheckCircledIcon className='inline-block mr-1' />
          Confirm Report
        </button>
      ) : (
        <div className='mt-6 flex items-center gap-2 text-sm text-gray-800'>
          <CheckCircledIcon className='text-green-500 w-5 h-5' />
          Report completed
        </div>
      )}
    </>
  );
}
