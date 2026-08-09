import React, { useState, useEffect } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { Navbar } from './components/Navbar';
import { WalletCardSection } from './components/WalletCardSection';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { EditBalanceModal } from './components/EditBalanceModal';
import { QuickShortcutModal } from './components/QuickShortcutModal';
import { AddWalletModal } from './components/AddWalletModal';
import { Plus, Zap } from 'lucide-react';

function DashboardContent() {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [isQuickShortcutOpen, setIsQuickShortcutOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);

  // Auto-trigger quick shortcut if URL contains ?mode=quick (iOS Backtap Bookmark support)
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
    <div className="min-h-screen bg-[#f4f5fa] dark:bg-[#0e0826] text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20">
      
      {/* Navbar */}
      <Navbar 
        onOpenAddTransaction={() => {
          setEditingTx(null);
          setIsAddTxOpen(true);
        }}
        onOpenQuickShortcut={() => setIsQuickShortcutOpen(true)}
        onOpenAddWallet={() => setIsAddWalletOpen(true)}
      />

      {/* Main Single Page Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Section 1: Balance & Account Cards */}
        <WalletCardSection 
          onEditBalance={handleEditBalance}
          onOpenAddWallet={() => setIsAddWalletOpen(true)}
        />

        {/* Section 2: Real Transactions Timeline */}
        <TransactionList 
          onOpenAddTransaction={() => {
            setEditingTx(null);
            setIsAddTxOpen(true);
          }}
          onEditTransaction={handleEditTx}
        />

      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setIsQuickShortcutOpen(true)}
          className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 shadow-xl flex items-center justify-center font-extrabold hover:scale-105 active:scale-95 transition-transform"
          title="iOS Backtap Quick Keypad"
        >
          <Zap className="w-6 h-6 fill-slate-950" />
        </button>

        <button
          onClick={() => {
            setEditingTx(null);
            setIsAddTxOpen(true);
          }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Add Transaction Log"
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
