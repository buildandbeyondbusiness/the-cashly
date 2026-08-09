import React, { useMemo } from 'react';
import { useFinancials, CATEGORIES, EX_RATES, formatCurrency, vibrate } from '../context/FinancialContext';
import { 
  Coffee, Car, ShoppingBag, Film, FileText, Home, Heart, Book, 
  Repeat, Zap, DollarSign, Landmark, ArrowRightLeft, Rocket, Tag
} from 'lucide-react';

const ICON_MAP = {
  food: Coffee,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Film,
  bills: FileText,
  home: Home,
  health: Heart,
  education: Book,
  subscriptions: Repeat,
  utilities: Zap,
  salary: DollarSign,
  gifts: DollarSign,
  investment: Landmark
};

const formatDateHeader = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
};

export const RecordsView = ({ onOpenAdd }) => {
  const { monthTransactions, wallets, activeWalletId, activeWallet, deleteTransaction } = useFinancials();

  const groupedTransactions = useMemo(() => {
    const groups = {};
    const baseRate = EX_RATES[activeWallet.currency] || 1;

    monthTransactions.forEach(t => {
      const dateKey = new Date(t.date).toDateString();
      if (!groups[dateKey]) groups[dateKey] = { date: t.date, items: [], total: 0 };
      groups[dateKey].items.push(t);

      let amount = Number(t.amount) || 0;
      if (activeWalletId === 'all' && t.type !== 'transfer') {
        const w = wallets.find(w => w.id === t.walletId);
        amount = (amount * (EX_RATES[w?.currency] || 1)) / baseRate;
        groups[dateKey].total += t.type === 'expense' ? -amount : amount;
      } else if (activeWalletId !== 'all') {
        if (t.type === 'transfer') {
          if (t.fromWalletId === activeWalletId) groups[dateKey].total -= t.amount;
          if (t.toWalletId === activeWalletId) groups[dateKey].total += (t.amountConverted || t.amount);
        } else {
          groups[dateKey].total += t.type === 'expense' ? -amount : amount;
        }
      }
    });

    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [monthTransactions, activeWalletId, wallets, activeWallet.currency]);

  if (groupedTransactions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-5 pt-16 px-6 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg ring-8 ring-emerald-500/20">
          <Rocket className="w-12 h-12 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white mb-1.5">Nothing here yet!</h3>
          <p className="text-sm font-medium text-gray-400">Your financial journey starts with a single step. Add an expense or income.</p>
        </div>
        <button 
          onClick={() => { vibrate(); onOpenAdd(); }} 
          className="px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Add Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-6">
      {groupedTransactions.map((group, index) => (
        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
          <div className="flex justify-between items-center px-2 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {formatDateHeader(group.date)}
            </span>
            <span className="text-xs font-bold text-gray-400">
              {group.total > 0 ? '+' : ''}{formatCurrency(group.total, activeWallet.currency)}
            </span>
          </div>

          <div className="bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-800/60 overflow-hidden">
            {group.items.map((tx, i) => {
              const isTransfer = tx.type === 'transfer';
              const category = isTransfer ? null : (CATEGORIES[tx.categoryId] || { name: 'General', bg: 'bg-emerald-500' });
              const CatIcon = category ? (ICON_MAP[tx.categoryId] || Tag) : ArrowRightLeft;

              let displayAmount = tx.amount;
              let isPositive = tx.type === 'income';
              if (isTransfer) {
                if (activeWalletId === 'all') {
                  displayAmount = tx.amount;
                  isPositive = false;
                } else {
                  isPositive = tx.toWalletId === activeWalletId;
                  displayAmount = isPositive ? (tx.amountConverted || tx.amount) : tx.amount;
                }
              }

              return (
                <div 
                  key={tx.id} 
                  className={`flex items-center justify-between p-4 hover:bg-gray-800/40 cursor-pointer transition-colors group ${
                    i !== group.items.length - 1 ? 'border-b border-gray-800/40' : ''
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (window.confirm('Delete this transaction?')) deleteTransaction(tx.id);
                  }}
                >
                  <div className="flex items-center gap-4">
                    {isTransfer ? (
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-gray-300 bg-gray-800 group-hover:scale-105 transition-transform">
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm ${category.bg} group-hover:scale-105 transition-transform`}>
                        <CatIcon className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-white text-[15px]">
                        {isTransfer ? 'Transfer' : category.name}
                      </p>
                      {activeWalletId === 'all' && (
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {wallets.find(w => w.id === tx.walletId)?.name || 'Account'}
                        </p>
                      )}
                      {tx.note && <p className="text-xs text-gray-400 mt-0.5">{tx.note}</p>}
                    </div>
                  </div>

                  <span className={`font-semibold text-[15px] ${
                    isTransfer ? (isPositive ? 'text-emerald-500' : 'text-white') : (tx.type === 'income' ? 'text-emerald-500' : 'text-white')
                  }`}>
                    {isPositive ? '+' : '-'}{formatCurrency(displayAmount, activeWalletId === 'all' ? wallets.find(w => w.id === (isTransfer ? tx.fromWalletId : tx.walletId))?.currency : activeWallet.currency)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
