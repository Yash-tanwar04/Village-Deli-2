import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Phone,
  Sparkles,
  Check,
  LifeBuoy,
  MessageSquare,
  Send,
  X,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Order, Address, SupportQuery } from '../types';

export const MyAccountPage: React.FC = () => {
  const { user, logout, addresses, addAddress, removeAddress, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const getInitialTab = (): 'orders' | 'addresses' | 'queries' | 'profile' => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'profile' || tabParam === 'addresses' || tabParam === 'orders' || tabParam === 'queries') {
      return tabParam;
    }
    if (location.pathname === '/profile' || location.pathname === '/my-profile') {
      return 'profile';
    }
    if (location.pathname === '/my-orders') {
      return 'orders';
    }
    return 'orders';
  };

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'queries' | 'profile'>(getInitialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Queries State (Requirement 3)
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [selectedUserQuery, setSelectedUserQuery] = useState<SupportQuery | null>(null);
  const [userReplyText, setUserReplyText] = useState('');
  const [sendingUserReply, setSendingUserReply] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState(user?.full_name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Sync tab with URL search parameter
  const handleTabChange = (tab: 'orders' | 'addresses' | 'queries' | 'profile') => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  useEffect(() => {
    if (user) {
      setEditName(user.full_name);
      setEditPhone(user.phone || '');
      loadUserQueries();
    }
  }, [user]);

  const loadUserQueries = async () => {
    if (!user) return;
    setLoadingQueries(true);
    try {
      const data = await api.getSupportQueries(user.email, user.id);
      setQueries(data);
      if (selectedUserQuery) {
        const refreshed = data.find(q => q.id === selectedUserQuery.id);
        if (refreshed) setSelectedUserQuery(refreshed);
      }
    } catch (err) {
      console.error('Failed to load user queries:', err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleSendCustomerReply = async () => {
    if (!selectedUserQuery || !userReplyText.trim() || sendingUserReply) return;
    setSendingUserReply(true);
    try {
      const updated = await api.replySupportQuery(
        selectedUserQuery.id,
        userReplyText.trim(),
        'Customer',
        user?.full_name || 'Customer'
      );
      setSelectedUserQuery(updated);
      setQueries(prev => prev.map(q => (q.id === updated.id ? updated : q)));
      setUserReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSendingUserReply(false);
    }
  };

  // New & Edit Address Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [houseFlat, setHouseFlat] = useState('');
  const [buildingStreet, setBuildingStreet] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [state, setState] = useState('Haryana');
  const [pincode, setPincode] = useState('122017');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setHouseFlat('');
    setBuildingStreet('');
    setAreaLocality('');
    setCity('Gurugram');
    setState('Haryana');
    setPincode('122017');
    setLandmark('');
    setAddressType('Home');
    setShowAddModal(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id || null);
    setHouseFlat(addr.house_flat || '');
    setBuildingStreet(addr.building_street || '');
    setAreaLocality(addr.area_locality || '');
    setCity(addr.city || 'Gurugram');
    setState(addr.state || 'Haryana');
    setPincode(addr.pincode || '');
    setLandmark(addr.landmark || '');
    setAddressType((addr.address_type as any) || 'Home');
    setShowAddModal(true);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadUserOrders();
  }, [user, navigate]);

  const loadUserOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const userOrders = await api.getOrders(user.id);
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const addrData: Address = {
        id: editingAddressId || undefined,
        user_id: user.id,
        full_name: user.full_name,
        phone: user.phone || '9876543210',
        house_flat: houseFlat.trim(),
        building_street: buildingStreet.trim(),
        area_locality: areaLocality.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        landmark: landmark.trim(),
        address_type: addressType,
        is_default: addresses.length === 0
      };

      await addAddress(addrData);

      setShowAddModal(false);
      setEditingAddressId(null);
      setHouseFlat('');
      setBuildingStreet('');
      setAreaLocality('');
    } catch (err) {
      alert('Failed to save address.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Full name is required.');
      return;
    }
    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    try {
      await updateProfile({
        full_name: editName.trim(),
        phone: editPhone.trim()
      });
      setIsEditingProfile(false);
      setProfileSuccessMsg('Profile details saved successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-20 pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0d1f15] text-[#fed100] font-serif font-black text-xl flex items-center justify-center border-2 border-[#6cb33f]">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-serif font-black text-[#0d1f15]">
                    {user.full_name}
                  </h1>
                </div>
                <p className="text-xs text-stone-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mt-8 border-b border-stone-200 -mb-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange('profile')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#3b711e] text-[#0d1f15]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <User className="w-4 h-4 text-[#3b711e]" />
              <span>My Profile & Details</span>
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-[#3b711e] text-[#0d1f15]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('addresses')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'addresses'
                  ? 'border-[#3b711e] text-[#0d1f15]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('queries')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'queries'
                  ? 'border-[#3b711e] text-[#0d1f15]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Support Queries ({queries.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-bold uppercase">Loading order history...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-black text-stone-900 text-sm">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-[#eaf4e6] text-[#2d5c16]'
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.delivery_type === 'pickup' ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f2f6ee] text-[#3b711e] border border-[#6cb33f]/30 flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            <span>Store Pickup: {order.pickup_store_name || 'Retail Outlet'}</span>
                          </span>
                        ) : order.nearest_store_name ? (
                          <span className="text-[10px] font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200 flex items-center gap-1">
                            <Store className="w-3 h-3 text-stone-400" />
                            <span>Hub: {order.nearest_store_name}</span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-stone-500">
                        Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="text-xs text-stone-700">
                        {order.items.length} items • Total:{' '}
                        <strong className="text-stone-900 font-bold">₹{order.total}</strong> ({order.payment_method === 'Razorpay' ? 'Razorpay Online' : 'Cash on Delivery'})
                      </div>
                      {order.cancellation_reason && (
                        <div className="text-[11px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-200 mt-1">
                          <strong>Cancellation Reason:</strong> {order.cancellation_reason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors"
                      >
                        View Receipt
                      </Link>
                      <Link
                        to={`/order-tracking/${order.id}`}
                        className="inline-flex items-center gap-1.5 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-colors shadow-2xs"
                      >
                        <span>Track Status</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#fed100]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold font-serif text-stone-900 mb-1">
                  No orders placed yet
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  Ready to order farm fresh groceries? Explore our departments now.
                </p>
                <Link
                  to="/order-now"
                  className="inline-flex items-center gap-2 bg-[#0d1f15] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#173323] transition-colors"
                >
                  <span>Start Shopping</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-900">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-stone-500">
                  Manage your home and office delivery destinations
                </p>
              </div>
              <button
                onClick={handleOpenAddAddress}
                className="inline-flex items-center gap-1.5 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#fed100]" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3b711e] bg-[#f2f6ee] px-2.5 py-0.5 rounded-md">
                        {addr.address_type}
                      </span>
                      {addr.is_default && (
                        <span className="text-[10px] font-bold text-stone-400">Default</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-800 space-y-0.5">
                      <div className="font-bold">{addr.house_flat}</div>
                      {addr.building_street && <div>{addr.building_street}</div>}
                      <div>{addr.area_locality}</div>
                      <div>{addr.city}, {addr.state} - {addr.pincode}</div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditAddress(addr)}
                      className="text-xs font-semibold text-[#3b711e] hover:text-[#2d5c16] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => addr.id && removeAddress(addr.id)}
                      className="text-xs font-semibold text-stone-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Personal Information & Edit Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-black text-stone-900">
                    Personal Information
                  </h2>
                  <p className="text-xs text-stone-500">
                    Your personal contact and identification details
                  </p>
                </div>

                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eef5ea] hover:bg-[#e2edd9] text-[#2d5c16] rounded-full text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {profileSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="font-medium">{profileSuccessMsg}</span>
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-100 text-stone-500 font-mono cursor-not-allowed"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      To change your primary email, please contact customer support.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditName(user.full_name);
                        setEditPhone(user.phone || '');
                        setIsEditingProfile(false);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2 rounded-full bg-[#0d1f15] hover:bg-[#1a3d2b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      {isSavingProfile ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#6cb33f]" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs text-stone-700">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Full Name
                      </span>
                      <span className="text-sm font-bold text-[#0d1f15] mt-0.5 block">
                        {user.full_name}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#3b711e]">
                      <User className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Email Address
                      </span>
                      <span className="text-xs font-mono font-semibold text-stone-800 mt-0.5 block">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-green-700" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Phone Number
                      </span>
                      <span className="text-xs font-mono font-semibold text-stone-800 mt-0.5 block">
                        {user.phone || 'Not specified (Click "Edit Profile" to add)'}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Account Type
                      </span>
                      <span className="text-xs font-bold text-[#0d1f15] mt-0.5 capitalize block">
                        {user.role === 'customer' ? 'Customer Account' : user.role.replace('_', ' ') + ' (Staff)'}
                      </span>
                    </div>
                    <span className="text-[10px] bg-[#eef5ea] text-[#2d5c16] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Account Overview, Stats & Shortcuts */}
            <div className="lg:col-span-5 space-y-6">
              {/* Account Card */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#0d1f15] text-[#fed100] font-black text-lg flex items-center justify-center border-2 border-[#6cb33f] shrink-0 shadow-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif font-black text-sm text-[#0d1f15] truncate">
                      {user.full_name}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-mono truncate">{user.email}</p>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                      ID: {user.id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleTabChange('orders')}
                    className="p-3 bg-stone-50 hover:bg-[#eef5ea] border border-stone-200 hover:border-[#6cb33f]/40 rounded-2xl text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-lg font-mono font-black text-[#0d1f15] block group-hover:text-[#2d5c16]">
                      {orders.length}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 group-hover:text-[#2d5c16] block truncate">
                      Orders →
                    </span>
                  </button>

                  <button
                    onClick={() => handleTabChange('addresses')}
                    className="p-3 bg-stone-50 hover:bg-[#eef5ea] border border-stone-200 hover:border-[#6cb33f]/40 rounded-2xl text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-lg font-mono font-black text-[#0d1f15] block group-hover:text-[#2d5c16]">
                      {addresses.length}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 group-hover:text-[#2d5c16] block truncate">
                      Addresses →
                    </span>
                  </button>

                  <button
                    onClick={() => handleTabChange('queries')}
                    className="p-3 bg-stone-50 hover:bg-[#eef5ea] border border-stone-200 hover:border-[#6cb33f]/40 rounded-2xl text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-lg font-mono font-black text-[#0d1f15] block group-hover:text-[#2d5c16]">
                      {queries.length}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 group-hover:text-[#2d5c16] block truncate">
                      Queries →
                    </span>
                  </button>
                </div>

                <div className="pt-2 text-xs text-stone-500 flex items-center justify-between border-t border-stone-100">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Member Since
                  </span>
                  <span className="font-semibold text-stone-700 font-mono text-[11px]">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'}
                  </span>
                </div>
              </div>

              {/* VillageDELI Club Banner */}
              <div className="bg-[#0d1f15] text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-[#6cb33f] text-[#0d1f15] font-black uppercase px-2 py-0.5 rounded-full">
                    EXCLUSIVE CLUB
                  </span>
                  <Sparkles className="w-4 h-4 text-[#fed100]" />
                </div>
                <h4 className="text-base font-serif font-black text-white">
                  VillageDELI Member Perks
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Enjoy free priority 30-min deliveries, seasonal farm basket previews, and exclusive in-store deli tastings.
                </p>
                <div className="pt-2">
                  <Link
                    to="/club"
                    className="inline-flex items-center gap-1.5 bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <span>Explore Club Perks →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPORT QUERIES & HELPDESK */}
        {activeTab === 'queries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0d1f15]">
                  Support Queries & Helpdesk
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Track questions submitted via our Contact Us form and view responses from our customer support team
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadUserQueries}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Refresh Queries</span>
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#6cb33f]" />
                  <span>Submit New Query</span>
                </Link>
              </div>
            </div>

            {loadingQueries ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-bold uppercase">Loading your support tickets...</p>
              </div>
            ) : queries.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {queries.map(q => (
                  <div
                    key={q.id}
                    onClick={() => setSelectedUserQuery(q)}
                    className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#6cb33f]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-stone-100 text-stone-900 px-2.5 py-0.5 rounded-lg border border-stone-200">
                          {q.ticket_number || q.id}
                        </span>
                        <h3 className="font-serif font-black text-base text-stone-900 group-hover:text-[#2d5c16] transition-colors truncate">
                          {q.subject}
                        </h3>
                        {(() => {
                          const s = (q.status || '').toLowerCase().replace(/\s+/g, '-');
                          if (s === 'open') {
                            return (
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                Open
                              </span>
                            );
                          }
                          if (s === 'in-progress') {
                            return (
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                                In Progress
                              </span>
                            );
                          }
                          if (s === 'resolved') {
                            return (
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-green-100 text-green-900 border border-green-300">
                                Resolved
                              </span>
                            );
                          }
                          return (
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                              Closed
                            </span>
                          );
                        })()}
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {q.message || (q.messages && q.messages[0]?.message) || ''}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-stone-400">
                        <span>Submitted on {new Date(q.created_at).toLocaleDateString()}</span>
                        {(() => {
                          const replyCount = q.replies
                            ? q.replies.length
                            : (q.messages && q.messages.length > 1 ? q.messages.length - 1 : 0);
                          return replyCount > 0 ? (
                            <span className="font-bold text-[#3b711e] flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {replyCount} repl{replyCount === 1 ? 'y' : 'ies'}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedUserQuery(q);
                        }}
                        className="bg-stone-50 group-hover:bg-[#0d1f15] text-stone-700 group-hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all border border-stone-200 group-hover:border-[#0d1f15] cursor-pointer"
                      >
                        View Chat →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-black text-lg text-stone-800">
                  No Support Inquiries Found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Need assistance with an order, deliveries, or farm products? Drop us a message anytime.
                </p>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-2xs"
                  >
                    <span>Contact VillageDELI Support</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* USER QUERY CONVERSATION MODAL */}
      {selectedUserQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-6 flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded-lg">
                    {selectedUserQuery.ticket_number || selectedUserQuery.id}
                  </span>
                  <h3 className="text-lg font-serif font-black text-[#0d1f15]">
                    {selectedUserQuery.subject}
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Submitted on {new Date(selectedUserQuery.created_at).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserQuery(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Original Message */}
              <div className="bg-[#fcfaf5] border border-amber-200/70 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Your Inquiry
                </span>
                <p className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {selectedUserQuery.message || (selectedUserQuery.messages && selectedUserQuery.messages[0]?.message) || ''}
                </p>
              </div>

              {/* Chat Thread */}
              {(() => {
                const thread = selectedUserQuery.replies && selectedUserQuery.replies.length > 0
                  ? selectedUserQuery.replies
                  : (selectedUserQuery.messages && selectedUserQuery.messages.length > 1 ? selectedUserQuery.messages.slice(1) : []);

                return thread.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {thread.map((r: any) => {
                      const isAdmin = r.sender === 'Admin' || r.sender === 'admin' || r.sender_name?.toLowerCase().includes('admin');
                      return (
                        <div
                          key={r.id}
                          className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs space-y-1 ${
                              isAdmin
                                ? 'bg-[#0d1f15] text-white rounded-bl-xs'
                                : 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-br-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                              <span className="font-bold">
                                {isAdmin ? '🛡️ VillageDELI Support Team' : '👤 You'}
                              </span>
                              <span>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{r.message}</p>
                          </div>
                          <span className="text-[10px] text-stone-400 mt-1 px-1">
                            {new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Reply Input */}
            <div className="pt-4 border-t border-stone-100 shrink-0 space-y-2">
              <textarea
                rows={3}
                value={userReplyText}
                onChange={e => setUserReplyText(e.target.value)}
                placeholder="Type your reply to our support team..."
                className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={sendingUserReply || !userReplyText.trim()}
                  onClick={handleSendCustomerReply}
                  className="inline-flex items-center gap-2 bg-[#3b711e] hover:bg-[#2d5c16] text-white px-5 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingUserReply ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-serif font-black text-stone-900 mb-4">
              {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>

            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">House / Flat No. *</label>
                <input
                  type="text"
                  required
                  value={houseFlat}
                  onChange={e => setHouseFlat(e.target.value)}
                  placeholder="e.g. Flat 301, Tower A"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Building / Society</label>
                <input
                  type="text"
                  value={buildingStreet}
                  onChange={e => setBuildingStreet(e.target.value)}
                  placeholder="e.g. Palm Gardens"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Area / Sector *</label>
                  <input
                    type="text"
                    required
                    value={areaLocality}
                    onChange={e => setAreaLocality(e.target.value)}
                    placeholder="e.g. Sector 109"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">6-Digit PIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="122017"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Type</label>
                  <select
                    value={addressType}
                    onChange={e => setAddressType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State</label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Haryana">Haryana</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chandigarh">Chandigarh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="e.g. Near Park"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#0d1f15] hover:bg-[#173323] text-white font-bold cursor-pointer"
                >
                  {editingAddressId ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
