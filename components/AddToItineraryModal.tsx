import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { ItineraryDay } from '../types';

interface AddToItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ItineraryDay[];
  onConfirm: (dayIndex: number, slot: 'morning' | 'lunch' | 'afternoon' | 'evening') => void;
}

const AddToItineraryModal: React.FC<AddToItineraryModalProps> = ({ isOpen, onClose, itinerary, onConfirm }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'lunch' | 'afternoon' | 'evening'>('morning');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-xl font-bold text-slate-800 mb-1">Add to Itinerary</h3>
        <p className="text-slate-500 text-sm mb-6">Choose when to schedule this adventure.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-mint-500"/> Select Day
            </label>
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-mint-500 appearance-none"
            >
              {itinerary.map((day, idx) => (
                <option key={day.day} value={idx}>Day {day.day} - {day.dayLabel}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-mint-500" /> Select Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['morning', 'lunch', 'afternoon', 'evening'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot as any)}
                  className={`p-3 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                    selectedSlot === slot 
                      ? 'bg-mint-50 border-mint-500 text-mint-700' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    {slot}
                    {selectedSlot === slot && <Check size={14} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onConfirm(selectedDay, selectedSlot)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Add Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToItineraryModal;