/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor, UserProfile, FoodItem } from '../types';
import { motion } from 'motion/react';
import { Plus, Clock, Trash2, Edit2, ShieldCheck, AlertTriangle, Star, Store } from 'lucide-react';
import FoodItemCard from '../components/FoodItemCard';

interface VendorDashboardProps {
  user: UserProfile;
}

export default function VendorDashboard({ user }: VendorDashboardProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditingStation, setIsEditingStation] = useState(false);
  const [newStation, setNewStation] = useState('');
  const [newItem, setNewItem] = useState({ name: '', price: 0, category: 'Veg', imageUrl: '', isVeg: true });

  useEffect(() => {
    // Fetch vendor profile
    const fetchVendor = async () => {
      const q = query(collection(db, 'vendors'), where('id', '==', user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const vendorData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Vendor;
        setVendor(vendorData);
        setNewStation(vendorData.station);
      } else {
        // Create initial vendor profile if not exists
        const initialVendor: Vendor = {
          id: user.uid,
          name: user.displayName,
          station: 'New Delhi (NDLS)',
          rating: 5.0,
          totalRatings: 0,
          hygieneScore: 5.0,
          freshnessScore: 5.0,
          tasteScore: 5.0,
          isBlacklisted: false,
          isVerified: false,
          illnessReportsToday: 0
        };
        await addDoc(collection(db, 'vendors'), initialVendor);
        setVendor(initialVendor);
        setNewStation(initialVendor.station);

        // Add some default items (lunch/fast food)
        const defaultItems = [
          { name: 'Veg Thali', price: 120, category: 'Veg', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1585932231552-29877e5f50f1?q=80&w=1000&auto=format&fit=crop', preparedAt: Date.now() },
          { name: 'Paneer Burger', price: 80, category: 'Veg', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop', preparedAt: Date.now() },
          { name: 'Chicken Biryani', price: 180, category: 'Non-Veg', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop', preparedAt: Date.now() }
        ];
        for (const item of defaultItems) {
          await addDoc(collection(db, `vendors/${user.uid}/foodItems`), item);
        }
      }
    };

    fetchVendor();

    // Real-time listener for food items
    const q = query(collection(db, `vendors/${user.uid}/foodItems`));
    const unsubscribeItems = onSnapshot(q, (snapshot) => {
      const itemList: FoodItem[] = [];
      snapshot.forEach((doc) => {
        itemList.push({ id: doc.id, ...doc.data() } as FoodItem);
      });
      setFoodItems(itemList.sort((a, b) => b.preparedAt - a.preparedAt));
      setLoading(false);
    });

    return () => unsubscribeItems();
  }, [user.uid, user.displayName]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || newItem.price <= 0) return;

    try {
      const itemData = {
        vendorId: user.uid,
        name: newItem.name,
        price: Number(newItem.price),
        preparedAt: Date.now(),
        category: newItem.category,
        isVeg: newItem.isVeg,
        imageUrl: newItem.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop'
      };
      await addDoc(collection(db, `vendors/${user.uid}/foodItems`), itemData);
      setNewItem({ name: '', price: 0, category: 'Veg', imageUrl: '', isVeg: true });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, `vendors/${user.uid}/foodItems`, itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleUpdateStation = async () => {
    if (!vendor || !newStation.trim()) return;
    try {
      const q = query(collection(db, 'vendors'), where('id', '==', user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const vendorDocId = snapshot.docs[0].id;
        await updateDoc(doc(db, 'vendors', vendorDocId), { station: newStation });
        setVendor({ ...vendor, station: newStation });
        setIsEditingStation(false);
      }
    } catch (err) {
      console.error('Failed to update station:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center text-slate-500 mb-2">
            <Store className="w-4 h-4 mr-1 text-orange-500" />
            {isEditingStation ? (
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                  className="text-sm font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button onClick={handleUpdateStation} className="text-xs font-bold text-green-600 hover:text-green-700">Save</button>
                <button onClick={() => setIsEditingStation(false)} className="text-xs font-bold text-slate-400 hover:text-slate-500">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center group">
                <span className="text-sm font-medium">{vendor?.station}</span>
                <button 
                  onClick={() => setIsEditingStation(true)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-orange-500"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{vendor?.name}</h1>
          <p className="text-slate-500">Vendor Dashboard</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center bg-white px-3 py-1 rounded-xl border border-slate-100 shadow-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm font-bold text-slate-900">{vendor?.rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Overall Rating</span>
        </div>
      </header>

      {/* Vendor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hygiene Score</div>
          <div className="text-2xl font-black text-slate-900">{vendor?.hygieneScore.toFixed(1)}</div>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: `${(vendor?.hygieneScore || 0) * 20}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Freshness Score</div>
          <div className="text-2xl font-black text-slate-900">{vendor?.freshnessScore.toFixed(1)}</div>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${(vendor?.freshnessScore || 0) * 20}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Illness Reports</div>
          <div className={`text-2xl font-black ${vendor?.illnessReportsToday || 0 > 0 ? 'text-red-500' : 'text-slate-900'}`}>
            {vendor?.illnessReportsToday}
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last 24 Hours</div>
        </div>
      </div>

      {/* Food Items Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Your Menu Items</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Item
          </button>
        </div>

        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddItem}
            className="mb-8 p-6 bg-white rounded-3xl border border-orange-100 shadow-lg shadow-orange-50/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name</label>
                <input 
                  type="text" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Veg Thali"
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select 
                  value={newItem.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setNewItem({ 
                      ...newItem, 
                      category: cat,
                      isVeg: cat === 'Veg' || cat === 'Snacks' || cat === 'Beverages'
                    });
                  }}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>Veg</option>
                  <option>Non-Veg</option>
                  <option>Snacks</option>
                  <option>Beverages</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Veg/Non-Veg</label>
                <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      checked={newItem.isVeg} 
                      onChange={() => setNewItem({ ...newItem, isVeg: true, category: newItem.category === 'Non-Veg' ? 'Veg' : newItem.category })}
                      className="mr-2"
                    />
                    <span className="text-xs font-bold text-green-600">Veg</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      checked={!newItem.isVeg} 
                      onChange={() => setNewItem({ ...newItem, isVeg: false, category: newItem.category === 'Veg' ? 'Non-Veg' : newItem.category })}
                      className="mr-2"
                    />
                    <span className="text-xs font-bold text-red-600">Non-Veg</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-slate-500 font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600"
              >
                Save Item
              </button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <FoodItemCard 
                key={item.id} 
                item={item} 
                onDelete={() => handleDeleteItem(item.id)}
                isVendorView
              />
            ))
          ) : (
            <div className="col-span-full p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
              <p className="text-slate-400">You haven't added any food items yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
