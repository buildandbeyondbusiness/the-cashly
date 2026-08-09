import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const FinancialContext = createContext(null);

const DEFAULT_WALLETS = [
  {
    id: 'w-1',
    name: 'Main VISA',
    type: 'card',
    balance: 7582.00,
    currency: '$',
    gradient: 'from-purple-900 via-indigo-900 to-slate-900',
    accountNumber: '•••• 1237',
    isPrimary: true,
  },
  {
    id: 'w-2',
    name: 'Cash Pocket',
    type: 'cash',
    balance: 425.00,
    currency: '$',
    gradient: 'from-emerald-700 to-teal-900',
    accountNumber: 'Cash',
    isPrimary: false,
  },
  {
    id: 'w-3',
    name: 'Savings Vault',
    type: 'savings',
    balance: 58560.00,
    currency: '$',
    gradient: 'from-amber-600 to-orange-800',
    accountNumber: '•••• 8890',
    isPrimary: false,
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Design & Work', icon: 'Briefcase', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', type: 'income' },
  { id: 'cat-2', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', type: 'expense' },
  { id: 'cat-3', name: 'Food & Cafe', icon: 'Utensils', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', type: 'expense' },
  { id: 'cat-4', name: 'Subscriptions', icon: 'Tv', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', type: 'expense' },
  { id: 'cat-5', name: 'Travel & Tickets', icon: 'Plane', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', type: 'expense' },
  { id: 'cat-6', name: 'Health & Pharmacy', icon: 'Cross', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20', type: 'expense' },
  { id: 'cat-7', name: 'Charity & Donation', icon: 'Heart', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', type: 'expense' },
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 't-1',
    title: 'App UI Project',
    amount: 1200,
    type: 'income',
    categoryId: 'cat-1',
    walletId: 'w-1',
    date: '2026-08-09',
    note: 'Final milestone payment from client',
  },
  {
    id: 't-2',
    title: 'Flight Tickets',
    amount: 694.50,
    type: 'expense',
    categoryId: 'cat-5',
    walletId: 'w-1',
    date: '2026-08-08',
    note: '2 roundtrip tickets',
  },
  {
    id: 't-3',
    title: 'Street Cafe',
    amount: 15.45,
    type: 'expense',
    categoryId: 'cat-3',
    walletId: 'w-2',
    date: '2026-08-08',
    note: 'Coffee & croissants',
  },
  {
    id: 't-4',
    title: 'Shopping Center',
    amount: 300.00,
    type: 'expense',
    categoryId: 'cat-2',
    walletId: 'w-1',
    date: '2026-08-07',
    note: 'Summer clothes & accessories',
  },
  {
    id: 't-5',
    title: 'Visual Design Retainer',
    amount: 700.00,
    type: 'income',
    categoryId: 'cat-1',
    walletId: 'w-1',
    date: '2026-08-06',
    note: 'Monthly brand kit update',
  },
  {
    id: 't-6',
    title: 'Pharmacy Essentials',
    amount: 24.32,
    type: 'expense',
    categoryId: 'cat-6',
    walletId: 'w-1',
    date: '2026-08-05',
    note: 'Vitamins and supplements',
  },
];

const DEFAULT_UPCOMING_BILLS = [
  {
    id: 'b-1',
    title: 'Evernote Subscription',
    amount: 9.50,
    dueDate: '22 Aug 2026',
    gradient: 'from-purple-600 to-indigo-900',
    category: 'Subscriptions'
  },
  {
    id: 'b-2',
    title: 'Xiaomi TV Premium',
    amount: 12.50,
    dueDate: '25 Aug 2026',
    gradient: 'from-orange-500 to-amber-700',
    category: 'Utilities'
  },
  {
    id: 'b-3',
    title: 'Spotify Family Plan',
    amount: 14.99,
    dueDate: '01 Sep 2026',
    gradient: 'from-emerald-600 to-teal-800',
    category: 'Entertainment'
  }
];

export const FinancialProvider = ({ children }) => {
  // Load state from localStorage or use default mock data
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('cashly_wallets');
    return saved ? JSON.parse(saved) : DEFAULT_WALLETS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('cashly_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('cashly_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [upcomingBills, setUpcomingBills] = useState(() => {
    const saved = localStorage.getItem('cashly_upcoming_bills');
    return saved ? JSON.parse(saved) : DEFAULT_UPCOMING_BILLS;
  });

  const [dailyLimit, setDailyLimit] = useState(() => {
    const saved = localStorage.getItem('cashly_daily_limit');
    return saved ? parseFloat(saved) : 100;
  });

  const [activeWalletId, setActiveWalletId] = useState('all');
  const [activeTimeframe, setActiveTimeframe] = useState('month'); // 'week' | 'month' | 'year'

  // Sync state to local storage on change
  useEffect(() => {
    localStorage.setItem('cashly_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('cashly_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cashly_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cashly_upcoming_bills', JSON.stringify(upcomingBills));
  }, [upcomingBills]);

  useEffect(() => {
    localStorage.setItem('cashly_daily_limit', dailyLimit.toString());
  }, [dailyLimit]);

  // Derived financial metrics
  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  const calculateStats = () => {
    let income = 0;
    let spending = 0;

    transactions.forEach(t => {
      if (activeWalletId !== 'all' && t.walletId !== activeWalletId) return;

      const amt = Number(t.amount);
      if (t.type === 'income') {
        income += amt;
      } else if (t.type === 'expense') {
        spending += amt;
      }
    });

    return { income, spending, net: income - spending };
  };

  const stats = calculateStats();

  // Action: Add Transaction
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
        return { ...w, balance: Math.max(0, w.balance + delta) };
      }
      if (tx.type === 'transfer' && w.id === tx.targetWalletId) {
        return { ...w, balance: w.balance + tx.amount };
      }
      return w;
    }));

    // Trigger celebratory confetti effect for fast feedback
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  // Action: Edit Transaction
  const editTransaction = (id, updatedFields) => {
    const oldTx = transactions.find(t => t.id === id);
    if (!oldTx) return;

    const newAmount = parseFloat(updatedFields.amount);

    // Revert old transaction effect on wallet balances
    setWallets(prev => prev.map(w => {
      let balance = w.balance;

      // Revert old
      if (w.id === oldTx.walletId) {
        balance += (oldTx.type === 'expense' ? oldTx.amount : (oldTx.type === 'income' ? -oldTx.amount : 0));
      }
      if (oldTx.type === 'transfer' && w.id === oldTx.targetWalletId) {
        balance -= oldTx.amount;
      }

      // Apply new
      const targetWalletId = updatedFields.walletId || oldTx.walletId;
      const targetType = updatedFields.type || oldTx.type;
      
      if (w.id === targetWalletId) {
        balance += (targetType === 'income' ? newAmount : (targetType === 'expense' ? -newAmount : 0));
      }

      return { ...w, balance: Math.max(0, balance) };
    }));

    // Update transaction entry
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields, amount: newAmount } : t));
  };

  // Action: Delete Transaction
  const deleteTransaction = (id) => {
    const oldTx = transactions.find(t => t.id === id);
    if (!oldTx) return;

    // Revert wallet balance
    setWallets(prev => prev.map(w => {
      let balance = w.balance;
      if (w.id === oldTx.walletId) {
        balance += (oldTx.type === 'expense' ? oldTx.amount : (oldTx.type === 'income' ? -oldTx.amount : 0));
      }
      return { ...w, balance: Math.max(0, balance) };
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Action: Direct Balance Edit for a Wallet
  const editWalletBalance = (walletId, newBalance) => {
    const val = parseFloat(newBalance);
    if (isNaN(val)) return;

    setWallets(prev => prev.map(w => w.id === walletId ? { ...w, balance: val } : w));
  };

  // Action: Add Wallet
  const addWallet = (walletData) => {
    const newWallet = {
      id: `w-${Date.now()}`,
      balance: parseFloat(walletData.balance || 0),
      currency: '$',
      gradient: walletData.gradient || 'from-indigo-600 to-purple-900',
      accountNumber: walletData.accountNumber || '•••• NEW',
      isPrimary: false,
      ...walletData
    };
    setWallets(prev => [...prev, newWallet]);
  };

  // Action: Add Custom Category
  const addCategory = (catData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      type: 'expense',
      ...catData
    };
    setCategories(prev => [...prev, newCat]);
  };

  // Export Data to JSON File
  const exportData = () => {
    const data = {
      wallets,
      categories,
      transactions,
      upcomingBills,
      dailyLimit,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashly_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Data from JSON File
  const importData = (importedData) => {
    try {
      if (importedData.wallets) setWallets(importedData.wallets);
      if (importedData.categories) setCategories(importedData.categories);
      if (importedData.transactions) setTransactions(importedData.transactions);
      if (importedData.upcomingBills) setUpcomingBills(importedData.upcomingBills);
      if (importedData.dailyLimit) setDailyLimit(importedData.dailyLimit);
      alert('Data imported successfully!');
    } catch (err) {
      alert('Invalid backup file format.');
    }
  };

  // Reset to default initial seed data
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all data to default samples?')) {
      setWallets(DEFAULT_WALLETS);
      setCategories(DEFAULT_CATEGORIES);
      setTransactions(DEFAULT_TRANSACTIONS);
      setUpcomingBills(DEFAULT_UPCOMING_BILLS);
      setDailyLimit(100);
    }
  };

  return (
    <FinancialContext.Provider value={{
      wallets,
      categories,
      transactions,
      upcomingBills,
      dailyLimit,
      activeWalletId,
      setActiveWalletId,
      activeTimeframe,
      setActiveTimeframe,
      totalBalance,
      stats,
      addTransaction,
      editTransaction,
      deleteTransaction,
      editWalletBalance,
      addWallet,
      addCategory,
      setDailyLimit,
      exportData,
      importData,
      resetToDefault
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
