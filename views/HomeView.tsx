
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
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-16">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
            System PetNFC v1.0
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Twój Pies w <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Jednym Dotknięciu.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Zintegrowany system identyfikacji NFC. Zabezpiecz swojego pupila nowoczesną technologią.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => startNFCScan(handleNFCScanResult)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-lg shadow-blue-900/40 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M7.5 12.2a4.95 4.95 0 0 1 9 0"/><path d="M9.1 10.1a2.9 2.9 0 0 1 5.8 0"/><path d="M12 14v.01"/></svg>
              Skanuj Tag NFC
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight px-1">Twoje Psy</h2>
        {dogs.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
             Nie masz jeszcze żadnych profili.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map(dog => (
              <Link 
                key={dog.id} 
                to={`/dog/${dog.id}`}
                className="group bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 mb-4">
                  <img src={dog.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase truncate">{dog.name}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase truncate">{dog.breed}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
