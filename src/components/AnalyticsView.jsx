import React, { useMemo, useState } from 'react';
import { useFinancials, CATEGORIES, EX_RATES, formatCurrency, vibrate } from '../context/FinancialContext';
import { PieChart as PieIcon, BarChart2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const AnalyticsView = () => {
  const { monthTransactions, wallets, activeWalletId, activeWallet, totalIncome, totalExpense } = useFinancials();
  const [selectedChartType, setSelectedChartType] = useState('overview'); // 'overview' | 'categories' | 'trend'

  // Category breakdown calculation
  const { categoryTotals, grandTotalExpense } = useMemo(() => {
    const totals = {};
    let sum = 0;
    const baseRate = EX_RATES[activeWallet.currency] || 1;

    monthTransactions.forEach(t => {
      if (t.type === 'expense') {
        let amt = Number(t.amount) || 0;
        if (activeWalletId === 'all') {
          const w = wallets.find(w => w.id === t.walletId);
          amt = (amt * (EX_RATES[w?.currency] || 1)) / baseRate;
        }
        totals[t.categoryId] = (totals[t.categoryId] || 0) + amt;
        sum += amt;
      }
    });

    const sorted = Object.entries(totals)
      .map(([catId, amount]) => ({
        catId,
        amount,
        percentage: sum > 0 ? Math.round((amount / sum) * 100) : 0,
        info: CATEGORIES[catId] || { name: 'Other', bg: 'bg-gray-500', color: '#6b7280' }
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryTotals: sorted, grandTotalExpense: sum };
  }, [monthTransactions, activeWalletId, wallets, activeWallet.currency]);

  // Weekly breakdown for Dual Bar Chart
  const weeklyData = useMemo(() => {
    const weeks = [
      { name: 'W1', income: 0, expense: 0 },
      { name: 'W2', income: 0, expense: 0 },
      { name: 'W3', income: 0, expense: 0 },
      { name: 'W4', income: 0, expense: 0 },
    ];
    const baseRate = EX_RATES[activeWallet.currency] || 1;

    monthTransactions.forEach(t => {
      const day = new Date(t.date).getDate();
      const weekIdx = Math.min(3, Math.floor((day - 1) / 7));
      let amt = Number(t.amount) || 0;
      if (activeWalletId === 'all' && t.type !== 'transfer') {
        const w = wallets.find(w => w.id === t.walletId);
        amt = (amt * (EX_RATES[w?.currency] || 1)) / baseRate;
      }
      if (t.type === 'income') weeks[weekIdx].income += amt;
      if (t.type === 'expense') weeks[weekIdx].expense += amt;
    });

    const maxVal = Math.max(...weeks.flatMap(w => [w.income, w.expense]), 1);
    return { weeks, maxVal };
  }, [monthTransactions, activeWalletId, wallets, activeWallet.currency]);

  // Generate SVG Donut Chart Paths
  const donutSlices = useMemo(() => {
    if (grandTotalExpense === 0 || categoryTotals.length === 0) return [];
    let cumulativePercent = 0;

    return categoryTotals.map(item => {
      const startPercent = cumulativePercent;
      cumulativePercent += item.percentage / 100;
      const endPercent = cumulativePercent;

      const startAngle = startPercent * 2 * Math.PI - Math.PI / 2;
      const endAngle = endPercent * 2 * Math.PI - Math.PI / 2;

      const x1 = 50 + 38 * Math.cos(startAngle);
      const y1 = 50 + 38 * Math.sin(startAngle);
      const x2 = 50 + 38 * Math.cos(endAngle);
      const y2 = 50 + 38 * Math.sin(endAngle);

      const largeArc = item.percentage > 50 ? 1 : 0;
      const pathData = `M 50 50 L ${x1} ${y1} A 38 38 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return { ...item, pathData };
    });
  }, [categoryTotals, grandTotalExpense]);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  return (
    <div className="px-4 py-4 space-y-6 animate-fade-in pb-32 text-white">
      
      {/* 1. Top Segmented Graph Selector */}
      <div className="flex bg-[#1C1C1E] rounded-2xl p-1 border border-gray-800 shadow-inner">
        <button
          onClick={() => { vibrate(); setSelectedChartType('overview'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedChartType === 'overview' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Cash Flow
        </button>
        <button
          onClick={() => { vibrate(); setSelectedChartType('categories'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedChartType === 'categories' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => { vibrate(); setSelectedChartType('trend'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedChartType === 'trend' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Weekly Graph
        </button>
      </div>

      {/* 2. Primary Donut / Category Pie Chart */}
      <div className="bg-[#1C1C1E] rounded-3xl p-6 shadow-xl border border-gray-800/60 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Spending Structure</span>
          </h3>
          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {savingsRate}% Savings Rate
          </span>
        </div>

        {grandTotalExpense === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Layers className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="font-extrabold text-sm text-gray-300">No Expenses Recorded</p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">Add transaction entries to visualize your spending charts.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* SVG Donut Chart with Cutout Center */}
            <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutSlices.map((slice, i) => (
                  <path
                    key={i}
                    d={slice.pathData}
                    fill={slice.info.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </svg>
              
              {/* Center Donut Hole Readout */}
              <div className="absolute w-24 h-24 rounded-full bg-[#1C1C1E] border border-gray-800 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Spent</span>
                <span className="text-xs font-extrabold font-mono text-white text-center px-1">
                  {formatCurrency(grandTotalExpense, activeWallet.currency)}
                </span>
              </div>
            </div>

            {/* Category Percentages Pill Grid */}
            <div className="flex-1 w-full space-y-2.5">
              {categoryTotals.slice(0, 4).map(cat => (
                <div key={cat.catId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.info.color }} />
                    <span className="font-bold text-gray-300 truncate">{cat.info.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-gray-400 font-bold">{cat.percentage}%</span>
                    <span className="font-bold text-white">{formatCurrency(cat.amount, activeWallet.currency)}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* 3. Dual Bar Chart: Weekly Income vs Expenses */}
      <div className="bg-[#1C1C1E] rounded-3xl p-6 shadow-xl border border-gray-800/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Weekly Cash Flow</span>
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-400">Income</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-gray-400">Expense</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 items-end h-36 border-b border-gray-800 pb-3">
          {weeklyData.weeks.map((w, idx) => {
            const incHeight = Math.min(100, Math.round((w.income / weeklyData.maxVal) * 100));
            const expHeight = Math.min(100, Math.round((w.expense / weeklyData.maxVal) * 100));

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center h-24">
                  <div 
                    className="w-3 rounded-t-md bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                    style={{ height: `${Math.max(8, incHeight)}%` }}
                    title={`Income: ${formatCurrency(w.income, activeWallet.currency)}`}
                  />
                  <div 
                    className="w-3 rounded-t-md bg-rose-500 transition-all duration-700 shadow-[0_0_10px_rgba(244,63,94,0.4)]" 
                    style={{ height: `${Math.max(8, expHeight)}%` }}
                    title={`Expense: ${formatCurrency(w.expense, activeWallet.currency)}`}
                  />
                </div>
                <span className="text-xs font-bold text-gray-400">{w.name}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ArrowDownRight className="w-4 h-4" />
            <span>Income: {formatCurrency(totalIncome, activeWallet.currency)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Expense: {formatCurrency(totalExpense, activeWallet.currency)}</span>
          </div>
        </div>
      </div>

      {/* 4. Detailed Category Progress Meters */}
      {categoryTotals.length > 0 && (
        <div className="bg-[#1C1C1E] rounded-3xl p-6 shadow-xl border border-gray-800/60 space-y-4">
          <h3 className="font-extrabold text-white text-base">Top Category Progress</h3>
          
          <div className="space-y-4">
            {categoryTotals.map(cat => (
              <div key={cat.catId} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{cat.info.name}</span>
                  <div className="font-mono text-gray-400">
                    <span className="text-white font-bold">{formatCurrency(cat.amount, activeWallet.currency)}</span>
                    <span className="ml-2 text-emerald-400 font-bold">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-800">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ 
                      width: `${Math.max(4, cat.percentage)}%`,
                      backgroundColor: cat.info.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
