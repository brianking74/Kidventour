import React from 'react';
import { UserPreferences } from '../types';
import { Settings, Shield, Globe, Award } from 'lucide-react';

interface ProfileViewProps {
  prefs: UserPreferences;
  savedCount: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ prefs, savedCount }) => {
  // Simulate stickers based on saved count
  const stickers = Array.from({ length: Math.min(savedCount, 12) }, (_, i) => i);
  
  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-full">
      
      {/* Header Profile */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint-400 to-blue-500 flex items-center justify-center text-3xl shadow-inner border-4 border-white">
          👶
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kid Explorer</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
             <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold text-xs flex items-center gap-1">
                Lvl {Math.floor(savedCount / 5) + 1}
             </span>
             <span>• {prefs.age} years old</span>
          </div>
        </div>
      </div>

      {/* Sticker Map Globe (CSS Implementation) */}
      <div className="relative">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Globe size={18} className="text-blue-500" /> World Sticker Map
        </h3>
        <div className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-full shadow-2xl relative overflow-hidden border-4 border-white/20 group">
            {/* Globe Grid lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <div className="absolute inset-0 border border-white/10 rounded-full scale-75"></div>
            <div className="absolute inset-0 border border-white/10 rounded-full scale-50"></div>
            
            {/* Continents (Simplified CSS blobs) */}
            <div className="absolute top-1/4 left-1/4 w-32 h-24 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse delay-700"></div>

            {/* Stickers Placed on Map */}
            {stickers.map((s, i) => {
                // Random positioning within circle
                const top = 20 + Math.random() * 60;
                const left = 20 + Math.random() * 60;
                return (
                    <div 
                        key={i}
                        className="absolute w-8 h-8 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center text-lg cursor-pointer transform hover:scale-150 transition-transform z-10 animate-in zoom-in duration-500"
                        style={{ top: `${top}%`, left: `${left}%` }}
                        title="Visited!"
                    >
                        {['🦁', '🚀', '🎨', '⚽', '🍦', '🌲'][i % 6]}
                    </div>
                );
            })}

            {/* Empty State Text */}
            {savedCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold text-center p-8">
                    Save activities to stick them on your world!
                </div>
            )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="text-3xl font-black text-mint-500 mb-1">{savedCount}</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Discoveries</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="text-3xl font-black text-orange-500 mb-1 flex justify-center items-center gap-1">
                {prefs.streakDays} <Award size={20} />
            </div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Day Streak</div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 mt-4">Parent Controls</h3>
        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors border border-slate-100">
          <Settings size={18} /> Notifications & Alerts
        </button>
        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors border border-slate-100">
          <Shield size={18} /> Privacy & Safety
        </button>
      </div>
    </div>
  );
};

export default ProfileView;