import React, { useState } from 'react';
import { Clock, DollarSign, CloudRain, Sun, Map } from 'lucide-react';
import { Activity, AppMode } from '../types';

interface ActivityCardProps {
  activity: Activity;
  mode: AppMode;
  onSwipeLeft: () => void; // Save
  onSwipeRight: () => void; // Pass
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, mode, onSwipeLeft, onSwipeRight }) => {
  const isKid = mode === AppMode.KID;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative w-full max-w-sm mx-auto h-[65vh] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 ${
      isKid ? 'border-4 border-white transform hover:scale-[1.02]' : 'bg-white'
    }`}>
      {/* Hero Image */}
      <div className="h-3/5 w-full relative bg-slate-200 overflow-hidden">
        {/* Placeholder / Loading Skeleton */}
        <div className={`absolute inset-0 bg-slate-200 animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        
        <img 
          src={activity.imageUrl} 
          alt={activity.name} 
          className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
      </div>

      {/* Content */}
      <div className={`h-2/5 px-6 pb-6 pt-10 flex flex-col justify-between ${
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
              <span key={tag} className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider ${
                isKid ? 'bg-orange-100 text-orange-600 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {tag}
              </span>
            ))}
            
            {/* Open in Maps Button (Parent Mode Only) */}
            {!isKid && (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Map size={10} />
                Open in Maps
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

      {/* Action Buttons overlay */}
      <div className="absolute top-[60%] left-0 right-0 -translate-y-1/2 flex justify-center gap-20 pointer-events-none z-20">
        {/* Pass Button */}
        <button 
          onClick={onSwipeRight}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border border-red-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Save Button */}
        <button 
          onClick={onSwipeLeft}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-mint-500 hover:bg-mint-50 transition-colors border border-mint-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;