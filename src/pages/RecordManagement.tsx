'use client';

import { useState } from 'react';
import RecordList from '@/components/RecordManagement/RecordList';
import RecordAssessmentView from '@/components/RecordManagement/RecordAssessmentView';
import QuestionSelector from '@/components/common/QuestionSelector';

export default function RecordManagement() {
  const [view, setView] = useState<'list' | 'form' | 'questions'>('list');
  const [requirement, setRequirement] = useState('');
  const [batchSet, setBatchSet] = useState('');

  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}${today.getFullYear()}`;
  const auditId = `${requirement || 'R101'}-${dateStr}`;

  const recordQuestions = [
    'Is the certificate number called out in the batch record?',
    'What is the Customer Purchase Order number in the batch record Certificate of Compliance?',
    'Is the Item number and correct revision number called out on the batch record Certificate of Compliance?',
    'Does the Item number mentioned on the Certificate of Compliance match the Item number mentioned in the Final AQL Inspection sheet within the batch record?',
    'Does the batch record include Certificate of Conformance issued for Electropolishing?',
    'Is the correct PO number issued by Supreme called out on the Certificate issued by NEE in the batch record?',
    'Is there a tool called out on the Final inspection report in the batch record for measuring diameter 0.1540 +/-0.0005?',
  ];

  return (
    <div className='text-gray-900'>
      {view === 'list' && (
        <RecordList onStartNewAssessment={() => setView('form')} />
      )}

      {view === 'form' && (
        <RecordAssessmentView
          onBack={() => setView('list')}
          requirement={requirement}
          setRequirement={setRequirement}
          batchSet={batchSet}
          setBatchSet={setBatchSet}
          onSubmit={() => setView('questions')}
        />
      )}

      {view === 'questions' && (
        <div className='max-w-4xl mx-auto text-gray-900 flex flex-col'>
          <p className='font-semibold text-lg'>ID: {auditId}</p>
          <p className='text-sm text-gray-600 mb-4'>
            Customer: <span className='font-bold'> SterileTech Corp</span>
          </p>

          <QuestionSelector
            questions={recordQuestions.map((q) => ({ question: q }))}
            setQuestions={() => {}}
            onSelectionChange={() => {}}
            onSubmit={() => {}}
            onCancel={() => setView('form')}
            selectedFile='Sterile Processing Batch #042'
            deleteQuestions={() => {}}
            disableCancel={false}
          />
        </div>
      )}
    </div>
  );
}
