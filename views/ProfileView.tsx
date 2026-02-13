
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DogProfile, Gender } from '../types';

interface ProfileViewProps {
  dogs: DogProfile[];
  deleteDog: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ dogs, deleteDog }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dog = dogs.find(d => d.id === id);

  if (!dog) return <div className="text-center py-20">Nie znaleziono profilu.</div>;

  const handleDelete = () => {
    if (confirm(`Czy na pewno chcesz usunąć profil ${dog.name}?`)) {
      deleteDog(dog.id);
      navigate('/');
    }
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Profil Psa</h1>
        <div className="ml-auto flex gap-2">
          <Link to={`/edit/${dog.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Link>
          <button onClick={handleDelete} className="p-2 bg-red-50 text-red-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg mb-4 border-4 border-white">
            <img src={dog.photoUrl || `https://picsum.photos/seed/${dog.id}/400/400`} alt={dog.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{dog.name}</h2>
          <p className="text-slate-500 font-medium">{dog.breed}</p>
          
          <div className="grid grid-cols-3 w-full mt-6 gap-2">
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Płeć</p>
              <p className="text-sm font-semibold text-slate-700">{dog.gender}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Wiek</p>
              <p className="text-sm font-semibold text-slate-700">{getAge(dog.birthDate)} lat</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">NFC</p>
              <p className={`text-sm font-semibold ${dog.nfcId ? 'text-blue-600' : 'text-slate-300'}`}>
                {dog.nfcId ? 'TAK' : 'BRAK'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-lg text-slate-900">Książeczka Zdrowia</h3>
          <span className="text-xs font-semibold text-slate-400">{dog.vaccinations.length} wpisów</span>
        </div>

        {dog.vaccinations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-slate-400 text-sm">Brak zarejestrowanych szczepień.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dog.vaccinations.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(v => (
              <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{v.name}</h4>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">{v.date}</span>
                  </div>
                  {v.expiryDate && (
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Ważne do:</span>
                      <span className={`font-semibold ${new Date(v.expiryDate) < new Date() ? 'text-red-500' : 'text-slate-600'}`}>
                        {v.expiryDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {dog.nfcId && (
        <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 flex items-center gap-4">
           <div className="bg-white/20 p-2 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M7.5 12.2a4.95 4.95 0 0 1 9 0"/><path d="M9.1 10.1a2.9 2.9 0 0 1 5.8 0"/><path d="M12 14v.01"/></svg>
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase opacity-80">Powiązany Tag NFC</p>
              <p className="text-xs font-mono break-all">{dog.nfcId}</p>
           </div>
        </div>
      )}
    </div>
  );
};
