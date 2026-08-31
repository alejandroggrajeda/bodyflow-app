import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useExerciseStore } from './application/store/exercise-store.ts';
import { CatalogPage } from './ui/pages/CatalogPage.tsx';
import { ProfilePage } from './ui/pages/ProfilePage.tsx';
import { RoutinesPage } from './ui/pages/RoutinesPage.tsx';
import { RoutineDetailPage } from './ui/pages/RoutineDetailPage.tsx';
import { BottomNav } from './ui/components/navigation/BottomNav.tsx';
import { ExerciseModal } from './ui/components/detail/ExerciseModal.tsx';

export const App: React.FC = () => {
  const initialize = useExerciseStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-black">
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />
        <ExerciseModal />
      </div>
    </BrowserRouter>
  );
};

export default App;
