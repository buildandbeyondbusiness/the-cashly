import React from 'react';
import { useFinancials } from '../context/FinancialContext';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  Sparkles,
  Zap,
  CreditCard
} from 'lucide-react';

export const OverviewSection = () => {
  const { 
    upcomingBills, 
    stats, 
    dailyLimit, 
    setDailyLimit, 
    activeTimeframe,
    transactions
  } = useFinancials();

  // Calculate today's spending for the daily limit indicator
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySpending = transactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const dailyProgressPercent = Math.min(100, Math.round((todaySpending / dailyLimit) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Left 7 Columns: Upcoming Bills Horizontal Carousel & Daily Limits */}
      <div className="lg:col-span-7 space-y-5">
        
        {/* Upcoming Bills Carousel Header */}
        <div className="bg-white dark:bg-[#150d36] rounded-3xl p-5 border border-slate-200/80 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Upcoming Bills
                </h3>
                <p className="text-xs text-slate-500 dark:text-purple-300/60">
                  Scheduled auto-deductions
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              {upcomingBills.length} Active
            </span>
          </div>

          {/* Cards Carousel (Matching Reference Image 1) */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className={`min-w-[210px] sm:min-w-[230px] p-4 rounded-2xl bg-gradient-to-br ${bill.gradient} text-white shadow-md flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02] transition-transform`}
              >
                {/* Date Header Badge */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                  <span>{bill.dueDate}</span>
                  <span className="p-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <CreditCard className="w-3 h-3 text-white" />
                  </span>
                </div>

                {/* Card Title & Amount */}
                <div className="mt-2">
                  <p className="text-xs font-medium text-white/80 line-clamp-1">{bill.title}</p>
                  <h4 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    ${bill.amount.toFixed(2)}
                  </h4>
                </div>

                {/* Card Footer Button */}
                <div className="flex items-center justify-between pt-2 border-t border-white/15">
                  <span className="text-[10px] font-medium text-white/70">{bill.category}</span>
                  <div className="w-7 h-7 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Limit Tracker (Matched to Reference Image 1) */}
        <div className="bg-white dark:bg-[#150d36] rounded-3xl p-5 border border-slate-200/80 dark:border-purple-900/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-purple-glow">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Daily Limit Tracker
                </h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  Today
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-purple-300/60">
                ${todaySpending.toFixed(2)} spent of ${dailyLimit} limit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 dark:border-purple-900/30 pt-3 sm:pt-0">
            {/* Progress Bar Meter */}
            <div className="w-32 sm:w-40 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-600 dark:text-purple-300">{dailyProgressPercent}%</span>
                <span className={dailyProgressPercent > 90 ? 'text-rose-500' : 'text-emerald-500'}>
                  {dailyProgressPercent > 100 ? 'Over limit' : `${100 - dailyProgressPercent}% left`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-purple-950 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    dailyProgressPercent > 90 
                      ? 'bg-gradient-to-r from-rose-500 to-red-600' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, dailyProgressPercent)}%` }}
                ></div>
              </div>
            </div>

            {/* Change Limit Button */}
            <button
              onClick={() => {
                const val = prompt('Set new daily limit ($):', dailyLimit);
                if (val && !isNaN(parseFloat(val))) {
                  setDailyLimit(parseFloat(val));
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-purple-900/40 hover:bg-slate-200 dark:hover:bg-purple-800/60 text-slate-700 dark:text-purple-200 text-xs font-semibold transition-colors"
            >
              Set Limit
            </button>
          </div>
        </div>

      </div>

      {/* Right 5 Columns: Monthly Stats Card (Matched to Reference Image 1 & 3) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Monthly Stats Hero Card */}
        <div className="bg-gradient-to-br from-[#1b103e] via-[#261556] to-[#0f0724] rounded-3xl p-5 text-white border border-purple-500/20 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Radial gauge representation */}
              <div className="relative w-12 h-12 rounded-full border-4 border-purple-500/30 flex items-center justify-center font-bold text-xs bg-purple-900/40 text-purple-200">
                <span>20%</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Monthly Stats</h4>
                <span className="text-xs font-medium text-emerald-400">
                  +20% better performance
                </span>
              </div>
            </div>

            <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>

          {/* Earning & Spending Pill Grid (Matched to Reference Image 1) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Earning Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-1">
                <ArrowUpRight className="w-4 h-4" />
                <span>Earnings</span>
              </div>
              <p className="text-xl font-extrabold text-emerald-400 tracking-tight">
                ${stats.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Spending Card */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mb-1">
                <ArrowDownRight className="w-4 h-4" />
                <span>Spending</span>
              </div>
              <p className="text-xl font-extrabold text-rose-400 tracking-tight">
                ${stats.spending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
