/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, ArrowRight, Star, AlertTriangle, Clock, Camera, User, Sparkles, Navigation, Train, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <Train className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 uppercase">Fresh <span className="text-green-600">Food</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">About</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#ratings" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">Vendor Ratings</a>
            <Link 
              to="/login?role=customer&mode=login" 
              className="px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-100"
            >
              Check Food Safety Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1474487056235-526c546e5032?q=80&w=2000&auto=format&fit=crop" 
            alt="Scenic Train Journey"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6">
                Never Eat <span className="text-orange-400">Unsafe Food</span> on Your Train Journey Again
              </h1>
              
              <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-xl font-medium">
                Verify food freshness, check vendor ratings, and get instant alerts about unsafe food vendors at railway stations. Your safety comes first.
              </p>

              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/login?role=customer&mode=signup" 
                  className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all shadow-2xl shadow-green-500/20 flex items-center justify-center space-x-2"
                  aria-label="Check food safety now"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Check Food Safety Now</span>
                </Link>
                <a 
                  href="#features" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center"
                  aria-label="Explore features"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold">Real-time Alerts</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold">Verified Vendors</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/10 backdrop-blur-sm">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fresh Healthy Food"
                  className="w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                
                {/* Train Icon Overlay */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  <Train className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl z-20 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Safety Score</div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">98% Verified</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>

      {/* Problem Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517093157656-b9424f461507?q=80&w=2000&auto=format&fit=crop" 
            alt="Railway Background"
            className="w-full h-full object-cover opacity-5"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-50/90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-black text-orange-600 uppercase tracking-[0.3em] mb-4 block">The Problem</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
              Train Food Safety is a <span className="text-red-600 uppercase">Serious Concern</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Every year, thousands of train passengers suffer from foodborne illnesses due to stale, unhygienic, or improperly stored food sold at railway stations and trains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
                title: "No Way to Verify",
                desc: "Passengers have no reliable method to check if the food they're about to buy is fresh or safe for consumption.",
                bgColor: "bg-red-50",
                image: "https://images.unsplash.com/photo-1585932231552-29877a5f50f1?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                title: "Health Risks",
                desc: "Food poisoning and stomach issues are common among train travelers due to contaminated or expired food products.",
                bgColor: "bg-orange-50",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <Star className="w-6 h-6 text-yellow-500" />,
                title: "Wasted Money",
                desc: "Passengers end up paying premium prices for low-quality, stale food with no recourse or compensation options.",
                bgColor: "bg-yellow-50",
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-10">
                  <div className={`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-6 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Annual Cases of Food Poisoning", value: "5M+" },
              { label: "Lost to Poor Food Quality", value: "₹2000 Cr" },
              { label: "Unverified Vendors at Stations", value: "70%" },
              { label: "Existing Verification Systems", value: "0" }
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm font-bold opacity-80 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop" 
            alt="Food Background"
            className="w-full h-full object-cover opacity-5"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/95"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Our Solution</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
            Powerful Features for <span className="text-green-600">Your Safety</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed mb-20 font-medium">
            Our app combines cutting-edge technology with real-time crowd-sourced data to keep you safe from unsafe food during your train journeys.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="w-6 h-6 text-green-600" />,
                title: "Vendor Rating System",
                desc: "Real ratings based on freshness, taste, and hygiene. Make informed decisions before buying.",
                link: "Learn more",
                bgColor: "bg-green-50",
                image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <Clock className="w-6 h-6 text-green-600" />,
                title: "Freshness Time Tracker",
                desc: "Track food preparation time and get instant freshness estimates: Fresh (0-2hrs), Risky (2-4hrs), Avoid (4+hrs).",
                link: "Learn more",
                bgColor: "bg-green-50",
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <MapPin className="w-6 h-6 text-green-600" />,
                title: "Location-Based Alerts",
                desc: "Get alerts about safe and blacklisted vendors at your current station or upcoming stops.",
                link: "Learn more",
                bgColor: "bg-green-50",
                image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <Camera className="w-6 h-6 text-green-600" />,
                title: "AI Food Image Check",
                desc: "Upload a photo of your food and get AI-powered analysis of freshness based on color and texture.",
                link: "Try it now",
                bgColor: "bg-green-50",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <AlertTriangle className="w-6 h-6 text-green-600" />,
                title: "Instant Warning System",
                desc: "Get notified when multiple users report illness from a specific vendor. Emergency alerts when needed.",
                link: "Learn more",
                bgColor: "bg-green-50",
                image: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=800&auto=format&fit=crop"
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
                title: "Food History Tracker",
                desc: "Keep track of everything you eat during your journey. Report issues if you feel unwell later.",
                link: "Learn more",
                bgColor: "bg-green-50",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] border border-slate-100 text-left hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>
                <div className="p-8 pt-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{feature.desc}</p>
                  <button className="text-green-600 font-bold text-sm flex items-center hover:translate-x-1 transition-transform">
                    {feature.link} <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16">
            <button className="px-8 py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-all flex items-center mx-auto space-x-2 shadow-xl shadow-green-900/20">
              <span>View All Features</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Find My Train Showcase Section */}
      <section id="train-tracking" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center space-x-2 bg-orange-500/20 border border-orange-500/30 px-4 py-1.5 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">New Feature</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                Integrated <span className="text-orange-500">Find My Train</span> Experience
              </h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                No more guessing where your train is. Track your journey's live route, see upcoming stations, and pre-order safe food to be delivered right to your seat.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Navigation className="w-6 h-6 text-blue-400" />, title: "Live Route Tracking", desc: "See your train's real-time location and upcoming station stops." },
                  { icon: <Clock className="w-6 h-6 text-green-400" />, title: "Station-Wise Vendors", desc: "Browse verified food vendors at every station on your route." },
                  { icon: <ShieldCheck className="w-6 h-6 text-orange-400" />, title: "PNR Seat Delivery", desc: "Enter your PNR to get fresh, safe food delivered directly to your coach." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="bg-slate-800 rounded-[3rem] p-4 shadow-2xl border border-white/10 relative">
                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Train className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-sm">Bhopal Shatabdi</div>
                        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">#12002 • On Time</div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex flex-col space-y-8 relative">
                      <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/5"></div>
                      {[
                        { name: 'New Delhi', time: '06:00', status: 'passed' },
                        { name: 'Mathura Jn', time: '07:20', status: 'current' },
                        { name: 'Agra Cantt', time: '08:06', status: 'upcoming' },
                        { name: 'Gwalior Jn', time: '09:23', status: 'upcoming' }
                      ].map((s, i) => (
                        <div key={i} className="flex items-center space-x-6 relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            s.status === 'passed' ? 'bg-green-500 border-green-500' : 
                            s.status === 'current' ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/40' : 
                            'bg-slate-800 border-white/10'
                          }`}>
                            {s.status === 'passed' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <MapPin className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className={`font-black text-sm ${s.status === 'upcoming' ? 'text-white/40' : 'text-white'}`}>{s.name}</div>
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{s.time} • {s.status}</div>
                          </div>
                          {s.status === 'current' && (
                            <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg text-[10px] font-black text-orange-400 uppercase tracking-widest">
                              Order Now
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs font-black text-white uppercase tracking-widest">Safe Vendors at Mathura</div>
                        <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">3 Verified</div>
                      </div>
                      <div className="flex space-x-3">
                        {[1, 2].map(i => (
                          <div key={i} className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                            <div className="w-full h-16 bg-slate-700 rounded-xl mb-2 overflow-hidden">
                              <img src={`https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop`} alt="food" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                            </div>
                            <div className="text-[10px] font-black text-white truncate">Railway Kitchen {i}</div>
                            <div className="flex items-center text-orange-400 text-[8px] mt-1">
                              <Star className="w-2 h-2 fill-current mr-1" />
                              4.5 • Safe
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 p-6 bg-white rounded-3xl shadow-2xl border border-slate-100 hidden lg:block"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Safety Verified</div>
                    <div className="text-[10px] font-bold text-slate-400">Mathura Station</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-4 block">The Process</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Engineered for <span className="text-green-600">Passenger Safety</span>
              </h2>
            </div>
            <p className="text-lg text-slate-500 max-w-md leading-relaxed font-medium">
              We've simplified the complex task of food safety verification into four intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            {[
              { 
                step: "01", 
                title: "Secure Onboarding", 
                desc: "Create your profile as a traveler or vendor. We use industry-standard encryption to protect your data.",
                icon: <User className="w-6 h-6" />
              },
              { 
                step: "02", 
                title: "Contextual Awareness", 
                desc: "Enable location services to receive real-time safety alerts for your specific train station.",
                icon: <Navigation className="w-6 h-6" />
              },
              { 
                step: "03", 
                title: "Safety Verification", 
                desc: "Access vendor ratings and freshness trackers. Use AI to analyze food quality before you buy.",
                icon: <ShieldCheck className="w-6 h-6" />
              },
              { 
                step: "04", 
                title: "Travel with Peace", 
                desc: "Enjoy your meal with confidence. Report any issues to help maintain high safety standards for everyone.",
                icon: <CheckCircle2 className="w-6 h-6" />
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 flex flex-col items-start group hover:bg-slate-50 transition-colors duration-500">
                <div className="text-4xl font-black text-slate-100 group-hover:text-green-100 transition-colors mb-8 font-mono tracking-tighter">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/login?role=customer&mode=signup" 
              className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-2xl shadow-slate-900/20 flex items-center space-x-3"
              aria-label="Sign up as a consumer"
            >
              <User className="w-5 h-5" />
              <span>Consumer Sign Up</span>
            </Link>
            <Link 
              to="/login?role=vendor&mode=signup" 
              className="px-12 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition-all flex items-center space-x-3"
              aria-label="Register as a vendor"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Vendor Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Vendor Ratings Section */}
      <section id="ratings" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2000&auto=format&fit=crop" 
            alt="Restaurant Background"
            className="w-full h-full object-cover opacity-5"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-50/90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Community Feedback</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
              Top Rated <span className="text-green-600">Vendors</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Real ratings from real passengers. See which vendors are consistently delivering safe and fresh food.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Railway Kitchen 1", rating: 4.8, reviews: 1240, comment: "Excellent hygiene and fresh food.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop" },
              { name: "Station Snacks", rating: 4.5, reviews: 850, comment: "Great variety and quick service.", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop" },
              { name: "Trackside Treats", rating: 4.2, reviews: 620, comment: "Good quality, but can be busy.", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop" },
              { name: "Express Eats", rating: 4.9, reviews: 2100, comment: "Best food on the route!", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" }
            ].map((vendor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-black text-slate-900">{vendor.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{vendor.name}</h3>
                  <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <User className="w-3 h-3 mr-1" />
                    {vendor.reviews} Reviews
                  </div>
                  <p className="text-slate-500 text-sm italic leading-relaxed">"{vendor.comment}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1474487056235-526c546e5032?q=80&w=2000&auto=format&fit=crop" 
            alt="Journey Background"
            className="w-full h-full object-cover opacity-5"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-50/90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Process</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
              How It <span className="text-green-600">Works</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Three simple steps to ensure you never have to worry about train food again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Search Your Journey",
                desc: "Enter your train number or PNR to see vendors at your upcoming stations.",
                image: "https://images.unsplash.com/photo-1474487056235-526c546e5032?q=80&w=800&auto=format&fit=crop"
              },
              {
                step: "02",
                title: "Check Safety Ratings",
                desc: "Browse vendors and see real-time freshness scores and user reviews.",
                image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop"
              },
              {
                step: "03",
                title: "Order & Verify",
                desc: "Order your meal and use our AI tool to verify freshness upon delivery.",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden mb-8 shadow-2xl">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <div className="text-5xl font-black text-white/20 mb-2">{item.step}</div>
                    <h3 className="text-2xl font-black text-white">{item.title}</h3>
                  </div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed px-4">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fresh Vegetarian Food"
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-orange-500 text-white p-4 rounded-2xl shadow-xl">
                  <div className="text-2xl font-black">4.8</div>
                  <div className="flex text-yellow-300">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <div className="text-[10px] font-bold opacity-80 uppercase mt-1">App Rating</div>
                </div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Freshness Verified</div>
                    <div className="text-xs text-green-600 font-bold">Safe to eat ✅</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Why Choose Us</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                Built for Train Travelers, <span className="text-green-600">Your Safety First</span>
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                We understand the challenges of finding safe, quality food during train journeys. Our platform bridges the gap between passengers and verified vendors.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Real-Time Data", desc: "Freshness updates and ratings updated every few minutes based on user reports." },
                  { title: "Crowd-Powered", desc: "Community-driven ratings ensure authenticity and reliability." },
                  { title: "Emergency Alerts", desc: "Instant notifications when multiple users report food safety issues." },
                  { title: "AI-Powered Analysis", desc: "Leverage advanced algorithms to detect potential food safety risks." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-10 text-green-600 font-bold flex items-center hover:translate-x-1 transition-transform">
                Learn more about us <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Freshness Gallery Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-orange-600 uppercase tracking-[0.3em] mb-4 block">Visual Journey</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
              Freshness You Can <span className="text-orange-500">See</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              We partner with vendors who prioritize quality and transparency. Here's a glimpse of the standards we uphold.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[40px] overflow-hidden shadow-2xl aspect-[3/4]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fresh Pizza" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[40px] overflow-hidden shadow-2xl aspect-square"
              >
                <img 
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop" 
                  alt="Healthy Salad" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
            <div className="space-y-8 pt-12">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[40px] overflow-hidden shadow-2xl aspect-square"
              >
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fresh Ingredients" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[40px] overflow-hidden shadow-2xl aspect-[3/4]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop" 
                  alt="Travel Journey" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
            <div className="space-y-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[40px] overflow-hidden shadow-2xl aspect-[3/4]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" 
                  alt="Gourmet Meal" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-[40px] overflow-hidden shadow-2xl aspect-square"
              >
                <img 
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fresh Fruit" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2000&auto=format&fit=crop" 
            alt="Fresh Food Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-green-800/90"></div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
            <span className="text-sm font-bold text-white">🎉 Launching Soon - Join the Waitlist</span>
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
            Ready to Transform Your <span className="text-orange-500">Train Food Experience?</span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Be among the first to access our platform. Sign up now and get exclusive early-bird benefits when we launch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/login?role=customer&mode=signup" 
              className="w-full sm:w-auto px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center space-x-2"
              aria-label="Sign up as a consumer"
            >
              <User className="w-6 h-6" />
              <span>Consumer Sign Up</span>
            </Link>
            <Link 
              to="/login?role=vendor&mode=signup" 
              className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
              aria-label="Register as a vendor"
            >
              <ShieldCheck className="w-6 h-6" />
              <span>Vendor Registration</span>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold">Privacy Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <Train className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-2xl tracking-tight uppercase">Fresh <span className="text-green-500">Food</span></span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed mb-8 font-medium">
                Dedicated to ensuring safe and fresh food for train travelers across India. Your health is our priority.
              </p>
              <div className="flex items-center space-x-4">
                {['twitter', 'instagram', 'facebook', 'youtube'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors border border-white/5">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-slate-400 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Vendor Ratings</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Find Safe Food</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-6">For Consumers</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/login?role=customer&mode=signup" className="hover:text-orange-500 transition-colors">Sign Up</Link></li>
                <li><Link to="/login?role=customer&mode=login" className="hover:text-orange-500 transition-colors">Login</Link></li>
                <li><Link to="/" className="hover:text-orange-500 transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Food History</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Check Freshness</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-6">For Vendors</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/login?role=vendor&mode=signup" className="hover:text-orange-500 transition-colors">Register</Link></li>
                <li><Link to="/login?role=vendor&mode=login" className="hover:text-orange-500 transition-colors">Vendor Login</Link></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Vendor Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Report Issue</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Safety Alerts</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Our Technology</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-bold">
            <div className="max-w-2xl text-center md:text-left">
              <p className="mb-2">© 2026 Food Freshness Verifier. All rights reserved.</p>
              <p className="text-orange-500/80 flex items-center justify-center md:justify-start">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Warning: The information provided above is for trial purposes only. Please verify food safety independently before consumption.
              </p>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
