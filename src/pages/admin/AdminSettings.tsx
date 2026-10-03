import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  CreditCard,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  ExternalLink,
  AlertCircle,
  Mail,
  Send,
  FileText,
  Store,
  RefreshCw,
  Server
} from 'lucide-react';
import { api } from '../../lib/api';
import { StoreSettings, PaymentSettings, EmailSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'payments' | 'email' | 'dispatch' | 'templates'>('store');
  const [loading, setLoading] = useState(true);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [pincodesInput, setPincodesInput] = useState('');
  const [savingStore, setSavingStore] = useState(false);
  const [storeSuccess, setStoreSuccess] = useState(false);

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; previewUrl?: string } | null>(null);

  // Custom User Email Dispatcher
  const [customEmailTo, setCustomEmailTo] = useState('');
  const [customEmailName, setCustomEmailName] = useState('');
  const [customEmailSubject, setCustomEmailSubject] = useState('');
  const [customEmailMessage, setCustomEmailMessage] = useState('');
  const [sendingCustom, setSendingCustom] = useState(false);
  const [customResult, setCustomResult] = useState<{ success: boolean; message: string; previewUrl?: string } | null>(null);

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    try {
      const [s, p, e] = await Promise.all([
        api.getStoreSettings(),
        api.getPaymentSettings().catch(() => ({
          razorpay_enabled: false,
          razorpay_key_id: '',
          razorpay_key_secret: '',
          require_admin_verification: false,
          cod_enabled: true,
          updated_at: new Date().toISOString()
        })),
        api.getEmailSettings().catch(() => ({
          admin_notification_email: 'admin@villagedeli.in',
          sender_name: 'VillageDELI Orders',
          from_email: 'orders@villagedeli.in',
          admin_cc_email: '',
          admin_bcc_email: '',
          customer_email_subject: 'VillageDELI — Your Order {{order_id}} Has Been Confirmed',
          customer_email_header: 'Thank you for shopping with VillageDELI! Your fresh groceries and everyday essentials are being prepared.',
          customer_email_footer: 'Need help with your order? Reach our customer care team anytime at support@villagedeli.in or +91 98765 43210.',
          admin_email_subject: '🛒 New VillageDELI Order — {{order_id}} (₹{{order_total}})',
          admin_email_header: 'A new order has been received and requires confirmation.',
          admin_email_footer: 'Manage this order live in your VillageDELI Admin Portal.',
          enable_customer_emails: true,
          enable_admin_emails: true,
          enable_contact_emails: true,
          updated_at: new Date().toISOString()
        }))
      ]);

      setStoreSettings(s);
      if (s.serviceable_pincodes) {
        setPincodesInput(s.serviceable_pincodes.join(', '));
      }
      setPaymentSettings(p);
      setEmailSettings(e);
      if (e.admin_notification_email) {
        setTestEmailTo(e.admin_notification_email);
      }
    } catch (err) {
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;

    setSavingStore(true);
    setStoreSuccess(false);
    try {
      const parsedPins = pincodesInput
        .split(',')
        .map(p => p.trim())
        .filter(p => /^\d{6}$/.test(p));

      const updated = await api.updateStoreSettings({
        ...storeSettings,
        serviceable_pincodes: parsedPins
      });
      setStoreSettings(updated);
      setStoreSuccess(true);
      setTimeout(() => setStoreSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save store settings:', err);
    } finally {
      setSavingStore(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentSettings) return;

    setSavingPayment(true);
    setPaymentSuccess(false);
    setPaymentError('');
    try {
      const updated = await api.updatePaymentSettings(paymentSettings);
      setPaymentSettings(updated);
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save payment settings:', err);
      setPaymentError(err.message || 'Failed to update payment settings');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSettings) return;

    setSavingEmail(true);
    setEmailSuccess(false);
    try {
      const updated = await api.updateEmailSettings(emailSettings);
      setEmailSettings(updated);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save email settings:', err);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTo.trim()) return;

    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await api.sendTestEmail(testEmailTo.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Test email failed to dispatch'
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailTo.trim() || !customEmailSubject.trim() || !customEmailMessage.trim()) return;

    setSendingCustom(true);
    setCustomResult(null);
    try {
      const res = await api.sendCustomEmail({
        to: customEmailTo.trim(),
        recipient_name: customEmailName.trim(),
        subject: customEmailSubject.trim(),
        message: customEmailMessage.trim()
      });
      setCustomResult({
        success: res.success,
        message: res.message || res.error || (res.success ? 'Email dispatched successfully!' : 'Email dispatch failed'),
        previewUrl: res.previewUrl
      });
      if (res.success) {
        setCustomEmailSubject('');
        setCustomEmailMessage('');
      }
    } catch (err: any) {
      setCustomResult({
        success: false,
        message: err.message || 'Failed to send custom email'
      });
    } finally {
      setSendingCustom(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'store', label: 'Store & Delivery', icon: Store },
    { id: 'payments', label: 'Razorpay & Payments', icon: CreditCard },
    { id: 'email', label: 'Mail Server (SMTP)', icon: Server },
    { id: 'dispatch', label: 'Email Any User', icon: Send },
    { id: 'templates', label: 'Notification Templates', icon: FileText }
  ] as const;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-serif font-black text-[#0d1f15]">
          Store & System Configuration
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage fulfillment rules, Razorpay payment gateway credentials, cPanel/SMTP mail servers, and customer communications
        </p>
      </div>

      {/* Responsive Navigation Tabs (Requirement 6: Organize properly) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0d1f15] text-[#fed100] shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STORE & DELIVERY SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'store' && storeSettings && (
        <form onSubmit={handleSaveStore} className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-serif font-black text-stone-900">
                  Store Contact & Identity
                </h2>
                <p className="text-xs text-stone-500">General store info visible to shoppers</p>
              </div>
              {storeSuccess && (
                <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved Successfully!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeSettings.store_name}
                  onChange={e => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Customer Care Phone</label>
                <input
                  type="text"
                  value={storeSettings.support_phone || storeSettings.contact_phone || ''}
                  onChange={e =>
                    setStoreSettings({
                      ...storeSettings,
                      support_phone: e.target.value,
                      contact_phone: e.target.value
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={storeSettings.support_email || ''}
                  onChange={e => setStoreSettings({ ...storeSettings, support_email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={storeSettings.opening_hours || ''}
                  onChange={e => setStoreSettings({ ...storeSettings, opening_hours: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  placeholder="e.g. 7:00 AM – 11:00 PM Daily"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Store Address / Flagship Hub</label>
                <input
                  type="text"
                  value={storeSettings.store_address || ''}
                  onChange={e => setStoreSettings({ ...storeSettings, store_address: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Pincodes */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-serif font-black text-stone-900">
                Delivery Charges & Serviceable Areas
              </h2>
              <p className="text-xs text-stone-500">Instant pincode checks validate against these rules</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={storeSettings.delivery_fee}
                  onChange={e => setStoreSettings({ ...storeSettings, delivery_fee: Number(e.target.value) })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Above (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={storeSettings.free_delivery_threshold}
                  onChange={e =>
                    setStoreSettings({ ...storeSettings, free_delivery_threshold: Number(e.target.value) })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={storeSettings.min_order_value}
                  onChange={e => setStoreSettings({ ...storeSettings, min_order_value: Number(e.target.value) })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Serviceable 6-Digit PIN Codes (Comma Separated)
                </label>
                <textarea
                  rows={3}
                  value={pincodesInput}
                  onChange={e => setPincodesInput(e.target.value)}
                  placeholder="122001, 122002, 122017, 122018..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono leading-relaxed"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Shoppers will instantly see green checkmarks for these pincodes on checkout. Empty means all PINs accepted.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingStore}
              className="bg-[#0d1f15] hover:bg-[#173323] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#fed100]" />
              <span>{savingStore ? 'Saving Changes...' : 'Save Store & Delivery Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RAZORPAY & PAYMENT GATEWAY */}
      {/* ======================================================== */}
      {activeTab === 'payments' && paymentSettings && (
        <form onSubmit={handleSavePayment} className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-serif font-black text-stone-900">
                  Razorpay Payment Gateway Setup
                </h2>
                <p className="text-xs text-stone-500">Configure keys and customer verification workflows</p>
              </div>
              {paymentSuccess && (
                <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Gateway Saved!
                </span>
              )}
            </div>

            {paymentError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Toggle Razorpay */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#fafaf7] border border-stone-200">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Enable Razorpay Online Payments</span>
                <span className="text-[11px] text-stone-500">Allow customers to pay via UPI, Credit/Debit Cards, NetBanking</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.razorpay_enabled}
                  onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b711e]"></div>
              </label>
            </div>

            {/* Key ID & Secret */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Razorpay Key ID *</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={paymentSettings.razorpay_enabled}
                    value={paymentSettings.razorpay_key_id}
                    onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_key_id: e.target.value })}
                    placeholder="rzp_test_... or rzp_live_..."
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Razorpay Key Secret *</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSecret ? 'text' : 'password'}
                    required={paymentSettings.razorpay_enabled}
                    value={paymentSettings.razorpay_key_secret || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_key_secret: e.target.value })}
                    placeholder="Enter Secret Key"
                    className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* COD Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#fafaf7] border border-stone-200">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Enable Cash on Delivery (COD)</span>
                <span className="text-[11px] text-stone-500">Allow customers to pay in cash or UPI QR upon delivery</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.cod_enabled}
                  onChange={e => setPaymentSettings({ ...paymentSettings, cod_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b711e]"></div>
              </label>
            </div>

            {/* ADMIN MANUAL VERIFICATION TOGGLE (User Requirement 2) */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-amber-950 block">
                    Require Manual Admin Payment Verification
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Dual Confirmation Workflow Option
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.require_admin_verification}
                    onChange={e =>
                      setPaymentSettings({ ...paymentSettings, require_admin_verification: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d1f15]"></div>
                </label>
              </div>

              <div className="text-[11px] text-amber-900/80 space-y-1 pt-1 border-t border-amber-200/60">
                <p>
                  <strong>When Turned ON:</strong> When customer pays online, the order is placed in <code>Placed</code> status with a <strong>"Needs Payment Verification"</strong> tag. The admin must verify and confirm the payment before dispatch.
                </p>
                <p>
                  <strong>When Turned OFF:</strong> When customer pays online, the order is <strong>automatically confirmed</strong> immediately upon successful Razorpay capture.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPayment}
              className="bg-[#0d1f15] hover:bg-[#173323] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#fed100]" />
              <span>{savingPayment ? 'Saving Gateway...' : 'Save Payment Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MAIL SERVER (SMTP / CPANEL) SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'email' && emailSettings && (
        <div className="space-y-6">
          <form onSubmit={handleSaveEmail} className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-serif font-black text-stone-900">
                    Mail Server (SMTP / cPanel Hosting)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Use your cPanel webmail account (e.g. orders@yourdomain.com) or custom SMTP server
                  </p>
                </div>
                {emailSuccess && (
                  <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Email Settings Saved!
                  </span>
                )}
              </div>

              {/* cPanel explanation card */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">💡 Hosting on cPanel?</span>
                <p className="text-blue-800 leading-relaxed">
                  In your cPanel dashboard &rarr; <strong>Email Accounts</strong> &rarr; create an email (e.g., <code>orders@yourdomain.com</code>).
                  Click "Connect Devices" to find your <strong>Outgoing Server</strong> (e.g. <code>mail.yourdomain.com</code>) and Port (<code>465</code> SSL or <code>587</code> TLS). Enter those credentials below!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    SMTP Host / Server (e.g. mail.yourdomain.com or smtp.gmail.com)
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtp_host || ''}
                    onChange={e => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                    placeholder="mail.villagedeli.in"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    SMTP Port (465 for SSL, 587 for TLS)
                  </label>
                  <input
                    type="number"
                    value={emailSettings.smtp_port || 465}
                    onChange={e => setEmailSettings({ ...emailSettings, smtp_port: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">SMTP Username / Email</label>
                  <input
                    type="text"
                    value={emailSettings.smtp_user || ''}
                    onChange={e => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                    placeholder="orders@villagedeli.in"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">SMTP Password</label>
                  <div className="relative">
                    <input
                      type={showSmtpPass ? 'text' : 'password'}
                      value={emailSettings.smtp_pass || ''}
                      onChange={e => setEmailSettings({ ...emailSettings, smtp_pass: e.target.value })}
                      placeholder="Account Password"
                      className="w-full text-xs pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPass(!showSmtpPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">From Email Address</label>
                  <input
                    type="email"
                    value={emailSettings.from_email || ''}
                    onChange={e => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                    placeholder="orders@villagedeli.in"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sender Name (Branding)</label>
                  <input
                    type="text"
                    value={emailSettings.sender_name}
                    onChange={e => setEmailSettings({ ...emailSettings, sender_name: e.target.value })}
                    placeholder="VillageDELI Orders"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Admin Notification Email (Receives New Orders & Inquiries)
                  </label>
                  <input
                    type="email"
                    value={emailSettings.admin_notification_email}
                    onChange={e => setEmailSettings({ ...emailSettings, admin_notification_email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>

              {/* OTP VERIFICATION SETTINGS (Requirement 2) */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#3b711e]" />
                    <span>Customer Authentication & OTP Verification (Can be Turned Off)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Configure one-time password (OTP) verification sent via email for user sign up and logins
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">OTP for User Registration / Sign Up</span>
                      <span className="text-[10px] text-stone-500">Require 6-digit email OTP to create an account</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailSettings.enable_otp_register === true}
                        onChange={e => setEmailSettings({ ...emailSettings, enable_otp_register: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b711e]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">OTP for User Sign In / Login</span>
                      <span className="text-[10px] text-stone-500">Send 6-digit OTP code to verify existing users</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailSettings.enable_otp_login === true}
                        onChange={e => setEmailSettings({ ...emailSettings, enable_otp_login: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b711e]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* GRANULAR NOTIFICATION SETTINGS (Requirement 2.1) */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3b711e]" />
                    <span>Granular Event Notifications (Customer & Admin Email Triggers)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Select exactly which events automatically dispatch emails to customers and administrators
                  </p>
                </div>

                {/* Customer Events */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">Customer Email Events:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { key: 'notify_customer_order_placed', label: 'Order Confirmed', desc: 'Sent when order is placed/confirmed' },
                      { key: 'notify_customer_order_preparing', label: 'Order Preparing', desc: 'Sent when status changes to Preparing' },
                      { key: 'notify_customer_order_out_for_delivery', label: 'Out for Delivery', desc: 'Sent when rider is dispatched' },
                      { key: 'notify_customer_order_delivered', label: 'Order Delivered', desc: 'Sent upon successful delivery' },
                      { key: 'notify_customer_order_cancelled', label: 'Order Cancelled', desc: 'Sent if order is cancelled with reason' },
                      { key: 'notify_customer_welcome', label: 'Welcome Email', desc: 'Sent upon successful registration' },
                      { key: 'notify_customer_query_received', label: 'Query Received', desc: 'Instant acknowledgment on Contact form' },
                      { key: 'notify_customer_query_reply', label: 'Admin Query Reply', desc: 'Sent when admin replies in Helpdesk' }
                    ].map(ev => (
                      <label
                        key={ev.key}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 flex items-start gap-2.5 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={(emailSettings as any)[ev.key] !== false}
                          onChange={e => setEmailSettings({ ...emailSettings, [ev.key]: e.target.checked })}
                          className="mt-0.5 w-4 h-4 text-[#3b711e] rounded focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-800 block">{ev.label}</span>
                          <span className="text-[10px] text-stone-500 leading-tight block mt-0.5">{ev.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Admin Events */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-stone-700 block">Admin Notification Alerts:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'notify_admin_new_order', label: 'New Order Alert', desc: 'Sent to admin email on each new order' },
                      { key: 'notify_admin_order_cancelled', label: 'Order Cancellation Alert', desc: 'Sent if an order is cancelled' },
                      { key: 'notify_admin_new_query', label: 'New Customer Support Ticket', desc: 'Sent when Contact Us form is submitted' }
                    ].map(ev => (
                      <label
                        key={ev.key}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 flex items-start gap-2.5 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={(emailSettings as any)[ev.key] !== false}
                          onChange={e => setEmailSettings({ ...emailSettings, [ev.key]: e.target.checked })}
                          className="mt-0.5 w-4 h-4 text-[#3b711e] rounded focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-800 block">{ev.label}</span>
                          <span className="text-[10px] text-stone-500 leading-tight block mt-0.5">{ev.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingEmail}
                className="bg-[#0d1f15] hover:bg-[#173323] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 text-[#fed100]" />
                <span>{savingEmail ? 'Saving Mail Server...' : 'Save Mail Server Settings'}</span>
              </button>
            </div>
          </form>

          {/* Test Email Dispatcher */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                🧪 Test Mail Server & Verify Delivery (Localhost / Live)
              </h3>
              <p className="text-xs text-stone-500">
                Send a test email to verify your SMTP connection. If on localhost without custom SMTP, Ethereal test server will generate an instant browser preview link.
              </p>
            </div>

            <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={testEmailTo}
                onChange={e => setTestEmailTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
              />
              <button
                type="submit"
                disabled={sendingTest}
                className="bg-[#3b711e] hover:bg-[#2d5c16] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {sendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{sendingTest ? 'Sending Test...' : 'Send Test Verification Email'}</span>
              </button>
            </form>

            {testResult && (
              <div
                className={`p-4 rounded-xl text-xs flex flex-col gap-1.5 ${
                  testResult.success
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{testResult.message}</span>
                </div>
                {testResult.previewUrl && (
                  <div className="pt-2 mt-1 border-t border-green-200/60">
                    <span className="font-semibold block mb-1">Localhost Test Delivery Preview:</span>
                    <a
                      href={testResult.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3b711e] font-bold underline flex items-center gap-1 hover:text-[#2d5c16]"
                    >
                      <span>Open Ethereal Email Preview in Browser</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: EMAIL ANY USER (DIRECT DISPATCHER - Requirement 5.1) */}
      {/* ======================================================== */}
      {activeTab === 'dispatch' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-serif font-black text-stone-900">
              Direct Email Dispatcher ("Email Any User")
            </h2>
            <p className="text-xs text-stone-500">
              Send a personalized official VillageDELI branded email directly to any customer, user, or email address
            </p>
          </div>

          {customResult && (
            <div
              className={`p-4 rounded-xl text-xs flex flex-col gap-1.5 ${
                customResult.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {customResult.success ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4" />}
                <span>{customResult.message}</span>
              </div>
              {customResult.previewUrl && (
                <div className="pt-2 mt-1 border-t border-green-200/60">
                  <a
                    href={customResult.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3b711e] font-bold underline flex items-center gap-1 hover:text-[#2d5c16]"
                  >
                    <span>View Sent Email Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSendCustomEmail} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Recipient Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={customEmailTo}
                    onChange={e => setCustomEmailTo(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Recipient Name (Optional)</label>
                <input
                  type="text"
                  value={customEmailName}
                  onChange={e => setCustomEmailName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subject Line *</label>
              <input
                type="text"
                required
                value={customEmailSubject}
                onChange={e => setCustomEmailSubject(e.target.value)}
                placeholder="Important update regarding your VillageDELI order"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Message Body *</label>
              <textarea
                rows={6}
                required
                value={customEmailMessage}
                onChange={e => setCustomEmailMessage(e.target.value)}
                placeholder="Write your email message here. It will be sent with official VillageDELI header and footer branding..."
                className="w-full text-xs p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] leading-relaxed resize-y"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sendingCustom}
                className="bg-[#0d1f15] hover:bg-[#173323] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
              >
                {sendingCustom ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#fed100]" />
                    <span>Send Email to User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: NOTIFICATION TEMPLATES */}
      {/* ======================================================== */}
      {activeTab === 'templates' && emailSettings && (
        <form onSubmit={handleSaveEmail} className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-serif font-black text-stone-900">
                  Transactional Email Templates
                </h2>
                <p className="text-xs text-stone-500">
                  Customize the subjects, headers, and footers of system-generated emails
                </p>
              </div>
              {emailSuccess && (
                <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Templates Saved!
                </span>
              )}
            </div>

            {/* Template Variables Helper */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-800 block">Available Dynamic Variables:</span>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono pt-1">
                <span className="bg-white px-2 py-0.5 rounded border border-stone-200">{'{{order_id}}'}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-stone-200">{'{{customer_name}}'}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-stone-200">{'{{order_total}}'}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-stone-200">{'{{payment_method}}'}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-stone-200">{'{{delivery_address}}'}</span>
              </div>
            </div>

            {/* Customer Email Template */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3b711e] block">
                1. Customer Order Confirmation Email
              </span>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSettings.customer_email_subject}
                  onChange={e => setEmailSettings({ ...emailSettings, customer_email_subject: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Header Message</label>
                <textarea
                  rows={2}
                  value={emailSettings.customer_email_header}
                  onChange={e => setEmailSettings({ ...emailSettings, customer_email_header: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Footer Message</label>
                <textarea
                  rows={2}
                  value={emailSettings.customer_email_footer}
                  onChange={e => setEmailSettings({ ...emailSettings, customer_email_footer: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
                />
              </div>
            </div>

            {/* Admin Alert Template */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0d1f15] block">
                2. Admin New Order Alert Email
              </span>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSettings.admin_email_subject}
                  onChange={e => setEmailSettings({ ...emailSettings, admin_email_subject: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Header Message</label>
                <textarea
                  rows={2}
                  value={emailSettings.admin_email_header}
                  onChange={e => setEmailSettings({ ...emailSettings, admin_email_header: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Footer Message</label>
                <textarea
                  rows={2}
                  value={emailSettings.admin_email_footer}
                  onChange={e => setEmailSettings({ ...emailSettings, admin_email_footer: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingEmail}
              className="bg-[#0d1f15] hover:bg-[#173323] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#fed100]" />
              <span>{savingEmail ? 'Saving Templates...' : 'Save Templates'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
