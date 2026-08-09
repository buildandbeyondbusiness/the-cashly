import React, { useState } from 'react';
import { useFinancials, vibrate } from '../context/FinancialContext';
import { 
  User, Wallet, Plus, Trash2, Globe, Home, Bell, Download, 
  HelpCircle, Info, ChevronRight 
} from 'lucide-react';

export const SettingsView = ({ onAddWallet }) => {
  const { 
    wallets, 
    preferences, 
    updatePreference, 
    deleteWallet, 
    exportCSV 
  } = useFinancials();

  const [activeModal, setActiveModal] = useState(null);
  const [walletToDelete, setWalletToDelete] = useState(null);

  const SectionTitle = ({ children }) => (
    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2 mt-7 first:mt-0">
      {children}
    </h3>
  );

  const Row = ({ icon: Icon, color, label, value, onClick }) => (
    <div 
      onClick={() => { vibrate(); onClick(); }} 
      className="flex items-center justify-between p-4 hover:bg-gray-800/40 cursor-pointer group transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${color} shadow-sm group-hover:scale-105 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="font-bold text-white text-[15px]">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-[13px] font-bold text-gray-400">{value}</span>}
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 animate-fade-in pb-32">
      
      {/* Profile Card */}
      <div className="bg-[#1C1C1E] rounded-3xl p-4 shadow-sm border border-gray-800/60 flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-inner text-white">
          <User className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-extrabold text-white truncate">Personal Finance</h2>
          <p className="text-gray-400 font-medium text-xs truncate">Local Private Session</p>
        </div>
      </div>

      {/* My Accounts */}
      <SectionTitle>My Accounts</SectionTitle>
      <div className="bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-800/60 overflow-hidden divide-y divide-gray-800/40">
        {wallets.map((w) => (
          <div key={w.id} className="flex items-center justify-between p-4 hover:bg-gray-800/40 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-[15px]">{w.name}</p>
                <p className="text-xs text-gray-400 font-medium">{w.currency}</p>
              </div>
            </div>
            {wallets.length > 1 && (
              <button 
                onClick={() => { vibrate(); setWalletToDelete(w.id); }} 
                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors active:scale-90"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        <div 
          onClick={onAddWallet} 
          className="flex items-center gap-4 p-4 hover:bg-gray-800/40 cursor-pointer text-emerald-400 transition-colors group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <p className="font-bold text-[15px]">Add New Account</p>
        </div>
      </div>

      {/* Preferences */}
      <SectionTitle>Preferences</SectionTitle>
      <div className="bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-800/60 overflow-hidden divide-y divide-gray-800/40">
        <Row icon={Globe} color="bg-orange-500" label="Currency" value={preferences.baseCurrency} onClick={() => setActiveModal('Currency')} />
        
        <div 
          className="flex items-center justify-between p-4 hover:bg-gray-800/40 transition-colors cursor-pointer" 
          onClick={() => { vibrate(); updatePreference('isDarkMode', !preferences.isDarkMode); }}
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-indigo-500 shadow-sm">
              <Home className="w-4 h-4" />
            </div>
            <p className="font-bold text-white text-[15px]">Dark Theme</p>
          </div>
          <button className={`w-[52px] h-7 rounded-full transition-colors relative pointer-events-none ${preferences.isDarkMode ? 'bg-emerald-500' : 'bg-gray-700'}`}>
            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-sm ${preferences.isDarkMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        <Row icon={Bell} color="bg-rose-500" label="Notifications & Reminders" onClick={() => setActiveModal('Notifications')} />
      </div>

      {/* Tools & Export */}
      <SectionTitle>Data & Options</SectionTitle>
      <div className="bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-800/60 overflow-hidden divide-y divide-gray-800/40">
        <Row icon={Download} color="bg-emerald-500" label="Export Ledger CSV" onClick={exportCSV} />
        <Row icon={HelpCircle} color="bg-blue-500" label="Help & Support" onClick={() => setActiveModal('Help')} />
        <Row icon={Info} color="bg-gray-700" label="About Cashly" onClick={() => setActiveModal('About')} />
      </div>

      {/* Delete Wallet Dialog */}
      {walletToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setWalletToDelete(null)}>
          <div className="bg-[#1C1C1E] rounded-3xl w-full max-w-xs border border-gray-800 text-center p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-white">Delete Account?</h3>
            <p className="text-xs text-gray-400">This action will remove the selected wallet account.</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setWalletToDelete(null)} className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gray-800 text-gray-300">Cancel</button>
              <button 
                onClick={() => { vibrate(); deleteWallet(walletToDelete); setWalletToDelete(null); }} 
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Modal Sheets */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-[#1C1C1E] rounded-3xl w-full max-w-sm border border-gray-800 p-6 space-y-4 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-base">{activeModal}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {activeModal === 'Currency' && (
              <div className="space-y-2">
                {['USD', 'EUR', 'GBP', 'JPY', 'INR'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => { vibrate(); updatePreference('baseCurrency', c); setActiveModal(null); }} 
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                      preferences.baseCurrency === c ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-gray-800 text-gray-300'
                    }`}
                  >
                    <span>{c}</span>
                    {preferences.baseCurrency === c && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                  </button>
                ))}
              </div>
            )}

            {activeModal === 'Notifications' && (
              <div className="space-y-3 text-center py-2">
                <Bell className="w-10 h-10 text-rose-400 mx-auto opacity-70" />
                <p className="font-bold text-sm">Bill Reminders Active</p>
                <p className="text-xs text-gray-400">Upcoming bill notifications are enabled automatically based on your recurring bills.</p>
              </div>
            )}

            {activeModal === 'Help' && (
              <div className="text-center py-4 space-y-2">
                <HelpCircle className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
                <p className="font-bold text-sm">Need Assistance?</p>
                <p className="text-xs text-gray-400">Reach out at <a href="mailto:support@cashly.app" className="text-emerald-400 underline">support@cashly.app</a></p>
              </div>
            )}

            {activeModal === 'About' && (
              <div className="text-center py-4 space-y-2">
                <img src="./logo.jpg" alt="Logo" className="w-14 h-14 rounded-2xl mx-auto border border-emerald-500/30" />
                <p className="font-extrabold text-base">Cashly 2.0</p>
                <p className="text-xs text-gray-400">Version 3.2.0 (Apple Liquid Glass Edition)<br/><span className="text-emerald-400 font-bold mt-1 block">Your wealth, simplified.</span></p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
