import { UserProfile } from '../../domain/entities/user-profile.ts';

const PROFILE_KEY = 'bodyflow:profile';

export class ProfileStorage {
  getProfile(): UserProfile | null {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  clearProfile(): void {
    localStorage.removeItem(PROFILE_KEY);
  }
}
