import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', remember: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const ok = await login(form.email, form.password);
        if (ok) {
          onNavigate('home');
        } else {
          setError('Invalid email or password. Try rafay@example.com or user@example.com');
        }
      } else if (mode === 'signup') {
        if (form.password !== form.confirm) { setError('Passwords do not match'); setLoading(false); return; }
        await signup(form.name, form.email, form.password);
        onNavigate('home');
      } else {
        setSuccess('Password reset link sent! Check your inbox.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Sneakers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 to-neutral-950/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-neutral-900 font-black">RK</span>
            </div>
            <span className="font-black text-2xl text-white tracking-tighter">RAFAY KICKS</span>
          </button>
          <div>
            <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Your Kicks.<br />Your Story.
            </h2>
            <p className="text-white/60 text-lg max-w-sm">
              Join 500K+ sneakerheads. Get exclusive access to limited drops, earn rewards, and own the culture.
            </p>
            <div className="flex gap-6 mt-10">
              {[['500K+', 'Members'], ['200+', 'Brands'], ['100%', 'Authenticated']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{val}</p>
                  <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 mb-10 lg:hidden"
          >
            <div className="w-9 h-9 bg-neutral-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-white dark:text-neutral-900 font-black text-sm">RK</span>
            </div>
            <span className="font-black text-lg text-neutral-900 dark:text-white tracking-tighter">RAFAY KICKS</span>
          </button>

          {mode !== 'forgot' ? (
            <>
              <div className="mb-8">
                <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1 mb-6">
                  {(['login', 'signup'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(''); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                        mode === m
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      {m === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
                  {mode === 'login' ? 'Welcome back' : 'Join the Club'}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                  {mode === 'login' ? 'Sign in to your account to continue' : 'Create your free account today'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3.5 bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 text-error-700 dark:text-error-400 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Social */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <Chrome size={18} />
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <Github size={18} />
                  GitHub
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <span className="text-xs text-neutral-400 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="input-field pl-11"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    required
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="input-field pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <div className="relative">
                    <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Confirm password"
                      required
                      value={form.confirm}
                      onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                      className="input-field pl-11"
                    />
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
                        className="w-4 h-4 rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); }}
                      className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {mode === 'login' && (
                <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-xs text-neutral-500 dark:text-neutral-400">
                  Demo: <strong className="text-neutral-700 dark:text-neutral-300">rafay@example.com</strong> (admin) or <strong className="text-neutral-700 dark:text-neutral-300">user@example.com</strong> — any password
                </div>
              )}
            </>
          ) : (
            <div>
              <button
                onClick={() => setMode('login')}
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8 flex items-center gap-1"
              >
                ← Back to Sign In
              </button>
              <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">Reset Password</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">Enter your email and we'll send you a reset link.</p>
              {success && (
                <div className="mb-4 p-3.5 bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20 text-success-700 dark:text-success-400 rounded-xl text-sm">
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="input-field pl-11"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-4">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
