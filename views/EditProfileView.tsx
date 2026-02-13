
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DogProfile, Gender, NFCState, Vaccination } from '../types';
import { detectBreedFromPhoto } from '../services/geminiService';

interface EditProfileViewProps {
  dogs: DogProfile[];
  updateDog: (dog: DogProfile) => void;
  nfcState: NFCState;
  startNFCScan: (onScan?: (serialNumber: string) => void) => void;
  isNew?: boolean;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({ dogs, updateDog, nfcState, startNFCScan, isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nfcFromUrl = queryParams.get('nfc');

  const [form, setForm] = useState<Partial<DogProfile>>({
    id: id || Math.random().toString(36).substr(2, 9),
    name: '',
    breed: '',
    gender: Gender.MALE,
    photoUrl: null,
    birthDate: new Date().toISOString().split('T')[0],
    vaccinations: [],
    nfcId: nfcFromUrl || null,
    createdAt: Date.now()
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isNew && id) {
      const existing = dogs.find(d => d.id === id);
      if (existing) setForm(existing);
    }
  }, [id, dogs, isNew]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kompresja obrazu przed wysłaniem do Gemini (opcjonalnie, tu używamy prostej metody)
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setForm(prev => ({ ...prev, photoUrl: base64 }));
      
      // Auto-wykrywanie rasy za pomocą Gemini
      try {
        setIsAnalyzing(true);
        const detected = await detectBreedFromPhoto(base64);
        setForm(prev => ({ ...prev, breed: detected }));
      } catch (err) {
        console.error("AI Breed detection failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddVaccination = () => {
    const vName = prompt("Nazwa szczepienia (np. Wścieklizna):");
    if (!vName) return;
    const vDate = prompt("Data szczepienia (RRRR-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!vDate) return;
    
    const newV: Vaccination = {
      id: Math.random().toString(36).substr(2, 5),
      name: vName,
      date: vDate
    };
    
    setForm(prev => ({
      ...prev,
      vaccinations: [...(prev.vaccinations || []), newV]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.breed) return alert("Wypełnij przynajmniej imię i rasę psa!");
    updateDog(form as DogProfile);
    navigate(`/dog/${form.id}`);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-slate-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          {isNew ? 'Nowy Profil' : 'Edycja Psa'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Sekcja Zdjęcia i AI */}
        <div className="flex flex-col items-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-44 h-44 rounded-[2.5rem] bg-slate-200 overflow-hidden relative group cursor-pointer border-4 border-white shadow-xl transform transition-transform hover:scale-105 active:scale-95"
          >
            {form.photoUrl ? (
              <img src={form.photoUrl} className="w-full h-full object-cover" alt="Podgląd" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span className="text-[10px] font-black mt-3 uppercase tracking-widest text-slate-400">Dodaj Fotkę</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </div>
            {isAnalyzing && (
              <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 text-center">
                 <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Skanowanie AI...</p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>

        {/* Dane Podstawowe */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Imię Psa</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="np. Burek"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 transition-all font-bold text-slate-800 placeholder:text-slate-300 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rasa</label>
              {isAnalyzing && <span className="text-[9px] text-blue-500 font-bold animate-pulse">AUTOUZUPEŁNIANIE...</span>}
            </div>
            <input 
              type="text" 
              value={form.breed} 
              onChange={e => setForm(prev => ({ ...prev, breed: e.target.value }))}
              placeholder="np. Owczarek Niemiecki"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 transition-all font-bold text-slate-800 placeholder:text-slate-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Data urodzenia</label>
              <input 
                type="date" 
                value={form.birthDate} 
                onChange={e => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 transition-all font-bold text-slate-800 outline-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Płeć</label>
              <select 
                value={form.gender} 
                onChange={e => setForm(prev => ({ ...prev, gender: e.target.value as Gender }))}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 transition-all font-bold text-slate-800 outline-none text-sm h-[60px] appearance-none cursor-pointer"
              >
                <option value={Gender.MALE}>Samiec</option>
                <option value={Gender.FEMALE}>Samiczka</option>
              </select>
            </div>
          </div>
        </div>

        {/* NFC Integration */}
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M7.5 12.2a4.95 4.95 0 0 1 9 0"/><path d="M9.1 10.1a2.9 2.9 0 0 1 5.8 0"/><path d="M12 14v.01"/></svg>
                 </div>
                 <h3 className="font-black text-sm uppercase tracking-wider">Tag NFC</h3>
              </div>
              
              <button 
                type="button"
                onClick={() => startNFCScan((id) => setForm(prev => ({ ...prev, nfcId: id })))}
                className={`text-[10px] px-4 py-2 rounded-full font-black uppercase transition-all ${nfcState.isReading ? 'bg-orange-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {nfcState.isReading ? 'Skanuję...' : (form.nfcId ? 'Zmień Tag' : 'Połącz z Tagiem')}
              </button>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-tighter">Status Połączenia:</p>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${form.nfcId ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                 <p className="text-xs font-mono tracking-tight overflow-hidden truncate">
                   {form.nfcId || 'Oczekiwanie na zbliżenie tagu...'}
                 </p>
              </div>
           </div>
        </div>

        {/* Sekcja Szczepień */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
             <div className="space-y-1">
                <h3 className="font-black text-slate-900 uppercase text-lg leading-none tracking-tight">Książeczka Zdrowia</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Szczepienia i Zabiegi</p>
             </div>
             <button 
               type="button" 
               onClick={handleAddVaccination}
               className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Dodaj
              </button>
          </div>
          
          <div className="space-y-3">
            {form.vaccinations?.length === 0 ? (
              <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
                 <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Brak wpisów</p>
              </div>
            ) : (
              form.vaccinations?.map(v => (
                <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                       <p className="font-black text-slate-800 text-sm uppercase leading-none mb-1">{v.name}</p>
                       <p className="text-[10px] font-mono text-slate-400 font-bold">{v.date}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, vaccinations: prev.vaccinations?.filter(x => x.id !== v.id) }))}
                    className="p-2 text-red-200 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Przycisk zapisu */}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] uppercase tracking-widest"
        >
          {isNew ? 'Utwórz Profil' : 'Zapisz Zmiany'}
        </button>
      </form>
    </div>
  );
};
