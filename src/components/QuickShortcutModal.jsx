import React, { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { X, Zap, Delete, Check, ArrowRight, Wallet } from 'lucide-react';

export const QuickShortcutModal = ({ isOpen, onClose }) => {
  const { categories, wallets, addTransaction } = useFinancials();

  const [amountStr, setAmountStr] = useState('0');
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (amountStr === '0') {
      setAmountStr(num.toString());
    } else if (amountStr.length < 7) {
      setAmountStr(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (amountStr.length === 1) {
      setAmountStr('0');
    } else {
      setAmountStr(prev => prev.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (!amountStr.includes('.')) {
      setAmountStr(prev => prev + '.');
    }
  };

  const handleSave = () => {
    const amt = parseFloat(amountStr);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const selectedCategoryObj = categories.find(c => c.id === selectedCatId);
    const entryTitle = title.trim() || (selectedCategoryObj ? selectedCategoryObj.name : 'Quick Expense');

    addTransaction({
      title: entryTitle,
      amount: amt,
      type: 'expense',
      categoryId: selectedCatId || categories[0]?.id,
      walletId: selectedWalletId || wallets[0]?.id,
      date: new Date().toISOString().split('T')[0],
      note: 'Logged via iOS Backtap Shortcut'
    });

    // Reset and close
    setAmountStr('0');
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-[#1c1143] to-[#0c0624] w-full max-w-sm rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-5 text-white">
        
        {/* iOS Backtap Badge & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300">
              <Zap className="w-4 h-4 fill-amber-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              iOS Backtap Shortcut
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-purple-300/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Amount (Matched to Reference Image 2 display) */}
        <div className="text-center py-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-purple-300/70 uppercase">
            Logging Expense
          </span>
          <div className="text-4xl font-extrabold tracking-tight text-white font-mono">
            ${amountStr}
          </div>
        </div>

        {/* Quick Category Selector Horizontal Pills */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-purple-300/70">Category</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCatId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCatId === c.id
                    ? 'bg-purple-600 text-white shadow-purple-glow scale-[1.02]'
                    : 'bg-white/10 text-purple-200 hover:bg-white/15'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Title / Memo (Optional) */}
        <input
          type="text"
          placeholder="Note (e.g. Street cafe, Tickets...)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-purple-300/40 outline-none focus:border-purple-500"
        />

        {/* Numeric Keypad (Matched to Reference Image 2 Keypad layout) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-purple-600 font-extrabold text-xl text-white transition-all duration-150 active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDecimal}
            className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold text-xl text-white transition-all active:scale-95"
          >
            .
          </button>
          <button
            onClick={() => handleKeyPress(0)}
            className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-purple-600 font-extrabold text-xl text-white transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-lg transition-all active:scale-95"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Action Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-purple-glow flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>Save Log</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
