'use client';

import { useEffect, useState } from 'react';
import { ReloadIcon, CheckCircledIcon } from '@radix-ui/react-icons';

interface BatchRecordStepperProps {
  onComplete: () => void;
}

type Step = {
  title: string;
  complete: boolean;
};

export default function BatchRecordStepper({
  onComplete,
}: BatchRecordStepperProps) {
  const [steps, setSteps] = useState<Step[]>([
    { title: 'BR Agent getting customer requirements', complete: false },
    { title: 'BR Agent generating batch record (1)', complete: false },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [batchStepCount, setBatchStepCount] = useState(1);

  useEffect(() => {
    if (stepIndex === 0) {
      // complete step 0 after 1s
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => (i === 0 ? { ...step, complete: true } : step))
        );
        setStepIndex(1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stepIndex === 1 && batchStepCount <= 3) {
      // update title for step 1 over 3 seconds
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) =>
            i === 1
              ? {
                  ...step,
                  title: `BR Agent generating batch record (${batchStepCount})`,
                }
              : step
          )
        );
        setBatchStepCount((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stepIndex === 1 && batchStepCount > 3) {
      // complete step 1 after (1 → 2 → 3)
      setSteps((prev) =>
        prev.map((step, i) => (i === 1 ? { ...step, complete: true } : step))
      );
      setStepIndex(2);
      onComplete();
    }
  }, [stepIndex, batchStepCount, onComplete]);

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
