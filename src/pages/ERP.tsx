'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const WorkflowCanvas = dynamic(
  () => import('@/components/ERP/WorkflowCanvas'),
  { ssr: false }
);

import RightSidebar from '@/components/ERP/RightSidebar';

const sampleProjects = [
  {
    id: 'proj1',
    projectName: 'SP117 - Complaint Handling',
    customer: 'SterileTech Corp.',
    address: '1001 MedPark Blvd, Round Rock, TX',
  },
  {
    id: 'proj2',
    projectName: 'FM202 - Batch Record Release',
    customer: 'PrecisionPharm Inc.',
    address: '2200 Pharma Way, San Antonio, TX',
  },
  {
    id: 'proj3',
    projectName: 'SP301 - Design Control',
    customer: 'FlexForm Devices LLC',
    address: '501 Innovation Dr, Austin, TX',
  },
];

export default function ERP() {
  const [selectedProjectId, setSelectedProjectId] = useState('proj1');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // CPQ Workflow State
  const [quoteStarted, setQuoteStarted] = useState(false);
  const [quoteCompleted, setQuoteCompleted] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);

  // Batch Records Workflow State
  const [brStarted, setBrStarted] = useState(false);
  const [brCompleted, setBrCompleted] = useState(false);
  const [brConfirmed, setBrConfirmed] = useState(false);

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

  const selectedProject = sampleProjects.find(
    (p) => p.id === selectedProjectId
  )!;

  return (
    <div className='h-full w-full bg-gray-100 p-4 text-gray-800'>
      <div className='flex justify-between flex-top mb-4'>
        <div>
          <h1 className='text-xl font-extrabold'>
            {selectedProject.projectName}
          </h1>
          <div className='text-md font-semibold text-orange-600'>
            {selectedProject.customer}
          </div>
          <div className='text-xs text-gray-600'>{selectedProject.address}</div>
        </div>
        <div className='relative'>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className='text-sm bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
          >
            {sampleProjects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.projectName} — {proj.customer}
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
          project={selectedProject}
          onClose={() => setSelectedNode(null)}
          // CPQ props
          quoteStarted={quoteStarted}
          setQuoteStarted={setQuoteStarted}
          quoteCompleted={quoteCompleted}
          setQuoteCompleted={setQuoteCompleted}
          quoteConfirmed={quoteConfirmed}
          setQuoteConfirmed={setQuoteConfirmed}
          // Batch Record props
          brStarted={brStarted}
          setBrStarted={setBrStarted}
          brCompleted={brCompleted}
          setBrCompleted={setBrCompleted}
          brConfirmed={brConfirmed}
          setBrConfirmed={setBrConfirmed}
        />
      )}
    </div>
  );
}
