/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { UserProfile } from '../types';
import { LogOut, Home, Camera, User, ShieldCheck, Store, Train } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
}

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="hidden md:flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-200">
          <Train className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-slate-900">Fresh<span className="text-green-600">Track</span></span>
      </div>

      <div className="flex items-center justify-around w-full md:w-auto md:space-x-8">
        <Link to="/" className="flex flex-col items-center text-slate-400 hover:text-orange-500 transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium md:hidden">Home</span>
        </Link>
        
        {user.role === 'customer' && (
          <Link to="/verify" className="flex flex-col items-center text-slate-400 hover:text-orange-500 transition-colors">
            <Camera className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium md:hidden">Verify</span>
          </Link>
        )}

        <div className="flex flex-col items-center text-slate-400 md:flex-row md:space-x-4">
          <div className="flex flex-col items-center md:flex-row md:space-x-2">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-6 h-6" />
            )}
            <div className="text-center md:text-left">
              <span className="text-[10px] mt-1 font-medium md:text-sm md:mt-0 block md:inline">{user.displayName}</span>
              <span className="hidden md:inline text-xs text-slate-400 ml-1">({user.role})</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex flex-col items-center text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium md:hidden">Logout</span>
        </button>
      </div>
    </nav>
  );
}
