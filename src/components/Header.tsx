import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCartDrawer, deliveryPincode, setDeliveryPincode } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  const primaryNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'What We Offer', path: '/what-we-offer' },
    { label: 'Our Locations', path: '/locations' },
    { label: 'Order Now', path: '/order-now', highlight: true },
    { label: 'VillageDELI Club', path: '/club' }
  ];

  const moreNavLinks = [
    { label: 'Our Formats', path: '/formats', desc: 'Flagship, Express & Micro Deli' },
    { label: 'Fresh From The Source', path: '/source', desc: 'Direct farm sourcing & harvest' },
    { label: 'Partner With Us', path: '/opportunity', desc: 'Franchise chapters & growth' },
    { label: 'Careers', path: '/careers', desc: 'Join our culinary & ops team' },
    { label: 'Contact', path: '/contact', desc: 'Customer support & inquiries' }
  ];

  const navLinks = [...primaryNavLinks, ...moreNavLinks];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/order-now?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-stone-200'
            : 'bg-white py-3.5 border-b border-stone-100'
        }`}
      >
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* 1. BRAND LOGO */}
            <Link to="/" className="flex items-center shrink-0 group py-0.5" title="Village DELI - Home">
              <img
                src="/assets/village_deli_logo.png"
                alt="Village DELI - Always Here For You"
                className="h-10 sm:h-11 w-auto object-contain group-hover:scale-[1.02] transition-transform"
              />
            </Link>

            {/* 2. DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4 text-xs xl:text-[13px] font-medium text-stone-700 whitespace-nowrap">
              {primaryNavLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`transition-colors relative py-1 shrink-0 ${
                      link.highlight
                        ? isActive
                          ? 'text-[#0d1f15] font-bold bg-[#6cb33f]/25 px-2.5 py-1 rounded-full'
                          : 'text-[#2d5c16] font-bold hover:text-[#0d1f15] bg-[#6cb33f]/15 hover:bg-[#6cb33f]/25 px-2.5 py-1 rounded-full'
                        : isActive
                        ? 'text-[#0d1f15] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6cb33f]'
                        : 'hover:text-[#0d1f15]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div className="relative shrink-0" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  onMouseEnter={() => setMoreDropdownOpen(true)}
                  className={`flex items-center gap-1 py-1 px-2 rounded-lg text-xs xl:text-[13px] font-medium transition-colors cursor-pointer shrink-0 ${
                    moreNavLinks.some(l => location.pathname === l.path)
                      ? 'text-[#0d1f15] font-bold bg-stone-100'
                      : 'hover:text-[#0d1f15] hover:bg-stone-50'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                      moreDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {moreDropdownOpen && (
                  <div
                    onMouseLeave={() => setMoreDropdownOpen(false)}
                    className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {moreNavLinks.map(link => {
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`block px-3 py-2 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-[#eef5ea] text-[#0d1f15] font-bold'
                              : 'hover:bg-stone-50 text-stone-700 hover:text-[#0d1f15]'
                          }`}
                        >
                          <div className="text-xs font-semibold leading-tight">{link.label}</div>
                          <div className="text-[10px] text-stone-400 leading-tight mt-0.5">{link.desc}</div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* 3. RIGHT UTILITY BUTTONS */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-10">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-stone-600 hover:text-[#0d1f15] hover:bg-stone-100 rounded-full transition-colors cursor-pointer shrink-0"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Location Deliver-to Selector */}
              <div className="relative hidden md:block shrink-0">
                <button
                  type="button"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-[#0d1f15] bg-stone-50 hover:bg-stone-100 px-2.5 sm:px-3 py-1.5 rounded-full border border-stone-200 transition-colors cursor-pointer shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#6cb33f] shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-stone-400 leading-tight hidden xl:block">Deliver to</span>
                    <span className="font-semibold text-stone-800 leading-tight truncate max-w-[85px] sm:max-w-[105px] xl:max-w-[130px]">
                      Sector 109, {deliveryPincode}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5 shrink-0" />
                </button>

                {locationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50">
                    <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                      Delivery Location
                    </div>
                    <p className="text-[11px] text-stone-500 mb-3">
                      Enter your 6-digit Indian PIN code to check instant 30–60 min delivery availability.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={deliveryPincode}
                        onChange={e => setDeliveryPincode(e.target.value)}
                        placeholder="e.g. 122017"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#6cb33f] text-stone-800 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setLocationDropdownOpen(false)}
                        className="bg-[#0d1f15] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#6cb33f] transition-colors cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button with Count Badge */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="relative p-2 text-stone-700 hover:text-[#0d1f15] hover:bg-stone-100 rounded-full transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#6cb33f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account / Profile Button & Dropdown */}
              {user ? (
                <div className="relative shrink-0" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 pl-1.5 pr-2 sm:px-3 sm:py-1.5 bg-[#eef5ea] hover:bg-[#e2edd9] text-[#0d1f15] border border-[#6cb33f]/50 rounded-full transition-all cursor-pointer shadow-2xs group shrink-0"
                    title={`Logged in as ${user.full_name} — View Profile`}
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-6 h-6 rounded-full object-cover border border-[#6cb33f]/60 shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#0d1f15] text-[#fed100] text-[11px] font-bold flex items-center justify-center shrink-0">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#2d5c16] font-bold leading-tight uppercase tracking-wider hidden sm:block">
                        My Profile
                      </span>
                      <span className="text-xs font-black text-[#0d1f15] leading-tight max-w-[80px] xl:max-w-[110px] truncate">
                        {user.full_name.split(' ')[0]}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#2d5c16] transition-transform duration-200 ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 bg-[#fafaf7] rounded-xl border border-stone-100 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#0d1f15] text-[#fed100] font-bold text-sm flex items-center justify-center shrink-0 border border-[#6cb33f]">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[#0d1f15] truncate">{user.full_name}</div>
                            <div className="text-[11px] text-stone-500 font-mono truncate">{user.email}</div>
                            <span className="inline-block mt-0.5 text-[9px] bg-[#eef5ea] text-[#2d5c16] font-black px-2 py-0.5 rounded-full uppercase">
                              {user.role === 'customer' ? 'Verified Member' : user.role.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-xs text-stone-700">
                        <Link
                          to="/my-account?tab=profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 hover:text-[#0d1f15] font-medium transition-colors"
                        >
                          <User className="w-4 h-4 text-[#3b711e]" />
                          <span>My Profile & Details</span>
                        </Link>
                        <Link
                          to="/my-account?tab=orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 hover:text-[#0d1f15] font-medium transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#3b711e]" />
                          <span>My Orders & History</span>
                        </Link>
                        <Link
                          to="/my-account?tab=addresses"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 hover:text-[#0d1f15] font-medium transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-[#3b711e]" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link
                          to="/club"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 hover:text-[#0d1f15] font-medium transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-[#fed100]" />
                          <span>VillageDELI Club</span>
                        </Link>
                      </div>

                      <div className="pt-1.5 mt-1.5 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-stone-400 group-hover:text-red-600" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 bg-[#0d1f15] hover:bg-[#1a3d2b] text-white rounded-full transition-all text-xs font-bold border border-[#6cb33f]/40 shadow-xs group shrink-0"
                  title="Sign In or View My Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[#fed100] group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold tracking-tight whitespace-nowrap">My Profile</span>
                </Link>
              )}

              {/* Find Your Store CTA Button (responsive & shrink-protected) */}
              <Link
                to="/locations"
                className="hidden 2xl:inline-flex items-center justify-center bg-[#0d1f15] hover:bg-[#173323] text-white font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all shadow-xs shrink-0 whitespace-nowrap"
              >
                FIND YOUR STORE
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 shadow-xl px-4 py-5 animate-fadeIn">
            {/* User Profile Mobile Card */}
            <div className="p-3.5 bg-[#f7faf5] border border-[#6cb33f]/30 rounded-2xl mb-4 shadow-2xs">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0d1f15] text-[#fed100] font-black text-sm flex items-center justify-center border-2 border-[#6cb33f] shrink-0 shadow-xs">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#0d1f15] truncate">{user.full_name}</div>
                      <div className="text-[11px] text-stone-500 font-mono truncate">{user.email}</div>
                      <span className="inline-block mt-0.5 text-[9px] bg-[#eef5ea] text-[#2d5c16] font-black px-2 py-0.5 rounded-full uppercase">
                        {user.role === 'customer' ? 'Verified Member' : user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/60">
                    <Link
                      to="/my-account?tab=profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-stone-50 rounded-xl text-xs font-bold text-[#0d1f15] border border-stone-200 shadow-2xs"
                    >
                      <User className="w-3.5 h-3.5 text-[#3b711e]" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/my-account?tab=orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-stone-50 rounded-xl text-xs font-bold text-[#0d1f15] border border-stone-200 shadow-2xs"
                    >
                      <Package className="w-3.5 h-3.5 text-[#3b711e]" />
                      <span>My Orders</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-center text-xs text-red-600 font-bold hover:underline pt-1 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0d1f15]">Customer Account</h4>
                    <p className="text-[11px] text-stone-500">Sign in to check profile & orders</p>
                  </div>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#0d1f15] hover:bg-[#6cb33f] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#fed100]" />
                    <span>My Profile</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Deliver to mobile bar */}
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl mb-4 border border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6cb33f]" />
                <span className="text-xs text-stone-700">Deliver to PIN: <strong>{deliveryPincode}</strong></span>
              </div>
              <button
                onClick={() => {
                  const newPin = prompt('Enter 6-digit delivery PIN code:', deliveryPincode);
                  if (newPin && /^\d{6}$/.test(newPin.trim())) {
                    setDeliveryPincode(newPin.trim());
                  }
                }}
                className="text-xs text-[#3b711e] font-bold hover:underline"
              >
                Change
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2.5 px-3 rounded-xl font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#0d1f15] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-stone-200 flex flex-col gap-2">
                <Link
                  to="/locations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#0d1f15] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  FIND YOUR STORE
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#3b711e]">
                Search Catalog
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search fresh produce, groceries, meals, snacks..."
                className="w-full text-sm sm:text-base py-3.5 pl-11 pr-24 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#6cb33f] text-stone-900 bg-stone-50"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0d1f15] hover:bg-[#6cb33f] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
