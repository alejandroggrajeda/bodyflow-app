import React, { useState } from 'react';
import { Exercise } from '../../../domain/entities/exercise.ts';
import { useExerciseStore } from '../../../application/store/exercise-store.ts';
import { Sparkles } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const openExerciseDetail = useExerciseStore((state) => state.openExerciseDetail);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => openExerciseDetail(exercise.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openExerciseDetail(exercise.id);
        }
      }}
      className="group relative flex flex-col bg-zinc-900/80 border border-zinc-800/90 hover:border-emerald-500/50 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {/* Aspect-Ratio Box for Zero Layout Shift (CLS = 0) */}
      <div className="relative w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-3 border border-zinc-800/60">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <span className="text-xs text-zinc-600 font-medium">Cargando...</span>
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center text-zinc-500 text-xs p-2 text-center">
            <Sparkles className="w-6 h-6 mb-1 text-zinc-600" />
            <span>Vista previa no disponible</span>
          </div>
        ) : (
          <img
            src={exercise.thumbnailUrl}
            alt={exercise.name}
            loading="lazy"
            decoding="async"
            width={180}
            height={180}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105 transition-transform duration-300`}
          />
        )}

        {/* Floating Muscle Tag */}
        <div className="absolute top-2 left-2">
          <span className="px-2.5 py-1 bg-zinc-950/85 backdrop-blur-md border border-zinc-700/50 text-emerald-400 text-[11px] font-semibold rounded-lg shadow-sm">
            {exercise.targetMuscle}
          </span>
        </div>
      </div>

      {/* Content Section with Normalized Height */}
      <div className="flex flex-col flex-1 justify-between">
        <h3 className="text-zinc-100 font-semibold text-base capitalize line-clamp-2 min-h-[2.75rem] leading-snug group-hover:text-emerald-300 transition-colors">
          {exercise.name}
        </h3>

        <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-400">
          <span className="capitalize font-medium text-zinc-400">
            {exercise.bodyPart}
          </span>
          <span className="text-emerald-400/90 font-medium text-[11px] group-hover:translate-x-0.5 transition-transform">
            Ver ejecución →
          </span>
        </div>
      </div>
    </article>
  );
};
