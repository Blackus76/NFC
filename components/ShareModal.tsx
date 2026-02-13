
import React, { useState, useEffect, useRef } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      try {
        // Najbezpieczniejsza metoda pobrania aktualnego adresu URL
        // Bierzemy dokładnie to, co jest w pasku adresu, ale bez części po # (router) i ? (parametry)
        let cleanUrl = window.location.href.split('#')[0].split('?')[0];
        
        // Jeśli adres kończy się slashem, zostawiamy. Jeśli nie, sprawdzamy czy to nie plik.
        // W tym środowisku bezpieczniej jest trzymać się pełnej ścieżki.
        if (!cleanUrl.endsWith('/') && !cleanUrl.split('/').pop()?.includes('.')) {
          cleanUrl += '/';
        }

        // Finalne sprawdzenie na wypadek błędów środowiska (np. podwójne https)
        if (cleanUrl.includes('https://https://')) {
          cleanUrl = cleanUrl.replace('https://https://', 'https://');
        }

        setUrl(cleanUrl);
      } catch (e) {
        setUrl(window.location.origin + '/');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&ecc=M&margin=2`;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all hover:rotate-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="text-center space-y-6">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase leading-none">Link do Tagu NFC</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Skanuj telefonem, aby otworzyć</p>
          </div>

          <div className="bg-white p-4 rounded-3xl border-2 border-slate-50 shadow-inner inline-block">
            <img src={qrCodeUrl} alt="Kod QR" className="w-44 h-44 mx-auto" />
          </div>

          <div className="space-y-4 text-left">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Adres URL:</span>
              <p className="text-[10px] font-mono text-slate-700 break-all leading-tight">
                {url}
              </p>
            </div>

            <button 
              onClick={copyToClipboard}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {copied ? 'Skopiowano adres!' : 'Kopiuj Link do NFC'}
            </button>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <p className="text-[10px] text-blue-800 leading-normal font-medium">
                <b>Ważne:</b> To jest adres tymczasowy dla tej sesji. Aby mieć stały adres, możesz wrzucić ten kod na własny hosting (np. Vercel lub GitHub Pages).
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
