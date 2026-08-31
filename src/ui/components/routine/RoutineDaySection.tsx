import React, { useState } from 'react';
import { RoutineDay, RoutineExercise } from '../../../domain/entities/routine.ts';
import { Exercise } from '../../../domain/entities/exercise.ts';
import { ChevronDown, ChevronUp, Clock, Repeat, Flame } from 'lucide-react';

interface RoutineDaySectionProps {
  day: RoutineDay;
  exercisesMap: Map<string, Exercise>;
  onSelectExercise: (exerciseId: string) => void;
  defaultExpanded?: boolean;
}

export const RoutineDaySection: React.FC<RoutineDaySectionProps> = ({
  day,
  exercisesMap,
  onSelectExercise,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden mb-4 transition-all">
      {/* Day Accordion Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Día {day.dayIndex}
            </span>
            <span className="text-xs text-zinc-400">
              {day.exercises.length} ejercicios
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-100">
            {day.label}
          </h3>
        </div>

        <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Exercises List (Collapsible) */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-zinc-800/40">
          {day.exercises.map((item: RoutineExercise, idx: number) => {
            const exercise = exercisesMap.get(item.exerciseId);

            return (
              <div
                key={`${day.dayIndex}-${item.exerciseId}-${idx}`}
                onClick={() => onSelectExercise(item.exerciseId)}
                className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/60 hover:border-emerald-500/50 cursor-pointer transition-all duration-150 flex items-center gap-3.5 group"
              >
                {/* Thumbnail Container (CLS = 0 with aspect-square and fixed dimension) */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-zinc-900 border border-zinc-800/80 overflow-hidden shrink-0 relative aspect-square">
                  {exercise?.thumbnailUrl ? (
                    <img
                      src={exercise.thumbnailUrl}
                      alt={exercise.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Flame className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Exercise Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {exercise?.targetMuscle || 'Peso corporal'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-200 truncate group-hover:text-emerald-400 transition-colors">
                    {exercise?.name || `Ejercicio ${item.exerciseId}`}
                  </h4>

                  {/* Volume parameters */}
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-zinc-300">
                      <Repeat className="w-3 h-3 text-emerald-400" />
                      {item.sets} series × {item.reps[0]}-{item.reps[1]} reps
                    </span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {item.restSeconds}s desc.
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
