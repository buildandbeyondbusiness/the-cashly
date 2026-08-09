import React, { useState, useEffect } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { Navbar } from './components/Navbar';
import { WalletCardSection } from './components/WalletCardSection';
import { OverviewSection } from './components/OverviewSection';
import { TransactionList } from './components/TransactionList';
import { AnalyticsView } from './components/AnalyticsView';
import { TransactionModal } from './components/TransactionModal';
import { EditBalanceModal } from './components/EditBalanceModal';
import { QuickShortcutModal } from './components/QuickShortcutModal';
import { AddWalletModal } from './components/AddWalletModal';
import { Plus, Zap, BarChart2, LayoutDashboard, History } from 'lucide-react';

function DashboardContent() {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [isQuickShortcutOpen, setIsQuickShortcutOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'transactions' | 'analytics'

  // Auto-trigger quick shortcut if URL contains ?mode=quick (iOS Backtap Bookmark support!)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'quick') {
      setIsQuickShortcutOpen(true);
    }
  }, []);

  const handleEditTx = (tx) => {
    setEditingTx(tx);
    setIsAddTxOpen(true);
  };

  const handleEditBalance = (wallet) => {
    setEditingWallet(wallet);
    setIsEditBalanceOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-12 bg-[#f4f5fa] dark:bg-[#0e0826] transition-colors duration-300">
      
      {/* Navbar */}
      <Navbar 
        onOpenQuickShortcut={() => setIsQuickShortcutOpen(true)}
        onOpenAddTransaction={() => {
          setEditingTx(null);
          setIsAddTxOpen(true);
        }}
        onOpenAddWallet={() => setIsAddWalletOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Section 1: Total Net Worth & Wallet Cards */}
        <WalletCardSection 
          onEditBalance={handleEditBalance}
          onOpenAddWallet={() => setIsAddWalletOpen(true)}
        />

        {/* View Switching Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-purple-900/40 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-purple-glow'
                : 'text-slate-600 dark:text-purple-300 hover:bg-slate-200/60 dark:hover:bg-purple-900/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview Dashboard
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'transactions'
                ? 'bg-purple-600 text-white shadow-purple-glow'
                : 'text-slate-600 dark:text-purple-300 hover:bg-slate-200/60 dark:hover:bg-purple-900/40'
            }`}
          >
            <History className="w-4 h-4" />
            All Transactions
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-purple-glow'
                : 'text-slate-600 dark:text-purple-300 hover:bg-slate-200/60 dark:hover:bg-purple-900/40'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Analytics & Reports
          </button>
        </div>

        {/* Section 2: Active Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <OverviewSection />
            <TransactionList 
              onOpenAddTransaction={() => {
                setEditingTx(null);
                setIsAddTxOpen(true);
              }}
              onEditTransaction={handleEditTx}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList 
            onOpenAddTransaction={() => {
              setEditingTx(null);
              setIsAddTxOpen(true);
            }}
            onEditTransaction={handleEditTx}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}

      </main>

      {/* Floating Quick Action Button (FAB) for rapid entry */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setIsQuickShortcutOpen(true)}
          className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 shadow-xl flex items-center justify-center font-extrabold hover:scale-105 active:scale-95 transition-transform group"
          title="iOS Backtap Shortcut"
        >
          <Zap className="w-6 h-6 fill-slate-950 group-hover:rotate-12 transition-transform" />
        </button>

        <button
          onClick={() => {
            setEditingTx(null);
            setIsAddTxOpen(true);
          }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Add Transaction"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Modals */}
      <TransactionModal 
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTx(null);
        }}
        initialData={editingTx}
      />

      <EditBalanceModal 
        isOpen={isEditBalanceOpen}
        onClose={() => {
          setIsEditBalanceOpen(false);
          setEditingWallet(null);
        }}
        wallet={editingWallet}
      />

      <QuickShortcutModal 
        isOpen={isQuickShortcutOpen}
        onClose={() => setIsQuickShortcutOpen(false)}
      />

      <AddWalletModal 
        isOpen={isAddWalletOpen}
        onClose={() => setIsAddWalletOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <FinancialProvider>
      <DashboardContent />
    </FinancialProvider>
  );
}
