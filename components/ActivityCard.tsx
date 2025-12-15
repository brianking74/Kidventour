import React, { useState, useRef, useEffect } from 'react';
import { Clock, DollarSign, CloudRain, Sun, Map, CalendarPlus, Heart, X as XIcon, Star } from 'lucide-react';
import { Activity, AppMode } from '../types';

interface ActivityCardProps {
  activity: Activity;
  mode: AppMode;
  onSwipeLeft: () => void; // Save
  onSwipeRight: () => void; // Pass
  onAddToItinerary: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, mode, onSwipeLeft, onSwipeRight, onAddToItinerary }) => {
  const isKid = mode === AppMode.KID;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Physics State
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Audio Context for SFX
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playSound = (type: 'pop' | 'rev' | 'whoosh') => {
    if (!window.AudioContext && !(window as any).webkitAudioContext) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'rev') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragPosition({ x: 0, y: 0 }); // Reset relative
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !cardRef.current) return;
    const touch = e.touches[0];
    // Calculate relative to center would require more complex logic, simplified here for relative movement
    // We assume the touch starts somewhat centrally for a swipe
    // A better approach for simple swipe cards:
    const startX = (cardRef.current as any).startX || touch.clientX;
    (cardRef.current as any).startX = startX;
    
    const deltaX = touch.clientX - startX;
    setDragPosition({ x: deltaX, y: 0 }); // Lock Y for simple left/right swipe mechanics
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    (cardRef.current as any).startX = null;
    
    const threshold = 100; // px to trigger swipe
    if (dragPosition.x > threshold) {
      // Right -> Pass
      playSound('whoosh');
      onSwipeRight();
    } else if (dragPosition.x < -threshold) {
      // Left -> Save
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      const isVehicle = activity.tags.some(t => t.includes('Vehicle') || t.includes('Car'));
      playSound(isVehicle ? 'rev' : 'pop');
      onSwipeLeft();
    }
    
    setDragPosition({ x: 0, y: 0 });
  };

  // Mouse fallback for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    (cardRef.current as any).startX = e.clientX;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - ((cardRef.current as any).startX || e.clientX);
    setDragPosition({ x: deltaX, y: 0 });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleTouchEnd();
  };

  // Calculate rotation and opacity based on drag
  const rotateDeg = dragPosition.x / 15;
  const likeOpacity = Math.max(0, -dragPosition.x / 150); // Left swipe = Save
  const passOpacity = Math.max(0, dragPosition.x / 150);  // Right swipe = Pass

  return (
    <div 
      className="relative w-full max-w-sm mx-auto h-[65vh] perspective-1000 touch-none"
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className={`w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white absolute top-0 left-0 transition-transform duration-100 ${!isDragging ? 'transition-all duration-500 ease-out' : ''} ${
          isKid ? 'border-8 border-white' : ''
        }`}
        style={{
          transform: `translateX(${dragPosition.x}px) rotate(${rotateDeg}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Overlays for Swipe Feedback */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-mint-500 mix-blend-multiply transition-opacity" style={{ opacity: likeOpacity }} />
        <div className="absolute top-8 right-8 z-30 pointer-events-none border-4 border-white text-white font-bold text-4xl px-4 py-2 rounded-xl transform -rotate-12 shadow-lg" style={{ opacity: likeOpacity }}>
          SAVED!
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none bg-red-500 mix-blend-multiply transition-opacity" style={{ opacity: passOpacity }} />
        <div className="absolute top-8 left-8 z-30 pointer-events-none border-4 border-white text-white font-bold text-4xl px-4 py-2 rounded-xl transform rotate-12 shadow-lg" style={{ opacity: passOpacity }}>
          NOPE
        </div>

        {/* Hero Image */}
        <div className="h-3/5 w-full relative bg-slate-200 overflow-hidden select-none">
          <div className={`absolute inset-0 bg-slate-200 animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <img 
            src={activity.imageUrl} 
            alt={activity.name} 
            draggable={false}
            className={`w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 z-10">
             {activity.isIndoor ? (
               <CloudRain size={12} className="text-blue-500 animate-pulse" />
             ) : (
               <Sun size={12} className="text-orange-500 animate-[spin_8s_linear_infinite]" />
             )}
             {activity.isIndoor ? 'Indoor' : 'Outdoor'}
          </div>

          {/* Rarity Badge (Progression) */}
          <div className="absolute top-4 left-4">
             {activity.rarity === 'legendary' && (
               <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                 <Star size={10} fill="currentColor" /> LEGENDARY FIND
               </div>
             )}
          </div>
        </div>

        {/* Content */}
        <div className={`h-2/5 px-6 pb-6 pt-10 flex flex-col justify-between select-none ${
          isKid ? 'bg-gradient-to-b from-white to-purple-50' : 'bg-white'
        }`}>
          <div>
            <h2 className={`font-bold leading-tight mb-2 ${
              isKid ? 'text-2xl text-purple-700' : 'text-xl text-slate-800'
            }`}>
              {isKid ? activity.headline : activity.name}
            </h2>
            <p className={`text-sm mb-4 line-clamp-3 ${isKid ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
              {activity.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {activity.tags.slice(0, 3).map(tag => (
                <span key={tag} className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider group hover:scale-110 transition-transform cursor-default ${
                  isKid ? 'bg-orange-100 text-orange-600 font-bold' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tag}
                </span>
              ))}
              
              {!isKid && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors pointer-events-auto"
                  onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Map size={10} />
                  Maps
                </a>
              )}
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-t pt-4 border-slate-100">
            <div className="flex items-center gap-1">
              <Clock size={14} /> {activity.duration}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} /> {activity.priceLevel}
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-mint-100 text-mint-500 px-2 py-0.5 rounded-full">{activity.ageRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Below Card, but interactable) */}
      <div className="absolute top-[60%] left-0 right-0 -translate-y-1/2 flex justify-center gap-6 pointer-events-none z-10 items-center">
        {/* Pass Button */}
        <button 
          onClick={onSwipeRight}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border border-red-100 transform active:scale-90"
        >
          <XIcon size={24} />
        </button>

        {/* Add to Itinerary Button */}
        {!isKid && (
          <button 
            onClick={onAddToItinerary}
            className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all border border-blue-100 transform hover:scale-110 active:scale-95"
            title="Add to Itinerary"
          >
            <CalendarPlus size={24} />
          </button>
        )}

        {/* Save Button */}
        <button 
          onClick={onSwipeLeft}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-mint-500 hover:bg-mint-50 transition-colors border border-mint-100 transform active:scale-90"
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;