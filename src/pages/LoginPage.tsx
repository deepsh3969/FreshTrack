/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole } from '../types';
import { motion } from 'motion/react';
import { Facebook, Twitter, Linkedin, Chrome, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const SSOButtons = ({ onGoogleClick }: { onGoogleClick: () => void }) => (
  <div className="sso">
    <button onClick={onGoogleClick} title="Continue with Google" aria-label="Continue with Google">
      <Chrome className="w-5 h-5" />
    </button>
    <button title="Facebook (Demo Only)" aria-label="Facebook (Demo Only)">
      <Facebook className="w-5 h-5" />
    </button>
    <button title="Twitter (Demo Only)" aria-label="Twitter (Demo Only)">
      <Twitter className="w-5 h-5" />
    </button>
    <button title="LinkedIn (Demo Only)" aria-label="LinkedIn (Demo Only)">
      <Linkedin className="w-5 h-5" />
    </button>
  </div>
);

const Hero = ({ type, active, title, text, buttonText, onClick }: any) => (
  <div 
    className={`hero ${type}`}
    style={{ 
      transform: active ? 'translateX(0)' : (type === 'signup' ? 'translateX(-100%)' : 'translateX(100%)'),
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'auto' : 'none'
    }}
  >
    <h2>{title}</h2>
    <p>{text}</p>
    <button type="button" onClick={onClick}>
      {buttonText}
    </button>
  </div>
);

const AuthForm = ({ type, active, title, children, onGoogleClick }: any) => (
  <div 
    className={`auth-form ${type}`}
    style={{ 
      transform: active ? 'translateX(0)' : (type === 'signup' ? 'translateX(100%)' : 'translateX(-100%)'),
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'auto' : 'none'
    }}
  >
    <h2>{title}</h2>
    <SSOButtons onGoogleClick={onGoogleClick} />
    <p>Or use your email address</p>
    <form onSubmit={(e) => e.preventDefault()}>
      {children}
    </form>
  </div>
);

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>((searchParams.get('mode') as any) || 'login');
  const [selectedRole, setSelectedRole] = useState<UserRole>((searchParams.get('role') as any) || 'customer');

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    const modeParam = searchParams.get('mode') as 'login' | 'signup';
    if (roleParam) setSelectedRole(roleParam);
    if (modeParam) setMode(modeParam);
  }, [searchParams]);

  const isSignup = mode === 'signup';
  const toggleView = () => setMode(isSignup ? 'login' : 'signup');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Anonymous',
          role: selectedRole,
          createdAt: Date.now(),
        });
      } else {
        const existingData = userDoc.data();
        if (existingData.role !== selectedRole) {
          setError(`This account is already registered as a ${existingData.role}. Logging you in as ${existingData.role}.`);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User closed the popup, no need to show an error message
        setError(null);
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div
          className="card-bg"
          style={{ transform: isSignup ? 'translateX(0)' : 'translateX(100%)' }}
        />
        
        <Hero
          type="signup"
          active={isSignup}
          title="Welcome Back!"
          text="Sign in to track your food safety journey and orders."
          buttonText="SIGN IN"
          onClick={toggleView}
        />

        <AuthForm type="signup" active={isSignup} title="Create Account" onGoogleClick={handleGoogleLogin}>
          <div className="w-full space-y-4">
            <div className="flex justify-center mb-2">
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${selectedRole === 'customer' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                Registering as {selectedRole}
              </span>
            </div>
            <input type="text" placeholder="Full Name" disabled />
            <input type="email" placeholder="Email Address" disabled />
            <input type="password" placeholder="Create Password" disabled />
            <button type="button" onClick={handleGoogleLogin} disabled={loading}>
              {loading ? 'Processing...' : 'Continue with Google'}
            </button>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight text-center mt-2">{error}</p>}
          </div>
        </AuthForm>

        <Hero
          type="signin"
          active={!isSignup}
          title="New Here?"
          text="Join our community of safe travelers and verified vendors today."
          buttonText="CREATE ACCOUNT"
          onClick={toggleView}
        />

        <AuthForm type="signin" active={!isSignup} title="Welcome Back" onGoogleClick={handleGoogleLogin}>
          <div className="w-full space-y-4">
            <div className="flex justify-center mb-2">
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${selectedRole === 'customer' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                Accessing as {selectedRole}
              </span>
            </div>
            <input type="text" placeholder="Email Address" disabled />
            <input type="password" placeholder="Password" disabled />
            <a className="block text-center mt-2 font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-green-600">Forgot password?</a>
            <button type="button" onClick={handleGoogleLogin} disabled={loading}>
              {loading ? 'Processing...' : 'Continue with Google'}
            </button>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight text-center mt-2">{error}</p>}
          </div>
        </AuthForm>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#8d00ff] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-white font-bold text-xs tracking-widest uppercase animate-pulse">Authenticating...</p>
        </div>
      )}
    </div>
  );
}
