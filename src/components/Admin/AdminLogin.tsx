import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { BrandLogo } from '../common/BrandLogo';

interface AdminLoginProps {
  onLoginSuccess?: (user: { displayName?: string | null; email?: string | null; photoURL?: string | null; uid?: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('samteckdigital@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user && onLoginSuccess) {
        onLoginSuccess({
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          uid: result.user.uid
        });
      }
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('popup-closed-by-user') || errorMsg.includes('cancelled-popup-request')) {
        setError('Sign-in popup was closed before completing. Please try again.');
      } else if (errorMsg.includes('network-request-failed')) {
        setError('Network connection error. Please check your internet connection.');
      } else if (errorMsg.includes('operation-not-allowed')) {
        setError('Google sign-in is not enabled. Go to Firebase Console > Authentication > Sign-in method > Enable Google.');
      } else if (errorMsg.includes('unauthorized-domain')) {
        setError('This domain is not authorized. Go to Firebase Console > Authentication > Settings > Authorized domains and add your domain.');
      } else {
        setError('Google sign-in failed. Make sure Google provider is enabled in Firebase Console > Authentication > Sign-in method.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign-In Handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (res.user && onLoginSuccess) {
        onLoginSuccess({
          displayName: res.user.displayName || email.split('@')[0],
          email: res.user.email,
          uid: res.user.uid
        });
      }
    } catch (err: unknown) {
      console.error('Email Auth error:', err);
      const signMsg = err instanceof Error ? err.message : '';

      if (signMsg.includes('operation-not-allowed')) {
        setError('Email/password sign-in is not enabled. Go to Firebase Console > Authentication > Sign-in method > Enable Email/Password.');
      } else if (signMsg.includes('user-not-found')) {
        setError('No account found with this email. Go to Firebase Console > Authentication > Users > Add user to create your admin account.');
      } else if (signMsg.includes('wrong-password') || signMsg.includes('invalid-credential')) {
        setError('Incorrect email or password. Please try again.');
      } else if (signMsg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (signMsg.includes('too-many-requests')) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Authentication failed. Make sure Email/Password provider is enabled in Firebase Console.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020B24] flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
      {/* Background glowing orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-72 h-72 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#041235]/95 border border-blue-900/50 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Top Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4 drop-shadow-xl hover:scale-105 transition-transform duration-300">
            <BrandLogo size={64} variant="blue" />
          </div>
          <h1 className="text-2xl font-bold text-white font-heading">
            SamTeck Digital Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure administrator portal for portfolio management.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 mb-5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Setup Guide */}
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] leading-relaxed mb-5">
          <p className="font-semibold mb-1.5 text-blue-200">First time setup:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Firebase Console &gt; Authentication &gt; Sign-in method</li>
            <li>Enable <strong>Google</strong> and <strong>Email/Password</strong></li>
            <li>Add <code className="bg-blue-900/40 px-1 rounded">localhost</code> to Authorized domains</li>
            <li>Authentication &gt; Users &gt; Add user (email: <code className="bg-blue-900/40 px-1 rounded">samteckdigital@gmail.com</code>)</li>
          </ol>
        </div>

        {/* Primary Action: Google Single Sign-On */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign In with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-blue-900/60 w-full" />
            <span className="bg-[#041235] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider relative z-10">
              or enter credentials
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samteckdigital@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#020B24] border border-blue-900/60 focus:border-orange-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate with Email</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-blue-900/40 flex items-center justify-between text-xs text-slate-400">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Firebase Auth Active</span>
          </span>
        </div>

      </div>
    </div>
  );
};
