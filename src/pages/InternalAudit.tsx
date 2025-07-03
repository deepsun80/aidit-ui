'use client';

import { useState } from 'react';
import RegulationList from '@/components/InternalAudit/RegulationList';
import RegulationAssessmentView from '@/components/InternalAudit/RegulationAssessmentView';
import RunInternalAssessment from '@/components/InternalAudit/RunInternalAssessment';
import QACards from '@/components/common/QACards';
import NonconformityReport from '@/components/AuditManagement/NonconformityReport';
import { QA } from '@/types/qa';

type Regulation = {
  name: string;
  date: string;
  notFound: number;
  total: number;
};

export type QuestionBankEntry = {
  id: number;
  question: string;
  reference: string;
};

const questionBank: Record<string, Omit<QuestionBankEntry, 'answer'>[]> = {
  '21 CFR Part 803': [
    {
      id: 1,
      question:
        'Does the organization have procedures for Medical Device Reporting (MDR)?',
      reference: '21 CFR §803.17',
    },
    {
      id: 2,
      question: 'Are employees trained to identify and report adverse events?',
      reference: '21 CFR §803.10',
    },
    {
      id: 3,
      question:
        'Is there a process for submitting serious injury and death reports within 30 days?',
      reference: '21 CFR §803.20',
    },
    {
      id: 4,
      question:
        'Does the system maintain adequate records of all reportable events?',
      reference: '21 CFR §803.18',
    },
    {
      id: 5,
      question:
        'Are annual summary reports prepared and submitted as required?',
      reference: '21 CFR §803.33',
    },
  ],
  default: [
    {
      id: 1,
      question: 'Is the organization compliant with the stated regulation?',
      reference: '',
    },
    {
      id: 2,
      question: 'Are procedures documented and accessible to personnel?',
      reference: '',
    },
  ],
};

const generateQAList = (regulationName: string): QA[] => {
  const base: QuestionBankEntry[] =
    questionBank[regulationName] || questionBank.default;

  return base.map((q, idx) => ({
    ...q,
    id: q.id || idx + 1,
    answer:
      idx % 2 === 0
        ? 'Yes. The organization complies with this requirement based on documentation reviewed.'
        : 'No. There is no clear evidence of compliance found in the current procedures.',
  }));
};

export default function InternalAudit() {
  const [activeRegulation, setActiveRegulation] = useState<Regulation | null>(
    null
  );
  const [runningAssessment, setRunningAssessment] = useState(false);
  const [showOnlyNotFound, setShowOnlyNotFound] = useState(false);
  const [showNonconformityReport, setShowNonconformityReport] = useState(false);
  const [viewingAudit, setViewingAudit] = useState<{
    auditId: string;
    date: string;
    qaList: QA[];
    regulation: Regulation;
  } | null>(null);

  const handleViewReport = (auditId: string, date: string) => {
    if (!activeRegulation) return;

    const qaList = generateQAList(activeRegulation.name);
    setViewingAudit({
      auditId,
      date,
      qaList,
      regulation: activeRegulation,
    });
  };

  const handleBackToAssessment = () => {
    setViewingAudit(null);
    setShowNonconformityReport(false);
  };

  return (
    <div className='text-gray-900'>
      {!activeRegulation && (
        <RegulationList setActiveRegulation={setActiveRegulation} />
      )}

      {activeRegulation && !runningAssessment && !viewingAudit && (
        <RegulationAssessmentView
          regulation={activeRegulation}
          onRunAssessment={() => setRunningAssessment(true)}
          onBack={() => setActiveRegulation(null)}
          onViewReport={handleViewReport}
        />
      )}

      {activeRegulation && runningAssessment && (
        <RunInternalAssessment
          regulation={activeRegulation}
          qaList={generateQAList(activeRegulation.name)}
          onCancel={() => setRunningAssessment(false)}
        />
      )}

      {viewingAudit && showNonconformityReport && (
        <NonconformityReport
          qaList={viewingAudit.qaList}
          notFoundCount={
            viewingAudit.qaList.filter((q) =>
              q.answer.trim().toLowerCase().startsWith('no')
            ).length
          }
          onBack={() => setShowNonconformityReport(false)}
          auditId={viewingAudit.auditId}
          customer='Internal'
          date={viewingAudit.date}
        />
      )}

      {viewingAudit && !showNonconformityReport && (
        <QACards
          qaList={viewingAudit.qaList}
          report={{
            auditId: viewingAudit.auditId,
            date: viewingAudit.date,
            customer: 'Internal',
          }}
          onEdit={() => {}}
          onDelete={() => {}}
          notFoundCount={
            viewingAudit.qaList.filter((q) =>
              q.answer.trim().toLowerCase().startsWith('no')
            ).length
          }
          showOnlyNotFound={showOnlyNotFound}
          setShowOnlyNotFound={setShowOnlyNotFound}
          onDownload={() => {}}
          onViewReport={() => setShowNonconformityReport(true)}
          onAskNew={() => {}}
          onUploadNew={() => {}}
          onViewUploaded={() => {}}
          hasUploadedQuestions={false}
          showControls={false}
          onBack={handleBackToAssessment}
        />
      )}
    </div>
  );
}
