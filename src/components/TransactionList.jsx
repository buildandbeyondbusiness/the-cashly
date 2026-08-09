import React, { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit2, 
  Trash2, 
  Briefcase, 
  ShoppingBag, 
  Utensils, 
  Tv, 
  Plane, 
  Cross, 
  Heart, 
  Tag,
  DollarSign
} from 'lucide-react';

const ICON_MAP = {
  Briefcase,
  ShoppingBag,
  Utensils,
  Tv,
  Plane,
  Cross,
  Heart,
  Tag
};

export const TransactionList = ({ onOpenAddTransaction, onEditTransaction }) => {
  const { 
    transactions, 
    categories, 
    wallets, 
    deleteTransaction,
    activeWalletId 
  } = useFinancials();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'income' | 'expense'

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    // Wallet filter
    if (activeWalletId !== 'all' && t.walletId !== activeWalletId) return false;
    
    // Category filter
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;

    // Type filter
    if (selectedType !== 'all' && t.type !== selectedType) return false;

    // Search query
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
      name: 'Uncategorized',
      icon: 'Tag',
      color: 'bg-slate-100 text-slate-600 dark:bg-purple-900/40 dark:text-purple-300'
    };
  };

  const getWalletName = (wId) => {
    const w = wallets.find((wal) => wal.id === wId);
    return w ? w.name : 'Unknown Wallet';
  };

  return (
    <section className="bg-white dark:bg-[#150d36] rounded-3xl p-5 border border-slate-200/80 dark:border-purple-900/40 shadow-sm space-y-4">
      
      {/* List Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-purple-900/30">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
            Recent Transactions
          </h3>
          <p className="text-xs text-slate-500 dark:text-purple-300/60">
            {filteredTransactions.length} recorded entries
          </p>
        </div>

        {/* Action Controls & Add Button */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f1449] border border-transparent focus:border-purple-500 text-xs text-slate-800 dark:text-slate-100 outline-none transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f1449] border border-transparent text-xs font-medium text-slate-700 dark:text-purple-200 outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expenses (-)</option>
          </select>

          {/* Add Transaction Button */}
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-purple-glow transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>

        </div>
      </div>

      {/* Transaction List Entries */}
      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto text-slate-400 dark:text-purple-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-purple-300">No transactions found</p>
            <p className="text-xs text-slate-400 dark:text-purple-400/60">Try clearing filters or log a new transaction.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const cat = getCategory(tx.categoryId);
            const IconComponent = ICON_MAP[cat.icon] || Tag;

            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#1e1346] border border-transparent hover:border-slate-200 dark:hover:border-purple-800/40 transition-all duration-200"
              >
                {/* Left: Category Icon & Details */}
                <div className="flex items-center gap-3">
                  
                  {/* Circular Icon with Direction Arrow (Matched to Ref Image 1 & 2) */}
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${cat.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm ${
                      tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {tx.type === 'income' ? '↑' : '↓'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-purple-300/60">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600 dark:text-purple-300/80">{getWalletName(tx.walletId)}</span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[140px] italic text-slate-400 dark:text-purple-400/60">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right: Amount Readout & Action Buttons (Edit / Delete) */}
                <div className="flex items-center gap-3">
                  
                  <div className="text-right">
                    <span className={`font-extrabold text-base tracking-tight ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-purple-300/50 uppercase">
                      {tx.type}
                    </p>
                  </div>

                  {/* Edit & Delete Action Triggers */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="Edit Transaction"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
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
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </section>
  );
};
