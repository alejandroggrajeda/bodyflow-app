import React from 'react';
import { useExerciseStore } from '../../../application/store/exercise-store.ts';
import { ExerciseCard } from './ExerciseCard.tsx';
import { Dumbbell, RefreshCw } from 'lucide-react';

export const ExerciseGrid: React.FC = () => {
  const { filteredExercises, isLoading, resetFilters, language } = useExerciseStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-3.5 animate-pulse"
          >
            <div className="w-full aspect-square bg-zinc-800/80 rounded-xl mb-3" />
            <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-zinc-800/60 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredExercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
          <Dumbbell className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100 mb-1">
          {language === 'es' ? 'No se encontraron ejercicios' : 'No exercises found'}
        </h3>
        <p className="text-sm text-zinc-400 max-w-sm mb-5">
          {language === 'es'
            ? 'Probá ajustando el término de búsqueda o seleccionando otra categoría muscular.'
            : 'Try adjusting your search terms or selecting a different muscle group.'}
        </p>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-zinc-950 font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'es' ? 'Ver todos los ejercicios' : 'View all exercises'}</span>
        </button>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
      {filteredExercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </main>
  );
};
