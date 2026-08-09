import React, { useState } from 'react';
import { useFinancials, vibrate } from '../context/FinancialContext';

export const AddWalletModal = ({ isOpen, onClose }) => {
  const { addWallet } = useFinancials();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');

  if (!isOpen) return null;

  const handleSubmit = () => {
    vibrate();
    if (!name) return;
    addWallet({ name, currency, iconString: 'Wallet' });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />
      <div className="bg-[#1C1C1E] w-full rounded-t-[2.5rem] p-6 pb-safe pointer-events-auto animate-spring-up border-t border-gray-800 text-white space-y-4">
        <h2 className="text-xl font-bold text-center">Add New Account</h2>
        
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Wallet Name (e.g. Savings, Chase Card)" 
          className="w-full bg-[#2C2C2E] text-white rounded-2xl px-4 py-3.5 font-bold border border-gray-700 outline-none text-sm" 
          autoFocus
        />

        <select 
          value={currency} 
          onChange={e => setCurrency(e.target.value)} 
          className="w-full bg-[#2C2C2E] text-white rounded-2xl px-4 py-3.5 font-bold border border-gray-700 outline-none text-sm"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="INR">INR (₹)</option>
        </select>

        <button 
          onClick={handleSubmit} 
          disabled={!name} 
          className="w-full py-3.5 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 active:scale-98 transition-all disabled:opacity-50 text-sm"
        >
          Create Wallet
        </button>
      </div>
    </div>
  );
};
