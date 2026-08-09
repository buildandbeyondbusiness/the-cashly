import React, { useRef, useEffect, useState } from 'react';
import { List, PieChart, Target, Settings, Plus } from 'lucide-react';
import { vibrate } from '../context/FinancialContext';

export const FloatingLiquidNavbar = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenAddTx, 
  hasNotifications 
}) => {
  const tabs = [
    { id: 'transactions', label: 'Records', icon: List, side: 'left' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, side: 'left' },
    { id: 'planning', label: 'Planning', icon: Target, side: 'right' },
    { id: 'settings', label: 'Settings', icon: Settings, side: 'right', hasBadge: hasNotifications }
  ];

  // Tab index mapping
  const getIndex = (tabId) => {
    switch (tabId) {
      case 'transactions': return 0;
      case 'analytics': return 1;
      case 'planning': return 2;
      case 'settings': return 3;
      default: return 0;
    }
  };

  const activeIndex = getIndex(currentTab);

  return (
    <div className="pointer-events-auto relative inline-flex items-center gap-1 px-3 py-2 rounded-full liquid-glass shadow-2xl border border-white/20 animate-spring-up">
      
      {/* Left Tabs (Records, Analytics) */}
      <div className="flex items-center gap-1 relative z-10">
        {tabs.slice(0, 2).map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { vibrate(); setCurrentTab(item.id); }}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200 active:scale-90 ${
                isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title={item.label}
            >
              {/* Active Tab Sliding Capsule Highlight */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-white/25 border border-white/30 backdrop-blur-md shadow-inner transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.25)] animate-fade-in" />
              )}
              <Icon className="w-5 h-5 relative z-10" />
            </button>
          );
        })}
      </div>

      {/* Center Elevated Floating Plus (+) FAB */}
      <div className="px-1 relative z-20">
        <button
          onClick={() => { vibrate(); onOpenAddTx(); }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300"
          title="Add Log"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Right Tabs (Planning, Settings) */}
      <div className="flex items-center gap-1 relative z-10">
        {tabs.slice(2, 4).map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { vibrate(); setCurrentTab(item.id); }}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200 active:scale-90 ${
                isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title={item.label}
            >
              {/* Active Tab Sliding Capsule Highlight */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-white/25 border border-white/30 backdrop-blur-md shadow-inner transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.25)] animate-fade-in" />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              {item.hasBadge && (
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-black z-20" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
