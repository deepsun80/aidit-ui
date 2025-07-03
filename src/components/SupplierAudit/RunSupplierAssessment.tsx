'use client';

import { useEffect, useState } from 'react';
import QuestionSelector from '@/components/common/QuestionSelector';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

interface RunAssessmentProps {
  supplier: Supplier;
  onCancel: () => void;
}

export default function RunSupplierAssessment({
  supplier,
  onCancel,
}: RunAssessmentProps) {
  const [questions, setQuestions] = useState<
    { question: string; reference?: string }[]
  >([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(0);
  const [selected, setSelected] = useState<string[]>([]);

  const allQuestions = [
    {
      question: 'Does the supplier have documented sterilization validation?',
      reference: 'ISO 11135, CFR §820.75',
    },
    {
      question: 'Are training records maintained for critical processes?',
      reference: 'CFR §820.25, ISO 13485',
    },
    {
      question: 'Has the supplier completed a recent internal audit?',
      reference: 'ISO 13485, CFR §820.22',
    },
    {
      question: 'Are incoming materials verified upon receipt?',
      reference: 'CFR §820.80, ISO 9001',
    },
    {
      question: 'Is there a CAPA process for nonconforming products?',
      reference: 'CFR §820.100, ISO 13485',
    },
  ];

  const abbrev = supplier.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const today = new Date();
  const auditId = `${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}${today.getFullYear()}${abbrev}`;

  useEffect(() => {
    if (loadingIndex === null) return;

    if (loadingIndex < allQuestions.length) {
      const timer = setTimeout(() => {
        setQuestions((prev) => [...prev, allQuestions[loadingIndex]]);
        setLoadingIndex((i) => (i !== null ? i + 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoadingIndex(null);
    }
  }, [loadingIndex]);

  useEffect(() => {
    if (questions.length === 0) {
      setLoadingIndex(0);
    }
  }, []);

  const handleRunAssessment = () => {
    // Use selected questions as needed
    console.log('Selected questions:', selected);
  };

  return (
    <div className='max-w-4xl mx-auto text-gray-900 flex flex-col'>
      <p className='font-semibold text-lg'>Audit ID: {auditId}</p>
      <p className='text-sm text-gray-600 mb-4'>
        Supplier: <span className='font-bold'>{supplier.name}</span>
      </p>

      <div className='relative'>
        {loadingIndex !== null && (
          <div className='absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center'>
            <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            <p className='mt-3 text-sm text-gray-700'>
              Generating Question {loadingIndex + 1} of {allQuestions.length}...
            </p>
          </div>
        )}

        <QuestionSelector
          questions={questions}
          setQuestions={setQuestions}
          onSelectionChange={(selected) => setSelected(selected)}
          onSubmit={handleRunAssessment}
          onCancel={onCancel}
          selectedFile={supplier.name}
          deleteQuestions={() => setQuestions([])}
          disableCancel={false}
        />
      </div>
    </div>
  );
}
