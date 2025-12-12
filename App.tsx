import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ActivityCard from './components/ActivityCard';
import Filters from './components/Filters';
import ItineraryView from './components/ItineraryView';
import ProfileView from './components/ProfileView';
import SubscriptionModal from './components/SubscriptionModal';
import { Activity, AppMode, UserPreferences, ItineraryDay } from './types';
import { fetchSuggestedActivities, generateHolidayItinerary } from './services/geminiService';
import { MapPin, Lock, RefreshCw } from 'lucide-react';

const DEFAULT_PREFS: UserPreferences = {
  age: 6,
  interests: ['Vehicles', 'Animals'],
  isIndoor: false,
  maxPrice: 1,
  location: null
};

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.PARENT);
  const [activeTab, setActiveTab] = useState('explore');
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pro / Subscription State
  const [isPro, setIsPro] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
  
  // Start loading true so we don't show "No activities" while locating
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  // Initialize Geo
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPrefs(prev => ({
            ...prev,
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              name: "Current Location"
            }
          }));
        }, 
        (err) => {
          console.warn("Geo denied or failed", err);
          useDefaultLocation();
        },
        { timeout: 5000 } // Timeout after 5s and use default
      );
    } else {
      useDefaultLocation();
    }
  }, []);

  const useDefaultLocation = () => {
    setPrefs(prev => ({
      ...prev,
      location: { lat: 40.7128, lng: -74.0060, name: "New York" }
    }));
  };

  // Fetch initial activities when location is set
  useEffect(() => {
    if (prefs.location && activities.length === 0) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.location]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const results = await fetchSuggestedActivities(prefs);
      setActivities(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItineraryGen = async () => {
    if (!isPro) {
      setShowSubscriptionModal(true);
      return;
    }
    setLoadingItinerary(true);
    try {
      // Pro gets 14 days
      const plan = await generateHolidayItinerary(prefs, 14);
      setItinerary(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingItinerary(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (visibleActivities.length === 0) return;
    
    const current = activities[0];
    if (direction === 'left') {
      // Save
      setSavedActivities(prev => [...prev, current]);
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
    
    // Remove from stack
    setActivities(prev => prev.slice(1));

    // Refill logic
    if (activities.length < 3 && isPro) {
      loadActivities();
    }
  };

  const handleToggleMode = () => {
    setMode(prev => prev === AppMode.PARENT ? AppMode.KID : AppMode.PARENT);
  };

  const handleUpgradeClick = () => {
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false);
    setIsPro(true);
    alert("🎉 Welcome to Pro! You can now generate full itineraries.");
  };

  // Logic to limit free users
  const visibleActivities = isPro ? activities : activities.slice(0, 5);
  const isLimitReached = !isPro && activities.length > 0 && visibleActivities.length === 0;

  const renderContent = () => {
    if (activeTab === 'explore') {
      return (
        <div className="h-full flex flex-col p-4 relative">
          {/* Top Bar inside View */}
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center text-slate-500 text-sm">
                <MapPin size={16} className="mr-1" />
                {prefs.location?.name || 'Locating...'}
             </div>
             <div className="flex gap-2">
                {!isPro && (
                  <button onClick={handleUpgradeClick} className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-sm">
                    GO PRO
                  </button>
                )}
                <button 
                  onClick={() => setShowFilters(true)}
                  className="text-mint-500 font-bold text-sm bg-mint-50 px-3 py-1 rounded-full"
                >
                  Filters
                </button>
             </div>
          </div>

          {/* Cards Stack */}
          <div className="flex-1 flex items-center justify-center relative">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${mode === AppMode.KID ? 'border-purple-500' : 'border-mint-500'}`} />
                <div className="text-slate-400 font-bold animate-pulse">Finding fun spots...</div>
              </div>
            ) : visibleActivities.length > 0 ? (
              <ActivityCard 
                activity={visibleActivities[0]} 
                mode={mode}
                onSwipeLeft={() => handleSwipe('left')}
                onSwipeRight={() => handleSwipe('right')}
              />
            ) : isLimitReached ? (
              // Paywall Card
              <div className="w-full max-w-sm h-[65vh] bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center border-4 border-amber-100 relative overflow-hidden">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-500">
                  <Lock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">You've hit the limit!</h2>
                <p className="text-slate-500 mb-6">Free users get 5 swipes per session. Upgrade to unlock unlimited activities and 2-week itinerary building.</p>
                <button 
                  onClick={handleUpgradeClick}
                  className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg w-full"
                >
                  Unlock for $9.99/mo
                </button>
              </div>
            ) : (
              // Empty State
              <div className="text-center p-8">
                <p className="mb-4 text-slate-600">No activities found. Try changing your filters or checking your connection.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setShowFilters(true)} className="text-mint-500 font-bold bg-mint-50 px-4 py-2 rounded-xl">
                    Edit Filters
                  </button>
                  <button onClick={loadActivities} className="flex items-center justify-center gap-2 text-slate-500 font-bold bg-slate-100 px-4 py-2 rounded-xl">
                    <RefreshCw size={16} /> Retry
                  </button>
                </div>
              </div>
            )}
            
            {/* Background stack effect */}
            {visibleActivities.length > 1 && (
               <div className="absolute top-6 w-full max-w-sm h-[65vh] bg-white/50 rounded-3xl -z-10 scale-95 transform translate-y-4 shadow-sm border border-slate-100"></div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'plan') {
      return (
        <ItineraryView 
          itinerary={itinerary}
          mode={mode}
          isLoading={loadingItinerary}
          onGenerate={handleItineraryGen}
          isPro={isPro}
          onUpgrade={handleUpgradeClick}
        />
      );
    }

    if (activeTab === 'saved') {
      return (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Saved Adventures</h2>
          {savedActivities.length === 0 ? (
            <div className="text-center text-slate-400 mt-20">
              No saved activities yet. Go Explore!
            </div>
          ) : (
            savedActivities.map(act => (
              <div key={act.id} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm">
                <img src={act.imageUrl} alt={act.name} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold text-slate-800">{act.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{act.headline}</p>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === 'profile') {
      return (
        <div className="h-full overflow-y-auto pb-20">
          <ProfileView prefs={prefs} savedCount={savedActivities.length} />
          {!isPro && (
            <div className="px-6 pb-6">
              <button 
                onClick={handleUpgradeClick}
                className="w-full bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 font-bold py-4 rounded-xl shadow-md"
              >
                Upgrade to Kidventour Pro 🚀
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      mode={mode}
      onToggleMode={handleToggleMode}
      showBoredButton={activeTab === 'explore'}
      onBoredClick={() => {
         alert("I'm Bored clicked! Imagine a random fun activity popping up here.");
      }}
    >
      {renderContent()}

      {showFilters && (
        <Filters 
          prefs={prefs}
          onChange={(p) => {
            setPrefs(p);
            setActivities([]); // clear so we fetch new
          }}
          onClose={() => setShowFilters(false)}
        />
      )}

      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSuccess={handleSubscriptionSuccess}
      />
    </Layout>
  );
}