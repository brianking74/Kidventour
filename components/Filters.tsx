import React from 'react';
import { UserPreferences, INTERESTS } from '../types';
import { Sliders, Sun, CloudRain } from 'lucide-react';

interface FiltersProps {
  prefs: UserPreferences;
  onChange: (newPrefs: UserPreferences) => void;
  onClose: () => void;
}

const Filters: React.FC<FiltersProps> = ({ prefs, onChange, onClose }) => {
  const toggleInterest = (interest: string) => {
    const newInterests = prefs.interests.includes(interest)
      ? prefs.interests.filter(i => i !== interest)
      : [...prefs.interests, interest];
    onChange({ ...prefs, interests: newInterests });
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sliders className="text-mint-500" size={20} />
          Customize Your Search
        </h2>
        <button onClick={onClose} className="text-mint-500 font-bold text-sm">Done</button>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        
        {/* Age Slider */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-4">
            Child Age: <span className="text-mint-500 text-lg">{prefs.age} yrs</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="12" 
            value={prefs.age}
            onChange={(e) => onChange({...prefs, age: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-mint-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>1 yr</span>
            <span>6 yrs</span>
            <span>12 yrs</span>
          </div>
        </section>

        {/* Interests */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3">Interests</label>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map(interest => {
              const isSelected = prefs.interests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isSelected 
                      ? 'bg-mint-500 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {interest}
                </button>
              )
            })}
          </div>
        </section>

        {/* Indoor/Outdoor */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3">Environment</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => onChange({...prefs, isIndoor: false})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                !prefs.isIndoor ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400'
              }`}
            >
              <Sun size={18} /> Outdoor
            </button>
            <button 
              onClick={() => onChange({...prefs, isIndoor: true})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                prefs.isIndoor ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-400'
              }`}
            >
              <CloudRain size={18} /> Indoor
            </button>
          </div>
        </section>

        {/* Price */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3">Max Price</label>
          <div className="flex justify-between gap-2">
            {[0, 1, 2, 3].map(lvl => (
              <button
                key={lvl}
                onClick={() => onChange({...prefs, maxPrice: lvl})}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${
                  prefs.maxPrice === lvl 
                    ? 'border-mint-500 bg-mint-50 text-mint-600' 
                    : 'border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                {lvl === 0 ? 'Free' : Array(lvl).fill('$').join('')}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Filters;