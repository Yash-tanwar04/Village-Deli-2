import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Send, CheckCircle2 } from 'lucide-react';

export const ContactPartnership: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    partnerType: 'Property Owner',
    region: 'Haryana',
    format: 'Waypoint Highway Hub (1,500–3,000 sq.ft.)',
    propertyDetails: '',
  });

  const contacts = [
    {
      name: 'Mr. Yateen Yadav',
      region: 'HARYANA',
      desc: 'Highways & Petrol Pump Deployments across Haryana',
      image: '/assets/contact_haryana_yateen.webp',
    },
    {
      name: 'Mr. Rishab Mehrotra',
      region: 'PUNJAB',
      desc: 'Highway & Urban Network Expansion across Punjab',
      image: '/assets/contact_punjab_rishab.webp',
    },
    {
      name: 'Mr. Udai Pal Singh',
      region: 'ALL OTHER REGIONS',
      subRegion: 'Delhi NCR, UP, Uttarakhand & HP',
      desc: 'Expanding expressway corridors & growing suburbs',
      image: '/assets/contact_north_india_udai.webp',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#091710] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#6cb33f]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30"
          >
            PARTNERSHIP & TERRITORY EXPANSION
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight mb-4"
          >
            Let's Build the Future of Convenience Retail — Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Be part of North India's most promising 24/7 convenience retail journey — a partner in a scalable, trusted and future-ready brand.
          </motion.p>

          <div className="mt-6 inline-flex items-center gap-2 bg-[#fed100] text-[#0d1f15] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#0d1f15] animate-ping"></span>
            <span>LIMITED TERRITORIES AVAILABLE. Be a part of India's Convenience Revolution.</span>
          </div>
        </div>

        {/* 3 Designated Points of Contact Cards */}
        <div className="mb-20">
          <div className="bg-[#173323] text-white py-3.5 px-6 rounded-2xl mb-8 text-center text-xs font-bold tracking-widest uppercase border border-[#6cb33f]/40 shadow-sm">
            DESIGNATED POINTS OF CONTACT
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map((c, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#12281c] rounded-3xl p-7 border border-[#234934] shadow-xl hover:shadow-2xl hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-64 rounded-2xl overflow-hidden bg-[#091710] border border-[#234934] mb-6 flex items-center justify-center p-3">
                    <img
                      src={c.image}
                      alt={`${c.name} territory map`}
                      className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold font-serif text-white mb-1">
                      {c.name}
                    </h3>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7ad048] mb-1">
                      {c.region}
                    </div>
                    {c.subRegion && (
                      <div className="text-[11px] font-semibold text-stone-300 mb-2">
                        {c.subRegion}
                      </div>
                    )}
                    <p className="text-xs text-stone-400 font-light">
                      {c.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs font-semibold text-stone-300">
                  <a
                    href="mailto:franchise@villagedeli.in"
                    className="text-[#7ad048] hover:text-[#fed100] flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#7ad048]" />
                    <span>Inquire for {c.region}</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2-Column: Direct Information on Left, Interactive Partner Inquiry on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info and Criteria */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#12281c] text-white p-8 sm:p-10 rounded-3xl border border-[#234934] shadow-2xl">
              <h3 className="text-2xl font-bold font-serif mb-6 text-[#7ad048]">
                PARTNER WITH US TODAY
              </h3>

              <div className="space-y-4 mb-8">
                <a
                  href="mailto:franchise@villagedeli.in"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#091710] hover:bg-[#173323] border border-[#234934] transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#6cb33f] text-[#0d1f15] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Official Email</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-[#7ad048] transition-colors">
                      franchise@villagedeli.in
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#091710] border border-[#234934]">
                  <div className="w-11 h-11 rounded-xl bg-[#fed100] text-[#0d1f15] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Official Portal</span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      villagedeli.in
                    </span>
                  </div>
                </div>
              </div>

              {/* Ideal Properties Checklist */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#fed100] mb-4">
                  IDEAL PROPERTIES
                </h4>
                <div className="space-y-2.5">
                  {[
                    'Highways & Expressways',
                    'Fuel Stations',
                    'Neighborhood Centers',
                    'Residential & Commercial Areas',
                  ].map((prop, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-[#7ad048] shrink-0" />
                      <span>{prop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Territory & Franchise Inquiry Form */}
          <div className="lg:col-span-7 bg-[#12281c] p-8 sm:p-10 rounded-3xl border border-[#234934] shadow-2xl">
            {formSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#173323] text-[#7ad048] border border-[#6cb33f]/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-white mb-2">
                  Thank You for Your Partnership Interest
                </h3>
                <p className="text-stone-300 text-sm max-w-md mx-auto mb-6 leading-relaxed font-light">
                  Your details have been registered for review by our regional expansion team. You may also connect with our designated team directly at <strong className="text-white">franchise@villagedeli.in</strong>.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-8 py-3 rounded-full bg-[#173323] text-white text-xs font-semibold hover:bg-[#6cb33f] border border-[#234934] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-white mb-1">
                    Partnership & Property Proposal
                  </h3>
                  <p className="text-xs text-stone-300 font-light">
                    Connect directly with our designated regional leadership for Haryana, Punjab & North India.
                  </p>
                </div>

                {/* Partner Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                    I am interested as a:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Property Owner', 'Franchise Partner', 'Fuel Station / Highway'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, partnerType: type })}
                        className={`text-xs py-2.5 px-3 rounded-xl border font-semibold transition-all ${
                          formData.partnerType === type
                            ? 'bg-[#6cb33f] text-white border-[#6cb33f]'
                            : 'bg-[#091710] text-stone-300 border-[#234934] hover:border-[#6cb33f]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region & Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Target Territory
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#234934] bg-[#091710] focus:outline-none focus:border-[#6cb33f] text-white font-medium"
                    >
                      <option value="Haryana">Haryana (Mr. Yateen Yadav)</option>
                      <option value="Punjab">Punjab (Mr. Rishab Mehrotra)</option>
                      <option value="Delhi NCR, UP, Uttarakhand & HP">
                        Delhi NCR, UP, Uttarakhand & HP (Mr. Udai Pal Singh)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Preferred Format
                    </label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#234934] bg-[#091710] focus:outline-none focus:border-[#6cb33f] text-white font-medium"
                    >
                      <option value="Waypoint Highway Hub (1,500–3,000 sq.ft.)">
                        Waypoint Highway Hub (1,500–3,000 sq.ft.)
                      </option>
                      <option value="Neighborhood Express (500–1,200 sq.ft.)">
                        Neighborhood Express (500–1,200 sq.ft.)
                      </option>
                      <option value="FICO Model Standard (1,200–1,500 sq.ft.)">
                        FICO Model Standard (1,200–1,500 sq.ft.)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Name, Phone, Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#234934] bg-[#091710] focus:outline-none focus:border-[#6cb33f] text-white placeholder-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#234934] bg-[#091710] focus:outline-none focus:border-[#6cb33f] text-white placeholder-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#234934] bg-[#091710] focus:outline-none focus:border-[#6cb33f] text-white placeholder-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                    Property Location / Proposal Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify city, highway stretch, fuel station brand, or commercial area..."
                    value={formData.propertyDetails}
                    onChange={(e) => setFormData({ ...formData, propertyDetails: e.target.value })}
                    className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#234934] bg-[#091710] focus:outline-none focus:border-[#6cb33f] text-white placeholder-stone-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold py-4 rounded-full text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Partnership Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
