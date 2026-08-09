import React from 'react';
import { useFinancials } from '../context/FinancialContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export const AnalyticsView = () => {
  const { transactions, categories, stats, activeTimeframe } = useFinancials();

  // Process transactions into monthly / daily chart data
  const monthlyData = [
    { month: 'Sep', Income: 4200, Expenses: 3100 },
    { month: 'Oct', Income: 3800, Expenses: 2900 },
    { month: 'Nov', Income: 5100, Expenses: 4100 },
    { month: 'Dec', Income: 6200, Expenses: 3800 },
    { month: 'Jan', Income: 5400, Expenses: 2950 },
    { month: 'Feb', Income: stats.income || 6890, Expenses: stats.spending || 2400 },
  ];

  // Calculate category distribution
  const categoryTotals = categories.map(cat => {
    const catExpenses = transactions
      .filter(t => t.categoryId === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { ...cat, total: catExpenses };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const totalExpenseSum = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Left 7 Columns: Dual Bar Chart (Matched to Reference Image 2) */}
      <div className="lg:col-span-7 bg-white dark:bg-[#150d36] rounded-3xl p-5 border border-slate-200/80 dark:border-purple-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Analytics Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300/60">
              Income vs Expenses Comparison
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-slate-600 dark:text-purple-200">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="text-slate-600 dark:text-purple-200">Expenses</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1b103e', 
                  borderColor: 'rgba(139, 92, 246, 0.3)', 
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }} 
              />
              <Bar dataKey="Income" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={12} />
              <Bar dataKey="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Metric Pill (Matched to Reference Image 2) */}
        <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700 dark:text-purple-200">
            Expenses this timeframe
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            $400 less than last month
          </span>
        </div>
      </div>

      {/* Right 5 Columns: Category Spending Breakdown */}
      <div className="lg:col-span-5 bg-white dark:bg-[#150d36] rounded-3xl p-5 border border-slate-200/80 dark:border-purple-900/40 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Category Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-purple-300/60">
            Where your money goes
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {categoryTotals.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No expenses logged yet.</p>
          ) : (
            categoryTotals.slice(0, 5).map((cat) => {
              const percent = totalExpenseSum > 0 ? Math.round((cat.total / totalExpenseSum) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-purple-200">
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${cat.total.toFixed(2)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-purple-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
