import React from 'react';
import { Flame, Dumbbell } from 'lucide-react';
import { useExerciseStore } from '../../../application/store/exercise-store.ts';

export const Header: React.FC = () => {
  const language = useExerciseStore((state) => state.language);

  return (
    <header className="w-full flex items-center justify-between py-4 border-b border-zinc-800/80">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20">
          <Flame className="w-6 h-6 fill-zinc-950" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-1.5">
            <span>BodyFlow</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Calisthenics
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            {language === 'es' ? 'Entrenamiento con peso corporal sin equipo' : 'Zero-equipment bodyweight fitness'}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
        <Dumbbell className="w-4 h-4 text-emerald-400" />
        <span>325 {language === 'es' ? 'ejercicios' : 'exercises'}</span>
      </div>
    </header>
  );
};
