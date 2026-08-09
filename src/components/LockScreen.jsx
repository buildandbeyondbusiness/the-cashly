import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { vibrate } from '../context/FinancialContext';

export const LockScreen = ({ pin, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (input.length === 4) {
      if (input === pin) {
        setInput('');
        onUnlock();
      } else {
        vibrate();
        setError(true);
        setTimeout(() => {
          setInput('');
          setError(false);
        }, 500);
      }
    }
  }, [input, pin, onUnlock]);

  const handleBiometric = async () => {
    try {
      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "Cashly Finance" },
            user: { id: new Uint8Array(16), name: "user", displayName: "User" },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }],
            authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
            timeout: 60000
          }
        });
        onUnlock();
      }
    } catch (e) {
      console.log("Biometric failed", e);
    }
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return (
    <div className="w-full h-full bg-[#000000] flex flex-col items-center justify-center p-6 relative z-50 animate-fade-in text-white">
      <div className="absolute top-20 flex flex-col items-center">
        <img src="./logo.jpg" alt="Logo" className="w-20 h-20 rounded-3xl shadow-lg mb-6 border border-emerald-500/30" />
        <h2 className="text-xl font-bold text-center text-white">Enter App PIN</h2>
      </div>

      <div className="flex gap-4 mb-16 mt-20">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full transition-colors ${
              input.length > i ? 'bg-emerald-500' : 'bg-gray-800'
            } ${error ? 'bg-rose-500' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => { vibrate(); setInput(p => p.length < 4 ? p + num : p); }} 
            className="w-20 h-20 rounded-full bg-[#1C1C1E] text-3xl font-medium text-white shadow-sm active:bg-gray-800 transition-colors flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <button onClick={() => { vibrate(); handleBiometric(); }} className="w-20 h-20 flex items-center justify-center text-emerald-500 active:scale-90 transition-transform">
          <Shield className="w-8 h-8" />
        </button>
        <button onClick={() => { vibrate(); setInput(p => p.length < 4 ? p + '0' : p); }} className="w-20 h-20 rounded-full bg-[#1C1C1E] text-3xl font-medium text-white shadow-sm active:bg-gray-800 transition-colors flex items-center justify-center">
          0
        </button>
        <button onClick={() => { vibrate(); setInput(p => p.slice(0, -1)); }} className="w-20 h-20 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
          <ArrowLeft className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
