import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Calendar, User } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Catálogo', icon: BookOpen },
  { to: '/routines', label: 'Mis Rutinas', icon: Calendar },
  { to: '/profile', label: 'Mi Perfil', icon: User },
];

export const BottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/80 safe-bottom"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400 font-semibold scale-105'
                    : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
