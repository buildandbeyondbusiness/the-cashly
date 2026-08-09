import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const FinancialContext = createContext(null);

const REAL_INITIAL_WALLETS = [
  {
    id: 'w-1',
    name: 'Main Bank',
    type: 'card',
    balance: 0.00,
    currency: '$',
    accountNumber: 'Bank Account',
    isPrimary: true,
  },
  {
    id: 'w-2',
    name: 'Cash Pocket',
    type: 'cash',
    balance: 0.00,
    currency: '$',
    accountNumber: 'Cash',
    isPrimary: false,
  },
  {
    id: 'w-3',
    name: 'Savings',
    type: 'savings',
    balance: 0.00,
    currency: '$',
    accountNumber: 'Savings Vault',
    isPrimary: false,
  }
];

const CLEAN_CATEGORIES = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'Utensils', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { id: 'cat-2', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  { id: 'cat-3', name: 'Bills & Utilities', icon: 'Tv', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { id: 'cat-4', name: 'Transport & Travel', icon: 'Plane', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { id: 'cat-5', name: 'Health & Personal', icon: 'Heart', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
  { id: 'cat-6', name: 'Income & Salary', icon: 'Briefcase', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { id: 'cat-7', name: 'General', icon: 'Tag', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' }
];

export const FinancialProvider = ({ children }) => {
  // Load state from localStorage or start fresh with real 0-data state
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('cashly_v2_wallets');
    return saved ? JSON.parse(saved) : REAL_INITIAL_WALLETS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('cashly_v2_categories');
    return saved ? JSON.parse(saved) : CLEAN_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('cashly_v2_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeWalletId, setActiveWalletId] = useState('all');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('cashly_v2_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('cashly_v2_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cashly_v2_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Total balance computation
  const totalBalance = wallets.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);

  // Income vs Expenses
  const calculateStats = () => {
    let income = 0;
    let spending = 0;

    transactions.forEach(t => {
      if (activeWalletId !== 'all' && t.walletId !== activeWalletId) return;

      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        income += amt;
      } else if (t.type === 'expense') {
        spending += amt;
      }
    });

    return { income, spending, net: income - spending };
  };

  const stats = calculateStats();

  // Add transaction
  const addTransaction = (newTx) => {
    const tx = {
      id: `t-${Date.now()}`,
      date: newTx.date || new Date().toISOString().split('T')[0],
      ...newTx,
      amount: parseFloat(newTx.amount)
    };

    setTransactions(prev => [tx, ...prev]);

    // Update wallet balance automatically
    setWallets(prev => prev.map(w => {
      if (w.id === tx.walletId) {
        const delta = tx.type === 'income' ? tx.amount : (tx.type === 'expense' ? -tx.amount : 0);
        return { ...w, balance: Math.max(0, (w.balance || 0) + delta) };
      }
      return w;
    }));

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.85 }
    });
  };

  // Edit transaction
  const editTransaction = (id, updatedFields) => {
    const oldTx = transactions.find(t => t.id === id);
    if (!oldTx) return;

    const newAmount = parseFloat(updatedFields.amount);

    setWallets(prev => prev.map(w => {
      let balance = w.balance || 0;
      if (w.id === oldTx.walletId) {
        balance += (oldTx.type === 'expense' ? oldTx.amount : (oldTx.type === 'income' ? -oldTx.amount : 0));
      }
      const targetWalletId = updatedFields.walletId || oldTx.walletId;
      const targetType = updatedFields.type || oldTx.type;
      if (w.id === targetWalletId) {
        balance += (targetType === 'income' ? newAmount : (targetType === 'expense' ? -newAmount : 0));
      }
      return { ...w, balance: Math.max(0, balance) };
    }));

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields, amount: newAmount } : t));
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    const oldTx = transactions.find(t => t.id === id);
    if (!oldTx) return;

    setWallets(prev => prev.map(w => {
      let balance = w.balance || 0;
      if (w.id === oldTx.walletId) {
        balance += (oldTx.type === 'expense' ? oldTx.amount : (oldTx.type === 'income' ? -oldTx.amount : 0));
      }
      return { ...w, balance: Math.max(0, balance) };
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Direct balance edit
  const editWalletBalance = (walletId, newBalance) => {
    const val = parseFloat(newBalance);
    if (isNaN(val)) return;

    setWallets(prev => prev.map(w => w.id === walletId ? { ...w, balance: val } : w));
  };

  // Add new wallet
  const addWallet = (walletData) => {
    const newWallet = {
      id: `w-${Date.now()}`,
      balance: parseFloat(walletData.balance || 0),
      currency: '$',
      accountNumber: walletData.accountNumber || 'Account',
      isPrimary: false,
      ...walletData
    };
    setWallets(prev => [...prev, newWallet]);
  };

  // Export JSON
  const exportData = () => {
    const data = {
      wallets,
      categories,
      transactions,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashly_real_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importData = (importedData) => {
    try {
      if (importedData.wallets) setWallets(importedData.wallets);
      if (importedData.categories) setCategories(importedData.categories);
      if (importedData.transactions) setTransactions(importedData.transactions);
      alert('Data imported successfully!');
    } catch (err) {
      alert('Invalid backup file.');
    }
  };

  // Clear all data to fresh state
  const clearAllData = () => {
    if (window.confirm('Clear all data and start completely fresh?')) {
      setWallets(REAL_INITIAL_WALLETS);
      setCategories(CLEAN_CATEGORIES);
      setTransactions([]);
    }
  };

  return (
    <FinancialContext.Provider value={{
      wallets,
      categories,
      transactions,
      activeWalletId,
      setActiveWalletId,
      totalBalance,
      stats,
      addTransaction,
      editTransaction,
      deleteTransaction,
      editWalletBalance,
      addWallet,
      exportData,
      importData,
      clearAllData
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancials = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancials must be used within a FinancialProvider');
  }
  return context;
};
