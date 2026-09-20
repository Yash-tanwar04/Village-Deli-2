import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { ArrowRight, Sparkles, Store, TrendingUp, Utensils, MapPin, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const exploreChapters = [
    {
      title: 'Store Experience & Formats',
      tag: 'EXPERIENCE & ARCHITECTURE',
      stat: '500 – 3,000 SQ.FT.',
      desc: 'Explore our Waypoint Highway Hubs and Neighborhood Express formats, featuring an onsite flour mill, cold-press juice bar, fresh bakery, and hot quick meals.',
      highlights: ['Onsite Flour Mill', 'Cold-Press Juice Bar', 'Fresh Bakery & Lounge'],
      link: '/experience',
      image: '/assets/format_waypoint_highway_hub.webp',
      icon: Store,
      accent: 'border-[#6cb33f]/40 hover:border-[#6cb33f]',
      cta: 'Explore Experience & Formats',
    },
    {
      title: 'Market Opportunity & Trends',
      tag: 'INDUSTRY LANDSCAPE',
      stat: '₹6+ LAKH CR. BY 2027',
      desc: 'A once-in-a-generation consumer shift towards organized 24/7 convenience retail across 100,000+ fuel stations and expanding high-speed expressway corridors.',
      highlights: ['20%+ CAGR Growth', '100,000+ Fuel Stations', 'Where We Play Strategy'],
      link: '/opportunity',
      image: '/assets/family_shopping_produce.webp',
      icon: TrendingUp,
      accent: 'border-[#fed100]/40 hover:border-[#fed100]',
      cta: 'View Market Scope & Data',
    },
    {
      title: 'In-House Brand Portfolio',
      tag: 'FOOD & BEVERAGE BRANDS',
      stat: '6 CURATED BRANDS',
      desc: 'Distinct dining brands crafted for round-the-clock cravings, highway pitstops, and digital delivery on Zomato and Zepto.',
      highlights: ['Gateway of Punjab', 'Union Artisan Coffee', 'Eataliana & My Asiana'],
      link: '/brands',
      image: '/assets/store_bakery_aisle.webp',
      icon: Utensils,
      accent: 'border-[#6cb33f]/40 hover:border-[#6cb33f]',
      cta: 'Discover Brand Portfolio',
    },
    {
      title: 'The FICO Investment Model',
      tag: 'FRANCHISE OPPORTUNITY',
      stat: '₹3,500 / SQ.FT.',
      desc: 'Franchise Invested Company Operated model. Low operational complexity, ₹18–28 Lakhs average monthly net revenue, and flat 7% net revenue share.',
      highlights: ['TARGET: 50+ Haryana', '50+ Targeted Punjab', 'Capex Fully Amortised in 3 Yrs'],
      link: '/investment',
      image: '/assets/storefront_dual_vita_village_deli.webp',
      icon: Building2,
      accent: 'border-[#fed100]/40 hover:border-[#fed100]',
      cta: 'Review Financial Projections',
    },
    {
      title: 'Regional Expansion Roadmap',
      tag: 'GROWTH ROADMAP',
      stat: 'PAN-NORTH INDIA',
      desc: 'Structured regional rollout scaling from the active PILOT in Haryana to targeted scale in Punjab (PHASE 1) and regional corridors across North India (PHASE 2).',
      highlights: ['PILOT: Haryana Active', 'PHASE 1: Punjab (50+ Targeted)', 'PHASE 2: Delhi NCR & Hills'],
      link: '/expansion',
      image: '/assets/map_expansion_roadmap.webp',
      icon: MapPin,
      accent: 'border-[#6cb33f]/40 hover:border-[#6cb33f]',
      cta: 'Explore Growth Roadmap',
    },
    {
      title: 'Partnership & Territory Leadership',
      tag: 'DESIGNATED CONTACTS',
      stat: 'LIMITED TERRITORIES',
      desc: 'Designated points of contact for Haryana, Punjab, and North India corridors. Submit prime highway real estate proposals or apply for franchise territories.',
      highlights: ['Mr. Yateen Yadav (Haryana)', 'Mr. Rishab Mehrotra (Punjab)', 'Mr. Udai Pal Singh (All Regions)'],
      link: '/contact',
      image: '/assets/contact_haryana_yateen.webp',
      icon: Sparkles,
      accent: 'border-[#fed100]/40 hover:border-[#fed100]',
      cta: 'Connect With Territory Heads',
    },
  ];

  return (
    <div className="bg-[#091710] text-white">
      {/* 1. HERO SECTION WITH KEY METRICS */}
      <Hero />

      {/* 2. ABOUT VILLAGE DELI: EDITORIAL BRAND ESSENCE */}
      <section className="py-20 md:py-28 bg-[#0d1f15] border-y border-[#173323] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6cb33f]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30"
            >
              ABOUT VILLAGE DELI
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white mb-6"
            >
              Redefining 24/7 Convenience for India's Evolving Lifestyle
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-300 text-base sm:text-lg leading-relaxed font-light"
            >
              Village DELI bridges the gap between fragmented local shops and modern organized retail. By integrating round-the-clock grocery essentials, freshly ground flour, daily cold-pressed juices, and chef-curated dining brands into unified modular formats, we bring dependable quality wherever people live, travel, and refuel.
            </motion.p>
          </div>

          {/* 3 Core Philosophical Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#12281c] border border-[#234934] p-8 rounded-3xl shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#173323] border border-[#234934] text-[#7ad048] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-3">
                Round-the-Clock Assurance
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Licensed for 24/7 operations across all Haryana locations and upcoming interstate highway stretches, providing dependable service at every hour.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#12281c] border border-[#234934] p-8 rounded-3xl shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#173323] border border-[#234934] text-[#fed100] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-3">
                Fresh & Authentic Quality
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                From our signature onsite flour mill to cold-pressed juice station and fresh artisan bakery, pure wholesome freshness is our core standard.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#12281c] border border-[#234934] p-8 rounded-3xl shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#173323] border border-[#234934] text-[#7ad048] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-3">
                Strategic Co-op Strength
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                In strategic collaboration with Har Hit Store and Vita, ensuring state-backed dairy, FMCG supply integrity, and trusted consumer goodwill.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. GATEWAY CHAPTERS: INTERACTIVE EDITORIAL CARDS REDIRECTING TO DEDICATED PAGES */}
      <section className="py-24 md:py-32 bg-[#091710] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-4 border border-[#6cb33f]/30">
              EXPLORE VILLAGE DELI
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4">
              Explore Every Dimension
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-light">
              Click into any chapter below to explore our detailed store formats, market economics, brand portfolio, investment figures, and leadership directory.
            </p>
          </div>

          {/* 6 High-End Editorial Gateway Cards (2x3 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exploreChapters.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link
                  to={card.link}
                  className={`h-full bg-[#12281c] border rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between ${card.accent}`}
                >
                  <div>
                    {/* Visual Media Header */}
                    <div className="relative h-56 overflow-hidden bg-stone-900">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12281c] via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-[#091710]/90 backdrop-blur-md text-[#fed100] text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                        {card.stat}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-7">
                      <span className="text-[10px] font-bold tracking-widest text-[#7ad048] uppercase block mb-1.5">
                        {card.tag}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-white mb-3 group-hover:text-[#7ad048] transition-colors leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light mb-6">
                        {card.desc}
                      </p>

                      {/* Highlights Pill List */}
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        {card.highlights.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 text-xs text-stone-300 font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7ad048]"></span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="p-7 pt-0">
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#7ad048] group-hover:text-white transition-colors">
                      <span>{card.cta}</span>
                      <div className="w-7 h-7 rounded-full bg-[#173323] group-hover:bg-[#6cb33f] text-[#7ad048] group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HIGH-IMPACT PARTNERSHIP CTA BANNER */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#173323] via-[#1d3e2b] to-[#173323] border border-[#6cb33f]/40 rounded-3xl p-10 sm:p-14 text-center shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#fed100] block mb-2">
                JOIN THE REVOLUTION
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
                Let's Build the Future of Convenience Retail Together
              </h3>
              <p className="text-sm sm:text-base text-stone-200 mb-8 font-light leading-relaxed">
                Exclusive territories are actively being allocated across Haryana, Punjab, and high-density North India corridors. Connect directly with our designated leadership.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-105"
                >
                  <span>Submit Partnership Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/investment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-stone-100 font-semibold px-8 py-4 rounded-full text-sm border border-stone-400/40 hover:border-white transition-all"
                >
                  <span>Review FICO Investment Terms</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
