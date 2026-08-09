import React, { useMemo } from 'react';
import { useFinancials, CATEGORIES, EX_RATES, formatCurrency } from '../context/FinancialContext';
import { 
  PieChart, Coffee, Car, ShoppingBag, Film, FileText, Home, Heart, Book, 
  Repeat, Zap, DollarSign, Landmark, HelpCircle 
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

export const AnalyticsView = () => {
  const { monthTransactions, totalExpense, activeWallet, wallets, activeWalletId } = useFinancials();

  const analyticsData = useMemo(() => {
    const expenses = monthTransactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    const baseRate = EX_RATES[activeWallet.currency] || 1;

    expenses.forEach(t => { 
      if (!categoryTotals[t.categoryId]) categoryTotals[t.categoryId] = 0; 
      let amount = t.amount || 0;
      if (activeWalletId === 'all') {
        const w = wallets.find(w => w.id === t.walletId);
        amount = (amount * (EX_RATES[w?.currency] || 1)) / baseRate;
      }
      categoryTotals[t.categoryId] += amount; 
    });

    return Object.keys(categoryTotals).map(catId => {
      const amount = categoryTotals[catId];
      const categoryData = CATEGORIES[catId] || { name: 'Other', bg: 'bg-gray-500', color: '#6b7280' };
      return { 
        ...categoryData, 
        catId,
        amount, 
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0 
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, totalExpense, activeWallet.currency, wallets, activeWalletId]);

  if (analyticsData.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20 px-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 shadow-md">
          <PieChart className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-white">No Data to Analyze</h3>
        <p className="text-xs text-gray-400 max-w-xs">Keep logging your expenses to unlock beautiful category spending insights.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-8 animate-fade-in">
      
      {/* SVG Donut Chart Card */}
      <div className="bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-gray-800/60 flex flex-col items-center justify-center h-64 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Expenses</span>
          <span className="text-3xl font-extrabold text-white">{formatCurrency(totalExpense, activeWallet.currency)}</span>
        </div>

        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90 drop-shadow-md">
          <circle cx="100" cy="100" r="80" fill="transparent" stroke="#2C2C2E" strokeWidth="18" />
          {(() => {
            let currentOffset = 0;
            const circumference = 2 * Math.PI * 80;
            return analyticsData.map((data, i) => {
              const safePercent = data.percentage || 0;
              const segmentLength = (safePercent / 100) * circumference;
              const gap = analyticsData.length > 1 && safePercent < 100 ? 6 : 0;
              const activeLength = Math.max(0, segmentLength - gap) || 0;
              const offsetToApply = currentOffset;
              currentOffset += segmentLength;

              return (
                <circle 
                  key={i} 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="transparent" 
                  stroke={data.color || '#10b981'} 
                  strokeWidth="18" 
                  strokeDasharray={`${activeLength} ${circumference}`} 
                  strokeDashoffset={0} 
                  strokeLinecap="round" 
                  transform={`rotate(${(offsetToApply / circumference) * 360} 100 100)`} 
                  className="transition-all duration-1000 ease-out" 
                />
              );
            });
          })()}
        </svg>
      </div>

      {/* Top Spending Breakdown List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Top Spending Categories</h3>
        <div className="bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-800/60 overflow-hidden divide-y divide-gray-800/40">
          {analyticsData.map((data, i) => {
            const IconComponent = ICON_MAP[data.catId] || HelpCircle;
            return (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${data.bg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="font-semibold text-white text-[15px] truncate">{data.name}</span>
                    <span className="font-semibold text-white">{formatCurrency(data.amount, activeWallet.currency)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${data.bg}`} style={{ width: `${data.percentage || 0}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
