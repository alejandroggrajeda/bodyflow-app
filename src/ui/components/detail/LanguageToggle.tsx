import React from 'react';
import { useExerciseStore } from '../../../application/store/exercise-store.ts';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useExerciseStore();

  return (
    <div className="inline-flex p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl">
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] flex items-center gap-1 ${
          language === 'es'
            ? 'bg-emerald-500 text-zinc-950 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <span>🇪🇸</span>
        <span>Español</span>
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] flex items-center gap-1 ${
          language === 'en'
            ? 'bg-emerald-500 text-zinc-950 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <span>🇬🇧</span>
        <span>English</span>
      </button>
    </div>
  );
};
