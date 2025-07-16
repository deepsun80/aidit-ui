'use client';

import { useState } from 'react';
import RegulationList from '@/components/InternalAudit/RegulationList';
import RegulationAssessmentView from '@/components/InternalAudit/RegulationAssessmentView';
import RunInternalAssessment from '@/components/InternalAudit/RunInternalAssessment';
import QACards from '@/components/common/QACards';
import NonconformityReport from '@/components/CustomerAudit/NonconformityReport';
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

const questionBank: Record<string, QuestionBankEntry[]> = {
  'Quality System': [
    {
      id: 1,
      question:
        'Is there a formal organization approved quality policy statement?',
      reference: 'CFR 820.20(a); ISO 9001/13485 5.3',
    },
    {
      id: 2,
      question:
        'Is the quality policy statement clearly posted, communicated, and understood?',
      reference: 'CFR 820.20(a); ISO 9001/13485 5.3',
    },
    {
      id: 3,
      question:
        'Have quality system procedures and instructions ben established and maintained?',
      reference: 'CFR 820.20(e); 820.186, ISO 9001/13485 4.2.1',
    },
    {
      id: 4,
      question:
        'Is there an approved Quality System Record that includes location of all QMS procedures that are not specific to a particular type of device?',
      reference: 'CFR 820.20(e); 820.186, ISO 9001/13485 4.2.1',
    },
    {
      id: 5,
      question:
        'Does the quality manual state the scope of QMS including justification for any exclusions from referenced standards and regulations?',
      reference: 'ISO 9001/13485 4.2.2',
    },
    {
      id: 6,
      question:
        'Has the organization identified processes needed in its QMS, determined the sequence and interaction of those processes ,and established criteria to ensure the quality objectives are attained?',
      reference: 'ISO 9001/13485 4.1',
    },
    {
      id: 7,
      question:
        'Are changes to the QMS planned, communicated, and implemented in such a way as to maintain the integrity of the QMS?',
      reference: 'CFR 820.40(b), ISO 9001/13485 5.4.2',
    },
    {
      id: 8,
      question:
        'Is there evidence that there is appropriate communication in the organization regarding the effectiveness of the QMS, e.g quality goals, internal/external quality audits, management reviews, and regulatory inspections?',
      reference: 'ISO 9001/13485 5.5.3',
    },
    {
      id: 9,
      question:
        'Does the quality system documentation refer to applicable regulations, directives, laws, and standards, including such items as FDA Quality System Regulation and Medical Device Directive?',
      reference: 'ISO 13485 4.2.1',
    },
    {
      id: 10,
      question:
        'Did management reviews cover all the required topics specified in the quality manual, regulations, standards, and/or management review procedures, and are they identified?',
      reference: 'CFR 820.20(c), ISO 9001/13485 5.6.2, 5.6.3',
    },
  ],
};

const generateQAList = (regulationName: string): QA[] => {
  const base = questionBank[regulationName] || [];

  return base.map((q, idx) => {
    const isNo = [2, 4, 9].includes(idx + 1); // 1-based indexes for No
    const answer = isNo
      ? 'No. There is no clear evidence of compliance found in the current procedures.\n\nCitation: Quality Manual; File: QM103-v1 - Quality Manual.pdf; Page: 14'
      : 'Yes. The organization complies with this requirement based on documentation reviewed.\n\nCitation: Quality Manual; File: QM103-v1 - Quality Manual.pdf; Page: 12';

    return {
      id: q.id,
      question: `${q.question} - ${q.reference}`,
      answer,
    };
  });
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
