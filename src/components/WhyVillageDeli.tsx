import React from 'react';
import { CheckCircle2, Clock, Apple, UtensilsCrossed, ShoppingBag, ShieldCheck } from 'lucide-react';

export const WhyVillageDeli: React.FC = () => {
  const points = [
    {
      title: '24/7 Convenience',
      desc: "Round-the-clock access for today's always-on consumers.",
      icon: Clock,
    },
    {
      title: 'Fresh & Local First',
      desc: 'Curated fresh produce, local staples and regionally loved food.',
      icon: Apple,
    },
    {
      title: 'Food for Every Craving',
      desc: 'Quick meals, bakery, beverages and healthy options — all under one roof.',
      icon: UtensilsCrossed,
    },
    {
      title: 'One Stop, Every Need.',
      desc: 'Daily essentials, personal care, household & more.',
      icon: ShoppingBag,
    },
    {
      title: 'Trusted Quality',
      desc: 'Hygienic, reliable and consistent products you can depend on.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-[#f4f6ee] text-[#12281c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-4 border border-[#6cb33f]/30">
            PITCH DECK SECTION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0d1f15] font-serif mb-4">
            Why Village DELI, Why Now?
          </h2>
          <p className="text-lg md:text-xl text-[#234934] font-medium leading-relaxed mb-6">
            India is transforming. Lifestyles are evolving. Consumers want convenience, quality, freshness and trust — 24/7. Village DELI is built for this new India.
          </p>

          <div className="inline-block bg-[#6cb33f] text-white text-xs sm:text-sm font-bold uppercase px-4 py-2 rounded shadow-sm tracking-wider">
            BUILT FOR TODAY. DESIGNED FOR TOMORROW.
          </div>
        </div>

        {/* 2-Column Split: Points on Left, Storefront Twilight Render on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Points List */}
          <div className="lg:col-span-6 space-y-4">
            {points.map((pt, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-[#6cb33f]/50 transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6cb33f]/10 group-hover:bg-[#6cb33f] text-[#488425] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                  <CheckCircle2 className="w-5 h-5 group-hover:hidden" />
                  <pt.icon className="w-5 h-5 hidden group-hover:block" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0d1f15] mb-1 font-serif group-hover:text-[#3b711e] transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="/assets/storefront_twilight.webp"
                alt="Village Deli twilight exterior view with customers entering the well-lit retail store"
                className="w-full h-auto object-cover max-h-[560px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1f15]/90 via-[#0d1f15]/40 to-transparent p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#fed100] font-bold">24/7 Operations</div>
                    <div className="text-base sm:text-lg font-serif font-bold">Always Open. Always Reliable.</div>
                  </div>
                  <span className="text-[10px] text-stone-300 bg-black/50 px-2.5 py-1 rounded border border-white/10">
                    *Image: AI Generated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
