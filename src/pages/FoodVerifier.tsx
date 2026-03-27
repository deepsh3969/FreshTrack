/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { analyzeFoodImage, ImageAnalysisResult } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, ShieldCheck, AlertTriangle, Clock, RefreshCw, ChevronLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FoodVerifier() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeFoodImage(base64Data);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getFreshnessColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'text-green-500 bg-green-50 border-green-100';
      case 'risky': return 'text-yellow-500 bg-yellow-50 border-yellow-100';
      case 'stale': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-8 flex items-center">
        <Link to="/" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 mr-4">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Food Verifier</h1>
          <p className="text-slate-500">Check freshness using your camera</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* Image Upload Area */}
        <div 
          onClick={() => !analyzing && fileInputRef.current?.click()}
          className={`relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer ${
            image ? 'border-transparent' : 'border-slate-200 bg-white hover:border-orange-500 hover:bg-orange-50'
          }`}
        >
          {image ? (
            <>
              <img src={image} alt="Food to verify" className="w-full h-full object-cover" />
              {analyzing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                  <p className="font-bold">Analyzing Freshness...</p>
                  <p className="text-xs opacity-70 mt-2">Checking color and texture</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-orange-500" />
              </div>
              <p className="font-bold text-slate-900">Take a Photo</p>
              <p className="text-xs text-slate-400 mt-1">or tap to upload from gallery</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        {image && !analyzing && !result && (
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
          >
            Verify Freshness
          </button>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Result Card */}
            <div className={`p-6 rounded-3xl border shadow-sm ${getFreshnessColor(result.freshness)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {result.freshness === 'fresh' ? (
                    <ShieldCheck className="w-8 h-8 mr-3" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 mr-3" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-70">AI Prediction</div>
                    <div className="text-2xl font-black uppercase">{result.freshness}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border mb-2 ${
                    result.isVeg ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'
                  }`}>
                    {result.isVeg ? 'Veg' : 'Non-Veg'}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold opacity-70">Confidence</div>
                    <div className="text-xl font-black">{(result.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                {result.reasoning}
              </p>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center text-slate-400 mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Color Analysis</span>
                </div>
                <p className="text-sm text-slate-700">{result.colorAnalysis}</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center text-slate-400 mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Texture Analysis</span>
                </div>
                <p className="text-sm text-slate-700">{result.textureAnalysis}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setImage(null);
                setResult(null);
              }}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Check Another Item
            </button>
          </motion.div>
        )}

        {/* Freshness Guide */}
        {!result && !analyzing && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="flex items-center text-blue-600 mb-3">
                <Clock className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Freshness Guide</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-slate-600 font-medium">🟢 Fresh (0–2 hrs): Safe to consume</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                  <span className="text-slate-600 font-medium">🟡 Risky (2–4 hrs): Check smell and texture</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                  <span className="text-slate-600 font-medium">🔴 Avoid ({'>'}4 hrs): High risk of contamination</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                How AI Verification Works
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    title: "Color Analysis",
                    desc: "Our AI detects subtle color shifts that indicate oxidation or bacterial growth.",
                    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop"
                  },
                  {
                    title: "Texture Detection",
                    desc: "The model identifies slimy surfaces or loss of structural integrity in fresh produce.",
                    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&auto=format&fit=crop"
                  }
                ].map((step, i) => (
                  <div key={i} className="flex items-center space-x-4 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
