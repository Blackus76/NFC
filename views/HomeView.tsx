
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DogProfile, NFCState } from '../types';

interface HomeViewProps {
  dogs: DogProfile[];
  startNFCScan: (onScan?: (serialNumber: string) => void) => void;
  nfcState: NFCState;
}

export const HomeView: React.FC<HomeViewProps> = ({ dogs, startNFCScan, nfcState }) => {
  const navigate = useNavigate();

  const handleNFCScanResult = (serialNumber: string) => {
    const foundDog = dogs.find(d => d.nfcId === serialNumber);
    if (foundDog) {
      navigate(`/dog/${foundDog.id}`);
    } else {
      if (confirm(`Nie znaleziono psa przypisanego do tagu ${serialNumber}. Czy chcesz dodać nowego?`)) {
        navigate(`/add?nfc=${serialNumber}`);
      }
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-16">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
            Nowoczesna Opieka 2.0
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Twój Pies w <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Jednym Dotknięciu.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Zintegrowany system identyfikacji NFC, AI i opieki weterynaryjnej. Zabezpiecz swojego pupila inteligentną technologią.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => startNFCScan(handleNFCScanResult)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-lg shadow-blue-900/40 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M7.5 12.2a4.95 4.95 0 0 1 9 0"/><path d="M9.1 10.1a2.9 2.9 0 0 1 5.8 0"/><path d="M12 14v.01"/></svg>
              Skanuj Tag NFC
            </button>
            <Link 
              to="/add" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
            >
              Dodaj Profil
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">Tagi NFC</h3>
          <p className="text-slate-500 text-sm">Zapisz dane psa na chipie NFC. Każdy, kto zbliży telefon, zobaczy profil i kontakt.</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/></svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">AI Breed Scanner</h3>
          <p className="text-slate-500 text-sm">Zrób zdjęcie, a nasza sztuczna inteligencja Gemini natychmiast rozpozna rasę Twojego pupila.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">Terminy Szczepień</h3>
          <p className="text-slate-500 text-sm">Pełna historia zdrowia zawsze pod ręką. Koniec z papierowymi książeczkami!</p>
        </div>
      </section>

      {/* NFC Scanning Indicator */}
      {nfcState.isReading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
            <div className="relative bg-white p-10 rounded-full text-blue-600 shadow-2xl nfc-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M7.5 12.2a4.95 4.95 0 0 1 9 0"/><path d="M9.1 10.1a2.9 2.9 0 0 1 5.8 0"/><path d="M12 14v.01"/></svg>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Szukam Sygnału...</h2>
          <p className="text-slate-400 max-w-xs mx-auto">Przyłóż tył telefonu do obroży psa lub tagu NFC.</p>
        </div>
      )}

      {/* Dogs List Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Twoja Gromadka</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Zarządzanie Profilami</p>
          </div>
        </div>

        {dogs.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172a2 2 0 0 0-1.414.586l-2.122 2.122a2 2 0 0 0-.586 1.414c0 .53.21 1.04.586 1.414l2.122 2.122A2 2 0 0 0 10 13.414c.53 0 1.04-.21 1.414-.586l2.122-2.122a2 2 0 0 0 .586-1.414c0-.53-.21-1.04-.586-1.414l-2.122-2.122A2 2 0 0 0 10 5.172z"/><path d="M14 10.172a2 2 0 0 0-1.414.586l-2.122 2.122a2 2 0 0 0-.586 1.414c0 .53.21 1.04.586 1.414l2.122 2.122A2 2 0 0 0 14 18.414c.53 0 1.04-.21 1.414-.586l2.122-2.122a2 2 0 0 0 .586-1.414c0-.53-.21-1.04-.586-1.414l-2.122-2.122A2 2 0 0 0 14 10.172z"/></svg>
             </div>
             <p className="text-slate-400 font-medium">Nie masz jeszcze żadnych psów. Dodaj pierwszego!</p>
             <Link to="/add" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Dodaj teraz &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map(dog => (
              <Link 
                key={dog.id} 
                to={`/dog/${dog.id}`}
                className="group bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative mb-4">
                  <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100">
                    <img src={dog.photoUrl || `https://picsum.photos/seed/${dog.id}/400/400`} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {dog.nfcId && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-xl shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M7.5 12.2a4.95 4.95 0 0 1 9 0"/><path d="M9.1 10.1a2.9 2.9 0 0 1 5.8 0"/><path d="M12 14v.01"/></svg>
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <h3 className="text-xl font-black text-slate-900 uppercase truncate">{dog.name}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase truncate">{dog.breed}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1">
                       <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${dog.vaccinations.length > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {dog.vaccinations.length} szczepień
                       </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Footer */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white text-center">
         <h2 className="text-3xl font-black mb-4">Gotowy na Cyfrową Rewolucję?</h2>
         <p className="text-blue-100 mb-8 max-w-md mx-auto">Dołącz do tysięcy opiekunów, którzy wybrali bezpieczeństwo i wygodę NFC.</p>
         <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95 uppercase tracking-wide">
           Zamów Tag PetNFC
         </button>
      </section>
    </div>
  );
};
