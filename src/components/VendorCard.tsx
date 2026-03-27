/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vendor } from '../types';
import { Star, ShieldCheck, AlertTriangle, Clock, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface VendorCardProps {
  vendor: Vendor;
  variant?: 'default' | 'warning';
  onViewMenu?: () => void;
  key?: string | number;
}

export default function VendorCard({ vendor, variant = 'default', onViewMenu }: VendorCardProps) {
  const isRisky = variant === 'warning' || vendor.isBlacklisted || vendor.illnessReportsToday > 0;

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-5 rounded-3xl shadow-sm border transition-all flex flex-col justify-between overflow-hidden ${
        isRisky 
          ? 'bg-red-50 border-red-100' 
          : 'bg-white border-slate-100'
      }`}
    >
      <div className="relative h-32 -mx-5 -mt-5 mb-4 overflow-hidden">
        <img 
          src={vendor.imageUrl || `https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop`} 
          alt={vendor.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex items-center">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-2 ${
            isRisky ? 'bg-red-500' : 'bg-orange-500'
          }`}>
            {isRisky ? (
              <AlertTriangle className="w-4 h-4 text-white" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-white" />
            )}
          </div>
          <h3 className="font-black text-white leading-tight drop-shadow-md">{vendor.name}</h3>
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {vendor.isVerified && (
            <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified
            </div>
          )}
          <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20 shadow-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-xs font-black text-slate-900">{vendor.rating.toFixed(1)}</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20 shadow-sm flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
            <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Verified</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <MapPin className="w-3 h-3 mr-1 text-orange-500" />
          <span>{vendor.station}</span>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {vendor.totalRatings} Reviews
        </div>
      </div>

      {isRisky && vendor.illnessReportsToday > 0 && (
        <div className="mb-4 p-2 bg-red-100/50 rounded-xl flex items-center text-red-600 text-[10px] font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3 h-3 mr-2" />
          <span>⚠️ {vendor.illnessReportsToday} people reported illness today</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-50 p-2 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Hygiene</div>
          <div className="text-sm font-bold text-slate-900">{vendor.hygieneScore.toFixed(1)}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Freshness</div>
          <div className="text-sm font-bold text-slate-900">{vendor.freshnessScore.toFixed(1)}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Taste</div>
          <div className="text-sm font-bold text-slate-900">{vendor.tasteScore.toFixed(1)}</div>
        </div>
      </div>

      <button 
        onClick={onViewMenu}
        className={`w-full py-3 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${
        isRisky 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-orange-500 text-white hover:bg-orange-600'
      }`}>
        View Menu <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </motion.div>
  );
}
