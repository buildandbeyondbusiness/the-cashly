import React, { useState, useMemo } from 'react';
import { useFinancials, CATEGORIES, EX_RATES, formatCurrency, vibrate } from '../context/FinancialContext';
import confetti from 'canvas-confetti';
import { 
  Target, Trophy, Plus, Coffee, Car, ShoppingBag, Film, FileText, Home, 
  Heart, Book, Repeat, Zap, DollarSign, Landmark, Sparkles, TrendingUp, 
  AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Droplet
} from 'lucide-react';

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
  const [mode, setMode] = useState('goals'); // 'goals' | 'budgets'
  const { monthTransactions, budgets, goals, fundGoal, activeWallet, wallets, activeWalletId } = useFinancials();

  // Calculate real-time budget spending per category
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
      const categoryData = CATEGORIES[budget.categoryId] || { name: 'General', bg: 'bg-emerald-500' };

      return {
        ...budget,
        spent,
        percentage,
        category: categoryData,
        isOver: spent > safeLimit,
        leftAmount: Math.max(0, safeLimit - spent)
      };
    });
  }, [monthTransactions, budgets, activeWallet.currency, wallets, activeWalletId]);

  const handleQuickDeposit = (goal, addAmt) => {
    vibrate();
    fundGoal(goal.id, goal.currentAmount + addAmt);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in">
      
      {/* Liquid Glass Segment Switcher */}
      <div className="p-1 rounded-2xl liquid-glass flex items-center relative">
        <button
          onClick={() => { vibrate(); setMode('goals'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
            mode === 'goals'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Liquid Savings Jars</span>
        </button>

        <button
          onClick={() => { vibrate(); setMode('budgets'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
            mode === 'budgets'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Category Budgets</span>
        </button>
      </div>

      {/* Mode 1: Liquid Savings Jars */}
      {mode === 'goals' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">Savings Jars</h3>
              <p className="text-[11px] text-gray-400">Watch your liquid wealth grow in real-time</p>
            </div>
            <button
              onClick={() => { vibrate(); onAddGoal(); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Jar</span>
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="p-8 text-center rounded-3xl liquid-card border border-dashed border-gray-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-white">No Savings Jars Created</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Set a goal for a new MacBook, vacation trip, or emergency buffer and fund it incrementally.
                </p>
              </div>
              <button
                onClick={() => { vibrate(); onAddGoal(); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-transform"
              >
                Create First Savings Jar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {goals.map((g) => {
                const target = g.targetAmount || 1;
                const percent = Math.min(100, Math.round((g.currentAmount / target) * 100));
                const isComplete = percent >= 100;

                return (
                  <div
                    key={g.id}
                    className="relative overflow-hidden rounded-3xl liquid-card p-5 border border-white/10 space-y-4 group hover:border-emerald-500/40 transition-all duration-300"
                  >
                    {/* Animated Background Liquid Fill Wave Indicator */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600/25 via-emerald-500/15 to-transparent transition-all duration-1000 ease-out pointer-events-none"
                      style={{ height: `${percent}%` }}
                    />

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/10">
                          {g.icon || '🎯'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-base leading-tight">
                            {g.name}
                          </h4>
                          <span className="text-[11px] font-semibold text-emerald-400">
                            {percent}% Funded
                          </span>
                        </div>
                      </div>

                      {/* Percent Pill */}
                      <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                        {formatCurrency(g.currentAmount, activeWallet.currency)} / {formatCurrency(g.targetAmount, activeWallet.currency)}
                      </div>
                    </div>

                    {/* Liquid Animated Fill Meter */}
                    <div className="relative z-10 space-y-1.5">
                      <div className="w-full h-3 rounded-full bg-gray-900/80 overflow-hidden p-0.5 border border-white/10">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                          style={{ width: `${Math.max(4, percent)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] font-semibold text-gray-400 px-1">
                        <span>{formatCurrency(g.currentAmount, activeWallet.currency)} saved</span>
                        <span>{isComplete ? 'Goal Reached! 🎉' : `${formatCurrency(Math.max(0, target - g.currentAmount), activeWallet.currency)} left`}</span>
                      </div>
                    </div>

                    {/* Quick Preset Deposit Buttons */}
                    <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Quick Add:</span>
                        {[10, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => handleQuickDeposit(g, amt)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/30 text-white font-bold text-[11px] backdrop-blur-md border border-white/10 transition-all active:scale-95"
                          >
                            +${amt}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => { vibrate(); onFundGoal(g); }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                        Custom Deposit
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Mode 2: Category Monthly Budgets */}
      {mode === 'budgets' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">Category Monthly Budgets</h3>
              <p className="text-[11px] text-gray-400">Keep spending bounded with smart limit tracking</p>
            </div>
            <button
              onClick={() => { vibrate(); onAddBudget(); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Limit</span>
            </button>
          </div>

          {budgetStats.length === 0 ? (
            <div className="p-8 text-center rounded-3xl liquid-card border border-dashed border-gray-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Target className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-white">No Monthly Budgets Configured</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Set spending caps on Food, Shopping, or Subscriptions to receive early limit notifications.
                </p>
              </div>
              <button
                onClick={() => { vibrate(); onAddBudget(); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-transform"
              >
                Set First Category Budget
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {budgetStats.map((b, idx) => {
                const CatIcon = ICON_MAP[b.categoryId] || Target;

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl liquid-card border border-white/10 space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md ${b.category.bg}`}>
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-base">
                            {b.category.name}
                          </h4>
                          <span className={`text-[11px] font-bold ${
                            b.isOver ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {b.isOver ? 'Over Limit!' : `${formatCurrency(b.leftAmount, activeWallet.currency)} remaining`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-extrabold text-white block">
                          {formatCurrency(b.spent, activeWallet.currency)}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">
                          of {formatCurrency(b.limit, activeWallet.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Fill Meter */}
                    <div className="space-y-1.5">
                      <div className="w-full h-3 rounded-full bg-gray-900/80 overflow-hidden p-0.5 border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            b.isOver 
                              ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_10px_rgba(244,63,94,0.6)]' 
                              : (b.percentage > 80 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                  : 'bg-gradient-to-r from-emerald-400 to-teal-400')
                          }`}
                          style={{ width: `${Math.min(100, b.percentage)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] font-bold text-gray-400 px-1">
                        <span>{b.percentage.toFixed(0)}% Used</span>
                        <span className={b.isOver ? 'text-rose-400' : 'text-emerald-400'}>
                          {b.isOver ? 'Budget Exceeded' : 'On Track'}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
