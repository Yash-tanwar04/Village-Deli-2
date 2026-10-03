import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  TrendingUp,
  BookOpen,
  Users,
  Heart,
  Award,
  Leaf,
  Store,
  ChefHat,
  Truck,
  Briefcase,
  Monitor,
  Wrench,
  CheckCircle2,
  X
} from 'lucide-react';
import { getTestimonialsByCategory, Testimonial } from '../lib/testimonialsStore';

export const CareersPage: React.FC = () => {
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [activeJobTitle, setActiveJobTitle] = useState('Store Operations');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    experience: '1-3 years',
    notes: '',
  });

  const valueBadges = [
    { icon: Users, title: 'Purpose Driven Work' },
    { icon: TrendingUp, title: 'Growth Opportunities' },
    { icon: BookOpen, title: 'Learn & Develop' },
    { icon: Users, title: 'Inclusive Culture' },
    { icon: Heart, title: 'Health & Wellbeing' },
    { icon: Award, title: 'Recognition & Rewards' },
    { icon: Leaf, title: 'Be Part of a Bigger Impact' },
  ];

  const departments = [
    {
      img: '/assets/mockup/career_store_ops.webp',
      icon: Store,
      title: 'Store Operations',
      desc: 'Frontline roles that keep our stores running and our customers smiling.',
    },
    {
      img: '/assets/mockup/career_food_prod.webp',
      icon: ChefHat,
      title: 'Food Production',
      desc: 'Create fresh, high-quality food that people love everyday.',
    },
    {
      img: '/assets/mockup/career_supply_chain.webp',
      icon: Truck,
      title: 'Supply Chain & Logistics',
      desc: 'Ensure our products reach stores fresh and on time.',
    },
    {
      img: '/assets/mockup/career_corporate.webp',
      icon: Briefcase,
      title: 'Corporate Functions',
      desc: 'Drive our growth through strategy, finance, marketing, HR and more.',
    },
    {
      img: '/assets/mockup/career_tech_data.webp',
      icon: Monitor,
      title: 'Technology & Data',
      desc: 'Build innovative solutions for a better retail experience.',
    },
    {
      img: '/assets/mockup/career_facilities.webp',
      icon: Wrench,
      title: 'Facilities & Support',
      desc: 'Keep our stores safe, clean and running smoothly.',
    },
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getTestimonialsByCategory('career'));

  useEffect(() => {
    const refresh = () => setTestimonials(getTestimonialsByCategory('career'));
    window.addEventListener('villagedeli:testimonials-updated', refresh);
    return () => window.removeEventListener('villagedeli:testimonials-updated', refresh);
  }, []);

  const handleOpenApplication = (jobTitle: string) => {
    setActiveJobTitle(jobTitle);
    setSubmitted(false);
    setApplicationModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16">
      {/* 1. HERO BANNER (PDF Page 17) */}
      <section className="relative bg-[#f7faf5] border-b border-stone-200 overflow-hidden">
        {/* Right side background hero graphic with employee photo */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none opacity-30 lg:opacity-100">
          <img
            src="/assets/mockup/career_employee_hero.webp"
            alt="VillageDELI Employee"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5] via-[#f7faf5]/80 to-transparent lg:w-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
            <Link to="/" className="hover:text-[#6cb33f] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[#0d1f15] font-bold">Careers</span>
          </nav>

          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.08] mb-4">
              Build a Career <br />
              <span className="text-[#6cb33f]">That Matters</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              Join a passionate team that is bringing fresh food, everyday essentials and a healthier lifestyle closer to communities across India.
            </p>

            <div className="pt-2 mb-8">
              <a
                href="#opportunities"
                className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#5aa132] text-white text-xs font-black px-6 py-3 rounded-full transition-colors uppercase tracking-wider shadow-sm"
              >
                <span>VIEW OPEN POSITIONS</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 7 VALUE BADGES BAR (PDF Page 17) */}
      <section className="bg-white border-b border-stone-200 py-4 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 min-w-max">
          {valueBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[#6cb33f] bg-[#f4f7f2] flex items-center justify-center text-[#6cb33f] shrink-0">
                <badge.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-700 whitespace-nowrap">
                {badge.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE OPPORTUNITIES (6 DEPT CARDS) (PDF Page 17) */}
      <section id="opportunities" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0d1f15]">
              Explore Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Be part of a growing team across stores, supply chain, corporate and support functions.
            </p>
          </div>

          <button
            onClick={() => handleOpenApplication('General Application')}
            className="self-start md:self-auto text-xs font-bold text-[#0d1f15] hover:text-[#6cb33f] flex items-center gap-1.5 transition-colors underline"
          >
            <span>View All Open Positions</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6cb33f]" />
          </button>
        </div>

        {/* 6 Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="h-32 bg-stone-100 overflow-hidden relative">
                <img
                  src={dept.img}
                  alt={dept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-[#f4f7f2] border border-[#6cb33f]/50 flex items-center justify-center text-[#6cb33f] shadow-2xs">
                  <dept.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xs font-serif font-black text-[#0d1f15] leading-snug">
                    {dept.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                    {dept.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenApplication(dept.title)}
                  className="mt-3 text-xs font-bold text-[#6cb33f] hover:text-[#5aa132] flex items-center gap-1 self-start"
                >
                  <span>View Jobs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LIFE AT VILLAGEDELI (4 TESTIMONIALS) (PDF Page 17) */}
      <section className="bg-white border-y border-stone-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0d1f15]">
                Life at VillageDELI
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                A dynamic, people-first culture where ideas, hard work and collaboration create real impact.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-500 self-start md:self-auto">
              Real People. Real Stories.
            </span>
          </div>

          {/* 4 Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.id || idx}
                className="bg-[#fafaf7] rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-200/80">
                  <img
                    src={t.image || (t as any).img}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#6cb33f]/40 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/mockup/career_priya_sharma.webp';
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0d1f15] leading-tight">{t.name}</h4>
                    <p className="text-[11px] text-stone-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GROW WITH US BOTTOM BANNER (PDF Page 17) */}
      <section className="bg-[#0d1f15] text-white py-6 sm:py-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#6cb33f] flex items-center justify-center text-[#6cb33f] shrink-0 bg-white/5">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-black leading-tight text-white">
                  Grow With Us. <br />
                  <span className="text-[#6cb33f]">Build a Healthier Tomorrow.</span>
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 max-w-md text-center lg:text-left">
              If you're passionate about fresh food, people and communities, we'd love to have you on board.
            </p>

            <button
              onClick={() => handleOpenApplication('General Career Enquiry')}
              className="bg-[#6cb33f] hover:bg-[#5aa132] text-white text-xs font-black px-6 py-3 rounded-full transition-colors flex items-center gap-1.5 shadow-md uppercase tracking-wider shrink-0"
            >
              <span>EXPLORE CAREERS</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      {applicationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setApplicationModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#f4f7f2] text-[#6cb33f] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-xl text-[#0d1f15] mb-2">
                  Application Received!
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  Thank you for your interest in joining VillageDELI in {activeJobTitle}. Our HR team will reach out to you via phone shortly.
                </p>
                <button
                  onClick={() => setApplicationModalOpen(false)}
                  className="bg-[#0d1f15] text-white text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6cb33f] block mb-1">
                  APPLY NOW
                </span>
                <h3 className="font-serif font-black text-xl text-[#0d1f15] mb-1">
                  {activeJobTitle}
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  Fill in your details below and our talent team will get in touch with you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none"
                      placeholder="e.g. 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Current City / Location</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none"
                      placeholder="e.g. Gurugram, Delhi NCR"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Experience</label>
                    <select
                      value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-none bg-white"
                    >
                      <option>Fresher</option>
                      <option>1-3 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#6cb33f] hover:bg-[#5aa132] text-white text-xs font-black py-3 rounded-full uppercase tracking-wider transition-colors shadow-md"
                  >
                    SUBMIT APPLICATION
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
