import React from 'react';
import { Truck, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const StrategicAlliance: React.FC = () => {
  const categories = [
    'Vita Products',
    'PACKED FOOD',
    'GROCERY',
    'DAIRY & DRY GOODS',
    'PERSONAL CARE',
    'HOUSEHOLD ESSENTIALS',
  ];

  return (
    <section className="py-20 md:py-28 bg-[#091710] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30">
            STRATEGIC COLLABORATION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-4">
            STRONGER TOGETHER FOR A BETTER TOMORROW
          </h2>
          <p className="text-base sm:text-lg text-stone-300 mb-6">
            VILLAGE DELI TIES UP WITH <strong className="text-white">Vita</strong> & <strong className="text-[#fed100]">हर हित Store</strong> TO SERVE QUALITY PRODUCTS 24/7 AT VILLAGE DELI OUTLETS
          </p>

          <div className="inline-flex items-center gap-2 bg-[#173323] border border-[#fed100]/40 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#fed100] shadow-md">
            <Sparkles className="w-4 h-4 text-[#fed100]" />
            <span>NOW VITA & HARHITH PRODUCTS AVAILABLE 24/7 AT ALL VILLAGE DELI OUTLETS</span>
          </div>
        </div>

        {/* Showcase Images: Dual-Branded Storefront + Store Interior */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Main Dual Branded Storefront */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#234934] shadow-2xl relative group bg-[#0d1f15]">
            <img
              src="/assets/storefront_dual_vita_village_deli.webp"
              alt="Vita Village Deli dual-branded flagship storefront render"
              className="w-full h-auto object-cover max-h-[500px] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091710] via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 p-5 bg-[#0d1f15]/90 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[#fed100] text-xs font-bold uppercase tracking-wider block">
                  Flagship Dual-Branded Model
                </span>
                <span className="text-base font-serif font-bold text-white">
                  Vita • Village DELI 24/7 Storefront
                </span>
              </div>
              <span className="text-xs bg-[#6cb33f] text-white px-3 py-1 rounded-full font-semibold">
                Open 24/7
              </span>
            </div>
          </div>

          {/* Side Interior & Supply Chain Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden border border-[#234934] shadow-lg relative h-48 bg-[#0d1f15]">
              <img
                src="/assets/store_interior_vitaproducts.webp"
                alt="Inside store Vita and Har Hith display counter with fresh bakery and hot meals"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="text-[11px] font-bold text-[#fed100] uppercase">Fresh Bakery & Hot Meals</div>
                <div className="text-sm font-semibold">Har Hith Store & Vita Showcase</div>
              </div>
            </div>

            <div className="bg-[#12281c] border border-[#234934] p-6 rounded-2xl">
              <h4 className="text-sm font-bold text-[#7ad048] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Proven Supply Chain</span>
              </h4>
              <div className="space-y-2.5">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-[#6cb33f] shrink-0" />
                    <span>{cat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fed100]" />
                  24/7 Supply Reliability
                </span>
                <span className="text-[#7ad048] font-semibold">Statewide Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Partner Banner image from page 13 */}
        <div className="bg-[#173323] border border-[#6cb33f]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-[#fed100] tracking-wider uppercase mb-1">
              IN STRATEGIC COLLABORATION WITH
            </div>
            <p className="text-sm text-stone-300">
              Backing every Village Deli outlet with established dairy, FMCG, and state government co-operative supply power.
            </p>
          </div>
          <div className="bg-white/95 px-6 py-3 rounded-xl shadow-md shrink-0">
            <img
              src="/assets/collab_har_hith_vita.png"
              alt="Har Hith Store and Vita official collaboration logos"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
