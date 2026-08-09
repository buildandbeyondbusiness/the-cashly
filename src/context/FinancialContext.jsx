import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from '../firebase';

const FinancialContext = createContext(null);

export const EX_RATES = { USD: 1, EUR: 1.08, GBP: 1.25, JPY: 0.0066, INR: 0.012 };

export const CATEGORIES = {
  // Expenses
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
  
  // Income Sources
  salary: { id: 'salary', name: 'Salary', bg: 'bg-emerald-500', color: '#10b981', type: 'income' },
  freelance: { id: 'freelance', name: 'Freelance', bg: 'bg-teal-500', color: '#14b8a6', type: 'income' },
  business: { id: 'business', name: 'Business', bg: 'bg-indigo-600', color: '#4f46e5', type: 'income' },
  investment: { id: 'investment', name: 'Investments', bg: 'bg-emerald-600', color: '#059669', type: 'income' },
  crypto: { id: 'crypto', name: 'Crypto & Forex', bg: 'bg-amber-500', color: '#f59e0b', type: 'income' },
  rental: { id: 'rental', name: 'Rental Income', bg: 'bg-sky-500', color: '#0ea5e9', type: 'income' },
  gifts: { id: 'gifts', name: 'Gifts & Bonus', bg: 'bg-pink-500', color: '#ec4899', type: 'income' },
  other_income: { id: 'other_income', name: 'Other Income', bg: 'bg-gray-600', color: '#4b5563', type: 'income' },
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
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Listen to Firebase Authentication & handle mobile redirect result
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    getRedirectResult(auth).catch(err => {
      console.log("Redirect check result:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync to Cloud Firestore when user is logged in
  useEffect(() => {
    if (!user || !db) return;

    const syncCollection = (collName, setter) => {
      const collRef = collection(db, 'users', user.uid, collName);
      return onSnapshot(collRef, (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setter(items);
        }
      }, err => console.error(`Sync error ${collName}:`, err));
    };

    const unsubWallets = syncCollection('wallets', setWallets);
    const unsubTx = syncCollection('transactions', setTransactions);
    const unsubBudgets = syncCollection('budgets', setBudgets);
    const unsubGoals = syncCollection('goals', setGoals);
    const unsubBills = syncCollection('bills', setBills);

    return () => {
      unsubWallets();
      unsubTx();
      unsubBudgets();
      unsubGoals();
      unsubBills();
    };
  }, [user]);

  // Sync state to local storage as fallback
  useEffect(() => safeSet('cashly_v3_wallets', wallets), [wallets]);
  useEffect(() => safeSet('cashly_v3_transactions', transactions), [transactions]);
  useEffect(() => safeSet('cashly_v3_budgets', budgets), [budgets]);
  useEffect(() => safeSet('cashly_v3_goals', goals), [goals]);
  useEffect(() => safeSet('cashly_v3_bills', bills), [bills]);
  useEffect(() => safeSet('cashly_v3_prefs', preferences), [preferences]);

  // Save entry helper for Firestore + local state
  const saveEntry = async (collName, data, id) => {
    const entryId = id || data.id || `${collName.substring(0, 1)}-${Date.now()}`;
    const payload = { ...data, id: entryId };

    if (user && db) {
      try {
        const docRef = doc(db, 'users', user.uid, collName, entryId);
        await setDoc(docRef, payload, { merge: true });
      } catch (err) {
        console.error("Firestore save error:", err);
      }
    }

    return payload;
  };

  const deleteEntry = async (collName, id) => {
    if (user && db) {
      try {
        const docRef = doc(db, 'users', user.uid, collName, id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error("Firestore delete error:", err);
      }
    }
  };

  // Google Login (Popup with mobile Redirect fallback)
  const loginWithGoogle = async () => {
    vibrate();
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.log("Popup blocked/failed, trying redirect:", err);
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        console.error("Google Auth error:", redirectErr);
        alert("Google Sign-In failed. Please check Firebase Authorized Domains in your Firebase Console.");
      }
    }
  };

  const logout = async () => {
    vibrate();
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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
    saveEntry('transactions', newTx);
    setTransactions(prev => [newTx, ...prev]);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
  };

  // Delete Transaction
  const deleteTransaction = (id) => {
    deleteEntry('transactions', id);
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
    saveEntry('wallets', newW);
    setWallets(prev => [...prev, newW]);
  };

  // Delete Wallet
  const deleteWallet = (id) => {
    if (wallets.length <= 1) return;
    deleteEntry('wallets', id);
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
    saveEntry('budgets', newB);
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
    saveEntry('goals', newG);
    setGoals(prev => [...prev, newG]);
  };

  // Fund Goal
  const fundGoal = (id, newAmount) => {
    const goalObj = goals.find(g => g.id === id);
    if (goalObj) {
      const updated = { ...goalObj, currentAmount: newAmount };
      saveEntry('goals', updated, id);
    }
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g));
  };

  // Add Bill
  const addBill = (data) => {
    const newBill = {
      id: `bill-${Date.now()}`,
      ...data,
      amount: parseFloat(data.amount)
    };
    saveEntry('bills', newBill);
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
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    link.setAttribute("download", `Cashly_Export_${monthName.replace(/ /g, '_')}.csv`);
    link.click();
  };

  return (
    <FinancialContext.Provider value={{
      user,
      authLoading,
      loginWithGoogle,
      logout,
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
