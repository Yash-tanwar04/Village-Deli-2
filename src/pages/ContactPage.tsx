import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Phone,
  MessageSquare,
  Users,
  MapPin,
  CheckCircle2,
  Handshake,
  Store,
  Headphones,
  Megaphone,
  Briefcase,
  Leaf,
  Heart,
  Truck
} from 'lucide-react';

import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    enquiryType: 'Customer Support & Orders',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Automatically pre-fill logged-in customer details for once if available
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.full_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        enquiry_type: formData.enquiryType,
        message: formData.message.trim(),
        user_id: user?.id
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const touchForItems = [
    {
      icon: Handshake,
      title: 'Partnership Enquiries',
      desc: 'Explore franchise, real estate and supplier opportunities.',
      link: '/opportunity',
    },
    {
      icon: Store,
      title: 'Store Locations',
      desc: 'Find a VillageDELI store near you.',
      link: '/locations',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      desc: 'Get help with orders and products.',
      link: '/contact',
    },
    {
      icon: Megaphone,
      title: 'Media Enquiries',
      desc: 'For press, media and brand collaborations.',
      link: '/contact',
    },
    {
      icon: Briefcase,
      title: 'Careers',
      desc: 'Join our growing team.',
      link: '/careers',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16">
      {/* 1. HERO BANNER (PDF Page 18) */}
      <section className="relative bg-[#f7faf5] border-b border-stone-200 overflow-hidden">
        {/* Right side background hero graphic with storefront photo */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none opacity-30 lg:opacity-100">
          <img
            src="/assets/mockup/contact_store_hero.webp"
            alt="VillageDELI Storefront"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5] via-[#f7faf5]/80 to-transparent lg:w-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
            <Link to="/" className="hover:text-[#6cb33f] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[#0d1f15] font-bold">Contact Us</span>
          </nav>

          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.08] mb-4">
              Get In <span className="text-[#6cb33f]">Touch</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 font-medium">
              We're here to help. Whether you have a question, partnership opportunity or just want to say hello — we'd love to hear from you.
            </p>

            {/* 4 Circular Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                {
                  icon: Phone,
                  title: 'Responsive Support',
                  subtitle: 'We usually respond within 24 hours',
                },
                {
                  icon: MessageSquare,
                  title: 'Multiple Channels',
                  subtitle: 'Reach us in the way that works for you',
                },
                {
                  icon: Users,
                  title: 'Dedicated Teams',
                  subtitle: 'For partners, media and careers',
                },
                {
                  icon: MapPin,
                  title: 'Pan India Presence',
                  subtitle: 'Growing stores across North India',
                },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full border border-[#6cb33f] bg-white flex items-center justify-center text-[#6cb33f] shrink-0 shadow-2xs mt-0.5">
                    <badge.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0d1f15] block leading-tight">
                      {badge.title}
                    </span>
                    <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                      {badge.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3-COLUMN CONTACT SECTION (PDF Page 18) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: Our Office (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-serif font-black text-[#0d1f15]">Our Office</h2>
              <div className="w-8 h-1 bg-[#6cb33f] rounded-full mt-1.5" />
            </div>

            {/* Head Office */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#6cb33f] bg-[#f4f7f2] flex items-center justify-center text-[#6cb33f] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0d1f15] uppercase tracking-wider">Head Office</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Plot 12, Sector 109, <br />
                  Gurugram, Haryana – 122017 <br />
                  India
                </p>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#6cb33f] bg-[#f4f7f2] flex items-center justify-center text-[#6cb33f] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0d1f15] uppercase tracking-wider">Call Us</h4>
                <p className="text-sm font-bold text-[#0d1f15] mt-0.5">+91 124 123 4567</p>
                <p className="text-xs text-stone-500 mt-0.5">Mon – Sat, 9:00 AM – 7:00 PM</p>
              </div>
            </div>

            {/* Corporate Office */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-stone-100">
              <div className="w-10 h-10 rounded-full border border-[#6cb33f] bg-[#f4f7f2] flex items-center justify-center text-[#6cb33f] shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0d1f15] uppercase tracking-wider">Corporate Entity</h4>
                <p className="text-xs font-medium text-stone-700 mt-0.5">Premiere Outlet Malls Private Limited</p>
                <p className="text-xs text-stone-500 mt-0.5">Operated under licence for VillageDELI</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Send Us a Message Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-2xs">
            <div>
              <h2 className="text-xl font-serif font-black text-[#0d1f15]">Send Us a Message</h2>
              <p className="text-xs text-stone-500 mt-1">
                Fill in the details below and we'll get back to you soon.
              </p>
              <div className="w-8 h-1 bg-[#6cb33f] rounded-full mt-2 mb-6" />
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#f4f7f2] text-[#6cb33f] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-xl text-[#0d1f15] mb-2">Message Sent!</h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  Thank you, <strong>{formData.name}</strong>. Our team has received your message regarding {formData.enquiryType} and will contact you at {formData.phone} shortly.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {user && (
                    <Link
                      to="/my-account?tab=queries"
                      className="inline-flex items-center gap-1.5 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Track In My Account</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: user?.full_name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        enquiryType: 'Customer Support & Orders',
                        message: ''
                      });
                    }}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Enquiry Type *</label>
                  <select
                    value={formData.enquiryType}
                    onChange={e => setFormData({ ...formData, enquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none bg-white font-medium"
                  >
                    <option>Customer Support & Orders</option>
                    <option>Partnership & Franchise</option>
                    <option>Real Estate & Store Spaces</option>
                    <option>Farmer / Supplier Onboarding</option>
                    <option>Careers & HR</option>
                    <option>General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#6cb33f] hover:bg-[#5aa132] disabled:opacity-50 text-white text-xs font-black py-3 rounded-full uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <span>SENDING MESSAGE...</span>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* COLUMN 3: Find Us Map (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-serif font-black text-[#0d1f15]">Find Us</h2>
              <p className="text-xs text-stone-500 mt-1">
                Visit our head office or reach out through the map below.
              </p>
              <div className="w-8 h-1 bg-[#6cb33f] rounded-full mt-2 mb-4" />
            </div>

            <div className="rounded-xl overflow-hidden border border-stone-200 relative group">
              <img
                src="/assets/mockup/contact_map_headoffice.webp"
                alt="VillageDELI Head Office Map"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#3b711e]">
              <span className="text-stone-700">Sector 109, Gurugram</span>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <span>Open in Maps</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GET IN TOUCH FOR (5 CARDS) (PDF Page 18) */}
      <section className="bg-white border-y border-stone-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-sm font-serif font-black uppercase tracking-wider text-[#0d1f15] mb-6">
            Get in Touch For
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {touchForItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="flex items-start gap-3 group hover:translate-x-0.5 transition-transform"
              >
                <div className="w-10 h-10 rounded-full border border-[#6cb33f] bg-[#f4f7f2] flex items-center justify-center text-[#6cb33f] shrink-0 group-hover:bg-[#6cb33f] group-hover:text-white transition-colors shadow-2xs">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0d1f15] group-hover:text-[#6cb33f] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GOOD FOOD BRIGHTER TOMORROWS BANNER (PDF Page 18) */}
      <section className="bg-[#0d1f15] text-white py-6 sm:py-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Title */}
            <div className="lg:col-span-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-black leading-tight text-white">
                Good Food <br />
                <span className="text-[#6cb33f]">Brighter Tomorrows.</span>
              </h3>
            </div>

            {/* 4 Values */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Leaf, title: 'Quality Food', desc: 'For Healthier Lives' },
                { icon: Users, title: 'Stronger', desc: 'Communities' },
                { icon: Heart, title: 'Sustainable', desc: 'Growth' },
                { icon: Truck, title: 'Pan India', desc: 'Expansion' },
              ].map((val, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border border-[#6cb33f] bg-white/5 flex items-center justify-center text-[#6cb33f] shrink-0">
                    <val.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {val.title}
                    </span>
                    <span className="text-[10px] text-stone-300 block leading-tight">
                      {val.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
