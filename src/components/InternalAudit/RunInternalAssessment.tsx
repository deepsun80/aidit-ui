'use client';

import { useEffect, useState } from 'react';
import { QA } from '@/types/qa';
import QuestionSelector from '@/components/common/QuestionSelector';

type Regulation = {
  name: string;
  date: string;
  notFound: number;
  total: number;
};

interface RunInternalAssessmentProps {
  regulation: Regulation;
  qaList: QA[];
  onCancel: () => void;
}

export default function RunInternalAssessment({
  regulation,
  qaList,
  onCancel,
}: RunInternalAssessmentProps) {
  const [questions, setQuestions] = useState<
    { question: string; reference?: string }[]
  >([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(0);
  const [selected, setSelected] = useState<string[]>([]);

  const abbrev = regulation.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const today = new Date();
  const auditId = `${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}${today.getFullYear()}${abbrev}`;

  // Load questions one by one
  useEffect(() => {
    if (loadingIndex === null) return;
    if (loadingIndex < qaList.length) {
      const timer = setTimeout(() => {
        const next = qaList[loadingIndex];
        const [questionText, reference] = next.question.split(' - ');
        setQuestions((prev) => [
          ...prev,
          { question: questionText, reference },
        ]);
        setLoadingIndex((i) => (i !== null ? i + 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoadingIndex(null);
    }
  }, [loadingIndex, qaList]);

  useEffect(() => {
    if (qaList.length > 0) {
      setLoadingIndex(0);
    }
  }, [qaList]);

  const handleRunAssessment = () => {
    // Do something with selected questions
    console.log('Selected questions:', selected);
  };

  return (
    <div className='max-w-4xl mx-auto text-gray-900 flex flex-col'>
      <p className='font-semibold text-lg'>Audit ID: {auditId}</p>
      <p className='text-sm text-gray-600 mb-4'>
        Regulation: <span className='font-bold'>{regulation.name}</span>
      </p>

      <div className='relative'>
        {loadingIndex !== null && (
          <div className='absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center'>
            <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            <p className='mt-3 text-sm text-gray-700'>
              Generating Question {loadingIndex + 1} of {qaList.length}...
            </p>
          </div>
        )}

        <QuestionSelector
          questions={questions}
          setQuestions={setQuestions}
          onSelectionChange={(selected) => setSelected(selected)}
          onSubmit={handleRunAssessment}
          onCancel={onCancel}
          selectedFile={regulation.name}
          deleteQuestions={() => setQuestions([])}
          disableCancel={false}
        />
      </div>
    </div>
  );
}
