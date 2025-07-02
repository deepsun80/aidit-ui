'use client';

import { useState } from 'react';
import SupplierList from '@/components/SupplierAudit/SupplierList';
import SupplierAssessmentView from '@/components/SupplierAudit/SupplierAssessmentView';
import RunAssessment from '@/components/SupplierAudit/RunAssessment';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

export default function SupplierAudit() {
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [runningAssessment, setRunningAssessment] = useState(false);

  return (
    <div className='text-gray-900'>
      {!activeSupplier && (
        <SupplierList setActiveSupplier={setActiveSupplier} />
      )}

      {activeSupplier && !runningAssessment && (
        <SupplierAssessmentView
          supplier={activeSupplier}
          onRunAssessment={() => setRunningAssessment(true)}
          onBack={() => setActiveSupplier(null)}
        />
      )}

      {activeSupplier && runningAssessment && (
        <RunAssessment
          supplier={activeSupplier}
          onCancel={() => {
            setRunningAssessment(false);
          }}
        />
      )}
    </div>
  );
}
