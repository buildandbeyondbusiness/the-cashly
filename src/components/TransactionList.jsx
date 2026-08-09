import React, { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Utensils, 
  ShoppingBag, 
  Tv, 
  Plane, 
  Heart, 
  Briefcase, 
  Tag, 
  Sparkles,
  Wallet
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  ShoppingBag,
  Tv,
  Plane,
  Heart,
  Briefcase,
  Tag
};

export const TransactionList = ({ onOpenAddTransaction, onEditTransaction }) => {
  const { transactions, categories, wallets, deleteTransaction, activeWalletId } = useFinancials();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    if (activeWalletId !== 'all' && t.walletId !== activeWalletId) return false;
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNote = t.note ? t.note.toLowerCase().includes(q) : false;
      const matchAmount = t.amount.toString().includes(q);
      if (!matchTitle && !matchNote && !matchAmount) return false;
    }
    return true;
  });

  const getCategory = (catId) => {
    return categories.find((c) => c.id === catId) || {
      name: 'General',
      icon: 'Tag',
      color: 'bg-slate-100 text-slate-600 dark:bg-purple-900/40 dark:text-purple-300'
    };
  };

  const getWalletName = (wId) => {
    const w = wallets.find((wal) => wal.id === wId);
    return w ? w.name : 'Account';
  };

  return (
    <section className="bg-white dark:bg-[#150d36] rounded-3xl p-6 border border-slate-200/80 dark:border-purple-900/40 shadow-sm space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
            Transaction Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-purple-300/60">
            {filteredTransactions.length} total entries recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f1449] border border-transparent focus:border-purple-500 text-xs text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f1449] border border-transparent text-xs font-medium text-slate-700 dark:text-purple-200 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Items / Intuitive Clean Empty State */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-2xl bg-slate-50 dark:bg-[#190f3f]/50 border border-dashed border-slate-200 dark:border-purple-800/30 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              No transactions logged yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-purple-300/60 leading-relaxed">
              Your money ledger is clean and ready. Tap <strong className="text-purple-600 dark:text-purple-300">"Add Log"</strong> to record your first real income or expense.
            </p>
          </div>
          <button
            onClick={onOpenAddTransaction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-purple-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const cat = getCategory(tx.categoryId);
            const IconComponent = ICON_MAP[cat.icon] || Tag;

            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#190f3f] hover:bg-slate-100 dark:hover:bg-[#20144f] border border-slate-100 dark:border-purple-900/30 transition-all duration-200"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-purple-300/60">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600 dark:text-purple-300/80">{getWalletName(tx.walletId)}</span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-400 dark:text-purple-400/60 truncate max-w-[150px]">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`font-extrabold text-base tracking-tight ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-semibold block text-slate-400 dark:text-purple-300/50 capitalize">
                      {tx.type}
                    </span>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="Edit Transaction"
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-purple-900/50 text-slate-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${tx.title}"?`)) {
                          deleteTransaction(tx.id);
                        }
                      }}
                      title="Delete Transaction"
                      className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
