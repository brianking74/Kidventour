import React, { useState } from 'react';
import { ItineraryDay, AppMode } from '../types';
import { Share2, Lock, Star, Sun, Moon, Coffee, Map, Printer, Check } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: ItineraryDay[];
  mode: AppMode;
  isLoading: boolean;
  onGenerate: () => void;
  isPro: boolean;
  onUpgrade: () => void;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ 
  itinerary, 
  mode, 
  isLoading, 
  onGenerate,
  isPro,
  onUpgrade
}) => {
  const isKid = mode === AppMode.KID;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const title = `Kidventour: ${itinerary.length}-Day Plan`;
    const text = itinerary.map(d => 
      `Day ${d.day} (${d.dayLabel}):\n🌞 ${d.morning.title}\n🥗 ${d.lunch.title}\n🏃 ${d.afternoon.title}\n🌙 ${d.evening.title}`
    ).join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${title}\n\n${text}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("Could not copy to clipboard. Please try manually.");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 ${isKid ? 'border-purple-500' : 'border-mint-500'}`}></div>
        <h3 className={`text-xl font-bold mb-2 ${isKid ? 'text-purple-600' : 'text-slate-800'}`}>
          {isKid ? '🚂 Building Magic...' : 'Generating 2-Week Plan...'}
        </h3>
        <p className="text-slate-500 text-sm">Crafting mornings, lunches, and adventures.</p>
      </div>
    );
  }

  // Not Pro / Paywall State
  if (!isPro && itinerary.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-24 h-24 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full shadow-lg flex items-center justify-center mb-6 text-white animate-pulse">
          <Star size={40} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Unlock Magic Month</h2>
        <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
          Get a full 14-day holiday itinerary with morning activities, best lunch spots, and evening wind-downs.
        </p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full max-w-sm mb-6 text-left">
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-xs">✓</span>
              Unlimited Activity Swipes
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-xs">✓</span>
              14-Day Detailed Plans
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-xs">✓</span>
              Snack & Lunch Recommendations
            </li>
          </ul>
        </div>

        <button 
          onClick={onUpgrade}
          className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition-colors w-full max-w-xs flex items-center justify-center gap-2"
        >
          <Lock size={18} />
          Unlock Pro for $9.99/mo
        </button>
      </div>
    );
  }

  // Initial Empty State (Pro but no plan yet)
  if (itinerary.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
          <span className="text-4xl">🗓️</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to Plan?</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Create a 14-day master plan instantly.</p>
        <button 
          onClick={onGenerate}
          className="bg-mint-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-mint-600 transition-colors w-full max-w-xs"
        >
          Generate 2-Week Plan ✨
        </button>
      </div>
    );
  }

  const activeDay = itinerary[selectedDayIndex];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header & Day Strip */}
      <div className="bg-white shadow-sm z-10 no-print">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div>
            <h2 className={`text-xl font-bold ${isKid ? 'text-purple-700' : 'text-slate-800'}`}>
              {isKid ? 'Magic Map 🗺️' : '2-Week Plan'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {itinerary.length} Days • Pro Mode
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 bg-slate-50 rounded-full shadow-sm text-slate-600 hover:bg-slate-100 hidden sm:flex"
              title="Print / Save PDF"
            >
              <Printer size={18} />
            </button>
            <button 
              onClick={handleShare}
              className={`p-2 rounded-full shadow-sm transition-all ${copied ? 'bg-mint-100 text-mint-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              title="Share"
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
            </button>
          </div>
        </div>

        {/* Horizontal Day Scroller */}
        <div className="flex overflow-x-auto no-scrollbar pb-2 px-4 gap-3 snap-x">
          {itinerary.map((day, idx) => (
            <button
              key={day.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all snap-start ${
                selectedDayIndex === idx
                  ? (isKid ? 'bg-purple-500 text-white shadow-md scale-105' : 'bg-mint-500 text-white shadow-md scale-105')
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span className="text-xs font-semibold">{day.dayLabel}</span>
              <span className="text-lg font-bold">{day.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 print:overflow-visible print:h-auto">
        {activeDay && (
          <>
            {/* Morning */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-orange-300 shadow-sm print:shadow-none print:border">
              <div className="flex items-center gap-2 mb-2 text-orange-400 font-bold text-sm uppercase tracking-wider">
                <Sun size={16} /> Morning (9-11)
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{activeDay.morning.title}</h3>
              <p className="text-slate-600 text-sm mb-3">{activeDay.morning.description}</p>
              <div className="flex gap-2 print:hidden">
                {activeDay.morning.tags.map(t => (
                  <span key={t} className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-semibold">{t}</span>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-mint-300 shadow-sm print:shadow-none print:border">
              <div className="flex items-center gap-2 mb-2 text-mint-500 font-bold text-sm uppercase tracking-wider">
                <Coffee size={16} /> Snack / Lunch
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{activeDay.lunch.title}</h3>
              <p className="text-slate-600 text-sm">{activeDay.lunch.description}</p>
            </div>

            {/* Afternoon */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-blue-300 shadow-sm print:shadow-none print:border">
              <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                <Map size={16} /> Afternoon (2-4)
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{activeDay.afternoon.title}</h3>
              <p className="text-slate-600 text-sm mb-3">{activeDay.afternoon.description}</p>
              <div className="flex gap-2 print:hidden">
                {activeDay.afternoon.tags.map(t => (
                  <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">{t}</span>
                ))}
              </div>
            </div>

            {/* Evening */}
            <div className="bg-indigo-50 p-4 rounded-2xl border-l-4 border-indigo-300 shadow-sm print:shadow-none print:border">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <Moon size={16} /> Wind-down
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{activeDay.evening.title}</h3>
              <p className="text-slate-600 text-sm italic">"{activeDay.evening.description}"</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;