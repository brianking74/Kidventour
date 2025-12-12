import React from 'react';
import { Compass, Calendar, Heart, User, MapPin } from 'lucide-react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: AppMode;
  onToggleMode: () => void;
  showBoredButton?: boolean;
  onBoredClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  mode, 
  onToggleMode,
  showBoredButton = true,
  onBoredClick
}) => {
  const isKid = mode === AppMode.KID;

  return (
    <div className={`h-screen w-full flex flex-col relative overflow-hidden transition-colors duration-500 ${
      isKid ? 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 font-display' : 'bg-slate-50 font-sans'
    }`}>
      {/* Header */}
      <header className={`px-4 py-3 flex justify-between items-center z-20 ${
        isKid ? 'bg-white/30 backdrop-blur-md' : 'bg-white shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <MapPin className={isKid ? "text-purple-500 w-8 h-8 animate-bounce" : "text-mint-500 w-5 h-5"} />
          <h1 className={`font-bold ${isKid ? 'text-2xl text-purple-600 tracking-wider' : 'text-xl text-slate-800'}`}>
            Kidventour
          </h1>
        </div>
        <button 
          onClick={onToggleMode}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isKid 
              ? 'bg-yellow-400 text-yellow-900 shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px]' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {isKid ? 'Exit Kid Mode 👶' : 'Parent Mode 👨‍👩‍👧'}
        </button>
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
              ? 'w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 border-4 border-white text-3xl animate-pulse' 
              : 'w-14 h-14 bg-mint-500 text-white'
          }`}
        >
          {isKid ? '🥱' : <Compass size={24} />}
        </button>
      )}

      {/* Bottom Nav */}
      <nav className={`pb-safe pt-2 px-6 flex justify-between items-center z-20 shrink-0 ${
        isKid ? 'bg-white/80 backdrop-blur-lg border-t-4 border-purple-200 h-24 rounded-t-3xl' : 'bg-white border-t border-slate-200 h-16'
      }`}>
        <NavIcon 
          icon={<Compass size={isKid ? 32 : 24} />} 
          label="Explore" 
          isActive={activeTab === 'explore'} 
          onClick={() => onTabChange('explore')}
          isKid={isKid}
        />
        <NavIcon 
          icon={<Calendar size={isKid ? 32 : 24} />} 
          label="Plan" 
          isActive={activeTab === 'plan'} 
          onClick={() => onTabChange('plan')}
          isKid={isKid}
        />
        <NavIcon 
          icon={<Heart size={isKid ? 32 : 24} />} 
          label="Saved" 
          isActive={activeTab === 'saved'} 
          onClick={() => onTabChange('saved')}
          isKid={isKid}
        />
        <NavIcon 
          icon={<User size={isKid ? 32 : 24} />} 
          label="Profile" 
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
    className={`flex flex-col items-center justify-center transition-colors ${
      isActive 
        ? (isKid ? 'text-purple-600 scale-110' : 'text-mint-500') 
        : (isKid ? 'text-slate-400' : 'text-slate-400 hover:text-slate-600')
    }`}
  >
    {icon}
    {!isKid && <span className="text-[10px] mt-1 font-medium">{label}</span>}
  </button>
);

export default Layout;