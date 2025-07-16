'use client';

import { useState, useRef, useEffect } from 'react';
import ChatPrompt from '@/components/CustomerAudit/ChatPrompt';
import QuestionSelector from '@/components/common/QuestionSelector';
import QACards from '@/components/common/QACards';
import NonconformityReport from '@/components/CustomerAudit/NonconformityReport';
import WelcomeScreen from '@/components/CustomerAudit/WelcomeScreen';
import CreateReport from '@/components/CustomerAudit/CreateReport';
import CustomerList from '@/components/CustomerAudit/CustomerList';
import type { QAReport } from '@/types/qa';
import { handleDownloadPDF } from '@lib/downloadPDF';

interface CustomerAuditProps {
  report: QAReport | null;
  setReport: (report: QAReport | null) => void;
  updateReport: (partial: Partial<QAReport>) => void;
  deleteQuestions: () => void;
  showError: (message: string) => void;
}

export default function CustomerAudit({
  report,
  setReport,
  updateReport,
  deleteQuestions,
  showError,
}: CustomerAuditProps) {
  const [view, setView] = useState<'list' | 'active'>('list');
  const [hasMounted, setHasMounted] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState<number | null>(
    null
  );
  const [showCancel, setShowCancel] = useState(false);
  const [showOnlyNotFound, setShowOnlyNotFound] = useState(false);
  const [showNonconformityReport, setShowNonconformityReport] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelRequestedRef = useRef(false);

  const qaList = report?.qaList || [];
  const questions = report?.questions || null;
  const selectedQuestions = report?.selectedQuestions || [];
  const selectedFile = report?.selectedFile || null;

  const notFoundCount = qaList.filter((qa) =>
    qa.answer.trim().toLowerCase().startsWith('no')
  ).length;

  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !report) return;
    setLoading(true);

    const exists = qaList.some((qa) => {
      const [qText] = qa.question.split(' - ');
      return qText.trim() === input.trim();
    });

    if (exists) {
      console.log(`Skipping duplicate chat question: ${input}`);
      setLoading(false);
      return;
    }

    const answer = await processQuery(input);

    updateReport({
      qaList: [...(report?.qaList || []), { question: input, answer }],
    });

    setShowChat(false);
    setLoading(false);
  };

  const handleSubmitQuestions = async () => {
    if (!report || selectedQuestions.length === 0) return;

    setLoading(true);
    setSubmissionProgress(0);
    cancelRequestedRef.current = false;

    const existingQuestions = new Set(
      (report.qaList || []).map((qa) => qa.question.trim())
    );

    const updatedQaList = [...report.qaList];

    for (let i = 0; i < selectedQuestions.length; i++) {
      if (cancelRequestedRef.current) {
        console.log('Cancellation triggered.');
        break;
      }

      const question = selectedQuestions[i].trim();
      if (existingQuestions.has(question)) {
        console.log(`Skipping duplicate question: ${question}`);
        setSubmissionProgress(i + 1);
        continue;
      }

      setSubmissionProgress(i + 1);

      const answer = await processQuery(question);

      if (answer) {
        updatedQaList.push({ question, answer });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    updateReport({ qaList: updatedQaList });

    setSubmissionProgress(null);
    setLoading(false);
    setShowQuestionSelector(false);
    setShowCancel(false);
    cancelRequestedRef.current = false;
  };

  const processQuery = async (query: string): Promise<string> => {
    try {
      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          organization: report?.customer || 'cg_labs',
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

      setActiveAgent(null);
      setActiveTool(null);

      return fullText;
    } catch (error) {
      showError(`Streaming error: ${error}`);
      console.error('Streaming error:', error);
      return '';
    }
  };

  const handleEditAnswer = (index: number, newAnswer: string) => {
    if (!report) return;
    const newQaList = [...qaList];
    newQaList[index] = { ...newQaList[index], answer: newAnswer };
    updateReport({ qaList: newQaList });
  };

  const handleDeleteAnswer = (index: number) => {
    if (!report) return;
    const newQaList = qaList.filter((_, i) => i !== index);
    updateReport({ qaList: newQaList });
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file || !report) return;
    setUploading(true);
    updateReport({ selectedFile: file });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.questions) {
        updateReport({ questions: data.questions });
        setShowQuestionSelector(true);
      } else {
        showError(data.error || 'Error processing file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showError(`Error uploading file: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className='fixed top-0 left-0 w-full h-full bg-gray-100/75 flex flex-col items-center justify-center z-50'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
        <span className='mt-2 text-gray-700 text-sm text-center px-4'>
          Initializing...
        </span>
      </div>
    );
  }

  if (view === 'list') {
    return <CustomerList onStartNewAssessment={() => setView('active')} />;
  }

  if (!report && view === 'active') {
    return (
      <CreateReport setReport={setReport} onBack={() => setView('list')} />
    );
  }

  return (
    <>
      {(loading || uploading) && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-100/75 flex flex-col items-center justify-center z-50'>
          <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
          <span className='mt-2 text-gray-700 text-sm text-center px-4'>
            {showCancel ? (
              'Cancelling...'
            ) : uploading ? (
              `Processing ${selectedFile?.name ?? 'file'}...`
            ) : submissionProgress !== null ? (
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
            ) : activeAgent && activeTool ? (
              <>
                <span>Processing...</span>
                <span className='mt-1 text-sm text-gray-600 flex items-center justify-center gap-2'>
                  <span>🤖 {activeAgent}</span>
                  <span className='text-gray-400'>→</span>
                  <span>🛠️ {activeTool}</span>
                </span>
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

      <input
        type='file'
        ref={fileInputRef}
        accept='.xlsx'
        className='hidden'
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
      />

      {showQuestionSelector && questions ? (
        <QuestionSelector
          selectedFile={selectedFile?.name}
          questions={questions}
          setQuestions={(q) => updateReport({ questions: q })}
          onSelectionChange={(sq) => updateReport({ selectedQuestions: sq })}
          onCancel={() => {
            if (qaList.length > 0) setShowQuestionSelector(false);
          }}
          onSubmit={handleSubmitQuestions}
          disableCancel={qaList.length === 0}
          deleteQuestions={deleteQuestions}
          disableTitle={false}
        />
      ) : qaList.length > 0 ? (
        showNonconformityReport ? (
          <NonconformityReport
            qaList={qaList}
            notFoundCount={notFoundCount || 0}
            onBack={() => setShowNonconformityReport(false)}
            auditId={report?.auditId || 'N/A'}
            customer={report?.customer || 'N/A'}
            date={report?.date || 'N/A'}
          />
        ) : (
          <QACards
            qaList={qaList}
            notFoundCount={notFoundCount || 0}
            onEdit={handleEditAnswer}
            onDelete={handleDeleteAnswer}
            showOnlyNotFound={showOnlyNotFound}
            setShowOnlyNotFound={setShowOnlyNotFound}
            onDownload={() => handleDownloadPDF(qaList, report!, true)}
            onViewReport={() => setShowNonconformityReport(true)}
            report={report!}
            onAskNew={() => setShowChat(true)}
            onUploadNew={() => fileInputRef.current?.click()}
            onViewUploaded={() => setShowQuestionSelector(true)}
            hasUploadedQuestions={(report?.questions?.length || 0) > 0}
            submit={true}
          />
        )
      ) : (
        <WelcomeScreen
          report={report}
          onOpenChat={() => setShowChat(true)}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      )}

      {showChat && (
        <div className='absolute top-0 left-0 w-full h-full bg-gray-100/95 z-40 flex items-center justify-center'>
          <ChatPrompt
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmitChat}
            onCancel={() => setShowChat(false)}
          />
        </div>
      )}
    </>
  );
}
