import React, { useState } from 'react';
import { Mail, Globe, CheckCircle2, Send, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    partnerType: 'Property Owner',
    region: 'Haryana',
    format: 'Waypoint Highway Hub (1,500–3,000 sq.ft.)',
    details: '',
  });

  const contacts = [
    {
      name: 'Mr. Yateen Yadav',
      region: 'HARYANA',
      desc: 'Highways & Petrol Pumps across Haryana',
      image: '/assets/contact_haryana_yateen.png',
    },
    {
      name: 'Mr. Rishab Mehrotra',
      region: 'PUNJAB',
      desc: 'Highway & Urban Network Expansion across Punjab',
      image: '/assets/contact_punjab_rishab.png',
    },
    {
      name: 'Mr. Udai Pal Singh',
      region: 'ALL OTHER REGIONS',
      subRegion: 'Delhi NCR, UP, Uttarakhand & HP',
      desc: 'Expressway corridors & growing suburbs',
      image: '/assets/contact_north_india_udai.png',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 bg-[#f4f6ee] text-[#12281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-3">
            DESIGNATED POINTS OF CONTACT
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0d1f15] tracking-tight mb-4">
            Let's Build the Future of Convenience Retail — Together
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Be part of North India's most promising 24/7 convenience retail journey. Connect with our designated regional heads.
          </p>
        </div>

        {/* 1. 3 LEADERSHIP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contacts.map((c, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-md hover:shadow-lg hover:border-[#6cb33f] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-56 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 mb-4 flex items-center justify-center p-2">
                  <img
                    src={c.image}
                    alt={`${c.name} map`}
                    className="max-h-full w-auto object-contain"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold font-serif text-[#0d1f15] mb-1">
                    {c.name}
                  </h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#3b711e] mb-1">
                    {c.region}
                  </div>
                  {c.subRegion && (
                    <div className="text-[11px] font-semibold text-stone-600 mb-1">
                      {c.subRegion}
                    </div>
                  )}
                  <p className="text-xs text-stone-500">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 text-center">
                <a
                  href="mailto:franchise@villagedeli.in"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173323] hover:text-[#6cb33f] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6cb33f]" />
                  <span>franchise@villagedeli.in</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DIRECT CONTACT & INQUIRY FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct channels */}
          <div className="lg:col-span-5 bg-[#0d1f15] text-white p-8 rounded-3xl border border-[#234934] shadow-lg">
            <span className="text-xs font-bold tracking-widest text-[#7ad048] uppercase block mb-2">
              PARTNER WITH US TODAY
            </span>
            <h3 className="text-2xl font-bold font-serif mb-6">
              Official Headquarters & Channels
            </h3>

            <div className="space-y-4 mb-8">
              <a
                href="mailto:franchise@villagedeli.in"
                className="p-4 rounded-xl bg-[#173323] flex items-center gap-3 border border-white/5 hover:border-[#6cb33f] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#6cb33f]" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase">Official Email</div>
                  <div className="text-sm font-bold text-white">franchise@villagedeli.in</div>
                </div>
              </a>

              <div className="p-4 rounded-xl bg-[#173323] flex items-center gap-3 border border-white/5">
                <Globe className="w-5 h-5 text-[#fed100]" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase">Official Portal</div>
                  <div className="text-sm font-bold text-white">villagedeli.in</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#fed100] mb-3">
                IDEAL PROPERTIES WANTED
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-200">
                <span>• Highways & Expressways</span>
                <span>• Fuel Stations</span>
                <span>• Neighborhood Centers</span>
                <span>• Commercial Districts</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#7ad048]">
              <Clock className="w-4 h-4" />
              <span>Round-the-clock 24/7 Operations</span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-lg">
            {formSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0d1f15] mb-2">
                  Inquiry Received
                </h3>
                <p className="text-xs text-stone-600 mb-6 max-w-sm mx-auto">
                  Thank you. Our regional expansion team will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-5 py-2 rounded-full bg-[#173323] text-white text-xs font-semibold hover:bg-[#6cb33f] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold font-serif text-[#0d1f15]">
                  Partnership & Property Inquiry
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Partner Type
                    </label>
                    <select
                      value={formData.partnerType}
                      onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#f4f6ee]"
                    >
                      <option value="Property Owner">Property Owner</option>
                      <option value="Franchise Partner">Franchise Partner</option>
                      <option value="Fuel Station Owner">Fuel Station Owner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Region
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#f4f6ee]"
                    >
                      <option value="Haryana">Haryana (Mr. Yateen Yadav)</option>
                      <option value="Punjab">Punjab (Mr. Rishab Mehrotra)</option>
                      <option value="Delhi NCR, UP, Uttarakhand & HP">
                        Delhi NCR, UP, Uttarakhand & HP (Mr. Udai Pal Singh)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#f4f6ee]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 Mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#f4f6ee]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#f4f6ee]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Property Location & Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="City, highway stretch, fuel station brand, or store size..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#f4f6ee]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold py-3.5 rounded-full text-xs transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Partnership Proposal</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
