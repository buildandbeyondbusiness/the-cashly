import React, { useRef } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { 
  Zap, 
  Download, 
  Upload, 
  RotateCcw, 
  Wallet, 
  Sparkles,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar = ({ onOpenQuickShortcut, onOpenAddTransaction, onOpenAddWallet }) => {
  const { 
    activeTimeframe, 
    setActiveTimeframe, 
    exportData, 
    importData, 
    resetToDefault,
    totalBalance 
  } = useFinancials();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          importData(json);
        } catch (err) {
          alert('Could not parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0e0826]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-purple-900/30 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <img 
              src="./logo.jpg" 
              alt="Cashly Logo" 
              className="relative w-10 h-10 rounded-2xl object-cover shadow-md border border-purple-400/30"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-500 dark:from-purple-300 dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                Cashly
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50">
                2.0
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-purple-300/70 hidden sm:block">
              Clean Money Management
            </p>
          </div>
        </div>

        {/* Timeframe Filter Tabs (Week, Month, Year) - Matched to Reference Image 1 */}
        <div className="bg-slate-100 dark:bg-[#1b123d] p-1 rounded-2xl border border-slate-200 dark:border-purple-900/40 flex items-center gap-1 shadow-inner">
          {['week', 'month', 'year'].map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${
                activeTimeframe === tf
                  ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Action Controls & Quick Backtap Mode Button */}
        <div className="flex items-center gap-2">
          
          {/* iOS Backtap / Quick Entry Button */}
          <button
            onClick={onOpenQuickShortcut}
            title="iOS Backtap Quick Shortcut"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-purple-glow transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
            <span className="hidden md:inline">Quick Tap</span>
          </button>

          {/* Add Wallet Button */}
          <button
            onClick={onOpenAddWallet}
            className="p-2 rounded-xl text-slate-600 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-purple-800/40 transition-colors"
            title="Add Wallet"
          >
            <Wallet className="w-4 h-4" />
          </button>

          {/* Backup & Data Actions */}
          <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 dark:border-purple-900/50 pl-2">
            <button
              onClick={exportData}
              title="Export JSON Backup"
              className="p-2 rounded-xl text-slate-600 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-950/60 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import JSON Backup"
              className="p-2 rounded-xl text-slate-600 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-950/60 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            <button
              onClick={resetToDefault}
              title="Reset Sample Data"
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Avatar Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-purple-900/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
