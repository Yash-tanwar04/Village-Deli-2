import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, Globe, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07130c] text-white pt-14 pb-10 border-t border-[#173323] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Footer: Brand Logo and Tagline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#fed100] flex items-center justify-center bg-[#173323] text-[#fed100] shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-white font-serif">Village</span>
                <span className="text-2xl font-black tracking-wider text-[#6cb33f]">DELI</span>
              </div>
              <div className="text-[9px] tracking-[0.2em] font-bold text-stone-300 uppercase">
                ALWAYS HERE FOR YOU
              </div>
            </div>
          </Link>

          <div className="text-left md:text-right">
            <div className="text-xs font-bold tracking-widest text-[#7ad048] uppercase mb-1">
              BUILT FOR TODAY. DESIGNED FOR TOMORROW.
            </div>
            <p className="text-xs text-stone-400">
              In strategic collaboration with Har Hit Store + Vita
            </p>
          </div>
        </div>

        {/* Middle Footer: Clean Navigation Links */}
        <div className="py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-white/10 text-xs text-stone-300">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-stone-400 mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#7ad048] transition-colors">Home</Link></li>
              <li><Link to="/experience" className="hover:text-[#7ad048] transition-colors">Store Experience & Formats</Link></li>
              <li><Link to="/opportunity" className="hover:text-[#7ad048] transition-colors">Market Opportunity</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-stone-400 mb-3">Partnerships</h4>
            <ul className="space-y-2">
              <li><Link to="/brands" className="hover:text-[#7ad048] transition-colors">Brand Portfolio</Link></li>
              <li><Link to="/investment" className="hover:text-[#7ad048] transition-colors">Investment & FICO Model</Link></li>
              <li><Link to="/contact" className="hover:text-[#7ad048] transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-stone-400 mb-3">Territories</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>• Phase 0: Haryana</li>
              <li>• Phase 1: Punjab</li>
              <li>• Phase 2: Delhi NCR, UP, UK, HP</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-stone-400 mb-3">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:franchise@villagedeli.in" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#7ad048]" />
                franchise@villagedeli.in
              </a>
              <div className="flex items-center gap-1.5 text-stone-400">
                <Globe className="w-3.5 h-3.5 text-[#fed100]" />
                villagedeli.in
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} Village DELI. All rights reserved. The Next-Generation Convenience Destination for India's New Lifestyle.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors p-1.5 rounded bg-white/5"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3 text-[#7ad048]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
