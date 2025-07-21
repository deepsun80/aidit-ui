'use client';

import { useState, useRef } from 'react';
import RecordList from '@/components/RecordManagement/RecordList';
import RecordAssessmentView from '@/components/RecordManagement/RecordAssessmentView';
import QuestionSelector from '@/components/common/QuestionSelector';
import QACards from '@/components/common/QACards';

export default function RecordManagement() {
  const [view, setView] = useState<'list' | 'form' | 'questions' | 'qa'>(
    'list'
  );
  const [requirement, setRequirement] = useState('');
  const [batchSet, setBatchSet] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
    []
  );
  const [submissionProgress, setSubmissionProgress] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const cancelRequestedRef = useRef(false);

  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(
    today.getDate()
  ).padStart(2, '0')}/${today.getFullYear()}`;
  const auditId = `${requirement || 'R101'}-${dateStr.replace(/\//g, '')}`;

  const recordQuestions = [
    'Is the certificate number called out in the batch record?',
    'What is the Customer Purchase Order number in the batch record Certificate of Compliance?',
    'Is the Item number and correct revision number called out on the batch record Certificate of Compliance?',
    'Does the Item number mentioned on the Certificate of Compliance match the Item number mentioned in the Final AQL Inspection sheet within the batch record?',
    'Does the batch record include Certificate of Conformance issued for Electropolishing?',
    'Is the correct PO number issued by Supreme called out on the Certificate issued by NEE in the batch record?',
    'Is there a tool called out on the Final inspection report in the batch record for measuring diameter 0.1540 +/-0.0005?',
  ];

  const handleSubmitQuestions = async () => {
    if (selectedQuestions.length === 0) return;
    setLoading(true);
    setSubmissionProgress(0);
    cancelRequestedRef.current = false;

    const currentQaList = [...qaList];
    const existingQuestions = new Set(
      currentQaList.map((qa) => qa.question.trim())
    );

    for (let i = 0; i < selectedQuestions.length; i++) {
      if (cancelRequestedRef.current) break;

      const question = selectedQuestions[i].trim();
      if (existingQuestions.has(question)) {
        setSubmissionProgress(i + 1);
        continue;
      }

      setSubmissionProgress(i + 1);

      try {
        const res = await fetch('/api/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: question,
            organization: batchSet || 'cg_labs',
          }),
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          if (chunk.includes('[ToolCall]')) {
            const match = chunk.match(/\[ToolCall\] (.+)/);
            if (match) {
              try {
                const { tool, agent } = JSON.parse(match[1]);
                setActiveAgent(agent);
                setActiveTool(tool);
              } catch (err) {
                console.warn('Failed to parse tool call metadata:', err);
              }
            }
            continue;
          }

          const formattedChunk = chunk.replace(/(?<!\n)(Citation: )/g, '\n$1');
          fullText += formattedChunk;
        }

        currentQaList.push({ question, answer: fullText });
        setQaList([...currentQaList]);
      } catch (error) {
        console.error('Streaming error:', error);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setSubmissionProgress(null);
    setLoading(false);
    setShowCancel(false);
    cancelRequestedRef.current = false;
    setView('qa');
  };

  const notFoundCount = qaList.filter((qa) =>
    qa.answer.toLowerCase().startsWith('no')
  ).length;

  return (
    <div className='text-gray-900'>
      {(loading || submissionProgress !== null) && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-100/75 flex flex-col items-center justify-center z-50'>
          <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
          <span className='mt-2 text-gray-700 text-sm text-center px-4'>
            {submissionProgress !== null ? (
              <>
                <span>
                  Processing {submissionProgress} / {selectedQuestions.length}
                  ...
                </span>
                {activeAgent && activeTool && (
                  <span className='mt-1 text-sm text-gray-600 flex items-center justify-center gap-2'>
                    <span>🤖 {activeAgent}</span>
                    <span className='text-gray-400'>→</span>
                    <span>🛠️ {activeTool}</span>
                  </span>
                )}
              </>
            ) : (
              'Processing...'
            )}
          </span>
          {loading && (
            <button
              onClick={() => {
                cancelRequestedRef.current = true;
                setShowCancel(true);
              }}
              className='mt-4 px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition'
              disabled={showCancel}
            >
              Cancel
            </button>
          )}
        </div>
      )}

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
          <p className='font-semibold text-lg'>Audit ID: {auditId}</p>
          <p className='text-sm text-gray-600 mb-4'>
            Customer: <span className='font-bold'>SterileTech Corp</span>
          </p>

          <QuestionSelector
            questions={recordQuestions.map((q) => ({ question: q }))}
            setQuestions={() => {}}
            onSelectionChange={setSelectedQuestions}
            onSubmit={handleSubmitQuestions}
            onCancel={() => setView(qaList.length > 0 ? 'qa' : 'form')}
            selectedFile='Sterile Processing Batch #042'
            deleteQuestions={() => {}}
            disableCancel={false}
          />
        </div>
      )}

      {view === 'qa' && (
        <QACards
          qaList={qaList}
          onEdit={() => {}}
          onDelete={() => {}}
          notFoundCount={notFoundCount}
          showOnlyNotFound={false}
          setShowOnlyNotFound={() => {}}
          onDownload={() => {}}
          onViewReport={() => {}}
          report={{ auditId, customer: 'SterileTech Corp', date: dateStr }}
          onAskNew={() => {}}
          onUploadNew={() => {}}
          onViewUploaded={() => {}}
          hasUploadedQuestions={false}
          showControls={false}
          onBack={() => setView('questions')}
        />
      )}
    </div>
  );
}
