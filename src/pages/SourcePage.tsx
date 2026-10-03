import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Leaf,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight
} from 'lucide-react';
import { getTestimonialsByCategory, Testimonial } from '../lib/testimonialsStore';

export const SourcePage: React.FC = () => {
  const journeySteps = [
    {
      num: '01',
      title: 'SOURCING AT SOURCE',
      desc: 'We work with trusted farmers and local producers.',
      image: '/assets/mockup/source_journey_step1.webp'
    },
    {
      num: '02',
      title: 'HANDPICKED WITH CARE',
      desc: 'Only the best, freshest produce is selected.',
      image: '/assets/mockup/source_journey_step2.webp'
    },
    {
      num: '03',
      title: 'QUALITY CHECKS',
      desc: 'Rigorous quality and hygiene checks at every stage.',
      image: '/assets/mockup/source_journey_step3.webp'
    },
    {
      num: '04',
      title: 'COLD CHAIN & CARE',
      desc: 'Handled and transported to retain freshness.',
      image: '/assets/mockup/source_journey_step4.webp'
    },
    {
      num: '05',
      title: 'TO YOUR NEIGHBOURHOOD',
      desc: 'Delivered fresh to your local VillageDELI store, every day.',
      image: '/assets/mockup/source_journey_step5.webp'
    }
  ];

  const qualityPromises = [
    {
      title: 'Carefully Selected Produce',
      desc: 'Handpicked and seasonally sourced.'
    },
    {
      title: 'Hygienic Handling',
      desc: 'Maintained through strict quality standards.'
    },
    {
      title: 'Better Shelf Life',
      desc: 'Stored and displayed the right way.'
    },
    {
      title: 'Locally Sourced',
      desc: 'Supporting local farmers and communities.'
    },
    {
      title: 'Freshness Every Day',
      desc: 'New arrivals, every day at your neighbourhood store.'
    }
  ];

  const seasons = [
    { name: 'Winter Greens', image: '/assets/mockup/source_season_winter.webp' },
    { name: 'Juicy Citrus', image: '/assets/mockup/source_season_citrus.webp' },
    { name: 'Summer Fruits', image: '/assets/mockup/source_season_summer.webp' },
    { name: 'Monsoon Favourites', image: '/assets/mockup/source_season_monsoon.webp' },
    { name: 'Regional Staples', image: '/assets/mockup/source_season_staples.webp' }
  ];

  const [farmerTestimonials, setFarmerTestimonials] = useState<Testimonial[]>(() => getTestimonialsByCategory('farmer'));

  useEffect(() => {
    const refresh = () => setFarmerTestimonials(getTestimonialsByCategory('farmer'));
    window.addEventListener('villagedeli:testimonials-updated', refresh);
    return () => window.removeEventListener('villagedeli:testimonials-updated', refresh);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#3b711e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">Fresh From The Source</span>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 7) */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-10 sm:py-16">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                FRESH FROM THE SOURCE
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.1]">
                From Farm to Your Neighbourhood. <br />
                <span className="text-[#6cb33f] font-serif font-normal italic">Always Fresh.</span>
              </h1>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                At VillageDELI, freshness is not just a promise — it's a system. We work closely with farmers and trusted producers to source handpicked fruits and vegetables, local staples and quality produce, bringing the best of the region to your neighbourhood, every day.
              </p>

              {/* 4 Hero Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Leaf className="w-4 h-4 text-[#3b711e]" />
                  <span>Handpicked Produce</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <MapPin className="w-4 h-4 text-[#3b711e]" />
                  <span>Local Sourcing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-[#3b711e]" />
                  <span>Quality Checks</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Truck className="w-4 h-4 text-[#3b711e]" />
                  <span>Farm-to-Fork Freshness</span>
                </div>
              </div>
            </div>

            {/* Right Photo: Farmer in Field with VillageDELI Crate */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src="/assets/mockup/source_farmer_harvest_hero.webp"
                  alt="Farmer Harvesting Fresh Greens for VillageDELI"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 5-STEP FRESHNESS JOURNEY & QUALITY PROMISE (PDF PAGE 7) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 Steps */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                  OUR FRESHNESS JOURNEY
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0d1f15]">
                  A Shorter Journey <span className="text-[#6cb33f]">For Fresher Food.</span>
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm">
                  From trusted farms and local producers to our stores, every step is designed to maintain freshness, quality and goodness.
                </p>
              </div>

              {/* 5 Journey Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2">
                {journeySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-24 overflow-hidden bg-stone-100">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#6cb33f] text-[#0d1f15] text-[10px] font-black flex items-center justify-center">
                          {step.num}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-[#0d1f15] leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-stone-600 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: OUR QUALITY PROMISE */}
            <div className="lg:col-span-4 bg-[#eef5ea] rounded-3xl border border-[#6cb33f]/30 p-6 sm:p-8 space-y-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                OUR QUALITY PROMISE
              </span>
              <h3 className="text-2xl font-serif font-black text-[#0d1f15] leading-snug">
                Freshness You Can See. <br />
                <span className="text-[#3b711e]">Quality You Can Trust.</span>
              </h3>

              <div className="space-y-3 pt-2">
                {qualityPromises.map((p, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#3b711e] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#0d1f15]">{p.title}</h4>
                      <p className="text-[11px] text-stone-600">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. SUPPORTING LOCAL FARMERS & SEASONAL GOODNESS (PDF PAGE 7) */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            {/* Left: Supporting Local Farmers Card */}
            <div className="lg:col-span-6 bg-[#0d1f15] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Supporting Local Farmers. <br />
                  <span className="text-[#6cb33f]">Stronger Communities.</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  We work with local farmers and producers because we believe great food creates stronger communities.
                </p>
                <div className="pt-2">
                  <Link
                    to="/opportunity"
                    className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-colors"
                  >
                    <span>OUR SUPPLY PARTNERS →</span>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 mt-4 shadow-inner">
                <img
                  src="/assets/mockup/source_produce_crate.webp"
                  alt="Fresh Farm Harvest Crate"
                  className="w-full h-44 sm:h-52 object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right: Seasonal Goodness */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                  SEASONAL GOODNESS
                </span>
                <h3 className="text-2xl font-serif font-black text-[#0d1f15]">
                  Fresh With <span className="text-[#6cb33f]">The Seasons.</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  From seasonal fruits to regional favourites, we bring you the best of every season — fresh, local and full of flavour.
                </p>
              </div>

              {/* 5 Season Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {seasons.map((s, idx) => (
                  <div key={idx} className="space-y-1.5 text-center">
                    <div className="rounded-xl overflow-hidden border border-stone-200 h-16 bg-stone-100">
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-800 block leading-tight">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#3b711e]">
                <span>Discover In Season Now</span>
                <Link to="/category/fresh-produce" className="hover:underline flex items-center gap-1">
                  Shop Fresh Produce <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 4. REAL PARTNERSHIPS. REAL IMPACT (PDF PAGE 8) */}
          {/* ============================================================== */}
          <div className="pt-6 border-t border-stone-200 space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
                Real Partnerships. <span className="text-[#6cb33f]">Real Impact.</span>
              </h3>
              <p className="text-xs text-stone-600">
                We are proud to work with farming communities across India, helping them grow and bringing the best of their harvests to your neighbourhood.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {farmerTestimonials.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/mockup/source_farmer_ramesh.webp';
                      }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#0d1f15]">{t.name}</h4>
                      <p className="text-[10px] text-stone-500 font-medium">{t.role}</p>
                    </div>
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
