import React, { useRef, useEffect } from 'react';
import { useFinancials, EX_RATES, formatCurrency, vibrate } from '../context/FinancialContext';
import { Wallet, Landmark, CreditCard, Layers, Plus } from 'lucide-react';

export const WalletCarousel = ({ onAddWallet }) => {
  const { 
    wallets, 
    activeWalletId, 
    setActiveWalletId, 
    preferences, 
    transactions 
  } = useFinancials();

  const scrollRef = useRef(null);

  // All cards: Net Worth + Individual Wallets
  const allCards = [
    { id: 'all', name: 'Net Worth', currency: preferences?.baseCurrency || 'USD', isNetWorth: true },
    ...wallets
  ];

  // Calculate specific wallet balance or Net Worth
  const getCardBalance = (card) => {
    const baseCurrency = preferences?.baseCurrency || 'USD';
    const baseRate = EX_RATES[baseCurrency] || 1;

    if (card.isNetWorth) {
      let net = 0;
      transactions.forEach(t => {
        const wCurrency = wallets.find(w => w.id === t.walletId)?.currency || 'USD';
        const converted = (t.amount * (EX_RATES[wCurrency] || 1)) / baseRate;
        if (t.type === 'income') net += converted;
        if (t.type === 'expense') net -= converted;
      });
      return net;
    }

    // Individual wallet balance
    let bal = 0;
    transactions.forEach(t => {
      if (t.type === 'transfer') {
        if (t.fromWalletId === card.id) bal -= t.amount;
        if (t.toWalletId === card.id) bal += (t.amountConverted || t.amount);
      } else if (t.walletId === card.id) {
        if (t.type === 'income') bal += t.amount;
        if (t.type === 'expense') bal -= t.amount;
      }
    });
    return bal;
  };

  const handleSelectCard = (id) => {
    vibrate('light');
    setActiveWalletId(id);
  };

  // Scroll to active card when activeWalletId changes
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeIdx = allCards.findIndex(c => c.id === activeWalletId);
    if (activeIdx !== -1) {
      const container = scrollRef.current;
      const cardWidth = container.offsetWidth * 0.82;
      container.scrollTo({
        left: activeIdx * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [activeWalletId]);

  return (
    <div className="w-full relative py-2">
      {/* Horizontal Swipeable Card Carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 py-1 scroll-smooth touch-pan-x"
      >
        {allCards.map((card, idx) => {
          const isActive = activeWalletId === card.id;
          const cardBal = getCardBalance(card);

          return (
            <div
              key={card.id}
              onClick={() => handleSelectCard(card.id)}
              className={`snap-center flex-shrink-0 w-[82%] sm:w-[310px] p-5 rounded-[2.2rem] cursor-pointer transition-all duration-300 transform active:scale-95 relative overflow-hidden border ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-900/90 via-teal-950/90 to-black border-emerald-500/50 shadow-[0_12px_30px_rgba(16,185,129,0.3)] scale-[1.02]'
                  : 'bg-[#1C1C1E]/80 hover:bg-[#1C1C1E] border-white/10 shadow-lg opacity-85'
              }`}
            >
              {/* Background Glow Accent */}
              {isActive && (
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              )}

              {/* Card Header */}
              <div className="flex justify-between items-center mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner ${
                    card.isNetWorth ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'
                  }`}>
                    {card.isNetWorth ? <Layers className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                  </div>
                  <span className="font-extrabold text-xs tracking-wide text-white truncate max-w-[130px]">
                    {card.name}
                  </span>
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-white/10 text-gray-400 border-white/10'
                }`}>
                  {card.currency}
                </span>
              </div>

              {/* Balance Readout */}
              <div className="relative z-10 pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  {card.isNetWorth ? 'Total Net Worth' : 'Account Balance'}
                </p>
                <h2 className="text-2xl font-black text-white tabular-nums tracking-tight font-mono">
                  {formatCurrency(cardBal, card.currency)}
                </h2>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 pt-2">
        {allCards.map((card) => {
          const isActive = activeWalletId === card.id;
          return (
            <button
              key={card.id}
              onClick={() => handleSelectCard(card.id)}
              className={`transition-all duration-300 rounded-full ${
                isActive 
                  ? 'w-5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                  : 'w-1.5 h-1.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
