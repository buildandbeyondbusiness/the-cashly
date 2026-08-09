import React, { useState, useEffect } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { X, Edit3, DollarSign, Wallet } from 'lucide-react';

export const EditBalanceModal = ({ isOpen, onClose, wallet }) => {
  const { editWalletBalance } = useFinancials();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (wallet) {
      setBalance(wallet.balance.toString());
    }
  }, [wallet, isOpen]);

  if (!isOpen || !wallet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(balance);
    if (!isNaN(val)) {
      editWalletBalance(wallet.id, val);
      onClose();
    } else {
      alert('Please enter a valid balance number.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#180e3c] w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Edit Wallet Balance
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/60">
                {wallet.name} ({wallet.accountNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1.5 block">
              Set Exact Balance ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 font-extrabold text-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                autoFocus
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-purple-400/60 mt-1.5">
              This updates the account balance directly without creating an extra transaction entry.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-purple-glow transition-all active:scale-98"
          >
            Update Balance
          </button>

        </form>

      </div>
    </div>
  );
};
