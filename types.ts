
export enum Gender {
  MALE = 'Samiec',
  FEMALE = 'Samiczka'
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  expiryDate?: string;
  doctorName?: string;
}

export interface DogProfile {
  id: string;
  nfcId: string | null;
  name: string;
  breed: string;
  gender: Gender;
  photoUrl: string | null;
  birthDate: string;
  vaccinations: Vaccination[];
  createdAt: number;
}

export interface NFCState {
  isSupported: boolean;
  isReading: boolean;
  lastError: string | null;
  scannedTagId: string | null;
}
