'use client';

import { useEffect, useState } from 'react';
import { ReloadIcon, CheckCircledIcon } from '@radix-ui/react-icons';

type Step = {
  title: string;
  complete: boolean;
};

interface QuoteStepperProps {
  onComplete: () => void;
}

export default function QuoteStepper({ onComplete }: QuoteStepperProps) {
  const [steps, setSteps] = useState<Step[]>([
    { title: 'CPQ Agent getting customer specs', complete: false },
    { title: 'CPQ Agent getting pricing info', complete: false },
  ]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex < steps.length) {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex ? { ...step, complete: true } : step
          )
        );
        setStepIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [stepIndex, steps.length, onComplete]);

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
              <ReloadIcon className='animate-spin text-gray-500 w-5 h-5' />
            )}
          </div>
          <span>{step.title}</span>
        </div>
      ))}
    </div>
  );
}
