import React, { useState } from 'react';
import { Routine } from '../../../domain/entities/routine.ts';
import { Calendar, Trash2, ChevronRight, Dumbbell } from 'lucide-react';

interface RoutineCardProps {
  routine: Routine;
  onOpen: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onOpen,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formattedDate = new Date(routine.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const totalExercises = routine.days.reduce(
    (sum, day) => sum + day.exercises.length,
    0
  );

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {routine.days.length} días / sem
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          {/* Delete Action */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDelete(routine.id)}
                className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Eliminar rutina ${routine.name}`}
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-1">
          {routine.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
          <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
          <span>{totalExercises} ejercicios en total</span>
          <span>•</span>
          <span className="capitalize">{routine.profileSnapshot.experience}</span>
        </div>
      </div>

      {/* Open Button */}
      <button
        type="button"
        onClick={() => onOpen(routine)}
        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
      >
        <span>Ver Plan Completo</span>
        <ChevronRight className="w-4 h-4 text-emerald-400" />
      </button>
    </div>
  );
};
