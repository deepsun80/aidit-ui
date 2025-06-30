'use client';

import { useState, useRef, useEffect } from 'react';
import ChatPrompt from '@/components/ChatPrompt';
import QuestionSelector from '@/components/QuestionSelector';
import QACards from '@/components/QACards';
import NonconformityReport from '@/components/NonconformityReport';
import WelcomeScreen from '@/components/WelcomeScreen';
import CreateReport from '@/components/CreateReport';
import type { QAReport } from '@/types/qa';
import { handleDownloadPDF } from '@lib/downloadPDF';

interface AuditManagementProps {
  report: QAReport | null;
  setReport: (report: QAReport | null) => void;
  updateReport: (partial: Partial<QAReport>) => void;
  deleteQuestions: () => void;
  showError: (message: string) => void;
}

export default function AuditManagement({
  report,
  setReport,
  updateReport,
  deleteQuestions,
  showError,
}: AuditManagementProps) {
  const [hasMounted, setHasMounted] = useState(false); // For Next.js hydration mismatch or flicker fix
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

    await processQuery(input);
    setShowChat(false);
    setLoading(false);
  };

  const handleSubmitQuestions = async () => {
    if (!report || selectedQuestions.length === 0) return;

    setLoading(true);
    setSubmissionProgress(0);
    cancelRequestedRef.current = false;

    let currentQaList = [...qaList];

    for (let i = 0; i < selectedQuestions.length; i++) {
      if (cancelRequestedRef.current) {
        console.log('Cancellation triggered.');
        break;
      }

      const question = selectedQuestions[i];
      const exists = currentQaList.some(
        (qa) => qa.question.trim() === question.trim()
      );

      if (exists) {
        console.log(`Skipping duplicate question: ${question}`);
        continue;
      }

      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
      });

      const data = await res.json();

      if (data.answer) {
        const newQa = { question: data.question, answer: data.answer };
        currentQaList = [...currentQaList, newQa];
        updateReport({ qaList: currentQaList });
      }

      setSubmissionProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setSubmissionProgress(null);
    setLoading(false);
    setShowQuestionSelector(false);
    setShowCancel(false);
    cancelRequestedRef.current = false;
  };
  //     const res = await fetch('/api/query', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ query }),
  //     });

  //     const data = await res.json();

  //     if (data.answer && report) {
  //       updateReport({
  //         qaList: [
  //           ...(report.qaList || []),
  //           { question: data.question, answer: data.answer },
  //         ],
  //       });
  //     }
  //   } catch (error) {
  //     showError(`Error with query: ${error}`);
  //     console.error('Error with query:', error);
  //   }
  // };

  const processQuery = async (query: string) => {
    try {
      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, organization: report?.customer || 'paramount' }),
      });
  
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
  
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
      
        // 🛠️ Detect tool usage metadata
        if (chunk.includes('[ToolCall]')) {
          const match = chunk.match(/\[ToolCall\] (.+)/);
          if (match) {
            try {
              const { tool, agent } = JSON.parse(match[1]);
              console.log(`🛠️ Agent: ${agent} → Tool: ${tool}`);
              setActiveAgent(agent);
              setActiveTool(tool);
            } catch (err) {
              console.warn('Failed to parse tool call metadata:', err);
            }
          }
          continue;
        }
      
        // ✅ Smart formatting: inject newline before Citation: if missing
        const formattedChunk = chunk.replace(/(?<!\n)(Citation: )/g, '\n$1');
      
        fullText += formattedChunk;
      }
      
      
  
      updateReport({
        qaList: [...(report?.qaList || []), { question: query, answer: fullText }],
      });

      setActiveAgent(null);
      setActiveTool(null);
    } catch (error) {
      showError(`Streaming error: ${error}`);
      console.error('Streaming error:', error);
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
      <div className='fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center z-50'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
        <span className='mt-2 text-gray-700 text-sm text-center px-4'>
          Initializing...
        </span>
      </div>
    );
  }

  return (
    <>
      {(loading || uploading) && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center z-50'>
          <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
          <span className='mt-2 text-gray-700 text-sm text-center px-4'>
            {showCancel
              ? 'Cancelling...'
              : uploading
                ? `Processing ${selectedFile?.name ?? 'file'}...`
                : submissionProgress !== null
                  ? `Processing ${submissionProgress} / ${selectedQuestions.length}...`
                  : activeAgent && activeTool
                    ? <>
                        <span>Processing...</span>
                        {activeAgent && activeTool && (
                          <span className='mt-1 text-sm text-gray-600 flex items-center gap-2'>
                            <span>🤖 {activeAgent}</span>
                            <span className='text-gray-400'>→</span>
                            <span>🛠️ {activeTool}</span>
                          </span>
                        )}
                      </>
                    : 'Processing...'}
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
        accept='.pdf'
        className='hidden'
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
      />

      {!report ? (
        <CreateReport setReport={setReport} />
      ) : showQuestionSelector && questions ? (
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
        <div className='absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-95 z-40 flex items-center justify-center'>
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
