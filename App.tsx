
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { DogProfile, Gender, NFCState } from './types.ts';
import { HomeView } from './views/HomeView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { EditProfileView } from './views/EditProfileView.tsx';
import { Navbar } from './components/Navbar.tsx';

const INITIAL_DOGS: DogProfile[] = [
  {
    id: '1',
    nfcId: '04:A1:B2:C3:D4:E5:F6',
    name: 'Burek',
    breed: 'Golden Retriever',
    gender: Gender.MALE,
    photoUrl: 'https://picsum.photos/seed/dog1/400/400',
    birthDate: '2021-05-15',
    vaccinations: [
      { id: 'v1', name: 'Wścieklizna', date: '2023-10-01', expiryDate: '2024-10-01' },
      { id: 'v2', name: 'Parwowiroza', date: '2023-11-15' }
    ],
    createdAt: Date.now()
  }
];

const App: React.FC = () => {
  const [dogs, setDogs] = useState<DogProfile[]>(() => {
    const saved = localStorage.getItem('dogs_v1');
    return saved ? JSON.parse(saved) : INITIAL_DOGS;
  });

  const [nfcState, setNfcState] = useState<NFCState>({
    isSupported: 'NDEFReader' in window,
    isReading: false,
    lastError: null,
    scannedTagId: null
  });

  useEffect(() => {
    localStorage.setItem('dogs_v1', JSON.stringify(dogs));
  }, [dogs]);

  const addDog = (dog: DogProfile) => setDogs(prev => [...prev, dog]);
  
  const updateDog = (updatedDog: DogProfile) => {
    setDogs(prev => prev.map(d => d.id === updatedDog.id ? updatedDog : d));
  };

  const deleteDog = (id: string) => {
    setDogs(prev => prev.filter(d => d.id !== id));
  };

  const startNFCScan = async (onScan?: (serialNumber: string) => void) => {
    if (!('NDEFReader' in window)) {
      alert("NFC nie jest wspierane w tej przeglądarce. Użyj Chrome na Androidzie i upewnij się, że masz włączone NFC w telefonie.");
      return;
    }

    try {
      setNfcState(prev => ({ ...prev, isReading: true, lastError: null }));
      // @ts-ignore
      const ndef = new window.NDEFReader();
      await ndef.scan();
      
      ndef.addEventListener("reading", ({ serialNumber }: any) => {
        setNfcState(prev => ({ ...prev, scannedTagId: serialNumber, isReading: false }));
        if (onScan) onScan(serialNumber);
      });

    } catch (error) {
      setNfcState(prev => ({ ...prev, lastError: "Nie można uruchomić czytnika NFC.", isReading: false }));
      alert("Błąd NFC: Upewnij się, że strona ma uprawnienia do NFC.");
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6 pb-24">
          <Routes>
            <Route path="/" element={<HomeView dogs={dogs} startNFCScan={startNFCScan} nfcState={nfcState} />} />
            <Route path="/dog/:id" element={<ProfileView dogs={dogs} deleteDog={deleteDog} />} />
            <Route path="/edit/:id" element={<EditProfileView dogs={dogs} updateDog={updateDog} nfcState={nfcState} startNFCScan={startNFCScan} />} />
            <Route path="/add" element={<EditProfileView dogs={dogs} updateDog={addDog} nfcState={nfcState} startNFCScan={startNFCScan} isNew />} />
          </Routes>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-6 py-3 flex gap-8 items-center border border-gray-200 pointer-events-auto">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <button 
              onClick={() => startNFCScan()}
              className={`p-4 -mt-10 rounded-full shadow-xl transition-all ${nfcState.isReading ? 'bg-orange-500 nfc-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/></svg>
            </button>
            <Link to="/add" className="text-gray-500 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12h2m-2 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-6z"/><path d="M16 12V8a4 4 0 1 0-8 0v4"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
