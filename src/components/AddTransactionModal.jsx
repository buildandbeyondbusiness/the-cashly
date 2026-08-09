import React, { useState, useEffect } from 'react';
import { useFinancials, CATEGORIES, vibrate } from '../context/FinancialContext';
import { 
  X, Coffee, Car, ShoppingBag, Film, FileText, Home, Heart, Book, 
  Repeat, Zap, DollarSign, Landmark, ArrowRightLeft, Wallet 
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

export const AddTransactionModal = ({ isOpen, onClose }) => {
  const { wallets, activeWalletId, addTransaction } = useFinancials();

  const [type, setType] = useState('expense'); // 'expense' | 'income' | 'transfer'
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');

  useEffect(() => {
    if (isOpen) {
      const defaultWallet = activeWalletId === 'all' ? (wallets[0]?.id || '') : activeWalletId;
      setSelectedWalletId(defaultWallet);
      setFromWalletId(wallets[0]?.id || '');
      setToWalletId(wallets[1]?.id || wallets[0]?.id || '');
      setAmount('');
      setSelectedCategory(null);
      setNote('');
    }
  }, [isOpen, activeWalletId, wallets]);

  if (!isOpen) return null;

  const handleSave = () => {
    vibrate();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    addTransaction({
      amount: val,
      type,
      categoryId: selectedCategory,
      walletId: selectedWalletId,
      fromWalletId,
      toWalletId,
      note: note.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />
      
      <div className="bg-[#1C1C1E] w-full h-[90%] rounded-t-[2.5rem] shadow-2xl pointer-events-auto flex flex-col relative animate-spring-up text-white border-t border-gray-800">
        
        {/* Drag Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-2 absolute top-0 z-20">
          <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
        </div>

        {/* Header Type Selector */}
        <div className="px-6 pt-9 pb-4 bg-[#1C1C1E] rounded-t-[2.5rem] shadow-sm z-10">
          <div className="flex bg-[#2C2C2E] rounded-xl p-1 shadow-inner relative">
            <div 
              className={`absolute top-1 bottom-1 w-[31%] bg-[#1C1C1E] rounded-lg shadow-sm transition-transform duration-300 ${
                type === 'expense' ? 'translate-x-[2%]' : (type === 'income' ? 'translate-x-[108%]' : 'translate-x-[214%]')
              }`}
            />
            <button 
              onClick={() => { vibrate(); setType('expense'); }} 
              className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${type === 'expense' ? 'text-white' : 'text-gray-400'}`}
            >
              Expense
            </button>
            <button 
              onClick={() => { vibrate(); setType('income'); }} 
              className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${type === 'income' ? 'text-white' : 'text-gray-400'}`}
            >
              Income
            </button>
            <button 
              onClick={() => { vibrate(); setType('transfer'); }} 
              className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${type === 'transfer' ? 'text-white' : 'text-gray-400'}`}
            >
              Transfer
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Big Amount Display Input */}
          <div className="p-8 text-center bg-[#1C1C1E] border-b border-gray-800">
            <p className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Enter Amount</p>
            <div className="flex items-center justify-center text-5xl font-extrabold text-white font-sans">
              <span className="text-gray-500 mr-2 text-4xl">$</span>
              <input 
                type="text" 
                inputMode="decimal" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} 
                placeholder="0.00" 
                className="bg-transparent w-full max-w-[200px] outline-none text-center placeholder-gray-600 font-mono" 
                autoFocus 
              />
            </div>
          </div>

          <div className="p-6 space-y-5">
            
            {/* Wallet Selector (For Expense & Income) */}
            {type !== 'transfer' ? (
              <div className="bg-[#2C2C2E]/60 p-3.5 rounded-2xl border border-gray-800">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 block">
                  Select Wallet
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {wallets.map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => { vibrate(); setSelectedWalletId(w.id); }}
                      className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        selectedWalletId === w.id
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-gray-800 bg-[#1C1C1E] text-gray-300'
                      }`}
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>{w.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Inter-Wallet Transfer Selector */
              <div className="bg-[#2C2C2E]/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">From Account</label>
                  <select 
                    value={fromWalletId} 
                    onChange={e => setFromWalletId(e.target.value)} 
                    className="w-full bg-[#1C1C1E] border border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mt-4">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">To Account</label>
                  <select 
                    value={toWalletId} 
                    onChange={e => setToWalletId(e.target.value)} 
                    className="w-full bg-[#1C1C1E] border border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Category Grid Picker (For Expense & Income) */}
            {type !== 'transfer' && (
              <div className="bg-[#2C2C2E]/60 p-4 rounded-2xl border border-gray-800">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                  {Object.values(CATEGORIES).filter(c => c.type === type).map((cat) => {
                    const CatIcon = ICON_MAP[cat.id] || Wallet;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { vibrate(); setSelectedCategory(cat.id); }}
                        className="flex flex-col items-center gap-1.5 outline-none active:scale-95 transition-transform"
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? `${cat.bg} text-white shadow-lg scale-110 ring-2 ring-white/40`
                            : 'bg-[#1C1C1E] text-gray-400 border border-gray-800'
                        }`}>
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold text-center ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Note Memo Input */}
            <div className="bg-[#2C2C2E]/60 p-3 rounded-2xl border border-gray-800 flex items-center gap-3">
              <input 
                type="text" 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="Write a memo / note..." 
                className="w-full text-xs font-medium text-white bg-transparent outline-none placeholder-gray-500 px-2" 
              />
            </div>

          </div>
        </div>

        {/* Action Save Button */}
        <div className="p-6 bg-[#1C1C1E] border-t border-gray-800 pb-safe">
          <button 
            onClick={handleSave} 
            disabled={!amount || (type !== 'transfer' && !selectedCategory) || (type === 'transfer' && fromWalletId === toWalletId)} 
            className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 shadow-lg active:scale-98 transition-all"
          >
            Save {type === 'transfer' ? 'Transfer' : 'Transaction'}
          </button>
        </div>

      </div>
    </div>
  );
};
