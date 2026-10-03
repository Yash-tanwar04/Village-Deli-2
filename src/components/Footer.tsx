import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07130c] text-white pt-16 pb-12 border-t border-[#173323] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Footer: Brand Logo and Tagline */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 border-b border-white/10">
          <Link to="/" className="inline-flex items-center group py-1" title="Village DELI - Home">
            <img
              src="/assets/village_deli_logo_dark_bg.png"
              alt="Village DELI - Always Here For You"
              className="h-12 sm:h-14 w-auto object-contain group-hover:scale-[1.02] transition-transform"
            />
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2.5 text-stone-300">
              <Clock className="w-4 h-4 text-[#fed100] shrink-0" />
              <div className="text-left">
                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Store Timings</span>
                <span className="font-semibold text-white">Open 24/7 Everyday</span>
              </div>
            </div>

            {/* Official Alliance: Har-Hith & Vita logos */}
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="text-left">
                <span className="text-[9px] text-[#7ad048] block font-black uppercase tracking-wider">Official Partners</span>
                <span className="text-[11px] font-semibold text-stone-300">Har-Hith & Vita</span>
              </div>
              <div className="h-7 w-[1px] bg-white/15" />
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl shadow-xs">
                <img
                  src="/assets/harhith_logo.png"
                  alt="Har-Hith Store Logo"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
                <span className="text-stone-400 font-bold text-xs">✕</span>
                <img
                  src="/assets/vita_logo.png"
                  alt="Vita Logo"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Footer: Comprehensive Navigation Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/10 text-xs text-stone-300">
          {/* Col 1: Shop Groceries */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#7ad048] text-xs">Shop Groceries</h4>
            <ul className="space-y-2">
              <li><Link to="/order-now" className="hover:text-white transition-colors">Order Now</Link></li>
              <li><Link to="/category/fresh-produce" className="hover:text-white transition-colors">Fresh Produce</Link></li>
              <li><Link to="/category/bakery-snacks" className="hover:text-white transition-colors">Bakery & Snacks</Link></li>
              <li><Link to="/category/dairy-chilled" className="hover:text-white transition-colors">Dairy & Chilled</Link></li>
              <li><Link to="/category/groceries-essentials" className="hover:text-white transition-colors">Pantry Essentials</Link></li>
              <li><Link to="/category/coffee-beverages" className="hover:text-white transition-colors">Cold-Press Juices</Link></li>
            </ul>
          </div>

          {/* Col 2: About & Vision */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#7ad048] text-xs">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/what-we-offer" className="hover:text-white transition-colors">What We Offer</Link></li>
              <li><Link to="/formats" className="hover:text-white transition-colors">Store Formats</Link></li>
              <li><Link to="/hub" className="hover:text-white transition-colors">VillageDELI Hub</Link></li>
              <li><Link to="/source" className="hover:text-white transition-colors">Fresh From The Source</Link></li>
              <li><Link to="/club" className="hover:text-white transition-colors">VillageDELI Club</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#7ad048] text-xs">Orders & Help</h4>
            <ul className="space-y-2">
              <li><Link to="/order-tracking" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Basket</Link></li>
              <li><Link to="/my-account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/locations" className="hover:text-white transition-colors">Store Locator</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Customer Care</Link></li>
            </ul>
          </div>

          {/* Col 4: Corporate & Expansion */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#7ad048] text-xs">Partnerships</h4>
            <ul className="space-y-2">
              <li><Link to="/investment" className="hover:text-white transition-colors">FICO Franchise Model</Link></li>
              <li><Link to="/expansion" className="hover:text-white transition-colors">Expansion Roadmap</Link></li>
              <li><Link to="/brands" className="hover:text-white transition-colors">In-House Dining Brands</Link></li>
              <li><Link to="/opportunity" className="hover:text-white transition-colors">Market Opportunity</Link></li>
            </ul>
          </div>

          {/* Col 5: Customer Care & Helpline */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="font-bold uppercase tracking-wider text-[#fed100] text-xs">Customer Care</h4>
            <ul className="space-y-2">
              <li><Link to="/order-tracking" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/club" className="hover:text-white transition-colors">VillageDELI Club</Link></li>
              <li><Link to="/locations" className="hover:text-white transition-colors">Find Your Store</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help & Contact</Link></li>
            </ul>

            <div className="pt-2 text-stone-400 space-y-1 text-[11px]">
              <div>Helpline: +91 124 123 4567</div>
              <div>Hours: Open 24/7 Everyday</div>
            </div>
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} Village DELI. All rights reserved. The Next-Generation 24/7 Convenience Destination for India.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors p-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3 text-[#7ad048]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
