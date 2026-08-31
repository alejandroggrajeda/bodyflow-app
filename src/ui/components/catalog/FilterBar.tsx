import React from 'react';
import { Search, X, Dumbbell, ShieldCheck } from 'lucide-react';
import { useExerciseStore } from '../../../application/store/exercise-store.ts';
import { EquipmentFilterOption } from '../../../domain/entities/exercise.ts';

const BODY_PART_LABELS: Record<string, { es: string; en: string }> = {
  all: { es: 'Todos', en: 'All' },
  waist: { es: 'Abdomen / Core', en: 'Core / Waist' },
  chest: { es: 'Pectorales', en: 'Chest' },
  back: { es: 'Espalda', en: 'Back' },
  arms: { es: 'Brazos', en: 'Arms' },
  'upper arms': { es: 'Brazos Sup.', en: 'Upper Arms' },
  'lower arms': { es: 'Antebrazos', en: 'Forearms' },
  'upper legs': { es: 'Piernas (Muslos)', en: 'Thighs' },
  'lower legs': { es: 'Pantorrillas', en: 'Calves' },
  shoulders: { es: 'Hombros', en: 'Shoulders' },
  neck: { es: 'Cuello', en: 'Neck' },
  cardio: { es: 'Cardio', en: 'Cardio' },
};

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedBodyPart,
    setSelectedBodyPart,
    equipmentFilter,
    setEquipmentFilter,
    availableBodyParts,
    filteredExercises,
    language,
    resetFilters,
  } = useExerciseStore();

  const equipmentOptions: { id: EquipmentFilterOption; labelEs: string; labelEn: string }[] = [
    { id: 'all', labelEs: 'Todo el Catálogo', labelEn: 'All Types' },
    { id: 'floor-only', labelEs: 'Solo Suelo (Sin Equipo)', labelEn: 'Floor Only (No Equipment)' },
    { id: 'apparatus', labelEs: 'Con Barra / Apoyo', labelEn: 'With Bar / Support' },
  ];

  return (
    <div className="w-full space-y-3 sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md pt-3 pb-2 border-b border-zinc-800/80">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'es'
              ? 'Buscar por nombre o músculo (ej. push-up, abs, flexión)...'
              : 'Search by exercise or muscle (e.g. push-up, abs)...'
          }
          className="w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Limpiar búsqueda"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Equipment Filter Pill Group */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {equipmentOptions.map((opt) => {
          const isActive = equipmentFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setEquipmentFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {opt.id === 'floor-only' && <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{language === 'es' ? opt.labelEs : opt.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {availableBodyParts.map((part) => {
          const isActive = selectedBodyPart === part;
          const labelObj = BODY_PART_LABELS[part.toLowerCase()];
          const label = labelObj
            ? labelObj[language]
            : part.charAt(0).toUpperCase() + part.slice(1);

          return (
            <button
              key={part}
              onClick={() => setSelectedBodyPart(part)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                  : 'bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 active:scale-95'
              }`}
            >
              {part === 'all' && <Dumbbell className="w-4 h-4" />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Result Count Indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          {language === 'es' ? 'Mostrando' : 'Showing'}{' '}
          <strong className="text-zinc-200 font-semibold">{filteredExercises.length}</strong>{' '}
          {language === 'es' ? 'ejercicios de peso corporal' : 'bodyweight exercises'}
        </span>
        {(searchQuery || selectedBodyPart !== 'all' || equipmentFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
          >
            {language === 'es' ? 'Restablecer filtros' : 'Reset filters'}
          </button>
        )}
      </div>
    </div>
  );
};
