import React, { useState } from 'react';
import { FinancialProvider, useFinancials, formatCurrency, vibrate } from './context/FinancialContext';
import { LockScreen } from './components/LockScreen';
import { RecordsView } from './components/RecordsView';
import { AnalyticsView } from './components/AnalyticsView';
import { PlanningView } from './components/PlanningView';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddWalletModal } from './components/AddWalletModal';
import { AddBudgetModal } from './components/AddBudgetModal';
import { AddGoalModal } from './components/AddGoalModal';
import { FundGoalModal } from './components/FundGoalModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AddBillModal } from './components/AddBillModal';
import { PinSetupModal } from './components/PinSetupModal';

import { 
  List, PieChart, Target, Settings, Plus, RefreshCw, Wallet, 
  Bell, ChevronLeft, ChevronRight, TrendingUp, TrendingDown 
} from 'lucide-react';

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center gap-1 min-w-[4rem] transition-colors relative z-10 ${
        active ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <Icon className={`w-6 h-6 transition-transform duration-300 ${active ? '-translate-y-1 scale-110' : ''}`} />
      <span className={`text-[10px] font-bold tracking-wide transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
      {active && <span className="absolute -bottom-1.5 w-1 h-1 bg-emerald-500 rounded-full" />}
    </button>
  );
}

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
    if (currentTab === 'planning') return 'bg-gradient-to-br from-indigo-900 to-purple-950 text-white';
    return 'bg-gradient-to-br from-emerald-800 via-teal-900 to-black text-white';
  };

  return (
    <div className="w-full h-full bg-black sm:p-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-[100dvh] sm:h-[100vh] sm:max-h-[850px] sm:rounded-[40px] sm:border-[8px] border-gray-800 bg-black overflow-hidden relative flex flex-col shadow-2xl transition-colors">
        
        {/* Apple Top Hero Header Banner */}
        <div className={`${getHeaderStyle()} pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-sm z-10 flex-shrink-0 transition-colors duration-500 relative overflow-hidden`}>
          
          <div className="flex justify-between items-center mb-5 relative z-10">
            {/* Cycle Wallet Button */}
            <div 
              onClick={currentTab !== 'settings' ? cycleWallet : undefined}
              className={`flex items-center gap-2 py-1.5 px-3.5 rounded-full transition-all ${
                currentTab !== 'settings' ? 'bg-white/15 hover:bg-white/25 cursor-pointer backdrop-blur-md active:scale-95' : 'bg-transparent'
              }`}
            >
              {currentTab !== 'settings' ? <RefreshCw className="w-4 h-4 text-emerald-300" /> : <Wallet className="w-4 h-4 text-gray-400" />}
              <span className="font-semibold text-xs tracking-wide truncate max-w-[130px]">
                {currentTab === 'settings' ? 'Settings' : activeWallet.name}
              </span>
            </div>

            {/* Notification Bell */}
            {currentTab !== 'settings' && (
              <button 
                onClick={() => { vibrate(); setIsNotifOpen(true); }} 
                className="p-2 hover:bg-white/15 rounded-full transition-colors relative active:scale-90"
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
            <div className="text-center mb-3 relative z-10 animate-fade-in">
              <p className="opacity-75 text-xs font-medium uppercase tracking-wider mb-1">
                {currentTab === 'planning' ? 'Planning Net Worth' : 'Total Balance'}
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight font-sans">
                {formatCurrency(balance, activeWallet.currency)}
              </h1>
            </div>
          )}

          {/* Income & Expenses Sub-Header Pill */}
          {currentTab === 'transactions' && (
            <div className="flex justify-between items-center bg-white/10 rounded-2xl p-3.5 mt-5 backdrop-blur-md border border-white/10 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner text-emerald-300">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-semibold uppercase">Income</p>
                  <p className="font-bold text-sm text-emerald-400">{formatCurrency(totalIncome, activeWallet.currency)}</p>
                </div>
              </div>

              <div className="w-px h-7 bg-white/20" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white/70 text-[10px] font-semibold uppercase">Expenses</p>
                  <p className="font-bold text-sm text-white">{formatCurrency(totalExpense, activeWallet.currency)}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner text-rose-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Month Selector Bar */}
        {currentTab !== 'settings' && (
          <div className="flex items-center justify-between px-6 py-3.5 bg-black border-b border-gray-800/80 flex-shrink-0 z-0 text-xs">
            <button 
              onClick={() => { vibrate(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); }} 
              className="p-1.5 hover:bg-gray-800 rounded-full transition-colors active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="font-bold text-gray-300">
              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
            </span>
            <button 
              onClick={() => { vibrate(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); }} 
              className="p-1.5 hover:bg-gray-800 rounded-full transition-colors active:scale-90"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Tab View Body */}
        <div className="flex-1 overflow-y-auto pb-28 relative z-0">
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

        {/* Apple Native Glassmorphic Bottom Navigation Bar */}
        <div className="absolute bottom-0 w-full glass-bottom-bar pb-safe px-6 h-24 flex items-center justify-between z-20">
          <NavItem 
            icon={List} 
            label="Records" 
            active={currentTab === 'transactions'} 
            onClick={() => { vibrate(); setCurrentTab('transactions'); }} 
          />
          <NavItem 
            icon={PieChart} 
            label="Analytics" 
            active={currentTab === 'analytics'} 
            onClick={() => { vibrate(); setCurrentTab('analytics'); }} 
          />
          
          <div className="w-16" />

          <NavItem 
            icon={Target} 
            label="Planning" 
            active={currentTab === 'planning'} 
            onClick={() => { vibrate(); setCurrentTab('planning'); }} 
          />
          <NavItem 
            icon={Settings} 
            label="Settings" 
            active={currentTab === 'settings'} 
            onClick={() => { vibrate(); setCurrentTab('settings'); }} 
          />

          {/* Elevated Floating Center FAB (+) */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30">
            <div className="w-[72px] h-[72px] rounded-full bg-emerald-500/20 p-2 flex items-center justify-center backdrop-blur-xl">
              <button 
                onClick={() => { vibrate(); setIsAddTxOpen(true); }} 
                className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(16,185,129,0.5)] active:scale-90 transition-transform"
              >
                <Plus className="w-8 h-8 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

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
