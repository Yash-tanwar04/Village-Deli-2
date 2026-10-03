import React from 'react';
import { motion } from 'framer-motion';
import { Building, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const PartnerOpportunities: React.FC = () => {
  const propertyOwnerBenefits = [
    'Long-term leases & secure rental yield',
    'High-traffic, high-conversion retail anchor',
    'Low operational risk with professional corporate management',
    'Backed by trusted national and state co-op supply chains',
  ];

  const franchisePartnerBenefits = [
    'Low investment with attractive recurring returns',
    'End-to-end turnkey support, billing systems & training',
    'Established supply chain with Vita and HARHITH',
    'Scalable, sustainable and profitable FICO model',
  ];

  const idealProperties = [
    'Highways & Expressways',
    'Fuel Stations',
    'Neighborhood Centers',
    'Residential & Commercial Hubs',
  ];

  return (
    <section className="py-24 md:py-32 bg-[#12281c] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30"
          >
            PARTNER OPPORTUNITY
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-4"
          >
            Attractive Opportunities For Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-light"
          >
            Whether you own prime real estate along highway corridors or wish to own and operate a high-yield retail franchise, Village DELI offers structured paths to recurring profitability.
          </motion.p>
        </div>

        {/* 2 Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Card 1: Property Owners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="bg-[#0d1f15] border border-[#234934] p-8 sm:p-10 rounded-3xl flex flex-col justify-between hover:border-[#6cb33f] transition-all duration-300 shadow-2xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-[#7ad048] bg-[#173323] px-3.5 py-1.5 rounded-full border border-[#6cb33f]/30">
                  REAL ESTATE OWNERS
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#173323] text-[#7ad048] flex items-center justify-center border border-[#234934] group-hover:bg-[#6cb33f] group-hover:text-white transition-colors">
                  <Building className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">
                Property Owners
              </h3>

              <p className="text-sm text-stone-300 leading-relaxed mb-8 font-light">
                Monetize your highway & neighborhood properties with a high-footfall, high-performance retail format.
              </p>

              <div className="space-y-3.5 mb-8">
                {propertyOwnerBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#6cb33f]/20 text-[#7ad048] flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-[#7ad048]" />
                    </div>
                    <span className="text-sm font-medium text-stone-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="p-4 rounded-2xl bg-[#173323] border border-white/5 mb-6">
                <div className="text-[11px] font-bold text-[#fed100] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#fed100]" />
                  <span>Ideal Property Criteria:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
                  {idealProperties.map((prop, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 font-light">
                      <span className="w-1 h-1 rounded-full bg-[#7ad048]"></span>
                      {prop}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold text-sm transition-all shadow-lg hover:scale-[1.02]"
              >
                <span>Submit Property For Review</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Franchise Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-[#0d1f15] border border-[#234934] p-8 sm:p-10 rounded-3xl flex flex-col justify-between hover:border-[#fed100]/60 transition-all duration-300 shadow-2xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-[#fed100] bg-[#173323] px-3.5 py-1.5 rounded-full border border-[#fed100]/30">
                  RETAIL ENTREPRENEURS
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#173323] text-[#fed100] flex items-center justify-center border border-[#234934] group-hover:bg-[#fed100] group-hover:text-[#0d1f15] transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">
                Franchise Partners
              </h3>

              <p className="text-sm text-stone-300 leading-relaxed mb-8 font-light">
                Own a future-ready business with a proven model, strong brand support and multiple revenue streams.
              </p>

              <div className="space-y-3.5 mb-8">
                {franchisePartnerBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#fed100]/20 text-[#fed100] flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-[#fed100]" />
                    </div>
                    <span className="text-sm font-medium text-stone-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="p-4 rounded-2xl bg-[#173323] border border-white/5 mb-6">
                <div className="text-[11px] font-bold text-[#7ad048] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7ad048]" />
                  <span>Partnership Assurance:</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Turnkey setup, company-managed staffing & operations, backed by central supply chain and digital ERP.
                </p>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#173323] hover:bg-[#6cb33f] text-white font-bold text-sm transition-all border border-[#6cb33f]/40 hover:scale-[1.02]"
              >
                <span>Apply For Franchise Territory</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
