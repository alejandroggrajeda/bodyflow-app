import React from 'react';
import { Header } from '../components/layout/Header.tsx';
import { FilterBar } from '../components/catalog/FilterBar.tsx';
import { ExerciseGrid } from '../components/catalog/ExerciseGrid.tsx';

export const CatalogPage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 pb-24">
      <Header />
      <FilterBar />
      <ExerciseGrid />
    </div>
  );
};
