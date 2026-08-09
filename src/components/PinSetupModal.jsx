import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { vibrate } from '../context/FinancialContext';

export const PinSetupModal = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [error, setError] = useState(false);

  const currentPin = step === 1 ? pin1 : pin2;
  const setPin = step === 1 ? setPin1 : setPin2;

  useEffect(() => {
    if (currentPin.length === 4) {
      setTimeout(() => {
        if (step === 1) {
          setStep(2);
          vibrate();
        } else {
          if (pin1 === pin2) {
            onSave(pin1);
          } else {
            vibrate();
            setError(true);
            setTimeout(() => {
              setPin1('');
              setPin2('');
              setStep(1);
              setError(false);
            }, 800);
          }
        }
      }, 200);
    }
  }, [currentPin, step, pin1, pin2, onSave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />
      <div className="bg-[#1C1C1E] w-full rounded-t-[2.5rem] p-6 pb-safe pointer-events-auto animate-spring-up border-t border-gray-800 text-white flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1 pt-2">{step === 1 ? 'Create App PIN' : 'Confirm PIN'}</h2>
        <p className="text-xs text-center text-gray-400 mb-6 h-5">
          {error ? <span className="text-rose-500 font-bold">PINs did not match. Try again.</span> : 'This will be used to unlock your Cashly app.'}
        </p>

        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-colors ${
                currentPin.length > i ? 'bg-emerald-500' : 'bg-gray-800'
              } ${error ? 'bg-rose-500' : ''}`} 
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-[280px] mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              onClick={() => { vibrate(); setPin(p => p.length < 4 ? p + num : p); }} 
              className="w-20 h-20 rounded-full bg-[#2C2C2E] text-2xl font-bold text-white shadow-sm active:bg-gray-700 transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button 
            onClick={() => { vibrate(); setPin(p => p.length < 4 ? p + '0' : p); }} 
            className="w-20 h-20 rounded-full bg-[#2C2C2E] text-2xl font-bold text-white shadow-sm active:bg-gray-700 transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button 
            onClick={() => { vibrate(); setPin(p => p.slice(0, -1)); }} 
            className="w-20 h-20 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
