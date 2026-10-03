import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gift,
  Tag,
  Crown,
  Star,
  ChevronRight,
  Edit3,
  ShoppingCart,
  Heart,
  Users,
  Leaf
} from 'lucide-react';

export const ClubPage: React.FC = () => {
  const benefitCards = [
    {
      img: '/assets/mockup/club_benefit_coffee.webp',
      title: 'Free Treats',
      desc: 'Enjoy free coffee, fresh juice and more with your points.',
    },
    {
      img: '/assets/mockup/club_benefit_veggies.webp',
      title: 'Exclusive Offers',
      desc: 'Get access to member-only discounts and promotions.',
    },
    {
      img: '/assets/mockup/club_benefit_cake.webp',
      title: 'Birthday Rewards',
      desc: 'Special treats to make your day even better.',
    },
    {
      img: '/assets/mockup/club_benefit_salad.webp',
      title: 'Special Meal Offers',
      desc: 'Great savings on your favourite meals and snacks.',
    },
    {
      img: '/assets/mockup/club_benefit_basket.webp',
      title: 'Grocery Rewards',
      desc: 'Earn more on your everyday essentials.',
    },
    {
      img: '/assets/mockup/club_benefit_gift.webp',
      title: 'Personalised Surprises',
      desc: 'Tailored offers just for you.',
    },
  ];

  const steps = [
    {
      step: '1',
      icon: Edit3,
      title: 'Sign Up',
      desc: 'Join VillageDELI Club in just a few steps.',
    },
    {
      step: '2',
      icon: ShoppingCart,
      title: 'Shop',
      desc: 'Shop at any VillageDELI store.',
    },
    {
      step: '3',
      icon: Star,
      title: 'Earn Points',
      desc: 'Collect points on every purchase.',
    },
    {
      step: '4',
      icon: Gift,
      title: 'Redeem & Enjoy',
      desc: 'Use your points for exclusive rewards and offers.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16">
      {/* 1. HERO SECTION (PDF Page 15) */}
      <section className="relative bg-[#f7faf5] border-b border-stone-200 overflow-hidden">
        {/* Right side background hero graphic with phone mockup & woman holding grocery bag */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none opacity-30 lg:opacity-100">
          <img
            src="/assets/mockup/club_mobile_hand_hero.webp"
            alt="VillageDELI Club App"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5] via-[#f7faf5]/80 to-transparent lg:w-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <div className="max-w-xl">
            <span className="text-xs font-black tracking-widest uppercase text-stone-500 mb-2 block">
              VILLAGEDELI CLUB
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.08] mb-4">
              Shop More. <br />
              <span className="text-[#6cb33f]">Get More.</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 font-medium">
              Join VillageDELI Club and enjoy exclusive rewards, special offers and a better everyday experience.
            </p>

            {/* 4 Circular Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { icon: Gift, title: 'Exclusive Rewards' },
                { icon: Tag, title: 'Special Offers' },
                { icon: Crown, title: 'Birthday Surprises' },
                { icon: Star, title: 'Everyday Benefits' },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border border-[#6cb33f] bg-white flex items-center justify-center text-[#6cb33f] shrink-0 shadow-2xs">
                    <badge.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#0d1f15] leading-tight">
                    {badge.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLUB BENEFITS & REWARDS (PDF Page 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-1">
              CLUB BENEFITS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0d1f15]">
              Rewards for <span className="text-[#6cb33f]">Your Everyday Life.</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl font-medium">
              From everyday shopping to special occasions, VillageDELI Club brings you closer to the things you love.
            </p>
          </div>
          <Link
            to="/register"
            className="self-start md:self-auto inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#1a3826] text-white text-xs font-extrabold px-6 py-3 rounded-full transition-colors shadow-xs"
          >
            <span>JOIN VILLAGEDELI CLUB</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* 6 Benefit Cards + On the Go App Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 6 Cards Grid (8 cols on large screens) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {benefitCards.map((b, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-32 bg-stone-100 overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <h3 className="text-xs sm:text-sm font-serif font-bold text-[#0d1f15] leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed mt-1">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Banner: VillageDELI CLUB on the Go (4 cols) */}
          <div className="lg:col-span-4 bg-[#0d1f15] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6cb33f] block mb-2">
                MOBILE COMPANION
              </span>
              <h3 className="text-2xl font-serif font-black leading-tight text-white mb-2">
                VillageDELI <span className="text-[#6cb33f]">CLUB</span> on the Go
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                Manage your points, explore offers and order from your nearest store anytime, anywhere.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 p-2">
              <img
                src="/assets/mockup/club_app_banner_right.webp"
                alt="VillageDELI App"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-300">Available on iOS & Android</span>
              <Link
                to="/order-now"
                className="text-xs font-bold text-[#6cb33f] hover:underline flex items-center gap-1"
              >
                <span>Order Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (PDF Page 15) */}
      <section className="bg-[#0d1f15] text-white py-12 sm:py-14 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center sm:text-left mb-8 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
              How It Works?
            </h2>
            <p className="text-xs sm:text-sm text-[#6cb33f] font-medium">
              Joining is easy and free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, idx) => (
              <div key={idx} className="flex items-start gap-4 relative">
                {/* Step number badge */}
                <div className="w-9 h-9 rounded-full bg-[#6cb33f] text-[#0d1f15] font-black text-sm flex items-center justify-center shrink-0">
                  {st.step}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <st.icon className="w-4 h-4 text-[#6cb33f]" />
                    <h3 className="font-serif font-bold text-white text-base">
                      {st.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                {/* Arrow connecting steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-3 text-[#6cb33f]">
                    <ChevronRight className="w-5 h-5 text-stone-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. A BETTER NEIGHBOURHOOD EXPERIENCE & BOTTOM JOIN STRIP (PDF Page 15) */}
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left 4 icon values */}
            <div className="md:col-span-6 flex flex-wrap items-center gap-4 sm:gap-6">
              <h4 className="font-serif font-black text-[#0d1f15] text-sm">
                A Better <br />
                <span className="text-[#6cb33f]">Neighbourhood Experience.</span>
              </h4>
              <div className="h-8 w-px bg-stone-200 hidden sm:block" />
              <div className="flex items-center gap-3">
                {[
                  { icon: Leaf, title: 'Fresh Food' },
                  { icon: Users, title: 'Community' },
                  { icon: Heart, title: 'Care' },
                  { icon: Crown, title: 'Perks' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#f4f7f2] border border-[#6cb33f]/40 text-[#6cb33f] flex items-center justify-center shadow-2xs">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-600 mt-1">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Join VillageDELI Club Today banner with fresh produce strip photo */}
            <div className="md:col-span-6 bg-[#f7faf5] border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 overflow-hidden relative">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/mockup/club_fresh_produce_strip.webp"
                  alt="Fresh Vegetables"
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <h4 className="font-serif font-black text-[#0d1f15] text-sm sm:text-base leading-tight">
                    Join VillageDELI Club Today.
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">Start earning rewards on every visit.</p>
                </div>
              </div>

              <Link
                to="/register"
                className="shrink-0 bg-[#6cb33f] hover:bg-[#5aa132] text-white text-xs font-black px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs uppercase tracking-wider"
              >
                <span>JOIN NOW</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
