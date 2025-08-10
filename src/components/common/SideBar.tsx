'use client';

import {
  ArchiveIcon,
  CardStackIcon,
  QuestionMarkCircledIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function Sidebar({
  setActivePage,
  activePage,
}: {
  setActivePage: (
    page: 'customer-audit' | 'supplier-audit' | 'internal-audit' | 'erp' | 'qms'
  ) => void;
  activePage:
    | 'customer-audit'
    | 'supplier-audit'
    | 'internal-audit'
    | 'erp'
    | 'qms';
}) {
  return (
    <aside className='bg-gray-200 p-3 min-h-screen'>
      <div className='bg-gray-600 h-full text-white rounded-md w-52 flex flex-col justify-between pt-6 pb-6'>
        {/* Logo */}
        <div className='flex flex-col items-center gap-12'>
          <Image
            src='/AiDIT-logo.jpg'
            alt='AiDIT Logo'
            width={165}
            height={80}
          />

          {/* Nav Items */}
          <nav className='flex flex-col gap-6 text-md w-full px-2'>
            <button
              onClick={() => setActivePage('qms')}
              className={`flex items-center gap-2 py-2 rounded-l-md transition relative pl-3 ${
                activePage === 'qms' ||
                activePage === 'customer-audit' ||
                activePage === 'internal-audit' ||
                activePage === 'supplier-audit'
                  ? 'bg-gray-200 text-gray-800 font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {(activePage === 'qms' ||
                activePage === 'customer-audit' ||
                activePage === 'internal-audit' ||
                activePage === 'supplier-audit') && (
                <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-red-400 rounded-r' />
              )}
              <CardStackIcon
                className={`w-6 h-6 ${
                  activePage === 'qms' ||
                  activePage === 'customer-audit' ||
                  activePage === 'internal-audit' ||
                  activePage === 'supplier-audit'
                    ? 'text-cyan-700'
                    : 'text-inherit'
                }`}
              />
              <span>QMS</span>
            </button>

            <button
              onClick={() => setActivePage('erp')}
              className={`flex items-center gap-2 py-2 rounded-l-md transition relative pl-3 ${
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
              <span>BPM</span>
            </button>
          </nav>
        </div>

        {/* Help and Sign Out */}
        <div className='flex flex-col gap-6 px-4 text-md'>
          <button
            title='Help'
            className='flex items-center gap-2 text-gray-300 hover:text-white transition'
          >
            <QuestionMarkCircledIcon className='w-4 h-4' />
            Help
          </button>
          <button
            onClick={() => signOut()}
            title='Sign Out'
            className='flex items-center gap-2 text-gray-300 hover:text-white transition'
          >
            <PersonIcon className='w-4 h-4' />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
