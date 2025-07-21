'use client';

import {
  FileTextIcon,
  ReaderIcon,
  ArchiveIcon,
  LayersIcon,
  CaretUpIcon,
  CaretDownIcon,
  CardStackIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';

export default function Sidebar({
  setActivePage,
  activePage,
}: {
  setActivePage: (page: 'audit' | 'supplier' | 'internal' | 'erp') => void;
  activePage: 'audit' | 'supplier' | 'internal' | 'erp';
}) {
  const [showQmsSubmenu, setShowQmsSubmenu] = useState(false);

  return (
    <aside className='w-70 bg-gray-600 text-white flex flex-col items-center pt-6 min-h-full gap-20'>
      {/* Logo */}
      <div className='flex items-center'>
        <Image src='/AiDIT-logo.jpg' alt='AiDIT Logo' width={180} height={80} />
      </div>

      {/* Nav Items */}
      <nav className='flex flex-col gap-6 text-md w-full px-6'>
        {/* QMS Section */}
        <div>
          <button
            onClick={() => setShowQmsSubmenu(!showQmsSubmenu)}
            className='flex items-center justify-between px-4 py-2 rounded-sm transition w-full text-gray-100 hover:text-white'
          >
            <div className='flex gap-2 items-center'>
              <CardStackIcon className='w-6 h-6 text-inherit' />
              <span>QMS</span>
            </div>
            {showQmsSubmenu ? (
              <CaretUpIcon className='w-4 h-4 text-inherit' />
            ) : (
              <CaretDownIcon className='w-4 h-4 text-inherit' />
            )}
          </button>

          {showQmsSubmenu && (
            <div className='ml-8 mt-4 flex flex-col gap-4'>
              <button
                onClick={() => setActivePage('audit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
                  activePage === 'audit'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FileTextIcon
                  className={`w-5 h-5 ${
                    activePage === 'audit' ? 'text-blue-400' : 'text-inherit'
                  }`}
                />
                <span>Customer Audit</span>
              </button>

              <button
                onClick={() => setActivePage('internal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
                  activePage === 'internal'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <LayersIcon
                  className={`w-5 h-5 ${
                    activePage === 'internal' ? 'text-blue-400' : 'text-inherit'
                  }`}
                />
                <span>Internal Audits</span>
              </button>

              <button
                onClick={() => setActivePage('supplier')}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
                  activePage === 'supplier'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <ReaderIcon
                  className={`w-5 h-5 ${
                    activePage === 'supplier' ? 'text-blue-400' : 'text-inherit'
                  }`}
                />
                <span>Supplier Audits</span>
              </button>
            </div>
          )}
        </div>

        {/* ERP Section */}
        <button
          onClick={() => setActivePage('erp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
            activePage === 'erp'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <ArchiveIcon
            className={`w-6 h-6 ${
              activePage === 'erp' ? 'text-blue-400' : 'text-inherit'
            }`}
          />
          <span>ERP</span>
        </button>
      </nav>
    </aside>
  );
}
