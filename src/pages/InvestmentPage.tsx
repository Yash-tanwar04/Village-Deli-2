import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Building, TrendingUp } from 'lucide-react';

export const InvestmentPage: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(2200000);
  const share = monthlyRevenue * 0.07;
  const annualShare = share * 12;

  const generalTerms = [
    'Flat 7% of net revenue share, or MG rent — whichever is higher',
    '3-year lock-in period',
    'Capex fully amortised in 3 years as MG rent',
    'Transparent, scalable and sustainable model',
  ];

  const roadmap = [
    { phase: 'PHASE 0', region: 'Haryana', target: '50 locations in next 12 months', details: 'Across highways and petrol pumps' },
    { phase: 'PHASE 1', region: 'Punjab', target: '50+ locations targeted', details: 'Expanding highway & urban network' },
    { phase: 'PHASE 2', region: 'Delhi NCR, UP, Uttarakhand & HP', target: 'Corridor Expansion', details: 'Connecting highway corridors & growing suburbs' },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#091710] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-3 border border-[#6cb33f]/30">
            THE INVESTMENT
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4">
            The FICO Model
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Franchise Invested Company Operated — a win-win partnership designed for high returns, hassle-free operations and long-term value creation.
          </p>
        </div>

        {/* 1. 3 CORE FINANCIAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-[#173323] border border-[#6cb33f]/50 p-6 rounded-3xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#7ad048] block mb-1">
              CAPITAL INVESTMENT
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-stat mb-1">
              ₹3,500 <span className="text-sm font-sans font-medium text-stone-300">/ SQ.FT.</span>
            </div>
            <p className="text-xs text-stone-300 mb-4">Including opening stocks</p>
            <div className="pt-3 border-t border-white/10 text-xs text-[#fed100] font-semibold">
              + ₹5,00,000 signup fee (interior design package)
            </div>
          </div>

          <div className="bg-[#173323] border border-[#fed100]/40 p-6 rounded-3xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#fed100] block mb-1">
              AVERAGE STORE SIZE
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-stat mb-1">
              1,200 – 1,500
            </div>
            <p className="text-xs text-stone-300 mb-4">Sq.Ft. average store size</p>
            <div className="pt-3 border-t border-white/10 text-xs text-stone-200">
              Primarily on highways & petrol pumps (24/7 license at all Haryana locations)
            </div>
          </div>

          <div className="bg-[#173323] border border-[#6cb33f]/50 p-6 rounded-3xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#7ad048] block mb-1">
              AGGRESSIVE EXPANSION PLAN
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-stat mb-1">
              50 LOCATIONS
            </div>
            <p className="text-xs text-stone-300 mb-4">in Haryana in the next 12 months</p>
            <div className="pt-3 border-t border-white/10 text-xs text-[#7ad048] font-semibold">
              Targeting 50+ locations in Punjab in Phase 1
            </div>
          </div>
        </div>

        {/* 2. GENERAL TERMS & FINANCIAL PROJECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* General Terms */}
          <div className="lg:col-span-5 bg-[#12281c] border border-[#234934] p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7ad048] mb-4">
                GENERAL TERMS
              </h3>
              <div className="space-y-3">
                {generalTerms.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#7ad048] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-stone-200">{term}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-stone-400">
              Company Operated: Turnkey inventory, billing, staffing, and 24/7 operational management handled end-to-end.
            </div>
          </div>

          {/* Indicative Projection & Calculator */}
          <div className="lg:col-span-7 bg-[#12281c] border border-[#234934] p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#fed100] block">
                    FINANCIALS PROJECTION (INDICATIVE)
                  </span>
                  <h3 className="text-xl font-bold font-serif text-white">
                    Per Store Average Returns
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Avg. Monthly Net Revenue:</span>
                  <span className="text-lg font-bold text-[#fed100] font-stat">₹18 – 28 LAKHS</span>
                </div>
              </div>

              {/* Slider */}
              <div className="bg-[#091710] p-4 rounded-2xl border border-white/5 mb-4">
                <div className="flex justify-between text-xs text-stone-300 mb-2">
                  <span>Simulate Net Monthly Store Revenue:</span>
                  <strong className="text-[#fed100]">₹{(monthlyRevenue / 100000).toFixed(1)} Lakhs</strong>
                </div>
                <input
                  type="range"
                  min={1800000}
                  max={2800000}
                  step={50000}
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full accent-[#6cb33f] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
                  <span>₹18L</span>
                  <span>₹28L</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-[#173323] rounded-xl border border-white/5">
                  <span className="text-[11px] text-stone-400 block">7% Monthly Share</span>
                  <span className="text-xl font-bold text-[#7ad048] font-stat">
                    ₹{Math.round(share).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-[#173323] rounded-xl border border-white/5">
                  <span className="text-[11px] text-stone-400 block">7% Annualized</span>
                  <span className="text-xl font-bold text-[#fed100] font-stat">
                    ₹{Math.round(annualShare).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[10px] text-stone-400 italic">
              *Figures are indicative and subject to location, format and market conditions. 7% or MG rent, whichever is higher.
            </span>
          </div>
        </div>

        {/* 3. PROPERTY OWNERS VS FRANCHISE PARTNERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#12281c] border border-[#234934] p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-5 h-5 text-[#7ad048]" />
              <h4 className="text-lg font-bold font-serif text-white">For Property Owners</h4>
            </div>
            <p className="text-xs text-stone-300 mb-4">
              Monetize your highway & neighborhood properties with a high-footfall, high-performance retail format.
            </p>
            <ul className="text-xs text-stone-300 space-y-1.5 font-medium">
              <li>• Long-term leases & high rental potential</li>
              <li>• Low operational risk backed by trusted national brand</li>
              <li>• Ideal: Highways, Fuel Stations, Neighborhood Centers</li>
            </ul>
          </div>

          <div className="bg-[#12281c] border border-[#234934] p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-[#fed100]" />
              <h4 className="text-lg font-bold font-serif text-white">For Franchise Partners</h4>
            </div>
            <p className="text-xs text-stone-300 mb-4">
              Own a future-ready business with a proven model, strong brand support and multiple revenue streams.
            </p>
            <ul className="text-xs text-stone-300 space-y-1.5 font-medium">
              <li>• Low investment, attractive returns & centralized ops</li>
              <li>• End-to-end support, training & proven supply chain with Vita / HARHITH</li>
              <li>• Scalable, sustainable and profitable business model</li>
            </ul>
          </div>
        </div>

        {/* 4. GROWTH ROADMAP */}
        <div className="bg-[#12281c] border border-[#234934] p-6 sm:p-8 rounded-3xl">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-[#7ad048] uppercase tracking-wider block">
              REGIONAL CORRIDORS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Aggressive Expansion Across North India
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {roadmap.map((r, idx) => (
              <div key={idx} className="p-4 bg-[#091710] rounded-xl border border-white/5">
                <span className="text-[10px] font-bold bg-[#6cb33f] text-white px-2 py-0.5 rounded uppercase">
                  {r.phase}
                </span>
                <h4 className="text-base font-bold text-white mt-2 mb-1">{r.region}</h4>
                <div className="text-xs text-[#fed100] font-medium mb-1">{r.target}</div>
                <p className="text-[11px] text-stone-400">{r.details}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-md"
            >
              <span>Apply For Territory Franchise</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
