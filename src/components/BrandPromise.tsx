import React from 'react';
import { Star, Quote } from 'lucide-react';

export const BrandPromise: React.FC = () => {
  const promises = [
    {
      title: 'Built For People. Designed For Life.',
      desc: 'Serving real needs of real India.',
    },
    {
      title: 'Trusted Today. Leading Tomorrow.',
      desc: 'A brand rooted in trust, ready to scale.',
    },
    {
      title: 'Scalable. Sustainable. Profitable.',
      desc: 'Strong model. Strong unit economics.',
    },
    {
      title: 'Invest In Growth. Invest In Impact.',
      desc: "Be part of North India's most promising retail journey.",
    },
    {
      title: 'Local At Heart. Future In Mind.',
      desc: 'Empowering communities. Enriching lives.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#091710] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30">
            OUR PROMISE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white mb-6">
            A Future-Ready Brand With Endless Possibilities
          </h2>
        </div>

        {/* Emotional Core Quote */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#12281c] via-[#173323] to-[#12281c] border border-[#6cb33f]/40 p-8 sm:p-12 rounded-3xl text-center shadow-2xl mb-16 relative">
          <Quote className="w-12 h-12 text-[#6cb33f]/40 mx-auto mb-4" />
          <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed mb-6">
            “More than a store. It's a promise of convenience, quality and care — wherever you are, whatever the hour, Village DELI is Always Here For You.”
          </p>
          <div className="inline-block h-1 w-20 bg-[#fed100] rounded-full"></div>
        </div>

        {/* 5 Promise Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {promises.map((prom, idx) => (
            <div
              key={idx}
              className={`bg-[#12281c] border border-[#234934] p-6 rounded-2xl flex items-start gap-4 hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 shadow-md ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#6cb33f] text-[#091710] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Star className="w-5 h-5 fill-[#091710]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-white mb-1.5 leading-snug">
                  {prom.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  {prom.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
