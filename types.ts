export interface Activity {
  id: string;
  name: string;
  headline: string;
  description: string;
  imageUrl: string;
  ageRange: string;
  priceLevel: 'Free' | '$' | '$$' | '$$$';
  duration: string;
  tags: string[];
  isIndoor: boolean;
  lat: number;
  lng: number;
  rarity?: 'common' | 'rare' | 'legendary'; // For stickers
}

export interface ItineraryItem {
  title: string;
  description: string;
  location?: string;
  tags: string[];
}

export interface ItineraryDay {
  day: number;
  dayLabel: string; // e.g. "Mon 12", "Day 1"
  morning: ItineraryItem;
  lunch: ItineraryItem;
  afternoon: ItineraryItem;
  evening: ItineraryItem;
}

export enum AppMode {
  PARENT = 'PARENT',
  KID = 'KID'
}

export interface UserPreferences {
  age: number;
  interests: string[];
  isIndoor: boolean;
  maxPrice: number; // 0=Free, 1=$, 2=$$, 3=$$$
  location: {
    lat: number;
    lng: number;
    name: string;
  } | null;
  streakDays: number;
  lastVisitDate: string;
  stickers: string[]; // Array of Activity IDs collected
}

export const INTERESTS = [
  'Art', 'Vehicles', 'Water', 'Ball Sports', 'Animals', 'STEM', 'Quiet Time', 'Adventure'
];