import React, { useRef, useState } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { Plus, Download, Upload, Trash2, MoreVertical, Zap } from 'lucide-react';

export const Navbar = ({ onOpenAddTransaction, onOpenQuickShortcut, onOpenAddWallet }) => {
  const { exportData, importData, clearAllData } = useFinancials();
  const [showMenu, setShowMenu] = useState(false);
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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0e0826]/90 backdrop-blur-md border-b border-slate-100 dark:border-purple-900/30 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <img 
            src="./logo.jpg" 
            alt="Cashly Logo" 
            className="w-9 h-9 rounded-2xl object-cover shadow-sm border border-purple-500/20"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Cashly
            </h1>
            <span className="text-[11px] font-medium text-slate-400 dark:text-purple-300/60">
              Personal Ledger
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* iOS Quick Keypad Shortcut */}
          <button
            onClick={onOpenQuickShortcut}
            title="Quick Keypad Entry"
            className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-500 dark:text-amber-300 transition-colors"
          >
            <Zap className="w-4 h-4 fill-current" />
          </button>

          {/* Primary Quick Log (+) Button */}
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-purple-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Log</span>
          </button>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1b103e] rounded-2xl p-1.5 shadow-2xl border border-slate-100 dark:border-purple-800/40 text-xs font-medium space-y-0.5 z-50">
                <button
                  onClick={() => {
                    onOpenAddWallet();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Wallet
                </button>

                <button
                  onClick={() => {
                    exportData();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Data JSON
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import Data JSON
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-purple-900/40"></div>

                <button
                  onClick={() => {
                    clearAllData();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Start Clean / Reset
                </button>
              </div>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />

        </div>

      </div>
    </header>
  );
};
