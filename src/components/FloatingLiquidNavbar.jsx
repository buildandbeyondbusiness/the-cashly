import React from 'react';
import { List, PieChart, Target, Settings, Plus } from 'lucide-react';
import { vibrate } from '../context/FinancialContext';

export const FloatingLiquidNavbar = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenAddTx, 
  hasNotifications 
}) => {
  const navItems = [
    { id: 'transactions', label: 'Records', icon: List },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'planning', label: 'Planning', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings, hasBadge: hasNotifications }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full liquid-glass shadow-2xl flex items-center gap-1.5 border border-white/20 animate-spring-up">
      
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { vibrate(); setCurrentTab(item.id); }}
            className={`relative flex items-center justify-center w-12 h-11 rounded-full transition-all duration-300 active:scale-95 ${
              isActive
                ? 'bg-white/25 text-white shadow-inner backdrop-blur-md scale-105'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}

      {/* Center Elevated Floating Plus (+) FAB */}
      <div className="px-1">
        <button
          onClick={() => { vibrate(); onOpenAddTx(); }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300"
          title="Add Log"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { vibrate(); setCurrentTab(item.id); }}
            className={`relative flex items-center justify-center w-12 h-11 rounded-full transition-all duration-300 active:scale-95 ${
              isActive
                ? 'bg-white/25 text-white shadow-inner backdrop-blur-md scale-105'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
            {item.hasBadge && (
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-black" />
            )}
          </button>
        );
      })}

    </div>
  );
};
