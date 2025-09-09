export interface BabyProfile {
  id: string;
  name: string;
  dateOfBirth: Date; // ISO date string (UTC 00:00)
  gender: 'male' | 'female';
}

export interface BabyProfileProps {
  baby: BabyProfile;
}

export interface BabyProfileStore {
  baby: BabyProfile | null;
  setBaby: (baby: BabyProfile) => void;
  updateBaby: (baby: Partial<BabyProfile>) => void;
  clearBaby: () => void;
}