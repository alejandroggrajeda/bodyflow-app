import React, { useState } from 'react';
import {
  UserProfile,
  ExperienceLevel,
  Sex,
  calculateBMI,
  getBMICategory,
} from '../../../domain/entities/user-profile.ts';
import { Sparkles, CheckCircle2, Scale, Ruler, Calendar, Award } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onGenerate: (profile: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  onSave,
  onGenerate,
}) => {
  const [age, setAge] = useState<string>(initialProfile?.age?.toString() || '');
  const [weight, setWeight] = useState<string>(
    initialProfile?.weight?.toString() || ''
  );
  const [height, setHeight] = useState<string>(
    initialProfile?.height?.toString() || ''
  );
  const [sex, setSex] = useState<Sex>(initialProfile?.sex || 'male');
  const [experience, setExperience] = useState<ExperienceLevel>(
    initialProfile?.experience || 'beginner'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const numAge = parseInt(age, 10);
  const numWeight = parseFloat(weight);
  const numHeight = parseFloat(height);

  const isValid =
    !isNaN(numAge) &&
    numAge >= 10 &&
    numAge <= 99 &&
    !isNaN(numWeight) &&
    numWeight >= 20 &&
    numWeight <= 300 &&
    !isNaN(numHeight) &&
    numHeight >= 100 &&
    numHeight <= 250;

  const currentBMI =
    !isNaN(numWeight) && !isNaN(numHeight) && numHeight > 0
      ? calculateBMI(numWeight, numHeight)
      : null;

  const bmiCategory = currentBMI ? getBMICategory(currentBMI) : null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (isNaN(numAge) || numAge < 10 || numAge > 99) {
      newErrors.age = 'Edad válida entre 10 y 99 años';
    }
    if (isNaN(numWeight) || numWeight < 20 || numWeight > 300) {
      newErrors.weight = 'Peso válido entre 20 y 300 kg';
    }
    if (isNaN(numHeight) || numHeight < 100 || numHeight > 250) {
      newErrors.height = 'Altura válida entre 100 y 250 cm';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getProfileData = (): UserProfile => ({
    age: numAge,
    weight: numWeight,
    height: numHeight,
    sex,
    experience,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const profile = getProfileData();
    onSave(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleGenerateClick = () => {
    if (!validate()) return;
    const profile = getProfileData();
    onSave(profile);
    onGenerate(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {/* Age, Weight, Height Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Age */}
        <div>
          <label
            htmlFor="profile-age"
            className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Edad (años)
          </label>
          <input
            id="profile-age"
            type="number"
            min={10}
            max={99}
            placeholder="ej. 28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.age ? 'border-red-500/80' : 'border-zinc-800'
            }`}
          />
          {errors.age && (
            <p className="text-red-400 text-xs mt-1.5">{errors.age}</p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label
            htmlFor="profile-weight"
            className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            Peso (kg)
          </label>
          <input
            id="profile-weight"
            type="number"
            step="0.1"
            min={20}
            max={300}
            placeholder="ej. 75.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.weight ? 'border-red-500/80' : 'border-zinc-800'
            }`}
          />
          {errors.weight && (
            <p className="text-red-400 text-xs mt-1.5">{errors.weight}</p>
          )}
        </div>

        {/* Height */}
        <div>
          <label
            htmlFor="profile-height"
            className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5 text-emerald-400" />
            Altura (cm)
          </label>
          <input
            id="profile-height"
            type="number"
            min={100}
            max={250}
            placeholder="ej. 178"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.height ? 'border-red-500/80' : 'border-zinc-800'
            }`}
          />
          {errors.height && (
            <p className="text-red-400 text-xs mt-1.5">{errors.height}</p>
          )}
        </div>
      </div>

      {/* BMI Live Indicator */}
      {currentBMI !== null && (
        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-medium">
            Índice de Masa Corporal (IMC):
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-100 font-mono">
              {currentBMI}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                bmiCategory === 'normal'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : bmiCategory === 'overweight'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {bmiCategory === 'normal'
                ? 'Normopeso'
                : bmiCategory === 'overweight'
                ? 'Sobrepeso'
                : bmiCategory === 'underweight'
                ? 'Bajo peso'
                : 'Obesidad'}
            </span>
          </div>
        </div>
      )}

      {/* Sex */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
          Sexo biológico / Objetivo morfológico
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['male', 'female', 'other'] as Sex[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSex(s)}
              className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                sex === s
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {s === 'male' ? 'Masculino' : s === 'female' ? 'Femenino' : 'Otro'}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          Nivel de Experiencia en Peso Corporal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(
            [
              {
                id: 'beginner',
                label: 'Principiante',
                days: '3 días / sem',
                desc: 'Full Body integral',
              },
              {
                id: 'intermediate',
                label: 'Intermedio',
                days: '4 días / sem',
                desc: 'Torso / Pierna',
              },
              {
                id: 'advanced',
                label: 'Avanzado',
                days: '5 días / sem',
                desc: 'Push / Pull / Legs',
              },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setExperience(item.id)}
              className={`min-h-[64px] p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 ${
                experience === item.id
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-sm font-bold ${
                    experience === item.id ? 'text-emerald-400' : 'text-zinc-200'
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {item.days}
                </span>
              </div>
              <span className="text-xs text-zinc-400 mt-1">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback message */}
      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Perfil guardado en memoria local correctamente.
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={!isValid}
          className="w-full sm:w-1/2 min-h-[48px] px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          Guardar Perfil
        </button>

        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={!isValid}
          className="w-full sm:w-1/2 min-h-[48px] px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4" />
          Generar Rutina
        </button>
      </div>
    </form>
  );
};
