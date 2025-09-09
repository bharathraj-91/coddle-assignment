import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BabyProfileStore, BabyProfile } from '../types/babyProfile';

const defaultBaby: BabyProfile = {
  id: '1',
  name: 'Emma',
  dateOfBirth: new Date('2025-03-15'),
  gender: 'female',
};

const useBabyProfileStore = create<BabyProfileStore>()(
  persist(
    (set) => ({
      baby: defaultBaby,

      setBaby: (baby) =>
        set(() => ({
          baby,
        })),

      updateBaby: (updatedBaby) =>
        set((state) => ({
          baby: state.baby ? { ...state.baby, ...updatedBaby } : null,
        })),

      clearBaby: () =>
        set(() => ({
          baby: null,
        })),
    }),
    {
      name: 'baby-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useBabyProfileStore;