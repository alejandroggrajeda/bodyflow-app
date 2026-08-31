import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedRoutineStore } from '../../application/store/saved-routine-store.ts';
import { RoutineCard } from '../components/routine/RoutineCard.tsx';
import { Routine } from '../../domain/entities/routine.ts';
import { Calendar, Plus, Sparkles } from 'lucide-react';

export const RoutinesPage: React.FC = () => {
  const navigate = useNavigate();
  const routines = useSavedRoutineStore((state) => state.routines);
  const loadRoutines = useSavedRoutineStore((state) => state.loadRoutines);
  const deleteRoutine = useSavedRoutineStore((state) => state.deleteRoutine);
  const setActiveRoutine = useSavedRoutineStore(
    (state) => state.setActiveRoutine
  );

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const handleOpenRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    navigate(`/routines/${routine.id}`);
  };

  const handleNewRoutine = () => {
    navigate('/profile');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              Mis Rutinas
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              {routines.length} / 10 rutinas guardadas en este dispositivo
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNewRoutine}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Rutina</span>
        </button>
      </div>

      {/* Routine Cards Grid or Empty State */}
      {routines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onOpen={handleOpenRoutine}
              onDelete={deleteRoutine}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 text-zinc-400 flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-zinc-100 mb-2">
            No tienes ninguna rutina guardada todavía
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mb-6">
            Configura tu perfil con tu peso, experiencia y objetivos para que el motor inteligente genere tu primer plan semanal.
          </p>
          <button
            type="button"
            onClick={handleNewRoutine}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Configurar Perfil y Generar
          </button>
        </div>
      )}
    </div>
  );
};
