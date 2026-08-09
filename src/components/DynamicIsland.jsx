import React, { useState, useEffect } from 'react';
import { useFinancials, formatCurrency, vibrate } from '../context/FinancialContext';
import { Sparkles, TrendingUp, TrendingDown, Wallet, Zap, CheckCircle2 } from 'lucide-react';

export const DynamicIsland = ({ onOpenQuickLog }) => {
  const { totalBalance, stats, activeWallet, monthTransactions } = useFinancials();
  const [isExpanded, setIsExpanded] = useState(false);
  const [eventNotification, setEventNotification] = useState(null);

  // Monitor latest transaction for live Dynamic Island expansion animation!
  useEffect(() => {
    if (monthTransactions.length > 0) {
      const latest = monthTransactions[0];
      // Trigger dynamic island pop animation on new transaction entry
      const txTime = new Date(latest.date).getTime();
      if (Date.now() - txTime < 5000) {
        setEventNotification(latest);
        const timer = setTimeout(() => {
          setEventNotification(null);
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [monthTransactions]);

  const toggleExpand = () => {
    vibrate();
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="absolute top-[11px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      
      {/* 1. Live Event Notification State (Morphing Banner) */}
      {eventNotification ? (
        <div 
          onClick={toggleExpand}
          className="w-[335px] h-[72px] rounded-[32px] bg-black border border-emerald-500/40 text-white shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-between px-4 cursor-pointer animate-spring-up transition-all duration-500 ease-out backdrop-blur-3xl ring-2 ring-emerald-500/30"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              eventNotification.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <CheckCircle2 className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white line-clamp-1">
                {eventNotification.title || 'Transaction Logged'}
              </p>
              <p className="text-[10px] font-semibold text-gray-400">
                {eventNotification.type === 'income' ? 'Income Added' : 'Expense Recorded'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-base font-extrabold font-mono ${
              eventNotification.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {eventNotification.type === 'income' ? '+' : '-'}{formatCurrency(eventNotification.amount, activeWallet.currency)}
            </span>
          </div>
        </div>
      ) : isExpanded ? (
        
        /* 2. Expanded Interactive Dynamic Island HUD */
        <div 
          onClick={toggleExpand}
          className="w-[330px] h-[74px] rounded-[34px] bg-black border border-white/20 text-white shadow-[0_12px_35px_rgba(0,0,0,0.95)] flex items-center justify-between px-4 cursor-pointer transition-all duration-400 ease-out backdrop-blur-3xl ring-1 ring-white/10"
        >
          {/* Active Wallet */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Wallet</p>
              <p className="text-xs font-extrabold text-white truncate max-w-[90px]">{activeWallet.name}</p>
            </div>
          </div>

          <div className="w-px h-7 bg-white/15" />

          {/* Quick Balance Readout */}
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Worth</p>
            <p className="text-xs font-extrabold text-emerald-400 font-mono">
              {formatCurrency(totalBalance, activeWallet.currency)}
            </p>
          </div>

          <div className="w-px h-7 bg-white/15" />

          {/* Quick Log Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              vibrate();
              setIsExpanded(false);
              onOpenQuickLog();
            }}
            className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-90 transition-transform"
            title="Instant Quick Log"
          >
            <Zap className="w-4 h-4 fill-white" />
          </button>
        </div>

      ) : (

        /* 3. Pixel-Precise Idle Dynamic Island Cutout (iPhone 14/15/16/17 Specs: 124px x 35px) */
        <div 
          onClick={toggleExpand}
          className="w-[124px] h-[35px] rounded-[20px] bg-black border border-white/10 shadow-lg flex items-center justify-between px-3 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-out group"
          title="Tap to Expand Dynamic Island"
        >
          {/* Left Indicator Dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />

          {/* Center Brand / Pulse Status */}
          <span className="text-[10px] font-extrabold text-white tracking-widest uppercase font-mono group-hover:text-emerald-400 transition-colors">
            CASHLY
          </span>

          {/* Right Camera Lens Cutout Sim */}
          <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-white/20" />
        </div>

      )}

    </div>
  );
};
