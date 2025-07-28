/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { RFQFields } from '@/types/rfq';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';

const WorkflowCanvas = dynamic(
  () => import('@/components/ERP/WorkflowCanvas'),
  { ssr: false }
);

import RightSidebar from '@/components/ERP/RightSidebar';

const customers = [
  'Tecomatrix Medical',
  'SterileTech Corp.',
  'FlexForm Devices LLC',
];
const projects = ['Project 1', 'Project 2', 'Project 3'];
const products = ['P17773 Rev C', 'KM29606 Rev B', '841011 Rev D'];

export default function ERP() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const [quoteStarted, setQuoteStarted] = useState(false);
  const [quoteCompleted, setQuoteCompleted] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);

  const [brStarted, setBrStarted] = useState(false);
  const [brCompleted, setBrCompleted] = useState(false);
  const [brConfirmed, setBrConfirmed] = useState(false);

  const [quoteSheetData, setQuoteSheetData] = useState<Record<
    string,
    any
  > | null>(null);

  const [rfqFields, setRfqFields] = useState<RFQFields | null>(null);

  const cpqProgress = quoteConfirmed
    ? 100
    : quoteCompleted
    ? 50
    : quoteStarted
    ? 10
    : 0;

  const batchProgress = brConfirmed
    ? 100
    : brCompleted
    ? 50
    : brStarted
    ? 10
    : 0;

  const fetchQuoteFromSheet = async () => {
    try {
      setQuoteCompleted(false);

      // ⏱️ Artificial delay to simulate loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch('/api/generate-quote');
      const data = await res.json();

      if (data && !data.error) {
        setQuoteSheetData(data);
      } else {
        console.error('Failed to fetch quote sheet data:', data.error);
      }
    } catch (err) {
      console.error('Error fetching quote sheet:', err);
    } finally {
      setQuoteCompleted(true);
    }
  };

  const generateSheetWithRFQ = async () => {
    try {
      if (!rfqFields) {
        console.error('No RFQ fields available');
        return;
      }

      setQuoteStarted(true);

      const res = await fetch('/api/generate-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqFields }),
      });

      const data = await res.json();

      if (data.message) {
        console.log('Quote written to Excel:', data.message);
        await fetchQuoteFromSheet(); // fetch and store preview data
      } else {
        console.error('Unexpected response:', data);
      }
    } catch (err) {
      console.error('Failed to write quote to Excel:', err);
    }
  };

  const fetchRFQ = async () => {
    try {
      const res = await fetch('/api/generate-rfq');
      const data = await res.json();
      setRfqFields(data);
    } catch (err) {
      console.error('Failed to fetch RFQ:', err);
    }
  };

  const downloadQuotePDF = async () => {
    try {
      if (!quoteSheetData || !rfqFields) {
        console.warn('Missing quote data or RFQ fields');
        return;
      }

      const res = await fetch('/api/generate-quote-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteSheetData, rfqFields }),
      });

      if (!res.ok) {
        console.error('PDF generation failed');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quote_${rfqFields.rfqNumber.replace(/\s+/g, '_')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  console.log('quoteSheetData:', quoteSheetData);
  console.log('rfqFields:', rfqFields);

  return (
    <div className='h-full w-full bg-gray-200 p-4 text-gray-800'>
      <div className='flex justify-between items-end mb-4 gap-4'>
        <div className='flex gap-4 items-end'>
          <div className='flex flex-col text-xs text-gray-600'>
            <label htmlFor='customer' className='font-bold'>
              Customer
            </label>
            <div className='relative flex items-center'>
              <MagnifyingGlassIcon className='absolute left-2 h-4 w-4 text-gray-400' />
              <select
                id='customer'
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className='pl-7 pr-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600'
              >
                {customers.map((c, index) => (
                  <option key={c} value={c} disabled={index !== 0}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex flex-col text-xs text-gray-600'>
            <label htmlFor='project' className='font-bold'>
              Project
            </label>
            <div className='relative flex items-center'>
              <MagnifyingGlassIcon className='absolute left-2 h-4 w-4 text-gray-400' />
              <select
                id='project'
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className='pl-7 pr-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600'
              >
                {projects.map((p, index) => (
                  <option key={p} value={p} disabled={index !== 0}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex flex-col text-xs text-gray-600'>
            <label htmlFor='product' className='font-bold'>
              Product
            </label>
            <div className='relative flex items-center'>
              <MagnifyingGlassIcon className='absolute left-2 h-4 w-4 text-gray-400' />
              <select
                id='product'
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className='pl-7 pr-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600'
              >
                {products.map((p, index) => (
                  <option key={p} value={p} disabled={index !== 0}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
            title='Add Customer'
          >
            <PlusIcon className='text-white w-5 h-5' />
          </button>
          <button
            className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
            title='Export Wofkflow'
          >
            <DownloadIcon className='text-white w-5 h-5' />
          </button>
        </div>
      </div>

      <div className='w-full h-[80vh] border border-gray-300 rounded-b shadow-md bg-white'>
        <WorkflowCanvas
          setSelectedNode={setSelectedNode}
          progressByNodeId={{
            cpq: cpqProgress,
            batch: batchProgress,
          }}
        />
      </div>

      {selectedNode && (
        <RightSidebar
          selectedNode={selectedNode}
          customer={selectedCustomer}
          project={selectedProject}
          product={selectedProduct}
          onClose={() => setSelectedNode(null)}
          // Quote states
          quoteStarted={quoteStarted}
          quoteCompleted={quoteCompleted}
          quoteConfirmed={quoteConfirmed}
          setQuoteConfirmed={setQuoteConfirmed}
          // Batch Record states
          brStarted={brStarted}
          setBrStarted={setBrStarted}
          brCompleted={brCompleted}
          setBrCompleted={setBrCompleted}
          brConfirmed={brConfirmed}
          setBrConfirmed={setBrConfirmed}
          // New props
          onGenerateQuote={generateSheetWithRFQ}
          onfetchQuote={fetchQuoteFromSheet}
          rfqFields={rfqFields}
          fetchRFQ={fetchRFQ}
          quoteSheetData={quoteSheetData}
          downloadQuotePDF={downloadQuotePDF}
        />
      )}
    </div>
  );
}
