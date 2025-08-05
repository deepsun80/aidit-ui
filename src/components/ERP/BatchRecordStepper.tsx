/**
 * ⏱ BatchRecordStepper
 *
 * Renders a multi-step progress UI for the batch records workflow inside the ERP system.
 * Displays individual steps such as draft, review, and approval, using visual cues
 * and completion status to guide the user.
 */

'use client';

import { useEffect, useState } from 'react';
import { ReloadIcon, CheckCircledIcon } from '@radix-ui/react-icons';

interface BatchRecordStepperProps {
  onComplete: () => void;
  selectedBatches: Batch[];
}

type Batch = {
  id: string;
  nonConformance: string | null;
};

type Step = {
  title: string;
  complete: boolean;
};

export default function BatchRecordStepper({
  onComplete,
  selectedBatches,
}: BatchRecordStepperProps) {
  const [steps, setSteps] = useState<Step[]>([
    { title: 'BR Agent getting customer requirements', complete: false },
    {
      title: `BR Agent generating batch record report${
        selectedBatches.length > 1 ? 's' : ''
      }`,
      complete: false,
    },
  ]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex === 0) {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => (i === 0 ? { ...step, complete: true } : step))
        );
        setStepIndex(1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stepIndex === 1) {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) =>
            i === 1
              ? {
                  ...step,
                  complete: true,
                }
              : step
          )
        );
        setStepIndex(2);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, selectedBatches.length, onComplete]);

  return (
    <div className='flex flex-col gap-6 mt-4'>
      {steps.map((step, idx) => (
        <div
          key={idx}
          className='flex items-center gap-2 text-sm text-gray-800'
        >
          <div className='w-5 h-5 flex items-center justify-center'>
            {step.complete ? (
              <CheckCircledIcon className='text-green-500 w-5 h-5' />
            ) : (
              <ReloadIcon className='animate-spin text-blue-500 w-5 h-5' />
            )}
          </div>
          <span>{step.title}</span>
        </div>
      ))}
    </div>
  );
}
