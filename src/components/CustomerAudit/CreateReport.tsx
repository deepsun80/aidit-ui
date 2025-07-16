/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { CaretLeftIcon } from '@radix-ui/react-icons';

export default function CreateReport({
  setReport,
  onBack,
}: {
  setReport: any;
  onBack: () => void;
}) {
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (!customer.trim() || !date) return;

    // Generate audit ID: MMDDYYYY + first 3 letters of customer name (uppercase, no space)
    const [yyyy, mm, dd] = date.split('-');
    const dateCode = `${mm}${dd}${yyyy}`;
    const abbreviation = customer
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 3)
      .toUpperCase();
    const auditId = `${dateCode}${abbreviation}`;

    setReport({
      auditId,
      customer: customer.trim(),
      date,
      questions: null,
      qaList: [],
      selectedQuestions: [],
      selectedFile: null,
    });
  };

  return (
    <div className='max-w-xl mx-auto'>
      <div className='flex justify-between items-start mb-6'>
        <h2 className='text-2xl font-semibold text-gray-900'>Create Audit</h2>
        <button
          onClick={onBack}
          className='w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center'
          title='Back'
        >
          <CaretLeftIcon className='w-5 h-5' />
        </button>
      </div>

      <div className='bg-white shadow-md p-6 rounded border border-gray-300'>
        {/* Requesting Entity */}
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Requesting Entity:
        </label>
        <input
          type='text'
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder='Enter customer name'
          className='w-full px-4 py-2 border border-gray-300 rounded-sm text-gray-900 focus:outline-gray-400 mb-6'
        />

        {/* Requested Date */}
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Requested Date:
        </label>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-sm text-gray-900 focus:outline-gray-400 mb-12'
        />

        <div className='flex justify-end'>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-sm transition ${
              customer.trim() && date
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
