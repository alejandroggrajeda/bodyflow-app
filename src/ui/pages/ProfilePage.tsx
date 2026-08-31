import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../application/store/profile-store.ts';
import { useSavedRoutineStore } from '../../application/store/saved-routine-store.ts';
import { generateRoutine } from '../../domain/services/routine-generator.ts';
import { UserProfile } from '../../domain/entities/user-profile.ts';
import { ProfileForm } from '../components/profile/ProfileForm.tsx';
import rawExercises from '../../infrastructure/data/exercises.json';
import { Exercise } from '../../domain/entities/exercise.ts';
import { User, ShieldCheck } from 'lucide-react';

const allExercises = rawExercises as Exercise[];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const setActiveRoutine = useSavedRoutineStore(
    (state) => state.setActiveRoutine
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleGenerate = (validProfile: UserProfile) => {
    const routine = generateRoutine(validProfile, allExercises);
    setActiveRoutine(routine);
    navigate('/routines/generated');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              Perfil de Entrenamiento
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Datos físicos para personalizar la frecuencia y el volumen de tus rutinas.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-5 sm:p-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl">
        <ProfileForm
          initialProfile={profile}
          onSave={saveProfile}
          onGenerate={handleGenerate}
        />
      </div>

      {/* Privacy Guarantee Note */}
      <div className="mt-6 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-300">Privacidad 100% Offline</p>
          <p>
            Tus datos físicos se almacenan exclusivamente en el almacenamiento local de tu navegador y nunca viajan a servidores externos.
          </p>
        </div>
      </div>
    </div>
  );
};
