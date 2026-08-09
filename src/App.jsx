import React, { useState } from 'react';
import { FinancialProvider, useFinancials, formatCurrency, vibrate } from './context/FinancialContext';
import { LockScreen } from './components/LockScreen';
import { RecordsView } from './components/RecordsView';
import { AnalyticsView } from './components/AnalyticsView';
import { PlanningView } from './components/PlanningView';
import { SettingsView } from './components/SettingsView';
import { FloatingLiquidNavbar } from './components/FloatingLiquidNavbar';

import { AddTransactionModal } from './components/AddTransactionModal';
import { AddWalletModal } from './components/AddWalletModal';
import { AddBudgetModal } from './components/AddBudgetModal';
import { AddGoalModal } from './components/AddGoalModal';
import { FundGoalModal } from './components/FundGoalModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AddBillModal } from './components/AddBillModal';
import { PinSetupModal } from './components/PinSetupModal';

import { 
  RefreshCw, Wallet, Bell, ChevronLeft, ChevronRight, TrendingUp, TrendingDown 
} from 'lucide-react';

function MainAppContent() {
  const { 
    activeWallet, 
    cycleWallet, 
    currentMonth, 
    setCurrentMonth, 
    balance, 
    totalIncome, 
    totalExpense, 
    bills, 
    isLocked, 
    setIsLocked, 
    preferences, 
    updatePreference 
  } = useFinancials();

  const [currentTab, setCurrentTab] = useState('transactions'); // 'transactions' | 'analytics' | 'planning' | 'settings'

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [fundingGoal, setFundingGoal] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);

  if (isLocked) {
    return <LockScreen pin={preferences?.securityPin} onUnlock={() => setIsLocked(false)} />;
  }

  const getHeaderStyle = () => {
    if (currentTab === 'settings') return 'bg-[#000000] text-white';
    if (currentTab === 'planning') return 'bg-gradient-to-br from-indigo-900/90 via-purple-950/90 to-black text-white';
    return 'bg-gradient-to-br from-emerald-900/90 via-teal-950/90 to-black text-white';
  };

  return (
    <div className="w-full h-full bg-black sm:p-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-[100dvh] sm:h-[100vh] sm:max-h-[850px] sm:rounded-[40px] sm:border-[8px] border-gray-800/80 bg-black overflow-hidden relative flex flex-col shadow-2xl transition-colors">
        
        {/* Top Liquid Glass Hero Header Banner */}
        <div className={`${getHeaderStyle()} pt-12 pb-5 px-6 rounded-b-[2.5rem] shadow-sm z-10 flex-shrink-0 transition-all duration-500 relative overflow-hidden backdrop-blur-xl border-b border-white/10`}>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            {/* Cycle Wallet Button */}
            <div 
              onClick={currentTab !== 'settings' ? cycleWallet : undefined}
              className={`flex items-center gap-2 py-1.5 px-3.5 rounded-full transition-all ${
                currentTab !== 'settings' ? 'bg-white/15 hover:bg-white/25 cursor-pointer backdrop-blur-md active:scale-95 border border-white/10' : 'bg-transparent'
              }`}
            >
              {currentTab !== 'settings' ? <RefreshCw className="w-3.5 h-3.5 text-emerald-300" /> : <Wallet className="w-3.5 h-3.5 text-gray-400" />}
              <span className="font-semibold text-xs tracking-wide truncate max-w-[130px]">
                {currentTab === 'settings' ? 'Settings' : activeWallet.name}
              </span>
            </div>

            {/* Notification Bell */}
            {currentTab !== 'settings' && (
              <button 
                onClick={() => { vibrate(); setIsNotifOpen(true); }} 
                className="p-2 hover:bg-white/15 rounded-full transition-colors relative active:scale-90 backdrop-blur-md"
              >
                <Bell className="w-5 h-5 text-white" />
                {bills.length > 0 && (
                  <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-transparent animate-pulse" />
                )}
              </button>
            )}
          </div>

          {/* Total Balance Readout */}
          {currentTab !== 'settings' && (
            <div className="text-center mb-2 relative z-10 animate-fade-in">
              <p className="opacity-75 text-[11px] font-semibold uppercase tracking-widest mb-0.5">
                {currentTab === 'planning' ? 'Planning Net Worth' : 'Total Balance'}
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight font-sans">
                {formatCurrency(balance, activeWallet.currency)}
              </h1>
            </div>
          )}

          {/* Income & Expenses Sub-Header Pill */}
          {currentTab === 'transactions' && (
            <div className="flex justify-between items-center bg-white/10 rounded-2xl p-3.5 mt-4 backdrop-blur-md border border-white/10 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-semibold uppercase">Income</p>
                  <p className="font-bold text-sm text-emerald-400">{formatCurrency(totalIncome, activeWallet.currency)}</p>
                </div>
              </div>

              <div className="w-px h-6 bg-white/20" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white/70 text-[10px] font-semibold uppercase">Expenses</p>
                  <p className="font-bold text-sm text-white">{formatCurrency(totalExpense, activeWallet.currency)}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Month Selector Bar */}
        {currentTab !== 'settings' && (
          <div className="flex items-center justify-between px-6 py-3 bg-black border-b border-gray-800/60 flex-shrink-0 z-0 text-xs">
            <button 
              onClick={() => { vibrate(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); }} 
              className="p-1 hover:bg-gray-800 rounded-full transition-colors active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="font-bold text-gray-300">
              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
            </span>
            <button 
              onClick={() => { vibrate(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); }} 
              className="p-1 hover:bg-gray-800 rounded-full transition-colors active:scale-90"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Tab View Body */}
        <div className="flex-1 overflow-y-auto pb-32 relative z-0">
          {currentTab === 'transactions' && (
            <RecordsView onOpenAdd={() => setIsAddTxOpen(true)} />
          )}
          {currentTab === 'analytics' && (
            <AnalyticsView />
          )}
          {currentTab === 'planning' && (
            <PlanningView 
              onAddBudget={() => { vibrate(); setIsAddBudgetOpen(true); }}
              onAddGoal={() => { vibrate(); setIsAddGoalOpen(true); }}
              onFundGoal={(g) => { vibrate(); setFundingGoal(g); }}
            />
          )}
          {currentTab === 'settings' && (
            <SettingsView 
              onAddWallet={() => { vibrate(); setIsAddWalletOpen(true); }}
              onEnableSecurity={() => { vibrate(); setIsPinSetupOpen(true); }}
            />
          )}
        </div>

        {/* Floating Liquid Glass Island Navigation Bar */}
        <FloatingLiquidNavbar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenAddTx={() => setIsAddTxOpen(true)}
          hasNotifications={bills.length > 0}
        />

        {/* Modal Sheets */}
        <AddTransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
        <AddWalletModal isOpen={isAddWalletOpen} onClose={() => setIsAddWalletOpen(false)} />
        <AddBudgetModal isOpen={isAddBudgetOpen} onClose={() => setIsAddBudgetOpen(false)} />
        <AddGoalModal isOpen={isAddGoalOpen} onClose={() => setIsAddGoalOpen(false)} />
        <FundGoalModal goal={fundingGoal} onClose={() => setFundingGoal(null)} />
        <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onAddBill={() => setIsAddBillOpen(true)} />
        <AddBillModal isOpen={isAddBillOpen} onClose={() => setIsAddBillOpen(false)} />
        <PinSetupModal 
          isOpen={isPinSetupOpen} 
          onClose={() => setIsPinSetupOpen(false)} 
          onSave={(pin) => { 
            updatePreference('securityPin', pin); 
            updatePreference('faceId', true); 
            setIsPinSetupOpen(false); 
          }} 
        />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <FinancialProvider>
      <MainAppContent />
    </FinancialProvider>
  );
}
