import React from 'react';
import { UserPreferences } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProfileViewProps {
  prefs: UserPreferences;
  savedCount: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ prefs, savedCount }) => {
  const data = [
    { name: 'Art', value: prefs.interests.includes('Art') ? 80 : 20 },
    { name: 'Sports', value: prefs.interests.includes('Ball Sports') ? 60 : 10 },
    { name: 'Nature', value: prefs.interests.includes('Animals') ? 90 : 30 },
    { name: 'STEM', value: prefs.interests.includes('STEM') ? 75 : 15 },
  ];

  const COLORS = ['#3AE2B7', '#8884d8', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl">
          👶
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kid Adventurer</h2>
          <p className="text-sm text-slate-500">{prefs.age} years old • {savedCount} Saved spots</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-4">Interest Profile</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-slate-400 mt-2">Based on your selections and saved items.</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-700">Account Settings</h3>
        <button className="w-full text-left p-4 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Notifications
        </button>
        <button className="w-full text-left p-4 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Offline Maps Storage
        </button>
        <button className="w-full text-left p-4 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Privacy & Safety
        </button>
      </div>
    </div>
  );
};

export default ProfileView;