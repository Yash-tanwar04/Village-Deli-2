import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const highlightMetrics = [
    { value: '₹6+ Lakh Cr.', label: 'Convenience Retail by 2027' },
    { value: '20%+ CAGR', label: 'Segment Growth Rate' },
    { value: '100,000+', label: 'Fuel Station Opportunities' },
    { value: '50 Locations', label: 'Phase 0 Haryana Target' },
  ];

  const exploreCards = [
    {
      title: 'Store Experience & Formats',
      tag: 'EXPERIENCE & ARCHITECTURE',
      desc: 'Discover our Waypoint Highway Hubs and Neighborhood Express formats, featuring an onsite flour mill, cold-press juice bar, and fresh bakery.',
      link: '/experience',
      image: '/assets/format_waypoint_highway_hub.jpg',
      stat: '500 – 3,000 SQ.FT.',
      cta: 'Explore Formats',
    },
    {
      title: 'Market Opportunity & Trends',
      tag: 'INDUSTRY LANDSCAPE',
      desc: 'Why the scope is massive: rising urbanization, busy dual-income lifestyles, expanding highway corridors, and daily neighborhood demand.',
      link: '/opportunity',
      image: '/assets/family_shopping_produce.jpg',
      stat: '₹6+ LAKH CR. MARKET',
      cta: 'View Market Data',
    },
    {
      title: 'In-House Brand Portfolio',
      tag: 'FOOD & BEVERAGE BRANDS',
      desc: '6 curated in-house dining brands crafted for dine-in, takeaway, and digital delivery on Zomato and Zepto.',
      link: '/brands',
      image: '/assets/store_bakery_aisle.jpg',
      stat: '6 DISTINCT BRANDS',
      cta: 'Discover Brands',
    },
    {
      title: 'The FICO Investment Model',
      tag: 'FRANCHISE OPPORTUNITY',
      desc: 'Franchise Invested Company Operated model. Low operational complexity, ₹18–28 Lakhs avg. monthly net revenue, and 7% or MG rent.',
      link: '/investment',
      image: '/assets/storefront_dual_vita_village_deli.jpg',
      stat: '₹3,500 / SQ.FT.',
      cta: 'Review Financials',
    },
    {
      title: 'Territory Contacts & Partnership',
      tag: 'REGIONAL LEADERSHIP',
      desc: 'Designated points of contact for Haryana, Punjab, Delhi NCR, UP, Uttarakhand & HP. Submit highway or urban real estate proposals.',
      link: '/contact',
      image: '/assets/map_expansion_roadmap.png',
      stat: 'LIMITED TERRITORIES',
      cta: 'Connect With Leaders',
    },
  ];

  return (
    <div className="bg-[#091710] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#173323] border border-[#6cb33f]/40 text-[#7ad048] text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#fed100] animate-ping"></span>
              <span>OPENING SOON • HARYANA</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#234934]/60 border border-white/10 text-stone-200 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-[#fed100]" />
              <span>24/7 OPEN ROUND-THE-CLOCK</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif leading-[1.1] mb-6">
              The Next-Generation Convenience Destination for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ad048] via-[#6cb33f] to-[#fed100] italic">
                India's New Lifestyle.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              <strong className="text-white font-medium">Village DELI — ALWAYS HERE FOR YOU.</strong><br />
              Delivering round-the-clock convenience, curated local essentials, and freshly prepared food in strategic collaboration with <strong className="text-[#fed100]">Har Hit Store + Vita</strong>.
            </p>

            {/* Direct Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/experience"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg shadow-[#6cb33f]/25 hover:scale-[1.02]"
              >
                <span>Explore Store Formats</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/investment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-stone-100 font-semibold px-8 py-4 rounded-full text-base border border-stone-400/40 hover:border-white transition-all duration-200"
              >
                <span>Franchise Opportunity</span>
              </Link>
            </div>
          </div>

          {/* Hero Storefront Image */}
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#234934] shadow-2xl bg-[#091710] group max-w-6xl mx-auto">
            <img
              src="/assets/storefront_opening_soon.jpg"
              alt="Village Deli Flagship Storefront"
              className="w-full h-auto object-cover max-h-[560px] transition-transform duration-700 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091710] via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-[#091710]/90 backdrop-blur-md border border-[#234934] px-4 py-2 rounded-xl text-xs text-stone-200">
                <span className="text-[#fed100] font-bold">Eat Fresh • Live Well</span> — 24/7 Operations Across North India
              </div>
              <span className="text-[10px] text-stone-400 bg-black/60 px-2.5 py-1 rounded border border-white/10">
                *Image: AI Generated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. A LITTLE INFO & SNAPSHOT METRICS */}
      <section className="py-14 bg-[#0d1f15] border-y border-[#173323]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlightMetrics.map((m, idx) => (
              <div key={idx} className="text-center p-4 rounded-2xl bg-[#12281c] border border-[#234934]/60">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#7ad048] font-stat mb-1">
                  {m.value}
                </div>
                <div className="text-xs text-stone-300 font-medium">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6cb33f]" />
              <span>In strategic collaboration with <strong className="text-white">Har Hit Store + Vita</strong></span>
            </div>
            <div className="text-[#fed100] font-semibold">
              BUILT FOR TODAY. DESIGNED FOR TOMORROW.
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE SECTIONS / REDIRECT CARDS */}
      <section className="py-20 md:py-28 bg-[#091710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30">
              EXPLORE VILLAGE DELI
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-stone-300 text-sm sm:text-base">
              Dive into our store formats, market economics, in-house brands, and the FICO franchise model.
            </p>
          </div>

          {/* Grid of 5 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className="group bg-[#12281c] border border-[#234934] rounded-3xl overflow-hidden hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-900">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12281c] via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#091710]/90 text-[#fed100] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      {card.stat}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-bold tracking-widest text-[#7ad048] uppercase block mb-1">
                      {card.tag}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-[#7ad048] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed font-light">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#7ad048] group-hover:text-white transition-colors">
                    <span>{card.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONCISE PARTNERSHIP CALLOUT */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#173323] via-[#1d3e2b] to-[#173323] border border-[#6cb33f]/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-4">
              Let's Build the Future of Convenience Retail — Together
            </h3>
            <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto mb-8 font-light">
              Limited territories available across Haryana, Punjab, and North India corridors for property owners and franchise entrepreneurs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-[1.02]"
            >
              <span>Partner With Village Deli Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
