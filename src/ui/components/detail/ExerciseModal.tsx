import React, { useEffect, useState } from 'react';
import { useExerciseStore } from '../../../application/store/exercise-store.ts';
import { LanguageToggle } from './LanguageToggle.tsx';
import { X, Activity, Target, ShieldCheck } from 'lucide-react';

export const ExerciseModal: React.FC = () => {
  const { isDetailOpen, selectedExercise, closeExerciseDetail, language } = useExerciseStore();
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeExerciseDetail();
      }
    };

    if (isDetailOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDetailOpen, closeExerciseDetail]);

  useEffect(() => {
    setGifLoaded(false);
    setGifError(false);
  }, [selectedExercise?.id]);

  if (!isDetailOpen || !selectedExercise) {
    return null;
  }

  const instructions = selectedExercise.instructions[language] || selectedExercise.instructions.es || selectedExercise.instructions.en || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div
        className="fixed inset-0"
        onClick={closeExerciseDetail}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Container */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden z-10 animate-slideUp">
        {/* Mobile Pull Bar */}
        <div className="md:hidden w-full flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono text-zinc-400">ID #{selectedExercise.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={closeExerciseDetail}
              aria-label="Cerrar modal"
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 space-y-5 text-zinc-100">
          {/* Animated GIF Container (Zero Layout Shift Box) */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/80 flex items-center justify-center shadow-inner">
            {!gifLoaded && !gifError && (
              <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-2 text-zinc-500 animate-pulse">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium">Cargando animación...</span>
              </div>
            )}

            {gifError ? (
              <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 text-xs p-4 text-center">
                <p>No se pudo cargar la animación animada.</p>
              </div>
            ) : (
              <img
                src={selectedExercise.gifUrl}
                alt={selectedExercise.name}
                loading="eager"
                decoding="async"
                onLoad={() => setGifLoaded(true)}
                onError={() => setGifError(true)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  gifLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>

          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl font-bold capitalize text-zinc-100 mb-2">
              {selectedExercise.name}
            </h2>

            {/* Muscle Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Objetivo:' : 'Target:'} {selectedExercise.targetMuscle}</span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800/80 border border-zinc-700/60 rounded-lg text-zinc-300 text-xs font-medium capitalize">
                <span>{language === 'es' ? 'Zona:' : 'Body part:'} {selectedExercise.bodyPart}</span>
              </div>

              {selectedExercise.secondaryMuscles.length > 0 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800/80 border border-zinc-700/60 rounded-lg text-zinc-400 text-xs">
                  <span>{language === 'es' ? 'Secundarios:' : 'Secondary:'} {selectedExercise.secondaryMuscles.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4.5 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'es' ? 'Instrucciones paso a paso' : 'Step-by-step instructions'}</span>
            </h4>

            {instructions.length > 0 ? (
              <ol className="space-y-3 text-sm text-zinc-300">
                {instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed text-zinc-200">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                {language === 'es' ? 'Sin instrucciones disponibles para este idioma.' : 'No instructions available.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900 flex justify-end">
          <button
            onClick={closeExerciseDetail}
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-sm rounded-xl transition-all min-h-[44px]"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
