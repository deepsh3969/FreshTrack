/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, limit, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor, UserProfile, FoodHistory, FoodItem } from '../types';
import { motion } from 'motion/react';
import { MapPin, AlertTriangle, CheckCircle, History, Search, Filter, X, Train, Navigation, Clock, ChevronRight, Star, Store, Sparkles, ShieldCheck } from 'lucide-react';
import VendorCard from '../components/VendorCard';
import FoodItemCard from '../components/FoodItemCard';
import { toast } from 'sonner';
import { AnimatePresence } from 'motion/react';

interface DashboardProps {
  user: UserProfile;
}

interface TrainRouteStation {
  name: string;
  code: string;
  arrivalTime: string;
  departureTime: string;
}

const MOCK_TRAINS = [
  { 
    number: '12002', 
    name: 'Bhopal Shatabdi', 
    route: [
      { name: 'New Delhi', code: 'NDLS', arrivalTime: '06:00', departureTime: '06:00' },
      { name: 'Mathura Jn', code: 'MTJ', arrivalTime: '07:20', departureTime: '07:22' },
      { name: 'Agra Cantt', code: 'AGC', arrivalTime: '08:06', departureTime: '08:11' },
      { name: 'Gwalior Jn', code: 'GWL', arrivalTime: '09:23', departureTime: '09:28' },
      { name: 'Jhansi Jn', code: 'VGLJ', arrivalTime: '10:43', departureTime: '10:48' },
      { name: 'Bhopal Jn', code: 'BPL', arrivalTime: '14:25', departureTime: '14:25' },
    ]
  },
  { 
    number: '12424', 
    name: 'Dibrugarh Rajdhani', 
    route: [
      { name: 'New Delhi', code: 'NDLS', arrivalTime: '16:20', departureTime: '16:20' },
      { name: 'Kanpur Central', code: 'CNB', arrivalTime: '21:40', departureTime: '21:45' },
      { name: 'Prayagraj Jn', code: 'PRYJ', arrivalTime: '23:50', departureTime: '23:55' },
      { name: 'Pt Deen Dayal Upadhyaya Jn', code: 'DDU', arrivalTime: '02:00', departureTime: '02:10' },
      { name: 'Patna Jn', code: 'PNBE', arrivalTime: '04:40', departureTime: '04:50' },
    ]
  },
  {
    number: '12951',
    name: 'Mumbai Rajdhani',
    route: [
      { name: 'Mumbai Central', code: 'MMCT', arrivalTime: '16:35', departureTime: '16:35' },
      { name: 'Surat', code: 'ST', arrivalTime: '19:37', departureTime: '19:42' },
      { name: 'Vadodara Jn', code: 'BRC', arrivalTime: '21:07', departureTime: '21:17' },
      { name: 'Ratlam Jn', code: 'RTM', arrivalTime: '00:25', departureTime: '00:28' },
      { name: 'Kota Jn', code: 'KOTA', arrivalTime: '03:15', departureTime: '03:20' },
      { name: 'New Delhi', code: 'NDLS', arrivalTime: '08:32', departureTime: '08:32' },
    ]
  },
  {
    number: '12301',
    name: 'Howrah Rajdhani',
    route: [
      { name: 'Howrah Jn', code: 'HWH', arrivalTime: '16:50', departureTime: '16:50' },
      { name: 'Asansol Jn', code: 'ASN', arrivalTime: '18:57', departureTime: '18:59' },
      { name: 'Dhanbad Jn', code: 'DHN', arrivalTime: '19:55', departureTime: '20:00' },
      { name: 'Gaya Jn', code: 'GAYA', arrivalTime: '22:31', departureTime: '22:34' },
      { name: 'Pt Deen Dayal Upadhyaya Jn', code: 'DDU', arrivalTime: '00:45', departureTime: '00:55' },
      { name: 'Prayagraj Jn', code: 'PRYJ', arrivalTime: '02:43', departureTime: '02:45' },
      { name: 'Kanpur Central', code: 'CNB', arrivalTime: '04:50', departureTime: '04:55' },
      { name: 'New Delhi', code: 'NDLS', arrivalTime: '10:00', departureTime: '10:00' },
    ]
  },
  {
    number: '22436',
    name: 'Vande Bharat Express',
    route: [
      { name: 'New Delhi', code: 'NDLS', arrivalTime: '06:00', departureTime: '06:00' },
      { name: 'Kanpur Central', code: 'CNB', arrivalTime: '10:08', departureTime: '10:10' },
      { name: 'Prayagraj Jn', code: 'PRYJ', arrivalTime: '12:08', departureTime: '12:10' },
      { name: 'Varanasi Jn', code: 'BSB', arrivalTime: '14:00', departureTime: '14:00' },
    ]
  }
];

const TRENDING_DISHES_BY_STATION: Record<string, { name: string; vendor: string; img: string; price: string }[]> = {
  'NDLS': [
    { name: 'Amritsari Kulcha', vendor: 'Delhi Delights', img: 'https://images.unsplash.com/photo-1601050633647-8f8f5f39d1ff?q=80&w=800&auto=format&fit=crop', price: '120' },
    { name: 'Butter Chicken', vendor: 'Mughal Kitchen', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop', price: '350' },
    { name: 'Chole Bhature', vendor: 'Pindi Express', img: 'https://images.unsplash.com/photo-1626132646529-500637532537?q=80&w=800&auto=format&fit=crop', price: '150' },
  ],
  'MTJ': [
    { name: 'Mathura Peda', vendor: 'Brijwasi Sweets', img: 'https://images.unsplash.com/photo-1589113103503-49683e89bc73?q=80&w=800&auto=format&fit=crop', price: '200' },
    { name: 'Kachori Sabzi', vendor: 'Krishna Bhojnalaya', img: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?q=80&w=800&auto=format&fit=crop', price: '80' },
    { name: 'Lassi', vendor: 'Radhe Dairy', img: 'https://images.unsplash.com/photo-1571153639161-322c55a14554?q=80&w=800&auto=format&fit=crop', price: '60' },
  ],
  'AGC': [
    { name: 'Agra Petha', vendor: 'Panchi Petha', img: 'https://images.unsplash.com/photo-1589113103503-49683e89bc73?q=80&w=800&auto=format&fit=crop', price: '180' },
    { name: 'Bedai Jalebi', vendor: 'Agra Sweets', img: 'https://images.unsplash.com/photo-1626132646529-500637532537?q=80&w=800&auto=format&fit=crop', price: '100' },
    { name: 'Mughlai Thali', vendor: 'Taj Kitchen', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop', price: '280' },
  ],
  'MMCT': [
    { name: 'Vada Pav', vendor: 'Mumbai Bites', img: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?q=80&w=800&auto=format&fit=crop', price: '40' },
    { name: 'Pav Bhaji', vendor: 'Chowpatty Express', img: 'https://images.unsplash.com/photo-1601050633647-8f8f5f39d1ff?q=80&w=800&auto=format&fit=crop', price: '150' },
    { name: 'Misal Pav', vendor: 'Puneri Tadka', img: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?q=80&w=800&auto=format&fit=crop', price: '120' },
  ],
  'HWH': [
    { name: 'Fish Curry', vendor: 'Bengali Bhoj', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop', price: '220' },
    { name: 'Rosogolla', vendor: 'KC Das', img: 'https://images.unsplash.com/photo-1589113103503-49683e89bc73?q=80&w=800&auto=format&fit=crop', price: '100' },
    { name: 'Luchi Alur Dom', vendor: 'Howrah Kitchen', img: 'https://images.unsplash.com/photo-1601050633647-8f8f5f39d1ff?q=80&w=800&auto=format&fit=crop', price: '140' },
  ],
  'DEFAULT': [
    { name: 'Paneer Butter Masala', vendor: 'Railway Kitchen 1', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop', price: '240' },
    { name: 'Veg Dum Biryani', vendor: 'Trackside Treats', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop', price: '180' },
    { name: 'Masala Dosa', vendor: 'South Express', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop', price: '120' },
  ]
};

export default function Dashboard({ user }: DashboardProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [history, setHistory] = useState<FoodHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState('New Delhi (NDLS)');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [pnr, setPnr] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorFoodItems, setVendorFoodItems] = useState<FoodItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  
  // Find My Train States
  const [trainSearch, setTrainSearch] = useState('');
  const [selectedTrain, setSelectedTrain] = useState<typeof MOCK_TRAINS[0] | null>(null);
  const [showTrainSearch, setShowTrainSearch] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [stationSearch, setStationSearch] = useState('');

  const POPULAR_STATIONS = [
    { name: 'New Delhi', code: 'NDLS', lat: 28.6429, lng: 77.2191 },
    { name: 'Mumbai Central', code: 'MMCT', lat: 18.9696, lng: 72.8193 },
    { name: 'Howrah Jn', code: 'HWH', lat: 22.5830, lng: 88.3433 },
    { name: 'Chennai Central', code: 'MAS', lat: 13.0827, lng: 80.2707 },
    { name: 'Bengaluru City', code: 'SBC', lat: 12.9780, lng: 77.5698 },
    { name: 'Ahmedabad Jn', code: 'ADI', lat: 23.0273, lng: 72.5949 },
    { name: 'Pune Jn', code: 'PUNE', lat: 18.5289, lng: 73.8744 },
    { name: 'Secunderabad Jn', code: 'SC', lat: 17.4334, lng: 78.5017 },
    { name: 'Lucknow Charbagh', code: 'LKO', lat: 26.8322, lng: 80.9220 },
    { name: 'Patna Jn', code: 'PNBE', lat: 25.6022, lng: 85.1376 },
    { name: 'Mathura Jn', code: 'MTJ', lat: 27.4924, lng: 77.6737 },
    { name: 'Agra Cantt', code: 'AGC', lat: 27.1577, lng: 77.9905 },
    { name: 'Gwalior Jn', code: 'GWL', lat: 26.2183, lng: 78.1828 },
    { name: 'Jhansi Jn', code: 'VGLJ', lat: 25.4484, lng: 78.5685 },
    { name: 'Bhopal Jn', code: 'BPL', lat: 23.2599, lng: 77.4126 },
    { name: 'Kanpur Central', code: 'CNB', lat: 26.4547, lng: 80.3510 },
    { name: 'Prayagraj Jn', code: 'PRYJ', lat: 25.4448, lng: 81.8432 },
  ];

  const filteredStations = POPULAR_STATIONS.filter(s => 
    s.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
    s.code.toLowerCase().includes(stationSearch.toLowerCase())
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Finding nearest station...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find nearest station from our list
        let nearest = POPULAR_STATIONS[0];
        let minDistance = Infinity;

        POPULAR_STATIONS.forEach(s => {
          const dist = Math.sqrt(Math.pow(s.lat - latitude, 2) + Math.pow(s.lng - longitude, 2));
          if (dist < minDistance) {
            minDistance = dist;
            nearest = s;
          }
        });

        toast.dismiss();
        handleSelectStation(nearest.name, nearest.code);
        toast.success(`Located at ${nearest.name} (${nearest.code})`);
      },
      (error) => {
        toast.dismiss();
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location. Please select manually.');
      }
    );
  };

  useEffect(() => {
    // Real-time listener for vendors
    const q = query(collection(db, 'vendors'), limit(20));
    const unsubscribeVendors = onSnapshot(q, (snapshot) => {
      const vendorList: Vendor[] = [];
      snapshot.forEach((doc) => {
        vendorList.push({ id: doc.id, ...doc.data() } as Vendor);
      });
      setVendors(vendorList);
      setLoading(false);
    });

    // Fetch user food history
    const historyQuery = query(
      collection(db, 'foodHistory'),
      where('userId', '==', user.uid),
      limit(5)
    );
    const unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
      const historyList: FoodHistory[] = [];
      snapshot.forEach((doc) => {
        historyList.push({ id: doc.id, ...doc.data() } as FoodHistory);
      });
      setHistory(historyList.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => {
      unsubscribeVendors();
      unsubscribeHistory();
    };
  }, [user.uid]);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.station.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // In a real app, we'd filter food items by veg status too.
  // For now, let's assume if vegOnly is true, we only show vendors that have veg items (which is all of them in this mock)
  // But we'll use this state to filter the menu when it's opened.

  const safeVendors = filteredVendors.filter(v => !v.isBlacklisted && v.rating >= 3.5);
  const riskyVendors = filteredVendors.filter(v => v.isBlacklisted || v.rating < 3.0 || v.illnessReportsToday > 0);

  const handleReportIllness = async (vendorId: string) => {
    const confirmed = window.confirm('Are you sure you want to report an illness from this vendor? This will alert other passengers.');
    if (!confirmed) return;
    
    try {
      const reportData = {
        id: Math.random().toString(36).substring(7),
        userId: user.uid,
        vendorId: vendorId,
        timestamp: Date.now(),
        symptoms: ['Stomach pain', 'Nausea'], // Default symptoms for now
      };
      await addDoc(collection(db, 'illnessReports'), reportData);
      
      // Update vendor's illness count (in a real app, this would be a Cloud Function)
      const vendorRef = doc(db, 'vendors', vendorId);
      const vendorDoc = await getDoc(vendorRef);
      if (vendorDoc.exists()) {
        await updateDoc(vendorRef, {
          illnessReportsToday: (vendorDoc.data().illnessReportsToday || 0) + 1
        });
      }
      
      toast.success('Report submitted. Thank you for helping keep others safe.');
    } catch (err) {
      console.error('Failed to report illness:', err);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  const handleViewMenu = async (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setLoadingMenu(true);
    try {
      const q = query(collection(db, `vendors/${vendor.id}/foodItems`));
      const snapshot = await getDocs(q);
      const items: FoodItem[] = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() } as FoodItem);
      });
      setVendorFoodItems(items);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      toast.error('Failed to load menu.');
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleAddToPlate = async (item: FoodItem) => {
    if (!pnr || pnr.length < 10) {
      toast.error('Please enter a valid 10-digit PNR first.');
      return;
    }

    try {
      const historyData = {
        userId: user.uid,
        vendorId: item.vendorId,
        foodName: item.name,
        timestamp: Date.now(),
        pnr: pnr
      };
      await addDoc(collection(db, 'foodHistory'), historyData);
      toast.success(`Added ${item.name} to your history. Enjoy your meal!`);
    } catch (err) {
      console.error('Failed to add to history:', err);
      toast.error('Failed to record consumption.');
    }
  };

  const handleTrainSearch = () => {
    const train = MOCK_TRAINS.find(t => 
      t.number === trainSearch || 
      t.name.toLowerCase().includes(trainSearch.toLowerCase())
    );
    if (train) {
      setSelectedTrain(train);
      setShowTrainSearch(false);
      toast.success(`Found ${train.name} (${train.number})`);
    } else {
      toast.error('Train not found. Try 12002 or 12424');
    }
  };

  const handleSelectStation = (stationName: string, stationCode: string) => {
    setStation(`${stationName} (${stationCode})`);
    toast.info(`Showing vendors at ${stationName}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-slate-50 min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10">
        <header className="mb-10 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center text-slate-500 mb-2">
            <MapPin className="w-4 h-4 mr-1 text-orange-500" />
            <span className="text-sm font-black uppercase tracking-widest mr-2">{station}</span>
            <button 
              onClick={() => setShowStationModal(true)}
              className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] hover:underline transition-all mr-2"
              aria-label="Change current station"
            >
              Change
            </button>
            <button 
              onClick={handleUseMyLocation}
              className="p-1 bg-orange-50 rounded-md text-orange-500 hover:bg-orange-100 transition-all"
              title="Use My Location"
            >
              <Navigation className="w-3 h-3" />
            </button>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Hello, <span className="text-orange-500">{user.displayName.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready for a safe and delicious journey?</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-end"
        >
          <div className="flex items-center bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Live Safety Feed</span>
          </div>
          <div className="mt-2 flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center text-[10px] font-black text-white">
              +12k
            </div>
          </div>
        </motion.div>
      </header>

      {/* Live Safety Ticker */}
      <div className="mb-10 bg-slate-900/5 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 overflow-hidden relative group">
        <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap">
          {[
            "🟢 New Delhi: 12 Vendors verified safe in the last hour",
            "🟢 Mumbai Central: Freshness check completed for 8 vendors",
            "🟢 Howrah Jn: 5-star rating given to 'Railway Kitchen'",
            "🟢 Chennai Central: All vendors cleared hygiene inspection",
            "🟢 Bengaluru City: 1500+ meals verified safe today",
          ].map((text, i) => (
            <span key={i} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center">
              <Sparkles className="w-3 h-3 mr-2 text-orange-500" />
              {text}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            "🟢 New Delhi: 12 Vendors verified safe in the last hour",
            "🟢 Mumbai Central: Freshness check completed for 8 vendors",
            "🟢 Howrah Jn: 5-star rating given to 'Railway Kitchen'",
            "🟢 Chennai Central: All vendors cleared hygiene inspection",
            "🟢 Bengaluru City: 1500+ meals verified safe today",
          ].map((text, i) => (
            <span key={i + 10} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center">
              <Sparkles className="w-3 h-3 mr-2 text-orange-500" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="mb-10 relative h-[300px] rounded-[3rem] overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2000&auto=format&fit=crop" 
          alt="Fresh Food"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center text-orange-400 mb-4">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <span className="text-sm font-black uppercase tracking-[0.3em]">100% Safety Guaranteed</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Fresh Food for your <br />
              <span className="text-orange-500">Train Journey</span>
            </h1>
            <p className="text-white/70 font-medium max-w-md text-lg">
              Order verified, fresh, and hygienic meals delivered directly to your seat at the next station.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-8 right-8 flex items-center space-x-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Verified Vendors</div>
              <div className="text-lg font-black text-white">500+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Find My Train Integration */}
      <section className="mb-10">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1474487056235-526c546e5032?q=80&w=2000&auto=format&fit=crop" 
              alt="Train Track"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Train className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Find My Train</h2>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Track Route & Order Food</p>
                </div>
              </div>
              {!selectedTrain ? (
                <button 
                  onClick={() => setShowTrainSearch(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                  aria-label="Track your journey"
                >
                  Track Journey
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedTrain(null)}
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95"
                  aria-label="Change tracked train"
                >
                  Change Train
                </button>
              )}
            </div>

            {showTrainSearch && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text"
                    placeholder="Enter Train Number (e.g. 12002)"
                    value={trainSearch}
                    onChange={(e) => setTrainSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleTrainSearch}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
                  aria-label="Search for train"
                >
                  Search
                </button>
              </motion.div>
            )}

            {selectedTrain && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div>
                    <div className="text-orange-400 text-xs font-black uppercase tracking-widest mb-1">Currently Tracking</div>
                    <div className="text-2xl font-black">{selectedTrain.name} <span className="text-white/40">#{selectedTrain.number}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Status</div>
                    <div className="text-green-400 font-black flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      On Time
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex items-start space-x-6 min-w-max">
                    {selectedTrain.route.map((s, idx) => (
                      <div key={s.code} className="flex flex-col items-center group cursor-pointer" onClick={() => handleSelectStation(s.name, s.code)}>
                        <div className="flex items-center">
                          <motion.div 
                            whileHover={{ scale: 1.2 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${station.includes(s.code) ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/40' : 'bg-white/5 border-white/10 group-hover:border-orange-500'}`}
                          >
                            <MapPin className={`w-5 h-5 ${station.includes(s.code) ? 'text-white' : 'text-white/40 group-hover:text-orange-500'}`} />
                          </motion.div>
                          {idx < selectedTrain.route.length - 1 && (
                            <div className="w-16 h-0.5 bg-white/10 mx-2"></div>
                          )}
                        </div>
                        <div className="mt-4 text-center">
                          <div className={`text-xs font-black uppercase tracking-widest transition-colors ${station.includes(s.code) ? 'text-orange-400' : 'text-white/60 group-hover:text-white'}`}>{s.name}</div>
                          <div className="text-[10px] font-bold text-white/30 mt-1">{s.arrivalTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Nearby Vendors', value: vendors.length, icon: Store, color: 'blue', bg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop' },
          { label: 'Safety Alerts', value: `${vendors.filter(v => v.illnessReportsToday > 0).length} Active`, icon: AlertTriangle, color: vendors.some(v => v.illnessReportsToday > 0) ? 'red' : 'green', bg: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=400&auto=format&fit=crop' },
          { label: 'Orders Tracked', value: history.length, icon: History, color: 'orange', bg: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop' },
          { label: 'Avg Rating', value: (vendors.reduce((acc, v) => acc + v.rating, 0) / (vendors.length || 1)).toFixed(1), icon: Star, color: 'yellow', bg: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400&auto=format&fit=crop' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
              <img src={stat.bg} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                stat.color === 'red' ? 'bg-red-50 text-red-500' :
                stat.color === 'green' ? 'bg-green-50 text-green-500' :
                stat.color === 'orange' ? 'bg-orange-50 text-orange-500' :
                'bg-yellow-50 text-yellow-500'
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trending Now */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Trending Now</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Most ordered dishes at {station.split('(')[0].trim()}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(TRENDING_DISHES_BY_STATION[station.match(/\(([^)]+)\)/)?.[1] || 'DEFAULT'] || TRENDING_DISHES_BY_STATION['DEFAULT']).map((dish, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="group relative h-48 rounded-[2rem] overflow-hidden shadow-lg cursor-pointer"
            >
              <img 
                src={dish.img} 
                alt={dish.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end">
                <div className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">{dish.vendor}</div>
                <h3 className="text-white font-black text-lg leading-tight">{dish.name}</h3>
                <div className="text-white/60 text-xs font-bold mt-1">₹{dish.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Featured Vendor Highlight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-orange-500" />
              Featured Vendor
            </h2>
          </div>
          <div className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl flex flex-col md:flex-row">
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop" 
                alt="Trackside Treats" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent md:hidden"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Top Rated</span>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Safety</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Trackside Treats</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Famous for their fresh samosas and regional snacks. Trackside Treats has maintained a 4.5+ hygiene score for 12 consecutive months.
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-lg font-black text-slate-900">4.2</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviews</span>
                  <span className="text-lg font-black text-slate-900">620+</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  const vendor = vendors.find(v => v.name === 'Trackside Treats');
                  if (vendor) handleViewMenu(vendor);
                  else toast.info('Menu coming soon for this featured vendor!');
                }}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all self-start"
              >
                Explore Menu
              </button>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-10">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for vendors, food, or stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-lg font-medium"
              />
            </div>
            <button 
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-8 py-6 rounded-[2rem] shadow-sm border transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs ${
                vegOnly 
                  ? 'bg-green-500 text-white border-green-600 shadow-green-500/20' 
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${vegOnly ? 'border-white' : 'border-green-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${vegOnly ? 'bg-white' : 'bg-green-600'}`}></div>
              </div>
              Veg Only
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Loading Vendors...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Safe Vendors Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Safe Vendors Nearby</h2>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Verified & Top Rated</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest transition-all">View All</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {safeVendors.length > 0 ? (
                    safeVendors.map((vendor) => (
                      <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        onViewMenu={() => handleViewMenu(vendor)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No safe vendors found in this area.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Warning Section */}
              {riskyVendors.length > 0 && (
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Safety Alerts</h2>
                      <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Avoid These Vendors</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {riskyVendors.map((vendor) => (
                      <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        variant="warning" 
                        onViewMenu={() => handleViewMenu(vendor)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        <div className="space-y-10">
          {/* PNR Integration Card */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">PNR Delivery</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Order to your seat</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter 10-digit PNR"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.slice(0, 10))}
                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 text-lg font-black focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-300"
                  />
                  {pnr.length === 10 && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  Your PNR helps us track your train and deliver food exactly when you arrive at the station.
                </p>
              </div>
            </div>
          </section>

          {/* Safety Banner */}
          <section className="bg-green-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-green-600/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <ShieldCheck className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Eat Safe, Travel Safe</h3>
              <p className="text-green-100 text-xs font-medium leading-relaxed mb-6">
                Every vendor on our platform undergoes rigorous hygiene checks. We monitor real-time health reports to ensure your safety.
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border border-green-600 bg-white/20"></div>
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Trusted by 1M+ Travelers</span>
              </div>
            </div>
          </section>

          {/* Food History Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <History className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Recent Orders</h2>
              </div>
              <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline transition-all">View All</button>
            </div>
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-colors ${idx !== history.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{item.foodName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(item.timestamp).toLocaleDateString()} • {item.pnr && `PNR: ${item.pnr}`}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No food history found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Menu Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-slate-50 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border border-white/10"
            >
              <div className="p-8 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center">
                    <Store className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedVendor.name}</h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center text-orange-500 font-black text-sm">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        {selectedVendor.rating}
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedVendor.station}</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="p-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-all hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {loadingMenu ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Loading Menu...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {vendorFoodItems.length > 0 ? (
                      vendorFoodItems
                        .filter(item => !vegOnly || item.isVeg)
                        .map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative group"
                        >
                          <FoodItemCard item={item} />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-all rounded-[2rem] pointer-events-none"></div>
                          <button 
                            onClick={() => handleAddToPlate(item)}
                            className="absolute bottom-6 left-6 right-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/20 hover:shadow-orange-500/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 active:scale-95"
                          >
                            Order & Track Safety
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full p-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Filter className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest">
                          {vegOnly ? "No vegetarian items available." : "No items available in this menu."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Station Selection Modal */}
      <AnimatePresence>
        {showStationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 id="station-modal-title" className="text-xl font-black text-slate-900 uppercase tracking-tight">Change Location</h2>
                <button 
                  onClick={() => setShowStationModal(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <button 
                  onClick={handleUseMyLocation}
                  className="w-full mb-6 p-4 bg-orange-500 text-white rounded-2xl flex items-center justify-center space-x-2 font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Use My Current Location</span>
                </button>

                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search station name or code..."
                    value={stationSearch}
                    onChange={(e) => setStationSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    aria-label="Search station"
                  />
                </div>

                <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Popular Stations</div>
                  {filteredStations.length > 0 ? (
                    filteredStations.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => {
                          handleSelectStation(s.name, s.code);
                          setShowStationModal(false);
                        }}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                          station.includes(s.code) 
                            ? 'bg-orange-50 border border-orange-100 text-orange-600' 
                            : 'bg-white border border-slate-50 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <MapPin className={`w-4 h-4 mr-3 ${station.includes(s.code) ? 'text-orange-500' : 'text-slate-300'}`} />
                          <span className="font-bold">{s.name}</span>
                        </div>
                        <span className="text-xs font-black opacity-40 uppercase tracking-widest">{s.code}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No stations found.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                  Changing your location will update the list of vendors and safety alerts.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Food Safety Guide */}
      <section className="mt-20 mb-20">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Food Safety Guide</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">How to stay safe during your journey</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Check the Seal",
              desc: "Always ensure the food packaging is intact and the seal hasn't been tampered with.",
              image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Smell & Texture",
              desc: "If the food smells unusual or has a slimy texture, do not consume it. Report it immediately.",
              image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Hot is Better",
              desc: "Prefer freshly cooked hot meals over cold items, as heat kills most foodborne pathogens.",
              image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop"
            }
          ].map((tip, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={tip.image} 
                  alt={tip.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              <div className="p-8 pt-4">
                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{tip.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{tip.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 Fresh Food Verifier • Safe Travels
        </p>
        <p className="text-red-400 text-[8px] font-black uppercase tracking-[0.2em] mt-2">
          Warning: This application is for trial and demonstration purposes only.
        </p>
      </footer>
      </div>
    </div>
  );
}
