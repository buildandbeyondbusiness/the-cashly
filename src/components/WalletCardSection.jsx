import React from 'react';
import { useFinancials } from '../context/FinancialContext';
import { CreditCard, Wallet, Edit3, Plus, Wifi, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const WalletCardSection = ({ onEditBalance, onOpenAddWallet }) => {
  const { 
    wallets, 
    totalBalance, 
    activeWalletId, 
    setActiveWalletId, 
    stats,
    activeTimeframe
  } = useFinancials();

  return (
    <section className="space-y-4">
      {/* Top Header & Total Income Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Total Balance & Accounts
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              +12.4% this {activeTimeframe}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <span className="text-sm font-medium text-slate-500 dark:text-purple-300/60">
              Net Worth
            </span>
          </div>
        </div>

        {/* Filter Wallets Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveWalletId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeWalletId === 'all'
                ? 'bg-purple-600 text-white shadow-purple-glow'
                : 'bg-white dark:bg-[#1c123f] text-slate-600 dark:text-purple-200 border border-slate-200 dark:border-purple-900/40 hover:bg-slate-50 dark:hover:bg-purple-900/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            All Accounts ({wallets.length})
          </button>
          {wallets.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWalletId(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeWalletId === w.id
                  ? 'bg-purple-600 text-white shadow-purple-glow'
                  : 'bg-white dark:bg-[#1c123f] text-slate-600 dark:text-purple-200 border border-slate-200 dark:border-purple-900/40 hover:bg-slate-50 dark:hover:bg-purple-900/40'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Cards Grid / Scrollable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            onClick={() => setActiveWalletId(wallet.id)}
            className={`relative group overflow-hidden rounded-3xl p-5 text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
              wallet.id === 'w-1' 
                ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 border border-purple-500/30' 
                : (wallet.id === 'w-2' 
                    ? 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 border border-emerald-500/30'
                    : 'bg-gradient-to-br from-amber-700 via-orange-900 to-slate-950 border border-amber-500/30')
            } ${activeWalletId === wallet.id ? 'ring-2 ring-purple-400 dark:ring-purple-400 scale-[1.02]' : 'opacity-90 hover:opacity-100'}`}
          >
            {/* Background Decorative Abstract Circles (Reference Image 2 styling) */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"></div>

            <div className="relative z-10 flex flex-col justify-between h-36">
              
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                    {wallet.type === 'card' ? (
                      <CreditCard className="w-4 h-4 text-purple-200" />
                    ) : (
                      <Wallet className="w-4 h-4 text-emerald-200" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide text-white">
                      {wallet.name}
                    </h3>
                    <p className="text-[11px] text-purple-200/70 font-mono">
                      {wallet.accountNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-white/50 rotate-90" />
                  <span className="text-xs font-black tracking-widest text-white/80 font-mono">
                    VISA
                  </span>
                </div>
              </div>

              {/* Card Balance Readout */}
              <div className="my-auto">
                <span className="text-[11px] text-white/60 font-medium">Balance</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold tracking-tight text-white">
                    ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions (Direct Edit Balance!) */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] font-medium text-white/70">
                  {wallet.isPrimary ? 'Primary Wallet' : 'Secondary Wallet'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditBalance(wallet);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold backdrop-blur-md transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Balance
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
