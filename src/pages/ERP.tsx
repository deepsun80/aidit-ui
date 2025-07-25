/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { RFQFields } from '@/types/rfq';

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

  // Fetch RFQ fields once on mount
  const fetchRFQ = async () => {
    try {
      const res = await fetch('/api/generate-rfq');
      const data = await res.json();
      setRfqFields(data);
    } catch (err) {
      console.error('Failed to fetch RFQ:', err);
    }
  };

  // console.log('quoteSummary:', quoteSummary);
  // console.log('pricingTable:', pricingTable);
  console.log('quoteSheetData:', quoteSheetData);
  console.log('rfqFields:', rfqFields);

  return (
    <div className='h-full w-full bg-gray-100 p-4 text-gray-800'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <div className='text-lg font-semibold text-orange-600'>
            {selectedCustomer}
          </div>
          <div className='flex items-baseline gap-2'>
            <h1 className='text-md font-extrabold text-gray-900'>
              {selectedProject}
            </h1>
            <span className='text-sm italic text-gray-500'>
              {selectedProduct}
            </span>
          </div>
        </div>

        <div className='flex gap-2'>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className='text-sm bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
          >
            {customers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className='text-sm bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
          >
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className='text-sm bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
          >
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='w-full h-[80vh] border border-gray-300 rounded-b shadow bg-white'>
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
        />
      )}
    </div>
  );
}
