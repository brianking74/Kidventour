import React from 'react';
import { Compass, Calendar, Heart, User, MapPin, Flame } from 'lucide-react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: AppMode;
  onToggleMode: () => void;
  showBoredButton?: boolean;
  onBoredClick?: () => void;
  streakDays?: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  mode, 
  onToggleMode,
  showBoredButton = true,
  onBoredClick,
  streakDays = 0
}) => {
  const isKid = mode === AppMode.KID;

  return (
    <div className={`h-screen w-full flex flex-col relative overflow-hidden transition-all duration-700 ${
      isKid ? 'bg-[#FFF5F7] font-display text-[110%]' : 'bg-slate-50 font-sans'
    }`}>
      {/* Header */}
      <header className={`px-4 py-3 flex justify-between items-center z-20 transition-all duration-500 ${
        isKid ? 'bg-white/40 backdrop-blur-md pt-4' : 'bg-white shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <MapPin className={`transition-all duration-500 ${isKid ? "text-purple-500 w-8 h-8 animate-bounce" : "text-mint-500 w-5 h-5"}`} />
          <h1 className={`font-bold transition-all ${isKid ? 'text-2xl text-purple-600 tracking-wider' : 'text-xl text-slate-800'}`}>
            Kidventour
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak Flame */}
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full border border-orange-100" title={`${streakDays} Day Streak`}>
            <Flame size={isKid ? 24 : 16} className={`${streakDays > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'} transition-all ${isKid ? 'animate-pulse' : ''}`} />
            <span className={`font-bold text-orange-700 ${isKid ? 'text-lg' : 'text-xs'}`}>{streakDays}</span>
          </div>

          <button 
            onClick={onToggleMode}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all transform active:scale-95 ${
              isKid 
                ? 'bg-yellow-400 text-yellow-900 shadow-[0_4px_0_rgb(180,83,9)] translate-y-0 active:translate-y-[4px] active:shadow-none' 
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isKid ? 'Exit Kid Mode 👶' : 'Parent Mode 👨‍👩‍👧'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>

      {/* FAB - I'm Bored */}
      {showBoredButton && (
        <button
          onClick={onBoredClick}
          className={`absolute bottom-24 right-4 z-30 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
            isKid 
              ? 'w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 border-4 border-white text-4xl animate-pulse' 
              : 'w-14 h-14 bg-mint-500 text-white'
          }`}
        >
          {isKid ? '🥱' : <Compass size={24} />}
        </button>
      )}

      {/* Bottom Nav */}
      <nav className={`px-2 sm:px-6 flex justify-around items-center z-20 shrink-0 transition-all duration-500 ${
        isKid 
          ? 'bg-white/90 backdrop-blur-lg border-t-4 border-purple-200 rounded-t-3xl pt-2 pb-6' 
          : 'bg-white border-t border-slate-200 pt-2 pb-6'
      }`}>
        <NavIcon 
          icon={<Compass size={isKid ? 28 : 22} />} 
          label="Discover" 
          isActive={activeTab === 'explore'} 
          onClick={() => onTabChange('explore')}
          isKid={isKid}
        />
        <NavIcon 
          icon={<Calendar size={isKid ? 28 : 22} />} 
          label="Passport" // Rebranded from Plan
          isActive={activeTab === 'plan'} 
          onClick={() => onTabChange('plan')}
          isKid={isKid}
        />
        <NavIcon 
          icon={<Heart size={isKid ? 28 : 22} />} 
          label="Saved" 
          isActive={activeTab === 'saved'} 
          onClick={() => onTabChange('saved')}
          isKid={isKid}
        />
        <NavIcon 
          icon={<User size={isKid ? 28 : 22} />} 
          label="Me" // Rebranded from Profile
          isActive={activeTab === 'profile'} 
          onClick={() => onTabChange('profile')}
          isKid={isKid}
        />
      </nav>
    </div>
  );
};

const NavIcon = ({ icon, label, isActive, onClick, isKid }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${
      isActive 
        ? (isKid ? 'text-purple-600 scale-110 -translate-y-2' : 'text-mint-500 -translate-y-1') 
        : (isKid ? 'text-slate-300' : 'text-slate-400 hover:text-slate-600')
    }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'animate-bounce-short' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] mt-1 font-bold tracking-tight transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>
      {label}
    </span>
  </button>
);

export default Layout;