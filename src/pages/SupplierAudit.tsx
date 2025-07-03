'use client';

import { useState } from 'react';
import SupplierList from '@/components/SupplierAudit/SupplierList';
import SupplierAssessmentView from '@/components/SupplierAudit/SupplierAssessmentView';
import RunSupplierAssessment from '@/components/SupplierAudit/RunSupplierAssessment';
import QACards from '@/components/common/QACards';
import { QA } from '@/types/qa';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

const generateQAList = (): QA[] => {
  const baseQuestions = [
    {
      id: 1,
      question: 'Does the supplier have documented sterilization validation?',
      reference: 'ISO 11135, CFR §820.75',
    },
    {
      id: 2,
      question: 'Are training records maintained for critical processes?',
      reference: 'CFR §820.25, ISO 13485',
    },
    {
      id: 3,
      question: 'Has the supplier completed a recent internal audit?',
      reference: 'ISO 13485, CFR §820.22',
    },
    {
      id: 4,
      question: 'Are incoming materials verified upon receipt?',
      reference: 'CFR §820.80, ISO 9001',
    },
    {
      id: 5,
      question: 'Is there a CAPA process for nonconforming products?',
      reference: 'CFR §820.100, ISO 13485',
    },
  ];

  return baseQuestions.map((q, idx) => ({
    id: q.id,
    question: `${q.question} - ${q.reference}`,
    answer:
      idx % 2 === 0
        ? 'Yes. Supplier provided documentation and validation records.'
        : 'No. Evidence of compliance was not available during review.',
  }));
};

export default function SupplierAudit() {
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [runningAssessment, setRunningAssessment] = useState(false);
  const [showOnlyNotFound, setShowOnlyNotFound] = useState(false);
  const [viewingAudit, setViewingAudit] = useState<{
    auditId: string;
    date: string;
    qaList: QA[];
    supplier: Supplier;
  } | null>(null);

  const handleViewReport = (auditId: string, date: string) => {
    if (!activeSupplier) return;

    const qaList = generateQAList();
    setViewingAudit({
      auditId,
      date,
      qaList,
      supplier: activeSupplier,
    });
  };

  const handleBackToAssessment = () => {
    setViewingAudit(null);
  };

  return (
    <div className='text-gray-900'>
      {!activeSupplier && (
        <SupplierList setActiveSupplier={setActiveSupplier} />
      )}

      {activeSupplier && !runningAssessment && !viewingAudit && (
        <SupplierAssessmentView
          supplier={activeSupplier}
          onRunAssessment={() => setRunningAssessment(true)}
          onBack={() => setActiveSupplier(null)}
          onViewReport={handleViewReport}
        />
      )}

      {activeSupplier && runningAssessment && (
        <RunSupplierAssessment
          supplier={activeSupplier}
          onCancel={() => {
            setRunningAssessment(false);
          }}
        />
      )}

      {viewingAudit && (
        <QACards
          qaList={viewingAudit.qaList}
          report={{
            auditId: viewingAudit.auditId,
            date: viewingAudit.date,
            customer: viewingAudit.supplier.name,
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
          onViewReport={() => {}}
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
