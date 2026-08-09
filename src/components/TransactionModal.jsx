import React, { useState, useEffect } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { X, Check, DollarSign, Calendar, Tag, Wallet, FileText } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const { categories, wallets, addTransaction, editTransaction } = useFinancials();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      setType(initialData.type || 'expense');
      setCategoryId(initialData.categoryId || (categories[0]?.id || ''));
      setWalletId(initialData.walletId || (wallets[0]?.id || ''));
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setNote(initialData.note || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategoryId(categories[0]?.id || '');
      setWalletId(wallets[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [initialData, isOpen, categories, wallets]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !walletId) {
      alert('Please fill in title, amount, and wallet.');
      return;
    }

    const payload = {
      title,
      amount: parseFloat(amount),
      type,
      categoryId: categoryId || categories[0]?.id,
      walletId,
      date,
      note
    };

    if (initialData && initialData.id) {
      editTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#180e3c] w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Income vs Expense Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#110930] border border-slate-200 dark:border-purple-900/40">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 font-extrabold text-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Title / Recipient</label>
            <input
              type="text"
              placeholder="e.g. Spotify, Donating for hospital..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Wallet Selector & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Wallet</label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Note Optional */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Note (Optional)</label>
            <input
              type="text"
              placeholder="Add memo..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-purple-glow transition-all active:scale-98 mt-2"
          >
            {initialData ? 'Save Changes' : 'Add Entry'}
          </button>

        </form>

      </div>
    </div>
  );
};
