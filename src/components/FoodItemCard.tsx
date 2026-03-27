/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { Clock, Trash2, Edit2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface FoodItemCardProps {
  item: FoodItem;
  onDelete?: () => void;
  isVendorView?: boolean;
  key?: string | number;
}

export default function FoodItemCard({ item, onDelete, isVendorView = false }: FoodItemCardProps) {
  const [timeElapsed, setTimeElapsed] = useState(Date.now() - item.preparedAt);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Date.now() - item.preparedAt);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [item.preparedAt]);

  const hoursElapsed = timeElapsed / (1000 * 60 * 60);
  
  const getFreshnessStatus = () => {
    if (hoursElapsed <= 2) return { status: 'Fresh', color: 'text-green-500 bg-green-50 border-green-100', icon: ShieldCheck };
    if (hoursElapsed <= 4) return { status: 'Risky', color: 'text-yellow-500 bg-yellow-50 border-yellow-100', icon: Info };
    return { status: 'Avoid', color: 'text-red-500 bg-red-50 border-red-100', icon: AlertTriangle };
  };

  const { status, color, icon: StatusIcon } = getFreshnessStatus();

  const formatTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m ago`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between"
    >
      <div className="relative h-40 mb-4 rounded-2xl overflow-hidden bg-slate-100">
        <img 
          src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop'} 
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
            item.isVeg ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'
          }`}>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </div>
          <div className={`w-6 h-6 bg-white rounded-md border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div>
            <h3 className="font-bold text-slate-900">{item.name}</h3>
            <div className="text-xs text-slate-400 font-medium tracking-tight">₹{item.price} • {item.category}</div>
          </div>
        </div>
        
        {isVendorView && (
          <div className="flex space-x-2">
            <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className={`p-3 rounded-2xl border flex items-center justify-between ${color}`}>
        <div className="flex items-center">
          <StatusIcon className="w-5 h-5 mr-2" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Freshness Status</div>
            <div className="text-sm font-black uppercase">{status}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-[10px] font-bold opacity-70 uppercase tracking-wider">
            <Clock className="w-3 h-3 mr-1" /> Prepared
          </div>
          <div className="text-xs font-bold">{formatTime(timeElapsed)}</div>
        </div>
      </div>

      {!isVendorView && (
        <button className="mt-4 w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
          Add to Plate
        </button>
      )}
    </motion.div>
  );
}
