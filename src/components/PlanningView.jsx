import React, { useState, useMemo } from 'react';
import { useFinancials, CATEGORIES, EX_RATES, formatCurrency, vibrate } from '../context/FinancialContext';
import { Target, Trophy, Plus, HelpCircle, Coffee, Car, ShoppingBag, Film, FileText, Home, Heart, Book, Repeat, Zap, DollarSign, Landmark } from 'lucide-react';

const ICON_MAP = {
  food: Coffee,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Film,
  bills: FileText,
  home: Home,
  health: Heart,
  education: Book,
  subscriptions: Repeat,
  utilities: Zap,
  salary: DollarSign,
  gifts: DollarSign,
  investment: Landmark
};

export const PlanningView = ({ onAddBudget, onAddGoal, onFundGoal }) => {
  const [mode, setMode] = useState('budgets');
  const { monthTransactions, budgets, goals, activeWallet, wallets, activeWalletId } = useFinancials();

  const budgetStats = useMemo(() => {
    const baseRate = EX_RATES[activeWallet.currency] || 1;
    return budgets.map(budget => {
      const spent = monthTransactions
        .filter(t => t.categoryId === budget.categoryId && t.type === 'expense' && (t.walletId === budget.walletId || budget.walletId === 'all'))
        .reduce((sum, t) => {
          let amount = t.amount || 0;
          if (activeWalletId === 'all') {
            const w = wallets.find(w => w.id === t.walletId);
            amount = (amount * (EX_RATES[w?.currency] || 1)) / baseRate;
          }
          return sum + amount;
        }, 0);

      const safeLimit = budget.limit || 1;
      const percentage = Math.min((spent / safeLimit) * 100, 100) || 0;
      const categoryData = CATEGORIES[budget.categoryId] || { name: 'Unknown', bg: 'bg-gray-500' };

      return {
        ...budget,
        spent,
        percentage,
        category: categoryData,
        statusColor: percentage >= 100 ? 'bg-rose-500' : percentage > 80 ? 'bg-orange-500' : 'bg-emerald-500'
      };
    });
  }, [monthTransactions, budgets, activeWallet.currency, wallets, activeWalletId]);

  return (
    <div className="px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Mode Switcher Tabs */}
      <div className="flex bg-[#1C1C1E] p-1 rounded-xl shadow-inner border border-gray-800/40">
        <button 
          onClick={() => { vibrate(); setMode('budgets'); }} 
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'budgets' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400'
          }`}
        >
          Category Budgets
        </button>
        <button 
          onClick={() => { vibrate(); setMode('goals'); }} 
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'goals' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400'
          }`}
        >
          Savings Jars
        </button>
      </div>

      {/* Budgets Tab */}
      {mode === 'budgets' && (
        <div className="space-y-4">
          {budgetStats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5 pt-12 px-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ring-8 ring-indigo-500/20">
                <Target className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1.5">Control your spending</h3>
                <p className="text-sm font-medium text-gray-400">Set monthly limit targets on categories so you never overspend again.</p>
              </div>
              <button 
                onClick={() => { vibrate(); onAddBudget(); }} 
                className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                Create Budget
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-2 mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Budgets</h3>
                <button onClick={onAddBudget} className="text-xs font-bold text-emerald-400 flex items-center gap-1 active:scale-95">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {budgetStats.map((b, i) => {
                const CatIcon = ICON_MAP[b.categoryId] || Target;
                return (
                  <div key={i} className="bg-[#1C1C1E] p-5 rounded-3xl shadow-sm border border-gray-800/60 relative overflow-hidden">
                    {b.percentage >= 100 && <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>}
                    
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${b.category.bg}`}>
                          <CatIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-[15px]">{b.category.name}</h3>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Monthly Target Limit</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-bold text-lg ${b.percentage >= 100 ? 'text-rose-500' : 'text-white'}`}>
                          {formatCurrency(b.spent, activeWallet.currency)}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">of {formatCurrency(b.limit, activeWallet.currency)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold px-1 uppercase tracking-wider">
                        <span className="text-gray-400">{b.percentage.toFixed(0)}% Spent</span>
                        <span className={b.percentage >= 100 ? 'text-rose-500' : 'text-emerald-400'}>
                          {b.percentage >= 100 ? 'Over Limit' : `${formatCurrency(b.limit - b.spent, activeWallet.currency)} Left`}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full rounded-full ${b.statusColor} transition-all duration-700 ease-out`} style={{ width: `${b.percentage || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Savings Jars Tab */}
      {mode === 'goals' && (
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5 pt-12 px-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg ring-8 ring-amber-500/20">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1.5">Dream Big!</h3>
                <p className="text-sm font-medium text-gray-400">Set up a savings jar for that new laptop, vacation, or emergency fund.</p>
              </div>
              <button 
                onClick={() => { vibrate(); onAddGoal(); }} 
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                Create Jar
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-2 mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Savings Jars</h3>
                <button onClick={onAddGoal} className="text-xs font-bold text-emerald-400 flex items-center gap-1 active:scale-95">
                  <Plus className="w-3.5 h-3.5" /> Create
                </button>
              </div>

              {goals.map((g, i) => {
                const safeTarget = g.targetAmount || 1;
                const percentage = Math.min((g.currentAmount / safeTarget) * 100, 100) || 0;
                return (
                  <div key={i} className="bg-[#1C1C1E] p-5 rounded-3xl shadow-sm border border-gray-800/60">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl bg-gray-800 w-12 h-12 rounded-2xl flex items-center justify-center">
                          {g.icon || '🎯'}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-[15px]">{g.name}</h3>
                        </div>
                      </div>

                      <button 
                        onClick={() => onFundGoal(g)} 
                        className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full hover:bg-emerald-500/30 transition-colors active:scale-95"
                      >
                        Add Funds
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold px-1 uppercase tracking-wider">
                        <span className="text-emerald-400">{formatCurrency(g.currentAmount, activeWallet.currency)}</span>
                        <span className="text-gray-400">{formatCurrency(g.targetAmount, activeWallet.currency)}</span>
                      </div>
                      <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${g.color || 'from-emerald-400 to-teal-500'} transition-all duration-700 ease-out relative`} 
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          {percentage >= 100 && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                        </div>
                      </div>
                      {percentage >= 100 && (
                        <p className="text-xs text-center text-emerald-400 font-bold pt-2 animate-bounce">Goal Reached! 🎉</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

    </div>
  );
};
