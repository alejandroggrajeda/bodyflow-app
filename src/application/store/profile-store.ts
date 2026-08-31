import { create } from 'zustand';
import { UserProfile } from '../../domain/entities/user-profile.ts';
import { ProfileStorage } from '../../infrastructure/storage/profile-storage.ts';

const storage = new ProfileStorage();

export interface ProfileState {
  profile: UserProfile | null;
  isComplete: boolean;
  loadProfile: () => void;
  saveProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: storage.getProfile(),
  isComplete: !!storage.getProfile(),

  loadProfile: () => {
    const p = storage.getProfile();
    set({ profile: p, isComplete: !!p });
  },

  saveProfile: (profile: UserProfile) => {
    storage.saveProfile(profile);
    set({ profile, isComplete: true });
  },

  clearProfile: () => {
    storage.clearProfile();
    set({ profile: null, isComplete: false });
  },

  reset: () => {
    set({ profile: null, isComplete: false });
  },
}));
