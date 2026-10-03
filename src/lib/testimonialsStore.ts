export interface Testimonial {
  id: string;
  name: string;
  role: string;
  category: 'career' | 'farmer' | 'customer';
  quote: string;
  image: string;
  created_at: string;
}

const STORAGE_KEY = 'villagedeli_testimonials_v1';

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  // 1. Careers & Team Testimonials
  {
    id: 'test-car-1',
    name: 'Priya Sharma',
    role: 'Store Manager, Gurugram',
    category: 'career',
    quote: '“I love being part of a team that makes a real difference in people’s daily lives.”',
    image: '/assets/mockup/career_priya_sharma.webp',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'test-car-2',
    name: 'Rohit Verma',
    role: 'Kitchen Executive, Noida',
    category: 'career',
    quote: '“Great learning, great people and endless opportunities to grow.”',
    image: '/assets/mockup/career_rohit_verma.webp',
    created_at: '2026-01-12T11:00:00Z'
  },
  {
    id: 'test-car-3',
    name: 'Ananya Mehta',
    role: 'Marketing Executive, Delhi',
    category: 'career',
    quote: '“VillageDELI gives me the platform to innovate and make an impact.”',
    image: '/assets/mockup/career_ananya_mehta.webp',
    created_at: '2026-01-15T09:30:00Z'
  },
  {
    id: 'test-car-4',
    name: 'Sandeep Kumar',
    role: 'Logistics Associate, Haryana',
    category: 'career',
    quote: '“It feels good to be part of a brand that stands for fresh food and stronger communities.”',
    image: '/assets/mockup/career_sandeep_kumar.webp',
    created_at: '2026-01-18T14:15:00Z'
  },

  // 2. Farmer & Producer Testimonials
  {
    id: 'test-farm-1',
    name: 'Ramesh Yadav',
    role: 'Vegetable Farmer, Haryana',
    category: 'farmer',
    quote: 'VillageDELI has given us a stable market for our produce and better income for our families.',
    image: '/assets/mockup/source_farmer_ramesh.webp',
    created_at: '2026-01-05T08:00:00Z'
  },
  {
    id: 'test-farm-2',
    name: 'Sunita Devi',
    role: 'Farmer, Uttar Pradesh',
    category: 'farmer',
    quote: 'We feel proud that our fresh produce reaches so many families through VillageDELI.',
    image: '/assets/mockup/source_farmer_sunita.webp',
    created_at: '2026-01-07T12:00:00Z'
  },
  {
    id: 'test-farm-3',
    name: 'Mahender Singh',
    role: 'Farmer, Punjab',
    category: 'farmer',
    quote: 'A partnership built on trust, quality and a shared vision for healthier communities.',
    image: '/assets/mockup/source_farmer_mahender.webp',
    created_at: '2026-01-08T15:00:00Z'
  },

  // 3. Customer & Club Member Testimonials
  {
    id: 'test-cust-1',
    name: 'Dr. Vikram Malik',
    role: 'Club Member, Sector 109 Gurugram',
    category: 'customer',
    quote: 'The morning farm deliveries and 24/7 store in Sector 109 have transformed how our family buys fresh groceries and artisan breads.',
    image: '/assets/mockup/about_girl_apple.webp',
    created_at: '2026-01-20T16:00:00Z'
  },
  {
    id: 'test-cust-2',
    name: 'Meenakshi Sen',
    role: 'Neighbourhood Shopper, Dwarka Expressway',
    category: 'customer',
    quote: 'Unmatched bakery and farm-fresh produce under one roof. Truly the heart and pride of our neighbourhood.',
    image: '/assets/mockup/about_family_hero.webp',
    created_at: '2026-01-22T17:30:00Z'
  }
];

export const getTestimonials = (): Testimonial[] => {
  if (typeof window === 'undefined') return DEFAULT_TESTIMONIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading testimonials from localStorage:', err);
    return DEFAULT_TESTIMONIALS;
  }
};

export const getTestimonialsByCategory = (category: Testimonial['category']): Testimonial[] => {
  return getTestimonials().filter(t => t.category === category);
};

export const saveTestimonial = (
  item: Partial<Testimonial> & {
    name: string;
    role: string;
    quote: string;
    category: Testimonial['category'];
    image: string;
  }
): Testimonial => {
  const current = getTestimonials();
  let updatedItem: Testimonial;

  if (item.id) {
    // Update existing
    updatedItem = {
      id: item.id,
      name: item.name,
      role: item.role,
      category: item.category,
      quote: item.quote,
      image: item.image,
      created_at: item.created_at || new Date().toISOString()
    };
    const next = current.map(t => (t.id === item.id ? updatedItem : t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } else {
    // Create new
    updatedItem = {
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: item.name,
      role: item.role,
      category: item.category,
      quote: item.quote,
      image: item.image,
      created_at: new Date().toISOString()
    };
    const next = [updatedItem, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  notifyTestimonialsUpdated();
  return updatedItem;
};

export const deleteTestimonial = (id: string): void => {
  const current = getTestimonials();
  const next = current.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notifyTestimonialsUpdated();
};

export const resetTestimonialsToDefault = (): Testimonial[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
  notifyTestimonialsUpdated();
  return DEFAULT_TESTIMONIALS;
};

const notifyTestimonialsUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('villagedeli:testimonials-updated'));
  }
};
