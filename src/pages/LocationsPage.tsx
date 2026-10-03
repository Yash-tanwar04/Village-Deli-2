import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Store,
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { DelhiNcrNetworkMap } from '../components/DelhiNcrNetworkMap';
import { api } from '../lib/api';

export interface StoreItem {
  id: string;
  name: string;
  format: 'Neighbourhood' | 'VillageDELI Hub' | 'Highway' | 'Petrol Pump' | string;
  badge: string;
  address: string;
  pincode: string;
  city: string;
  phone: string;
  hours: string;
  manager: string;
  parking: string;
  icons: string[];
  image: string;
}

const DEFAULT_STORES: StoreItem[] = [
  {
    id: 'loc-109',
    name: 'VillageDELI – Sector 109',
    format: 'Neighbourhood',
    badge: 'Neighbourhood Store',
    address: 'Plot 12, Sector 109, Gurugram, Haryana - 122017',
      pincode: '122017',
      city: 'Gurugram',
      phone: '+91 98765 43210',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Amit Sharma',
      parking: 'Yes',
      icons: ['Fresh Produce', 'Fresh Food', 'Groceries', 'Bakery'],
      image: '/assets/mockup/store_sector_109_card.webp'
    },
    {
      id: 'loc-dwarka-hub',
      name: 'VillageDELI Hub – Dwarka Expressway',
      format: 'VillageDELI Hub',
      badge: 'VillageDELI Hub',
      address: 'Near Global City, Dwarka Expressway, Gurugram, Haryana - 122006',
      pincode: '122006',
      city: 'Gurugram',
      phone: '+91 98765 43211',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Vikas Malhotra',
      parking: 'Yes (100+ Cars & EV)',
      icons: ['Fresh Produce', 'Bakery & Milling', 'Fresh Food', 'Dairy & Meats'],
      image: '/assets/mockup/store_dwarka_exp_card.webp'
    },
    {
      id: 'loc-kmp',
      name: 'VillageDELI – KMP Highway',
      format: 'Highway',
      badge: 'Highway Store',
      address: 'Kundli Manesar Palwal (KMP) Expressway, Gurugram, Haryana',
      pincode: '122505',
      city: 'Gurugram',
      phone: '+91 98765 43212',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Rajesh Hooda',
      parking: 'Yes (Highway Rest Area)',
      icons: ['Quick Meals', 'Beverages', 'Groceries', 'Travel Essentials'],
      image: '/assets/mockup/store_kmp_highway_card.webp'
    },
    {
      id: 'loc-sec56',
      name: 'VillageDELI – Sector 56',
      format: 'Neighbourhood',
      badge: 'Neighbourhood Store',
      address: 'Main Market, Sector 56, Gurugram, Haryana - 122011',
      pincode: '122011',
      city: 'Gurugram',
      phone: '+91 98765 43213',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Priya Sharma',
      parking: 'Yes',
      icons: ['Fresh Produce', 'Dairy & Chilled', 'Artisan Bakery', 'Groceries'],
      image: '/assets/mockup/store_sector_56_card.webp'
    },
    {
      id: 'loc-sohna',
      name: 'VillageDELI – Sohna Road',
      format: 'Highway',
      badge: 'Waypoint Highway Hub',
      address: 'Subhash Chowk, Sohna Road, Gurugram, Haryana - 122002',
      pincode: '122002',
      city: 'Gurugram',
      phone: '+91 98765 43214',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Karan Mehra',
      parking: 'Yes',
      icons: ['Quick Meals', 'Fresh Beverages', 'Groceries', 'Ample Parking'],
      image: '/assets/mockup/store_sohna_road_card.webp'
    },
    {
      id: 'loc-golf-course',
      name: 'VillageDELI – Golf Course Ext.',
      format: 'Neighbourhood',
      badge: 'Neighbourhood Store',
      address: 'Golf Course Extension Road, Gurugram, Haryana - 122036',
      pincode: '122036',
      city: 'Gurugram',
      phone: '+91 98765 43215',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Sunil Verma',
      parking: 'Yes',
      icons: ['Fresh Produce', 'Gourmet Grocery', 'Bakery', 'Coffee Station'],
      image: '/assets/mockup/store_golf_course_card.webp'
    }
  ];

export const LocationsPage: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<string>('All Stores');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStoreModal, setActiveStoreModal] = useState<StoreItem | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'gallery' | 'services' | 'map' | 'reviews'>('today');
  const [stores, setStores] = useState<StoreItem[]>(DEFAULT_STORES);

  useEffect(() => {
    api.getStores()
      .then(data => {
        if (data && data.length > 0) {
          const mapped: StoreItem[] = data.map(d => ({
            id: d.id,
            name: d.name,
            format: d.format,
            badge: d.badge || '',
            address: d.address,
            pincode: d.pincode,
            city: d.city,
            phone: d.phone,
            hours: d.hours,
            manager: d.manager,
            parking: d.parking,
            icons: d.icons || ['Fresh Produce', 'Groceries'],
            image: d.image || '/assets/mockup/store_sector_109_card.webp'
          }));
          setStores(mapped);
        }
      })
      .catch(err => console.error('Failed to load stores:', err));
  }, []);

  const filteredStores = stores.filter(s => {
    const matchesFormat =
      activeFormat === 'All Stores'
        ? true
        : activeFormat === 'Neighbourhood'
        ? s.format === 'Neighbourhood'
        : activeFormat === 'VillageDELI Hub'
        ? s.format === 'VillageDELI Hub'
        : activeFormat === 'Highway'
        ? s.format === 'Highway'
        : activeFormat === 'Petrol Pump'
        ? s.format === 'Petrol Pump'
        : true;

    const matchesSearch = searchQuery
      ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.pincode.includes(searchQuery)
      : true;

    return matchesFormat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#3b711e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">Our Locations</span>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 10) */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-10 sm:py-16">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                OUR LOCATIONS
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.1]">
                Find Your <br />
                <span className="text-[#6cb33f]">Village DELI.</span>
              </h1>
              <p className="text-base sm:text-lg font-bold text-stone-800">
                Always Close. Always Open. Always Here For You.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Your nearest VillageDELI is always closer than you think. Find a store, get directions, check what's available and order from your local store.
              </p>
            </div>

            {/* Right Storefront Photo */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src="/assets/mockup/store_sector_109_card.webp"
                  alt="VillageDELI Storefront illuminated at dusk"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. SEARCH & FORMAT FILTERS (PDF PAGE 10) */}
      {/* ============================================================== */}
      <section className="py-6 bg-white border-b border-stone-200 shadow-2xs">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 w-full lg:w-96">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Enter your area, city or landmark..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-full border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#3b711e] bg-stone-50"
                />
              </div>
              <button
                type="button"
                className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-4 py-2.5 rounded-full uppercase tracking-wider transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Format Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
              <button
                onClick={() => {
                  navigator.geolocation?.getCurrentPosition(
                    () => alert('Located: Showing nearest stores in Gurugram / Delhi NCR!'),
                    () => alert('Geolocation permitted. Showing nearest Gurugram locations.')
                  );
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#3b711e]" />
                <span>Use My Current Location</span>
              </button>

              {['All Stores', 'Neighbourhood', 'VillageDELI Hub', 'Highway', 'Petrol Pump'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setActiveFormat(fmt)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeFormat === fmt
                      ? 'bg-[#0d1f15] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MAIN SECTION: NCR MAP & STORES NEAR YOU (PDF PAGE 10) */}
      {/* ============================================================== */}
      <section className="py-12 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left NCR Map Graphic */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#3b711e]">
                  Delhi NCR & Highway Network
                </span>
                <span className="text-[10px] bg-[#eef5ea] text-[#2d5c16] font-bold px-2 py-0.5 rounded-full">
                  50+ Stores
                </span>
              </div>
              <DelhiNcrNetworkMap
                stores={stores}
                onSelectStore={(store) => setActiveStoreModal(store)}
              />
            </div>

            {/* Right Store Cards Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-[#0d1f15]">
                  Stores Near You ({filteredStores.length} Stores Found)
                </h3>
                <span className="text-xs text-stone-500 font-medium">Sort by: Nearest First</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStores.map(store => (
                  <div
                    key={store.id}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo Header with Badges */}
                      <div className="relative h-40 overflow-hidden bg-stone-900">
                        <img
                          src={store.image}
                          alt={store.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#6cb33f] text-[#0d1f15] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {store.badge}
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-[#0d1f15]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#fed100]" />
                          <span>Open 24/7</span>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="text-base font-serif font-bold text-[#0d1f15]">
                            {store.name}
                          </h4>
                          <div className="flex items-start gap-1.5 text-xs text-stone-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#3b711e] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{store.address}</span>
                          </div>
                        </div>

                        {/* 4 Feature Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {store.icons.map((ic, iIdx) => (
                            <span
                              key={iIdx}
                              className="text-[10px] bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-md text-stone-700 font-medium"
                            >
                              ✓ {ic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 4 Action Buttons from Page 10 */}
                    <div className="p-5 pt-0 grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0d1f15] hover:bg-[#173323] text-white py-2 rounded-xl transition-colors flex items-center justify-center gap-1 col-span-1"
                      >
                        <Navigation className="w-3 h-3 text-[#fed100]" />
                        <span className="hidden sm:inline">Directions</span>
                      </a>

                      <Link
                        to="/order-now"
                        className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] py-2 rounded-xl transition-colors font-black flex items-center justify-center gap-1 col-span-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span className="hidden sm:inline">Order</span>
                      </Link>

                      <a
                        href={`tel:${store.phone}`}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl transition-colors flex items-center justify-center gap-1 col-span-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">Call</span>
                      </a>

                      <button
                        onClick={() => setActiveStoreModal(store)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl transition-colors flex items-center justify-center gap-1 col-span-1 cursor-pointer"
                      >
                        <Store className="w-3 h-3 text-[#3b711e]" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. WHAT'S FRESH TODAY & CLUB BANNER (PDF PAGE 10) */}
      {/* ============================================================== */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Top Row: What's Fresh Today */}
          <div className="bg-[#eef5ea] rounded-3xl p-6 sm:p-10 border border-[#6cb33f]/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6">
                <img
                  src="/assets/mockup/locations_bottom_crate.webp"
                  alt="Fresh Vegetables Crate"
                  className="w-48 h-32 object-cover rounded-2xl border border-stone-200 shadow-sm shrink-0"
                />
                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-[#3b711e] uppercase block font-sans">
                    YOUR LOCAL STORE. MORE THAN JUST A STORE.
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
                    What's <span className="text-[#6cb33f]">Fresh Today?</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Check the latest fresh arrivals, today's meals, bakery and special offers at your nearest VillageDELI.
                  </p>
                  <Link
                    to="/order-now"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d1f15] hover:text-[#3b711e] pt-1"
                  >
                    <span>SELECT YOUR STORE →</span>
                  </Link>
                </div>
              </div>

              {/* 4 Fresh Today Cards */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link to="/category/fresh-produce" className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center space-y-2 group shadow-2xs hover:shadow-md transition-all">
                  <div className="h-16 rounded-xl overflow-hidden bg-stone-100">
                    <img src="/assets/mockup/locations_fresh_apples.webp" alt="Fresh Arrivals" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-[#0d1f15]">Fresh Arrivals Today →</div>
                </Link>

                <Link to="/category/fresh-food" className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center space-y-2 group shadow-2xs hover:shadow-md transition-all">
                  <div className="h-16 rounded-xl overflow-hidden bg-stone-100">
                    <img src="/assets/mockup/locations_fresh_sandwich.webp" alt="Today's Meals" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-[#0d1f15]">Today's Meals →</div>
                </Link>

                <Link to="/category/bakery-snacks" className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center space-y-2 group shadow-2xs hover:shadow-md transition-all">
                  <div className="h-16 rounded-xl overflow-hidden bg-stone-100">
                    <img src="/assets/mockup/locations_fresh_croissant.webp" alt="Fresh Bakery" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-[#0d1f15]">Fresh Bakery →</div>
                </Link>

                <Link to="/order-now" className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center space-y-2 group shadow-2xs hover:shadow-md transition-all">
                  <div className="h-16 rounded-xl overflow-hidden bg-stone-100">
                    <img src="/assets/mockup/locations_fresh_offers.webp" alt="Today's Offers" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-[#0d1f15]">Today's Offers →</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: VillageDELI CLUB Banner (from Page 9 & 10) */}
          <div className="bg-[#0d1f15] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1b3d2b] border border-[#6cb33f]/40 flex items-center justify-center text-[#fed100] shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-black tracking-widest text-[#fed100] uppercase">
                  VILLAGEDELI CLUB
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Shop More. Get More.
                </h4>
                <p className="text-xs text-stone-300 font-light">
                  Join VillageDELI Club and enjoy exclusive offers, rewards and special surprises.
                </p>
              </div>
            </div>

            <Link
              to="/club"
              className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              JOIN NOW →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. INTERACTIVE STORE MODAL: SECTOR 109 DETAILS (PDF PAGE 9) */}
      {/* ============================================================== */}
      {activeStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#fafaf7] rounded-t-3xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3b711e] bg-[#eef5ea] px-2.5 py-0.5 rounded-full">
                  {activeStoreModal.badge}
                </span>
                <h3 className="text-2xl font-serif font-black text-[#0d1f15] mt-1">
                  {activeStoreModal.name}
                </h3>
                <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3b711e]" />
                  <span>{activeStoreModal.address}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveStoreModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Quick Info Bar from Page 9 */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 border-b border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Store Timings</span>
                <span className="font-bold text-[#0d1f15]">{activeStoreModal.hours}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-bold text-[#0d1f15]">{activeStoreModal.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Store Manager</span>
                <span className="font-bold text-[#0d1f15]">{activeStoreModal.manager}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Parking Available</span>
                <span className="font-bold text-[#0d1f15]">{activeStoreModal.parking}</span>
              </div>
            </div>

            {/* Modal Tabs from Page 9 */}
            <div className="px-6 border-b border-stone-200 flex items-center gap-6 text-xs font-bold text-stone-600">
              <button
                onClick={() => setActiveTab('today')}
                className={`py-3.5 relative transition-colors ${
                  activeTab === 'today' ? 'text-[#3b711e] font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b711e]' : 'hover:text-stone-900'
                }`}
              >
                Today at This Store
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-3.5 relative transition-colors ${
                  activeTab === 'gallery' ? 'text-[#3b711e] font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b711e]' : 'hover:text-stone-900'
                }`}
              >
                Store Gallery
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-3.5 relative transition-colors ${
                  activeTab === 'services' ? 'text-[#3b711e] font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b711e]' : 'hover:text-stone-900'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`py-3.5 relative transition-colors ${
                  activeTab === 'map' ? 'text-[#3b711e] font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b711e]' : 'hover:text-stone-900'
                }`}
              >
                Map & Direction
              </button>
            </div>

            {/* Tab Contents: Today at This Store (Page 9) */}
            <div className="p-6">
              {activeTab === 'today' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-serif font-black text-[#0d1f15]">
                        Today at {activeStoreModal.name}
                      </h4>
                      <p className="text-xs text-stone-600">
                        Fresh arrivals, delicious meals, bakery favourites and special offers — curated for your local store, every day.
                      </p>
                    </div>
                    <Link
                      to="/order-now"
                      className="bg-[#0d1f15] hover:bg-[#6cb33f] text-white font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider transition-colors shrink-0"
                    >
                      VIEW ALL PRODUCTS →
                    </Link>
                  </div>

                  {/* 5 Cards from Page 9 */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="rounded-2xl border border-stone-200 overflow-hidden text-center space-y-2 p-2 bg-[#fafaf7]">
                      <img src="/assets/mockup/loc_arrival_produce.webp" alt="Fresh Arrivals" className="w-full h-20 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-[#0d1f15]">Fresh Arrivals Today</div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 overflow-hidden text-center space-y-2 p-2 bg-[#fafaf7]">
                      <img src="/assets/mockup/loc_meal_biryani.webp" alt="Today's Meals" className="w-full h-20 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-[#0d1f15]">Today's Meals</div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 overflow-hidden text-center space-y-2 p-2 bg-[#fafaf7]">
                      <img src="/assets/mockup/loc_bakery_croissants.webp" alt="Fresh Bakery" className="w-full h-20 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-[#0d1f15]">Fresh Bakery</div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 overflow-hidden text-center space-y-2 p-2 bg-[#fafaf7]">
                      <img src="/assets/mockup/loc_special_offers.webp" alt="Special Offers" className="w-full h-20 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-[#0d1f15]">Today's Offers</div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 overflow-hidden text-center space-y-2 p-2 bg-[#fafaf7]">
                      <img src="/assets/mockup/loc_beverages_coffee.webp" alt="Coffee & Drinks" className="w-full h-20 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-[#0d1f15]">Beverages & Coffee</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <img src="/assets/mockup/store_sector_109_card.webp" alt="Exterior" className="w-full h-40 object-cover rounded-2xl border border-stone-200" />
                  <img src="/assets/mockup/home_hero_store.webp" alt="Produce Display" className="w-full h-40 object-cover rounded-2xl border border-stone-200" />
                  <img src="/assets/mockup/offer_hero_store.webp" alt="Aisle View" className="w-full h-40 object-cover rounded-2xl border border-stone-200" />
                </div>
              )}

              {activeTab === 'services' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="font-bold text-[#0d1f15] block">30–60 Min Delivery</span>
                    <span className="text-stone-500">Hyperlocal delivery across Sector 109 and Dwarka Expressway.</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="font-bold text-[#0d1f15] block">Click & Collect</span>
                    <span className="text-stone-500">Order ahead on the website and pick up in 15 minutes.</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="font-bold text-[#0d1f15] block">24/7 In-Store Shopping</span>
                    <span className="text-stone-500">Walk into our store any time of the night or day.</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="font-bold text-[#0d1f15] block">Live Bakery & Coffee</span>
                    <span className="text-stone-500">Freshly baked croissants, artisan coffee & breakfast.</span>
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="space-y-4 text-xs">
                  <img src="/assets/mockup/locations_gurugram_detail_map.webp" alt="Gurugram Map Detail" className="w-full h-64 object-cover rounded-2xl border border-stone-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">{activeStoreModal.address}</span>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(activeStoreModal.name + ' ' + activeStoreModal.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0d1f15] text-white font-bold px-4 py-2 rounded-full uppercase"
                    >
                      Open Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
