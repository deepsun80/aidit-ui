'use client';

import { ArchiveIcon, CardStackIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

export default function Sidebar({
  setActivePage,
  activePage,
}: {
  setActivePage: (
    page: 'audit' | 'supplier' | 'internal' | 'erp' | 'qms'
  ) => void;
  activePage: 'audit' | 'supplier' | 'internal' | 'erp' | 'qms';
}) {
  return (
    <aside className='bg-gray-200 p-3 min-h-screen'>
      <div className='bg-gray-600 h-full text-white rounded-md w-52 flex flex-col items-center pt-6 pb-8 gap-12'>
        {/* <div className='w-60 bg-gradient-to-b from-gray-600 to-gray-900 text-white flex flex-col items-center pt-6 min-h-full gap-20'> */}
        {/* Logo */}
        <div className='flex items-center'>
          <Image
            src='/AiDIT-logo.jpg'
            alt='AiDIT Logo'
            width={165}
            height={80}
          />
        </div>

        {/* Nav Items */}
        <nav className='flex flex-col gap-6 text-md w-full'>
          {/* QMS Section */}
          <button
            onClick={() => setActivePage('qms')}
            className={`flex items-center gap-2 py-2 rounded-l-md transition relative ml-3 pl-3 ${
              activePage === 'qms'
                ? 'bg-gray-200 text-gray-800 font-semibold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {activePage === 'qms' && (
              <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-red-400 rounded-r' />
            )}
            <CardStackIcon
              className={`w-6 h-6 ${
                activePage === 'qms' ? 'text-cyan-700' : 'text-inherit'
              }`}
            />
            <span>QMS</span>
          </button>

          {/* ERP Section */}
          <button
            onClick={() => setActivePage('erp')}
            className={`flex items-center gap-2 py-2 rounded-l-md transition relative ml-3 pl-3 ${
              activePage === 'erp'
                ? 'bg-gray-200 text-gray-800 font-semibold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {activePage === 'erp' && (
              <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-red-400 rounded-r' />
            )}
            <ArchiveIcon
              className={`w-6 h-6 ${
                activePage === 'erp' ? 'text-cyan-700' : 'text-inherit'
              }`}
            />
            <span>ERP</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
