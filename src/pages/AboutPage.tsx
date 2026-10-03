import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Clock,
  Leaf,
  Utensils,
  ShoppingBag,
  ShieldCheck,
  Target,
  Users,
  Compass,
  Store,
  Truck
} from 'lucide-react';
import { NorthIndiaMap } from '../components/NorthIndiaMap';

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: '24/7 CONVENIENCE',
      desc: "Because life doesn't follow a 9 to 5 schedule."
    },
    {
      icon: Leaf,
      title: 'FRESH & LOCAL FIRST',
      desc: 'Handpicked produce and local staples for better food.'
    },
    {
      icon: Utensils,
      title: 'FOOD FOR EVERY CRAVING',
      desc: 'Freshly prepared meals, bakery, beverages and healthy options.'
    },
    {
      icon: ShoppingBag,
      title: 'ONE STOP EVERY NEED',
      desc: 'Groceries, dairy, meats, personal care, household essentials and more.'
    },
    {
      icon: ShieldCheck,
      title: 'TRUSTED QUALITY',
      desc: 'Hygienic, reliable and consistent products you can depend on.'
    }
  ];

  const roadmapSteps = [
    {
      step: '1',
      icon: Leaf,
      title: 'Local Beginnings',
      desc: 'Started in Haryana with a focus on fresh produce and community convenience.'
    },
    {
      step: '2',
      icon: Store,
      title: 'Regional Expansion',
      desc: 'Growing across Delhi NCR, Punjab, Uttar Pradesh, Uttarakhand and Himachal.'
    },
    {
      step: '3',
      icon: Compass,
      title: 'Pan-India Ambition',
      desc: 'Taking VillageDELI to communities across India.'
    },
    {
      step: '4',
      icon: Users,
      title: 'Healthier Communities',
      desc: 'Building a better food ecosystem for a brighter tomorrow.'
    }
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Freshness First',
      desc: 'Better food for better lives.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      desc: 'Stronger neighbourhoods together.'
    },
    {
      icon: ShieldCheck,
      title: 'Trust & Quality',
      desc: 'Products and people you can rely on.'
    },
    {
      icon: Leaf,
      title: 'Sustainable Growth',
      desc: 'A healthier tomorrow for generations to come.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#3b711e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">About Us</span>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 2) */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-10 sm:py-16">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                ABOUT VILLAGEDELI
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.1]">
                A Fresh Perspective <br />
                <span className="text-[#6cb33f] font-serif font-normal italic">on Everyday Life.</span>
              </h1>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                VillageDELI is India's next-generation 24/7 convenience destination, bringing together fresh food, everyday essentials and a better neighbourhood experience — one store at a time.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                From handpicked fruits and vegetables to freshly prepared meals, bakery, beverages, dairy, meats and daily essentials, we are built around a simple promise:
              </p>
              <div className="text-base sm:text-lg font-bold text-[#3b711e] font-sans">
                Always Fresh. Always Close. Always Here For You.
              </div>
            </div>

            {/* Right Photo: Family shopping in produce aisle */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src="/assets/mockup/about_family_hero.webp"
                  alt="Family shopping in VillageDELI produce aisle"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 5 FEATURE BAR (PDF PAGE 2) */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-stone-200 py-8">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 lg:gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#a3d47a] text-[#0d1f15] flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-6 h-6 text-[#0d1f15]" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0d1f15] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-stone-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. OUR STORY & OUR PURPOSE (PDF PAGE 2) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Story & Center Map */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                  OUR STORY
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#0d1f15]">
                  From Haryana to Every Neighbourhood <span className="text-[#6cb33f]">in India.</span>
                </h2>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  VillageDELI began with a simple idea — to bring better convenience and better food closer to people's everyday lives.
                </p>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  We started our journey in collaboration with HarHith and VITA, with a vision to create a modern convenience network rooted in local communities.
                </p>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Today, we are building VillageDELI as a scalable Indian retail platform — expanding from Haryana to Punjab, Delhi NCR, Uttar Pradesh, Uttarakhand, Himachal Pradesh and beyond.
                </p>
                <div className="text-xs font-black tracking-widest text-[#3b711e] uppercase pt-2">
                  ONE COUNTRY. ONE NEIGHBOURHOOD AT A TIME.
                </div>
              </div>

              {/* Center Map Graphic */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-72">
                  <NorthIndiaMap />
                </div>
                <div className="flex items-center gap-3 bg-[#eef5ea] px-5 py-3 rounded-2xl border border-[#6cb33f]/30">
                  <Truck className="w-5 h-5 text-[#3b711e]" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#0d1f15] block uppercase">EXPANDING ACROSS INDIA</span>
                    <span className="text-[11px] text-stone-600">Active rollouts in Haryana, Punjab & Delhi NCR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: OUR PURPOSE */}
            <div className="lg:col-span-4 bg-[#0d1f15] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#fed100] uppercase block">
                  OUR PURPOSE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                  Supporting Local. <br />
                  Strengthening Communities. <br />
                  <span className="text-[#6cb33f]">Enriching Lives.</span>
                </h3>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  {/* Vision */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1b3d2b] text-[#6cb33f] flex items-center justify-center shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">OUR VISION</h4>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        To be India's most trusted and loved 24/7 neighbourhood convenience platform.
                      </p>
                    </div>
                  </div>

                  {/* Mission */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1b3d2b] text-[#fed100] flex items-center justify-center shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">OUR MISSION</h4>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        To bring fresh food, everyday essentials and a better convenience experience to every neighbourhood, one store at a time.
                      </p>
                    </div>
                  </div>

                  {/* Values */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1b3d2b] text-[#6cb33f] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">OUR VALUES</h4>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        Freshness | Trust | Convenience | Community | Innovation | Responsibility | People First
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full text-center bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs py-3 rounded-full uppercase tracking-wider transition-colors"
              >
                Connect With Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ONE NEIGHBOURHOOD AT A TIME & IMPACT (PDF PAGE 3) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Row with Dusk Store Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0d1f15]">
                One Neighbourhood <br />
                <span className="text-[#6cb33f]">at a Time.</span>
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                VillageDELI is India's modern neighbourhood retail platform, bringing fresh food, everyday essentials and a healthier lifestyle closer to communities across the country.
              </p>
              <Link
                to="/locations"
                className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-colors shadow-xs"
              >
                <span>OUR STORY →</span>
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-stone-200">
                <img
                  src="/assets/mockup/about_flagship_dusk.webp"
                  alt="VillageDELI Storefront at Dusk"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
            </div>
          </div>

          {/* 3 Columns: Story, Strong Foundation, Our Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-200">
            {/* Col 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-bold text-[#0d1f15]">Our Story</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                VillageDELI was born from a simple belief — that everyone deserves access to fresh, high-quality food and everyday essentials, close to home, at any time of the day.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Built on deep retail, F&B and supply chain experience, VillageDELI brings together modern retail, fresh food, local sourcing and community convenience under one roof.
              </p>
            </div>

            {/* Col 2: Foundation with Logos */}
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-bold text-[#0d1f15]">A Strong Foundation</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                VillageDELI is a strategic partnership between HarHith Agro, a leader in fresh produce and agri-supply, and VITA, with deep expertise in modern retail and consumer businesses.
              </p>
              <div className="flex items-center gap-4 pt-3">
                <img
                  src="/assets/mockup/logo_harhith.webp"
                  alt="HarHith Farming a Healthier Tomorrow"
                  className="h-10 object-contain"
                />
                <span className="text-xl font-bold text-stone-400">+</span>
                <img
                  src="/assets/mockup/logo_vita.webp"
                  alt="Vita Consumer Brands"
                  className="h-10 object-contain"
                />
              </div>
            </div>

            {/* Col 3: Impact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#6cb33f] rounded-full" />
                <h3 className="text-lg font-serif font-bold text-[#0d1f15]">Our Impact So Far</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#fafaf7] p-3 rounded-2xl border border-stone-200 text-center">
                  <div className="text-xl font-serif font-black text-[#0d1f15]">50+</div>
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Stores (Phase 1)</div>
                </div>
                <div className="bg-[#fafaf7] p-3 rounded-2xl border border-stone-200 text-center">
                  <div className="text-xl font-serif font-black text-[#0d1f15]">1M+</div>
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Happy Customers</div>
                </div>
                <div className="bg-[#fafaf7] p-3 rounded-2xl border border-stone-200 text-center">
                  <div className="text-xl font-serif font-black text-[#0d1f15]">200+</div>
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Farm & Food Partners</div>
                </div>
                <div className="bg-[#fafaf7] p-3 rounded-2xl border border-stone-200 text-center">
                  <div className="text-xs font-serif font-bold text-[#0d1f15]">North India</div>
                  <div className="text-[9px] text-stone-500 uppercase font-semibold">HR | PB | NCR | UP | HP</div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 5. ROADMAP: FROM LOCAL ROOTS TO A NATIONAL PRESENCE */}
          {/* ============================================================== */}
          <div className="bg-[#0d1f15] text-white rounded-3xl overflow-hidden shadow-xl border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-10">
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
                  From Local Roots <br />
                  <span className="text-[#6cb33f]">to a National Presence</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  We began in Haryana with a vision to create a new standard in neighbourhood retail. Today, VillageDELI is rapidly expanding across North India, with a clear roadmap to become a pan-India brand.
                </p>
                <img
                  src="/assets/mockup/about_farmer_field.webp"
                  alt="Field Farmer Hands"
                  className="rounded-2xl border border-white/20 h-28 w-full object-cover"
                />
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {roadmapSteps.map((step, sIdx) => {
                  const Icon = step.icon;
                  return (
                    <div key={sIdx} className="bg-[#153123] p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white text-[#0d1f15] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#0d1f15]" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 6. OUR VALUES & SMILING GIRL PHOTO */}
          {/* ============================================================== */}
          <div className="pt-4 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h3 className="text-2xl font-serif font-bold text-[#0d1f15]">Our Values</h3>
              <p className="text-xs text-stone-600">These values guide everything we do at VillageDELI.</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {values.map((v, vIdx) => {
                  const Icon = v.icon;
                  return (
                    <div key={vIdx} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#a3d47a] text-[#0d1f15] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0d1f15]">{v.title}</div>
                        <div className="text-[11px] text-stone-500">{v.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-md border border-stone-200 w-full lg:w-96 shrink-0">
              <img
                src="/assets/mockup/about_girl_apple.webp"
                alt="Good People Better Communities"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
