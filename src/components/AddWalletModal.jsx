import React, { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { X, Wallet, CreditCard, DollarSign } from 'lucide-react';

export const AddWalletModal = ({ isOpen, onClose }) => {
  const { addWallet } = useFinancials();

  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('card');
  const [accountNumber, setAccountNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert('Please enter a wallet name.');
      return;
    }

    addWallet({
      name,
      balance: parseFloat(balance || '0'),
      type,
      accountNumber: accountNumber ? `•••• ${accountNumber}` : 'Account',
    });

    setName('');
    setBalance('');
    setType('card');
    setAccountNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#180e3c] w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Create New Wallet
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/60">
                Add bank, cash, or credit account
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Account Name</label>
            <input
              type="text"
              placeholder="e.g. Travel Card, Emergency Savings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Initial Balance ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="card">Credit / Debit Card</option>
                <option value="cash">Physical Cash</option>
                <option value="savings">Savings Account</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-1 block">Last 4 Digits</label>
              <input
                type="text"
                maxLength={4}
                placeholder="1234"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1f1449] border border-slate-200 dark:border-purple-800/40 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-purple-glow transition-all active:scale-98 mt-2"
          >
            Create Wallet
          </button>

        </form>

      </div>
    </div>
  );
};
