import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Clock, ArrowRight, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Store Experience', path: '/experience' },
    { label: 'Market Opportunity', path: '/opportunity' },
    { label: 'Brands & Reach', path: '/brands' },
    { label: 'Investment & FICO', path: '/investment' },
    { label: 'Expansion Roadmap', path: '/expansion' },
    { label: 'Partners & Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#091710]/95 backdrop-blur-md shadow-2xl border-b border-[#234934]/60 py-3'
          : 'bg-gradient-to-b from-[#091710]/95 via-[#091710]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#fed100] flex items-center justify-center bg-[#173323] text-[#fed100] shadow-md group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-[#fed100]" />
              <span className="absolute -top-1 -right-1 text-[9px] font-black bg-[#6cb33f] text-white px-1 py-0.5 rounded shadow-xs">24H</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-white font-serif">Village</span>
              <span className="text-2xl font-black tracking-wider text-[#6cb33f]">DELI</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] font-bold text-stone-300 uppercase">
              ALWAYS HERE FOR YOU
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-stone-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-200 py-1 relative text-[11px] tracking-wider uppercase font-semibold ${
                  isActive
                    ? 'text-[#7ad048] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#7ad048]'
                    : 'hover:text-[#7ad048] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#7ad048] hover:after:w-full after:transition-all'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03] group"
          >
            <span>Partner With Us</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-[#091710]/98 border-b border-[#234934] px-6 py-6 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 text-base font-medium text-stone-200">
              <div className="p-3 bg-[#173323]/80 rounded-xl border border-[#6cb33f]/30 text-xs text-[#7ad048] flex items-center justify-between">
                <span>OPENING SOON • HARYANA</span>
                <span className="text-white bg-[#6cb33f] px-2 py-0.5 rounded text-[10px] font-bold">24/7</span>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 border-b border-white/5 transition-colors text-sm font-semibold ${
                    location.pathname === link.path ? 'text-[#7ad048]' : 'hover:text-[#7ad048]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 flex flex-col gap-3">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold text-sm py-3.5 rounded-full transition-all shadow-md"
                >
                  Partner With Us
                </Link>
                <div className="text-center text-xs text-stone-400 pt-1 flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7ad048]" />
                  <a href="mailto:franchise@villagedeli.in">franchise@villagedeli.in</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
