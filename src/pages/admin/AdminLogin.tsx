import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, ArrowLeft, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email.trim(), password);
      if (loggedUser.role !== 'admin' && loggedUser.role !== 'super_admin') {
        logout();
        setError('403 Unauthorized: Your account does not possess administrative privileges.');
        return;
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickAdmin = () => {
    setEmail('admin@villagedeli.in');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#07130c] text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#6cb33f] selection:text-white">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#6cb33f]" />
          <span>Back to Storefront</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <Clock className="w-3.5 h-3.5 text-[#fed100]" />
          <span>VillageDELI Central Server</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#0d1f15] border border-[#234934] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6cb33f]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#173323] border border-[#3b711e] flex items-center justify-center text-[#fed100] mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 font-serif text-2xl font-black">
              <span>Village</span>
              <span className="text-[#6cb33f]">DELI</span>
            </div>
            <p className="text-[11px] font-mono tracking-widest text-[#fed100] uppercase font-bold mt-1">
              Internal Administration Console
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-200 rounded-2xl text-xs flex items-start gap-2.5 mb-6 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@villagedeli.in"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-xl bg-[#173323]/50 border border-[#234934] focus:outline-none focus:border-[#6cb33f] text-white placeholder-stone-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-xl bg-[#173323]/50 border border-[#234934] focus:outline-none focus:border-[#6cb33f] text-white placeholder-stone-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer mt-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-[#0d1f15] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate & Access Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Button */}
        <div className="mt-6 pt-5 border-t border-[#173323] text-center">
          <button
            type="button"
            onClick={fillQuickAdmin}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#fed100]" />
            <span>Fill Demo Admin (admin@villagedeli.in)</span>
          </button>
        </div>
      </div>

      {/* Security Notice Footer */}
      <div className="text-center text-[11px] text-stone-500 max-w-sm mx-auto">
        This portal is restricted to authorized personnel. All administrative access attempts, IP addresses, and actions are logged for audit compliance.
      </div>
    </div>
  );
};
