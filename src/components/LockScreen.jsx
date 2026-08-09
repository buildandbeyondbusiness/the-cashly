import React, { useState, useEffect } from 'react';
import { Scan, Shield, ArrowLeft } from 'lucide-react';
import { vibrate } from '../context/FinancialContext';

export const LockScreen = ({ pin, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [faceIdError, setFaceIdError] = useState(null);

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

  const triggerFaceId = async () => {
    vibrate();
    setFaceIdError(null);

    if (window.PublicKeyCredential) {
      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        
        // Trigger native iOS WebAuthn Face ID prompt
        await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "Cashly Finance" },
            user: { id: new Uint8Array(16), name: "user", displayName: "Cashly User" },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }],
            authenticatorSelection: { 
              authenticatorAttachment: "platform", 
              userVerification: "required" 
            },
            timeout: 60000
          }
        });

        onUnlock();
      } catch (e) {
        console.log("Face ID verification skipped/cancelled", e);
        setFaceIdError("Face ID skipped. Enter 4-digit PIN.");
      }
    } else {
      setFaceIdError("Face ID not supported on browser. Enter PIN.");
    }
  };

  // Auto-trigger Face ID prompt on screen load
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerFaceId();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#000000] flex flex-col items-center justify-center p-6 relative z-50 animate-fade-in text-white">
      
      {/* Header Badge */}
      <div className="absolute top-16 flex flex-col items-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20">
          <img src="./logo.jpg" alt="Logo" className="w-full h-full rounded-3xl object-cover" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Cashly App Lock</h2>
        <p className="text-xs text-gray-400 font-medium">
          {faceIdError || "Authenticating with Face ID..."}
        </p>
      </div>

      {/* PIN Dots Display */}
      <div className="flex gap-4 mb-14 mt-20">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              input.length > i ? 'bg-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-gray-800'
            } ${error ? 'bg-rose-500 animate-bounce' : ''}`}
          />
        ))}
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => { vibrate(); setInput(p => p.length < 4 ? p + num : p); }} 
            className="w-20 h-20 rounded-full bg-[#1C1C1E] text-3xl font-medium text-white shadow-sm active:bg-gray-800 transition-colors flex items-center justify-center font-mono"
          >
            {num}
          </button>
        ))}

        {/* Face ID Trigger Button */}
        <button 
          onClick={triggerFaceId} 
          className="w-20 h-20 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-emerald-500/20"
          title="Scan Face ID"
        >
          <Scan className="w-8 h-8" />
        </button>

        <button 
          onClick={() => { vibrate(); setInput(p => p.length < 4 ? p + '0' : p); }} 
          className="w-20 h-20 rounded-full bg-[#1C1C1E] text-3xl font-medium text-white shadow-sm active:bg-gray-800 transition-colors flex items-center justify-center font-mono"
        >
          0
        </button>

        <button 
          onClick={() => { vibrate(); setInput(p => p.slice(0, -1)); }} 
          className="w-20 h-20 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
      </div>

    </div>
  );
};
