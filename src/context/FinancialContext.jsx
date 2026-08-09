import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';

const FinancialContext = createContext(null);

export const EX_RATES = { USD: 1, EUR: 1.08, GBP: 1.25, JPY: 0.0066, INR: 0.012 };

export const CATEGORIES = {
  food: { id: 'food', name: 'Food & Drink', bg: 'bg-orange-500', color: '#f97316', type: 'expense' },
  transport: { id: 'transport', name: 'Transport', bg: 'bg-blue-500', color: '#3b82f6', type: 'expense' },
  shopping: { id: 'shopping', name: 'Shopping', bg: 'bg-purple-500', color: '#a855f7', type: 'expense' },
  entertainment: { id: 'entertainment', name: 'Entertainment', bg: 'bg-pink-500', color: '#ec4899', type: 'expense' },
  bills: { id: 'bills', name: 'Bills', bg: 'bg-rose-500', color: '#f43f5e', type: 'expense' },
  home: { id: 'home', name: 'Home', bg: 'bg-indigo-500', color: '#6366f1', type: 'expense' },
  health: { id: 'health', name: 'Health', bg: 'bg-red-500', color: '#ef4444', type: 'expense' },
  education: { id: 'education', name: 'Education', bg: 'bg-cyan-500', color: '#06b6d4', type: 'expense' },
  subscriptions: { id: 'subscriptions', name: 'Subscriptions', bg: 'bg-violet-500', color: '#8b5cf6', type: 'expense' },
  utilities: { id: 'utilities', name: 'Utilities', bg: 'bg-yellow-500', color: '#eab308', type: 'expense' },
  salary: { id: 'salary', name: 'Salary', bg: 'bg-emerald-500', color: '#10b981', type: 'income' },
  gifts: { id: 'gifts', name: 'Gifts', bg: 'bg-teal-500', color: '#14b8a6', type: 'income' },
  investment: { id: 'investment', name: 'Investment', bg: 'bg-emerald-600', color: '#059669', type: 'income' },
};

const DEFAULT_WALLETS = [
  { id: 'w1', name: 'Main Wallet', currency: 'USD', balance: 0, iconString: 'Wallet' },
  { id: 'w2', name: 'Savings Vault', currency: 'USD', balance: 0, iconString: 'Landmark' },
];

const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

export const vibrate = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(30);
  }
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  try {
    const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: currencyCode || 'USD', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    }).format(amount || 0);
  } catch (e) {
    return `${currencyCode === 'INR' ? '₹' : '$'}${parseFloat(amount || 0).toFixed(2)}`;
  }
};

export const FinancialProvider = ({ children }) => {
  const [wallets, setWallets] = useState(() => safeGet('cashly_v3_wallets', DEFAULT_WALLETS));
  const [transactions, setTransactions] = useState(() => safeGet('cashly_v3_transactions', []));
  const [budgets, setBudgets] = useState(() => safeGet('cashly_v3_budgets', []));
  const [goals, setGoals] = useState(() => safeGet('cashly_v3_goals', []));
  const [bills, setBills] = useState(() => safeGet('cashly_v3_bills', []));
  const [preferences, setPreferences] = useState(() => safeGet('cashly_v3_prefs', { 
    baseCurrency: 'USD', 
    isDarkMode: true 
  }));

  const [activeWalletId, setActiveWalletId] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => safeSet('cashly_v3_wallets', wallets), [wallets]);
  useEffect(() => safeSet('cashly_v3_transactions', transactions), [transactions]);
  useEffect(() => safeSet('cashly_v3_budgets', budgets), [budgets]);
  useEffect(() => safeSet('cashly_v3_goals', goals), [goals]);
  useEffect(() => safeSet('cashly_v3_bills', bills), [bills]);
  useEffect(() => safeSet('cashly_v3_prefs', preferences), [preferences]);

  const activeWallet = activeWalletId === 'all'
    ? { id: 'all', name: 'All Wallets', currency: preferences?.baseCurrency || 'USD' }
    : wallets.find(w => w.id === activeWalletId) || wallets[0] || { name: 'Main Wallet', currency: 'USD' };

  const cycleWallet = () => {
    vibrate();
    if (wallets.length === 0) return;
    const sequence = ['all', ...wallets.map(w => w.id)];
    const nextIdx = (sequence.indexOf(activeWalletId) + 1) % sequence.length;
    setActiveWalletId(sequence[nextIdx]);
  };

  // Filter transactions for active wallet
  const viewTransactions = useMemo(() => {
    return transactions.filter(t => 
      activeWalletId === 'all' || 
      (t.type === 'transfer' ? (t.fromWalletId === activeWalletId || t.toWalletId === activeWalletId) : t.walletId === activeWalletId)
    );
  }, [transactions, activeWalletId]);

  // Filter transactions for selected month
  const monthTransactions = useMemo(() => {
    return viewTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth.getMonth() && tDate.getFullYear() === currentMonth.getFullYear();
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [viewTransactions, currentMonth]);

  // Calculate Balance, Income & Expense
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0, exp = 0, bal = 0;
    const baseRate = EX_RATES[preferences?.baseCurrency || 'USD'] || 1;

    const convert = (amt, wId) => {
      if (activeWalletId === 'all') {
        const wCurrency = wallets.find(w => w.id === wId)?.currency || 'USD';
        return (amt * (EX_RATES[wCurrency] || 1)) / baseRate;
      }
      return amt;
    };

    viewTransactions.forEach(t => {
      let amt = t.type !== 'transfer' ? convert(t.amount, t.walletId) : 0;
      if (t.type === 'income') bal += amt;
      if (t.type === 'expense') bal -= amt;
      if (t.type === 'transfer' && activeWalletId !== 'all') {
        if (t.fromWalletId === activeWalletId) bal -= t.amount;
        if (t.toWalletId === activeWalletId) bal += (t.amountConverted || t.amount);
      }
    });

    monthTransactions.forEach(t => {
      let amt = t.type !== 'transfer' ? convert(t.amount, t.walletId) : 0;
      if (t.type === 'income') inc += amt;
      if (t.type === 'expense') exp += amt;
      if (t.type === 'transfer' && activeWalletId !== 'all') {
        if (t.fromWalletId === activeWalletId) exp += t.amount;
        if (t.toWalletId === activeWalletId) inc += (t.amountConverted || t.amount);
      }
    });

    return { totalIncome: inc, totalExpense: exp, balance: bal };
  }, [viewTransactions, monthTransactions, activeWalletId, wallets, preferences?.baseCurrency]);

  // Add Transaction
  const addTransaction = (data) => {
    const newTx = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString(),
      ...data,
      amount: parseFloat(data.amount)
    };
    setTransactions(prev => [newTx, ...prev]);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
  };

  // Delete Transaction
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Add Wallet
  const addWallet = (data) => {
    const newW = {
      id: `w-${Date.now()}`,
      name: data.name,
      currency: data.currency || 'USD',
      iconString: data.iconString || 'Wallet',
      balance: 0
    };
    setWallets(prev => [...prev, newW]);
  };

  // Delete Wallet
  const deleteWallet = (id) => {
    if (wallets.length <= 1) return;
    setWallets(prev => prev.filter(w => w.id !== id));
    if (activeWalletId === id) setActiveWalletId('all');
  };

  // Add Budget
  const addBudget = (data) => {
    const newB = {
      id: `b-${Date.now()}`,
      ...data,
      limit: parseFloat(data.limit)
    };
    setBudgets(prev => [...prev, newB]);
  };

  // Add Goal / Savings Jar
  const addGoal = (data) => {
    const newG = {
      id: `g-${Date.now()}`,
      ...data,
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: 0
    };
    setGoals(prev => [...prev, newG]);
  };

  // Fund Goal
  const fundGoal = (id, newAmount) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g));
  };

  // Add Bill
  const addBill = (data) => {
    const newBill = {
      id: `bill-${Date.now()}`,
      ...data,
      amount: parseFloat(data.amount)
    };
    setBills(prev => [...prev, newBill]);
  };

  // Update Preference
  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // CSV Export
  const exportCSV = () => {
    vibrate();
    const headers = ["Date", "Type", "Category", "Amount", "Currency", "Note"];
    const rows = monthTransactions.map(t => {
      const catName = CATEGORIES[t.categoryId]?.name || (t.type === 'transfer' ? 'Transfer' : 'General');
      const wallet = wallets.find(w => w.id === t.walletId);
      const curr = wallet ? wallet.currency : 'USD';
      return [
        new Date(t.date).toLocaleDateString(),
        t.type,
        catName,
        t.amount,
        curr,
        `"${(t.note || '').replace(/"/g, '""')}"`
      ].join(",");
    });
    
    const csvString = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([jsonStr || csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    link.setAttribute("download", `Cashly_Export_${monthName.replace(/ /g, '_')}.csv`);
    link.click();
  };

  return (
    <FinancialContext.Provider value={{
      wallets,
      transactions,
      budgets,
      goals,
      bills,
      preferences,
      activeWalletId,
      setActiveWalletId,
      activeWallet,
      cycleWallet,
      currentMonth,
      setCurrentMonth,
      monthTransactions,
      totalIncome,
      totalExpense,
      balance,
      addTransaction,
      deleteTransaction,
      addWallet,
      deleteWallet,
      addBudget,
      addGoal,
      fundGoal,
      addBill,
      updatePreference,
      exportCSV
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
