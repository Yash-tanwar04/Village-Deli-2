import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Clock, AlertCircle, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // OTP Verification State (Requirement 2)
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  const { login, setSessionUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = redirectParam || (location.state as any)?.from?.pathname || '/my-account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res: any = await login(email.trim(), password);
      if (res && res.otp_required) {
        setOtpRequired(true);
        setOtpSuccessMsg(`A 6-digit verification code has been sent to ${email.trim()}`);
        return;
      }
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError('');
    setVerifyingOtp(true);
    try {
      const res = await api.verifyOtp(email.trim(), otpCode.trim());
      setSessionUser(res.user, res.token);
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendingOtp(true);
    try {
      await api.resendOtp(email.trim(), 'login');
      setOtpSuccessMsg('A new verification code has been dispatched to your email.');
      setTimeout(() => setOtpSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#0d1f15] border-2 border-[#6cb33f] text-[#fed100] flex items-center justify-center mx-auto shadow-sm">
            {otpRequired ? <ShieldCheck className="w-6 h-6 text-[#6cb33f]" /> : <Clock className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-serif font-black text-[#0d1f15]">
            {otpRequired ? 'Verify Your Identity' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-stone-500">
            {otpRequired
              ? `Enter the 6-digit OTP code sent to ${email}`
              : 'Sign in to track orders, save delivery addresses & access club perks'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {otpSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs">
            {otpSuccessMsg}
          </div>
        )}

        {otpRequired ? (
          /* OTP INPUT FORM */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                6-Digit Email Verification Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-lg tracking-[0.3em] font-mono font-black pl-9 pr-3 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyingOtp || otpCode.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {verifyingOtp ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#fed100]" />
                  <span>Verify Code & Sign In</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setOtpRequired(false);
                  setOtpCode('');
                  setError('');
                }}
                className="text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={resendingOtp}
                onClick={handleResendOtp}
                className="text-[#3b711e] hover:underline font-bold disabled:opacity-50 cursor-pointer"
              >
                {resendingOtp ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        ) : (
          /* REGULAR LOGIN FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#fed100]" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          <span>Don't have an account yet? </span>
          <Link
            to={`/register?redirect=${encodeURIComponent(from)}`}
            className="text-[#3b711e] hover:underline font-bold"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};
