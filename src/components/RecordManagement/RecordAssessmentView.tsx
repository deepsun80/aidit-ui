'use client';

import { CaretLeftIcon } from '@radix-ui/react-icons';

export default function RecordAssessmentView({
  onBack,
  requirement,
  setRequirement,
  batchSet,
  setBatchSet,
  onSubmit,
}: {
  onBack: () => void;
  requirement: string;
  setRequirement: (value: string) => void;
  batchSet: string;
  setBatchSet: (value: string) => void;
  onSubmit: () => void;
}) {
  const handleSubmit = () => {
    if (!requirement || !batchSet) return;
    onSubmit();
  };

  return (
    <div className='max-w-xl mx-auto'>
      <div className='flex justify-between items-start mb-6'>
        <h2 className='text-2xl font-semibold text-gray-900'>New Assessment</h2>
        <button
          onClick={onBack}
          className='w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center'
          title='Back'
        >
          <CaretLeftIcon className='w-5 h-5' />
        </button>
      </div>

      <div className='bg-white shadow-md p-6 rounded border border-gray-300'>
        {/* Requirement Dropdown */}
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Requirement:
        </label>
        <select
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-sm text-gray-900 focus:outline-gray-400 mb-6'
        >
          <option value=''>Select requirement</option>
          <option value='R101'>R101</option>
          <option value='S102'>S102</option>
          <option value='B103'>B103</option>
        </select>

        {/* Batch Record Set Dropdown */}
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Record Batch Set:
        </label>
        <select
          value={batchSet}
          onChange={(e) => setBatchSet(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-sm text-gray-900 focus:outline-gray-400 mb-12'
        >
          <option value=''>Select batch set</option>
          <option value='Sterile Processing Batch #042'>
            Sterile Processing Batch #042
          </option>
        </select>

        <div className='flex justify-end'>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-sm transition ${
              requirement && batchSet
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
