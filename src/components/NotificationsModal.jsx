import React from 'react';
import { useFinancials, formatCurrency, vibrate } from '../context/FinancialContext';
import { AlertCircle, Plus, Calendar } from 'lucide-react';

export const NotificationsModal = ({ isOpen, onClose, onAddBill }) => {
  const { bills, activeWallet } = useFinancials();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />
      <div className="bg-[#1C1C1E] w-full rounded-t-[2.5rem] p-6 pb-safe pointer-events-auto animate-spring-up border-t border-gray-800 text-white space-y-4 max-h-[85%] overflow-y-auto">
        
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <h2 className="text-lg font-extrabold">Upcoming Bills & Reminders</h2>
          <button 
            onClick={() => { vibrate(); onAddBill(); }} 
            className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {bills.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base">All caught up!</h3>
            <p className="text-xs text-gray-400">No scheduled recurring bills recorded. Tap '+' to add a subscription bill.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map(b => (
              <div key={b.id} className="bg-[#2C2C2E] p-4 rounded-2xl flex items-center justify-between border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-[15px]">{b.name}</p>
                    <p className="text-xs text-rose-400 font-bold">Due on day {b.dueDate} of month</p>
                  </div>
                </div>
                <p className="font-extrabold text-white text-base">{formatCurrency(b.amount, activeWallet.currency)}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
