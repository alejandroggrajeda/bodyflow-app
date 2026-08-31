import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSavedRoutineStore } from '../../application/store/saved-routine-store.ts';
import { useExerciseStore } from '../../application/store/exercise-store.ts';
import { RoutineDaySection } from '../components/routine/RoutineDaySection.tsx';
import { TimelineCard } from '../components/routine/TimelineCard.tsx';
import rawExercises from '../../infrastructure/data/exercises.json';
import { Exercise } from '../../domain/entities/exercise.ts';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const allExercises = rawExercises as Exercise[];

export const RoutineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const routines = useSavedRoutineStore((state) => state.routines);
  const activeRoutine = useSavedRoutineStore((state) => state.activeRoutine);
  const saveRoutine = useSavedRoutineStore((state) => state.saveRoutine);
  const openExerciseDetail = useExerciseStore((state) => state.openExerciseDetail);

  // Look up routine from activeRoutine or by URL param
  const routine = useMemo(() => {
    if (activeRoutine) return activeRoutine;
    if (id && id !== 'generated') {
      return routines.find((r) => r.id === id) || null;
    }
    return null;
  }, [activeRoutine, id, routines]);

  const [routineName, setRoutineName] = useState(routine?.name || '');
  const [saveStatus, setSaveStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Pre-index exercises for fast lookup
  const exercisesMap = useMemo(() => {
    const map = new Map<string, Exercise>();
    for (const ex of allExercises) {
      map.set(ex.id, ex);
    }
    return map;
  }, []);

  if (!routine) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-zinc-100 mb-2">
          Rutina no encontrada
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          No se encontró la rutina solicitada o no hay una rutina activa generada.
        </p>
        <button
          type="button"
          onClick={() => navigate('/routines')}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-100 font-semibold text-xs hover:bg-zinc-700"
        >
          Volver a Mis Rutinas
        </button>
      </div>
    );
  }

  const isAlreadySaved = routines.some((r) => r.id === routine.id);

  const handleSave = () => {
    const updated = {
      ...routine,
      name: routineName.trim() || routine.name,
    };
    const result = saveRoutine(updated);
    if (result.success) {
      setSaveStatus({
        success: true,
        message: '¡Rutina guardada exitosamente en Mis Rutinas!',
      });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({
        success: false,
        message: result.error || 'Error al guardar la rutina',
      });
    }
  };

  const totalExercises = routine.days.reduce(
    (acc, day) => acc + day.exercises.length,
    0
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </button>

      {/* Routine Header Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {routine.days.length} Días / Semana
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 capitalize">
            Nivel {routine.profileSnapshot.experience}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 text-zinc-400 border border-zinc-800">
            {totalExercises} Ejercicios
          </span>
        </div>

        {/* Editable Name Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Nombre del Plan
          </label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="w-full text-lg sm:text-2xl font-black text-zinc-100 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Save feedback */}
        {saveStatus && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
              saveStatus.success
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {saveStatus.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}

        {/* Save button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
          >
            <Bookmark className="w-4 h-4" />
            <span>{isAlreadySaved ? 'Actualizar Rutina' : 'Guardar en Mis Rutinas'}</span>
          </button>
        </div>
      </div>

      {/* Weight Goal Timeline Projection */}
      {routine.profileSnapshot?.targetWeight !== undefined && (
        <TimelineCard profile={routine.profileSnapshot} />
      )}

      {/* Routine Days List */}
      <div>
        <h2 className="text-lg font-bold text-zinc-100 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>Estructura del Programa Semanal</span>
        </h2>

        {routine.days.map((day) => (
          <RoutineDaySection
            key={day.dayIndex}
            day={day}
            exercisesMap={exercisesMap}
            onSelectExercise={openExerciseDetail}
          />
        ))}
      </div>
    </div>
  );
};
