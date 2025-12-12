import React, { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Star } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = (provider: 'stripe' | 'paypal') => {
    setLoading(true);
    // In a real implementation, you would:
    // 1. Call your backend to create a Stripe Checkout Session or PayPal Order
    // 2. Use stripe.redirectToCheckout({ sessionId }) or paypal.Buttons.create()
    
    // Simulating API latency and success
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <Star className="text-yellow-300 w-16 h-16 animate-pulse" fill="currentColor" />
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors z-10">
                <X size={20} />
            </button>
        </div>

        <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Upgrade to Pro</h2>
            <p className="text-center text-slate-500 mb-8">Unlock the full magic of Kidventour</p>

            <div className="space-y-4 mb-8">
                <FeatureRow text="Unlimited Activity Swipes" />
                <FeatureRow text="Full 14-Day Holiday Itineraries" />
                <FeatureRow text="Smart Lunch & Snack Suggestions" />
                <FeatureRow text="Offline Maps & PDF Export" />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 text-center">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Monthly Plan</span>
                <div className="flex items-center justify-center gap-1 text-slate-800">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-sm font-medium text-slate-500">/ month</span>
                </div>
            </div>

            <div className="space-y-3">
                <button 
                    disabled={loading}
                    onClick={() => handlePayment('stripe')}
                    className="w-full bg-[#635BFF] hover:bg-[#5851E1] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? <Spinner /> : <><CreditCard size={18} className="group-hover:scale-110 transition-transform" /> Pay with Card</>}
                </button>
                
                <button 
                    disabled={loading}
                    onClick={() => handlePayment('paypal')}
                    className="w-full bg-[#FFC439] hover:bg-[#F4BB34] text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-yellow-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? <Spinner dark /> : <span className="italic font-bold text-lg px-2 group-hover:scale-105 transition-transform">PayPal</span>}
                </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck size={12} />
                Secure payment processed by Stripe / PayPal
            </div>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-mint-100 flex items-center justify-center shrink-0">
            <Check size={12} className="text-mint-600" strokeWidth={3} />
        </div>
        <span className="text-sm font-medium text-slate-600">{text}</span>
    </div>
);

const Spinner = ({ dark }: { dark?: boolean }) => (
    <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${dark ? 'border-slate-800' : 'border-white'}`} />
);

export default SubscriptionModal;