import React from 'react';
import { UserProfile } from '../../../domain/entities/user-profile.ts';
import { estimateWeightTimeline } from '../../../domain/services/weight-timeline-estimator.ts';
import {
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';

interface TimelineCardProps {
  profile: UserProfile;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ profile }) => {
  if (profile.targetWeight === undefined || profile.targetWeight === null) {
    return null;
  }

  const estimate = estimateWeightTimeline(
    profile.weight,
    profile.targetWeight,
    profile.experience,
    profile.weightUnit || 'lbs'
  );

  const isLoss = estimate.direction === 'lose';
  const isGain = estimate.direction === 'gain';

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl mb-6">
      {/* Header with direction badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-100">
              Proyección de Meta Física
            </h3>
            <p className="text-[11px] text-zinc-400">
              Estimación de progreso basada en tu nivel de entrenamiento
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isLoss
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : isGain
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {isLoss ? (
            <>
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Reducción</span>
            </>
          ) : isGain ? (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ganancia</span>
            </>
          ) : (
            <>
              <Minus className="w-3.5 h-3.5" />
              <span>Mantenimiento</span>
            </>
          )}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
            Peso Actual
          </span>
          <span className="text-sm sm:text-base font-bold text-zinc-100 font-mono">
            {estimate.currentWeight} {estimate.weightUnit}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
            Peso Objetivo
          </span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
            {estimate.targetWeight} {estimate.weightUnit}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
            Tiempo Estimado
          </span>
          <span className="text-sm sm:text-base font-bold text-zinc-100 font-mono">
            {estimate.estimatedWeeks}{' '}
            <span className="text-xs font-normal text-zinc-400">
              {estimate.estimatedWeeks === 1 ? 'semana' : 'semanas'}
            </span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-400" />
            Fecha Meta
          </span>
          <span className="text-xs sm:text-sm font-bold text-zinc-200">
            {estimate.estimatedCompletionDate}
          </span>
        </div>
      </div>

      {/* Progress rate bar and non-medical disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/40 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-zinc-300">Ritmo seguro:</span>
          <span>
            ~{estimate.weeklyRate} {estimate.weightUnit} / semana
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Proyección estimada para entrenamiento con peso corporal.</span>
        </div>
      </div>
    </div>
  );
};
