
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShareModal } from './ShareModal';

export const Navbar: React.FC = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172a2 2 0 0 0-1.414.586l-2.122 2.122a2 2 0 0 0-.586 1.414c0 .53.21 1.04.586 1.414l2.122 2.122A2 2 0 0 0 10 13.414c.53 0 1.04-.21 1.414-.586l2.122-2.122a2 2 0 0 0 .586-1.414c0-.53-.21-1.04-.586-1.414l-2.122-2.122A2 2 0 0 0 10 5.172z"/><path d="M14 10.172a2 2 0 0 0-1.414.586l-2.122 2.122a2 2 0 0 0-.586 1.414c0 .53.21 1.04.586 1.414l2.122 2.122A2 2 0 0 0 14 18.414c.53 0 1.04-.21 1.414-.586l2.122-2.122a2 2 0 0 0 .586-1.414c0-.53-.21-1.04-.586-1.414l-2.122-2.122A2 2 0 0 0 14 10.172z"/></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Pet<span className="text-blue-600">NFC</span></span>
          </Link>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsShareOpen(true)}
               className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors flex items-center gap-2"
               title="Otwórz na telefonie"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
               <span className="hidden sm:inline text-xs font-bold uppercase">Udostępnij</span>
             </button>
             <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
             <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">System OK</span>
          </div>
        </div>
      </nav>
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
