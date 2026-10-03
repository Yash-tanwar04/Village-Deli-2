import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  UserProfile,
  Category,
  Product,
  Address,
  Order,
  OrderItem,
  StoreSettings,
  EmailSettings,
  EmailLog,
  PaymentSettings,
  Transaction,
  ContactMessage,
  SupportQuery,
  QueryReply,
  ProductVariant,
  StoreLocation
} from './types';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

interface DatabaseSchema {
  users: UserProfile[];
  categories: Category[];
  products: Product[];
  addresses: Address[];
  orders: Order[];
  order_counter: number;
  transactions: Transaction[];
  transaction_counter: number;
  store_settings: StoreSettings;
  payment_settings: PaymentSettings;
  email_settings: EmailSettings;
  email_logs: EmailLog[];
  contact_messages?: ContactMessage[];
  support_queries?: SupportQuery[];
  query_counter?: number;
  stores?: StoreLocation[];
}

function getDefaultData(): DatabaseSchema {
  const now = new Date().toISOString();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@villagedeli.in').trim().toLowerCase();
  const adminPassword = (process.env.ADMIN_PASSWORD || 'VillageDeli@2026!').trim();
  const passwordHash = crypto.createHash('sha256').update(adminPassword).digest('hex');

  return {
    stores: getInitialStores(),
    users: [
      {
        id: 'usr_admin_01',
        email: adminEmail,
        full_name: 'VillageDELI Administrator',
        phone: '+91 98765 43210',
        role: 'super_admin',
        password_hash: passwordHash,
        created_at: now
      }
    ],
    categories: [
      {
        id: 'cat_01',
        name: 'Fresh Produce',
        slug: 'fresh-produce',
        description: 'Farm-fresh fruits and vegetables, handpicked for quality, nutrition and great taste.',
        image_url: '/assets/cat_fresh_produce.webp',
        sort_order: 1,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_02',
        name: 'Fresh Food',
        slug: 'fresh-food',
        description: 'Quick meals, chef-curated sandwiches, hot parathas, bowls, and savory treats.',
        image_url: '/assets/cat_fresh_food.webp',
        sort_order: 2,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_03',
        name: 'Bakery & Snacks',
        slug: 'bakery-snacks',
        description: 'Artisan sourdough, multigrain breads, freshly baked croissants and evening tea crunch.',
        image_url: '/assets/cat_bakery_snacks.webp',
        sort_order: 3,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_04',
        name: 'Groceries & Essentials',
        slug: 'groceries-essentials',
        description: 'Pantry staples, freshly ground flour (Atta), pulses, rice, cold-pressed oils, and spices.',
        image_url: '/assets/cat_groceries_essentials.webp',
        sort_order: 4,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_05',
        name: 'Dairy & Chilled',
        slug: 'dairy-chilled',
        description: 'Pure Vita milk, paneer, butter, artisanal curd, cheeses and farm eggs.',
        image_url: '/assets/cat_dairy_chilled.webp',
        sort_order: 5,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_06',
        name: 'Meat & Proteins',
        slug: 'meat-proteins',
        description: 'Hygienically packaged fresh poultry, marinated meats, cuts, and protein essentials.',
        image_url: '/assets/cat_meat_proteins.webp',
        sort_order: 6,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_07',
        name: 'Coffee & Beverages',
        slug: 'coffee-beverages',
        description: 'Union Artisan Coffee roast blends, freshly cold-pressed fruit juices, kombuchas and sodas.',
        image_url: '/assets/cat_coffee_beverages.webp',
        sort_order: 7,
        is_active: true,
        created_at: now
      },
      {
        id: 'cat_08',
        name: 'Personal Care & Household',
        slug: 'personal-care-household',
        description: 'Everyday personal care, wellness, cleaning essentials, and household necessities.',
        image_url: '/assets/cat_personal_household.webp',
        sort_order: 8,
        is_active: true,
        created_at: now
      }
    ],
    products: getInitialDummyProducts(now),
    addresses: [],
    orders: [],
    order_counter: 120, // Next order starts at VDL-000121
    transactions: [],
    transaction_counter: 100,
    store_settings: {
      store_name: 'VillageDELI Sector 109, Gurugram',
      store_address: 'Plot 12, Sector 109, Gurugram, Haryana - 122017',
      support_phone: '+91 98765 43210',
      support_email: 'orders@villagedeli.in',
      opening_hours: 'Open 24/7 (All days)',
      delivery_enabled: true,
      delivery_fee: 30,
      free_delivery_threshold: 500,
      min_order_value: 150,
      serviceable_pincodes: ['122001', '122002', '122003', '122017', '122018', '122050', '160017', '160022'],
      updated_at: now
    },
    payment_settings: {
      razorpay_enabled: false,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID || '',
      razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || '',
      require_admin_verification: false,
      cod_enabled: true,
      updated_at: now
    },
    email_settings: {
      admin_notification_email: 'admin@villagedeli.in',
      sender_name: 'VillageDELI Orders',
      from_email: 'orders@villagedeli.in',
      admin_cc_email: '',
      admin_bcc_email: '',
      customer_email_subject: 'VillageDELI — Your Order {{order_id}} Has Been Confirmed',
      customer_email_header: 'Thank you for shopping with VillageDELI! Your fresh groceries and everyday essentials are being prepared.',
      customer_email_footer: 'Need help with your order? Reach our customer care team anytime at support@villagedeli.in or +91 98765 43210.',
      admin_email_subject: '🛒 New VillageDELI Order — {{order_id}} (₹{{order_total}})',
      admin_email_header: 'A new order has been received and requires confirmation.',
      admin_email_footer: 'Manage this order live in your VillageDELI Admin Portal.',
      enable_customer_emails: true,
      enable_admin_emails: true,
      enable_contact_emails: true,
      enable_otp_login: false,
      enable_otp_register: false,
      notify_customer_order_placed: true,
      notify_customer_order_preparing: true,
      notify_customer_order_out_for_delivery: true,
      notify_customer_order_delivered: true,
      notify_customer_order_cancelled: true,
      notify_customer_welcome: true,
      notify_customer_query_received: true,
      notify_customer_query_reply: true,
      notify_admin_new_order: true,
      notify_admin_order_cancelled: true,
      notify_admin_new_query: true,
      query_ack_subject: 'We have received your query - Ticket #{{ticket_id}}',
      query_ack_message: 'Dear {{name}}, thank you for reaching out to VillageDELI. Our support team has received your query regarding {{enquiry_type}} and will reply shortly.',
      updated_at: now
    },
    email_logs: [],
    contact_messages: [],
    support_queries: [],
    query_counter: 1000
  };
}

export function getInitialDummyProducts(now: string): Product[] {
  return [
    {
      id: 'prd_dummy_01',
      name: 'Farm Fresh Red Strawberries',
      slug: 'farm-fresh-red-strawberries',
      description: 'Sweet, succulent hand-picked strawberries from Mahabaleshwar highland farms. Rich in Vitamin C and antioxidants.',
      category_id: 'cat_01',
      brand: 'VillageDELI Organics',
      sku: 'STR-FRM-250G',
      price: 149,
      discount_price: 129,
      unit: 'box',
      weight_quantity: '250 g',
      stock_quantity: 45,
      low_stock_threshold: 5,
      image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Fresh Harvest',
      dietary_tags: ['100% Organic', 'Farm Direct'],
      status: 'published',
      is_featured: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_02',
      name: 'Artisan Sourdough Country Loaf',
      slug: 'artisan-sourdough-country-loaf',
      description: 'Naturally fermented for 36 hours with wild sourdough culture. Crusty on the outside, light and airy crumb inside.',
      category_id: 'cat_03',
      brand: 'VillageDELI Bakery',
      sku: 'BAK-SRD-400G',
      price: 180,
      discount_price: 150,
      unit: 'loaf',
      weight_quantity: '400 g',
      stock_quantity: 30,
      low_stock_threshold: 4,
      image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Bestseller',
      dietary_tags: ['Zero Preservatives', 'Vegan'],
      status: 'published',
      is_featured: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_03',
      name: 'Vita Farm Fresh A2 Cow Milk',
      slug: 'vita-farm-fresh-a2-cow-milk',
      description: 'Pure, unadulterated chilled A2 Gir cow milk, delivered fresh daily in recyclable bottles. Retains all natural nutrients.',
      category_id: 'cat_05',
      brand: 'Vita Dairy',
      sku: 'VTA-MLK-1000ML',
      price: 88,
      discount_price: null,
      unit: 'bottle',
      weight_quantity: '1 Litre',
      stock_quantity: 50,
      low_stock_threshold: 10,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Pure Dairy',
      dietary_tags: ['A2 Certified', 'Cold Chain'],
      status: 'published',
      is_featured: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_04',
      name: 'Handcrafted Artisanal Malai Paneer',
      slug: 'handcrafted-artisanal-malai-paneer',
      description: 'Melt-in-mouth cottage cheese crafted from pure whole milk without any starch or additives. High protein and velvety texture.',
      category_id: 'cat_05',
      brand: 'Vita Dairy',
      sku: 'VTA-PNR-200G',
      price: 120,
      discount_price: 105,
      unit: 'pack',
      weight_quantity: '200 g',
      stock_quantity: 35,
      low_stock_threshold: 5,
      image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Fresh Daily',
      dietary_tags: ['High Protein', 'Gluten Free'],
      status: 'published',
      is_featured: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_05',
      name: 'Union Artisan Signature Cold Brew',
      slug: 'union-artisan-signature-cold-brew',
      description: 'Steeped for 18 hours in small batches from Chikmagalur estate Arabica beans. Smooth, low-acidity notes of dark chocolate and caramel.',
      category_id: 'cat_07',
      brand: 'Union Coffee',
      sku: 'UAC-CBR-250ML',
      price: 195,
      discount_price: 165,
      unit: 'bottle',
      weight_quantity: '250 ml',
      stock_quantity: 40,
      low_stock_threshold: 6,
      image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Chef Pick',
      dietary_tags: ['Zero Sugar', '100% Arabica'],
      status: 'published',
      is_featured: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_06',
      name: 'Cold-Pressed Kachi Ghani Mustard Oil',
      slug: 'cold-pressed-kachi-ghani-mustard-oil',
      description: 'Traditional wooden cold-pressed virgin mustard oil from select Haryana mustard seeds. Pungent aroma and natural antioxidants.',
      category_id: 'cat_04',
      brand: 'VillageDELI Pantry',
      sku: 'OIL-MST-1000ML',
      price: 245,
      discount_price: 219,
      unit: 'bottle',
      weight_quantity: '1 Litre',
      stock_quantity: 60,
      low_stock_threshold: 10,
      image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Cold Pressed',
      dietary_tags: ['Unrefined', 'Wood Pressed'],
      status: 'published',
      is_featured: false,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_07',
      name: 'Pasture-Raised Brown Farm Eggs',
      slug: 'pasture-raised-brown-farm-eggs',
      description: 'Fresh farm eggs from free-roaming hens fed organic grain and seeds. Rich golden yolks with high protein and Omega-3.',
      category_id: 'cat_05',
      brand: 'VillageDELI Farms',
      sku: 'EGG-BRN-6PK',
      price: 95,
      discount_price: 85,
      unit: 'carton',
      weight_quantity: 'Pack of 6',
      stock_quantity: 50,
      low_stock_threshold: 8,
      image_url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Organic',
      dietary_tags: ['Antibiotic Free', 'Omega-3'],
      status: 'published',
      is_featured: false,
      created_at: now,
      updated_at: now
    },
    {
      id: 'prd_dummy_08',
      name: 'Hass Avocados (Pack of 2)',
      slug: 'hass-avocados-pack-of-2',
      description: 'Buttery, ripe Hass avocados perfect for morning toast, guacamole, and fresh summer salads.',
      category_id: 'cat_01',
      brand: 'VillageDELI Organics',
      sku: 'AVO-HSS-2PK',
      price: 240,
      discount_price: 199,
      unit: 'pack',
      weight_quantity: '2 Pieces',
      stock_quantity: 25,
      low_stock_threshold: 5,
      image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
      additional_images: [],
      badge: 'Imported',
      dietary_tags: ['Superfood', 'Healthy Fats'],
      status: 'published',
      is_featured: true,
      created_at: now,
      updated_at: now
    }
  ];
}

export function getInitialStores(): StoreLocation[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'loc-109',
      name: 'VillageDELI – Sector 109',
      format: 'Neighbourhood',
      badge: 'Neighbourhood Store',
      address: 'Plot 12, Sector 109, Gurugram, Haryana - 122017',
      pincode: '122017',
      city: 'Gurugram',
      state: 'Haryana',
      phone: '+91 98765 43210',
      email: 'sec109@villagedeli.in',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Amit Sharma',
      parking: 'Yes',
      icons: ['Fresh Produce', 'Fresh Food', 'Groceries', 'Bakery'],
      image: '/assets/mockup/store_sector_109_card.webp',
      is_active: true,
      allow_pickup: true,
      assigned_admin_ids: ['usr_admin_01'],
      created_at: now,
      updated_at: now
    },
    {
      id: 'loc-dwarka-hub',
      name: 'VillageDELI Hub – Dwarka Expressway',
      format: 'VillageDELI Hub',
      badge: 'VillageDELI Hub',
      address: 'Near Global City, Dwarka Expressway, Gurugram, Haryana - 122006',
      pincode: '122006',
      city: 'Gurugram',
      state: 'Haryana',
      phone: '+91 98765 43211',
      email: 'dwarka.hub@villagedeli.in',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Vikas Malhotra',
      parking: 'Yes (100+ Cars & EV)',
      icons: ['Fresh Produce', 'Bakery & Milling', 'Fresh Food', 'Dairy & Meats'],
      image: '/assets/mockup/store_dwarka_exp_card.webp',
      is_active: true,
      allow_pickup: true,
      assigned_admin_ids: ['usr_admin_01'],
      created_at: now,
      updated_at: now
    },
    {
      id: 'loc-kmp',
      name: 'VillageDELI – KMP Highway',
      format: 'Highway',
      badge: 'Highway Store',
      address: 'Kundli Manesar Palwal (KMP) Expressway, Gurugram, Haryana - 122505',
      pincode: '122505',
      city: 'Gurugram',
      state: 'Haryana',
      phone: '+91 98765 43212',
      email: 'kmp.highway@villagedeli.in',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Rajesh Hooda',
      parking: 'Yes (Highway Rest Area)',
      icons: ['Quick Meals', 'Beverages', 'Groceries', 'Travel Essentials'],
      image: '/assets/mockup/store_kmp_highway_card.webp',
      is_active: true,
      allow_pickup: true,
      assigned_admin_ids: [],
      created_at: now,
      updated_at: now
    },
    {
      id: 'loc-sec56',
      name: 'VillageDELI – Sector 56',
      format: 'Neighbourhood',
      badge: 'Neighbourhood Store',
      address: 'Main Market, Sector 56, Gurugram, Haryana - 122011',
      pincode: '122011',
      city: 'Gurugram',
      state: 'Haryana',
      phone: '+91 98765 43213',
      email: 'sec56@villagedeli.in',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Priya Sharma',
      parking: 'Yes',
      icons: ['Fresh Produce', 'Dairy & Chilled', 'Artisan Bakery', 'Groceries'],
      image: '/assets/mockup/store_sector_56_card.webp',
      is_active: true,
      allow_pickup: true,
      assigned_admin_ids: [],
      created_at: now,
      updated_at: now
    },
    {
      id: 'loc-sohna',
      name: 'VillageDELI – Sohna Road',
      format: 'Highway',
      badge: 'Waypoint Highway Hub',
      address: 'Subhash Chowk, Sohna Road, Gurugram, Haryana - 122002',
      pincode: '122002',
      city: 'Gurugram',
      state: 'Haryana',
      phone: '+91 98765 43214',
      email: 'sohna@villagedeli.in',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Karan Mehra',
      parking: 'Yes',
      icons: ['Quick Meals', 'Fresh Beverages', 'Groceries', 'Ample Parking'],
      image: '/assets/mockup/store_sohna_road_card.webp',
      is_active: true,
      allow_pickup: true,
      assigned_admin_ids: [],
      created_at: now,
      updated_at: now
    },
    {
      id: 'loc-golf-course',
      name: 'VillageDELI – Golf Course Ext.',
      format: 'Neighbourhood',
      badge: 'Neighbourhood Store',
      address: 'Golf Course Extension Road, Gurugram, Haryana - 122036',
      pincode: '122036',
      city: 'Gurugram',
      state: 'Haryana',
      phone: '+91 98765 43215',
      email: 'golfcourse@villagedeli.in',
      hours: 'Open 24 Hours (7 Days a Week)',
      manager: 'Sunil Verma',
      parking: 'Yes',
      icons: ['Fresh Produce', 'Gourmet Grocery', 'Bakery', 'Coffee Station'],
      image: '/assets/mockup/store_golf_course_card.webp',
      is_active: true,
      allow_pickup: true,
      assigned_admin_ids: [],
      created_at: now,
      updated_at: now
    }
  ];
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        let updated = false;

        // Ensure stores exist
        if (!this.data.stores || this.data.stores.length === 0) {
          this.data.stores = getInitialStores();
          updated = true;
        }

        // Ensure default admin exists
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = getDefaultData().users;
          updated = true;
        } else if (process.env.ADMIN_PASSWORD) {
          const superAdmin = this.data.users.find(u => u.role === 'super_admin');
          if (superAdmin) {
            const expectedHash = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD.trim()).digest('hex');
            if (superAdmin.password_hash !== expectedHash) {
              superAdmin.password_hash = expectedHash;
              updated = true;
            }
            if (process.env.ADMIN_EMAIL && superAdmin.email !== process.env.ADMIN_EMAIL.trim().toLowerCase()) {
              superAdmin.email = process.env.ADMIN_EMAIL.trim().toLowerCase();
              updated = true;
            }
          }
        }

        // Ensure dummy products exist for testing
        if (!this.data.products || this.data.products.length === 0) {
          this.data.products = getInitialDummyProducts(new Date().toISOString());
          updated = true;
        }

        // Ensure payment_settings exists
        if (!this.data.payment_settings) {
          this.data.payment_settings = getDefaultData().payment_settings;
          updated = true;
        }

        // Ensure transactions exists
        if (!this.data.transactions) {
          this.data.transactions = [];
          updated = true;
        }

        if (!this.data.transaction_counter) {
          this.data.transaction_counter = 100;
          updated = true;
        }

        // Ensure contact_messages exists
        if (!this.data.contact_messages) {
          this.data.contact_messages = [];
          updated = true;
        }

        // Ensure support_queries exists
        if (!this.data.support_queries) {
          this.data.support_queries = [];
          updated = true;
        }

        if (!this.data.query_counter) {
          this.data.query_counter = 1000;
          updated = true;
        }

        if (updated) {
          this.save();
        }
      } catch (err) {
        console.error('Error reading store.json, resetting to defaults', err);
        this.data = getDefaultData();
        this.save();
      }
    } else {
      this.data = getDefaultData();
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // --- Users / Auth ---
  getUsers(): UserProfile[] {
    return this.data.users;
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserProfile | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByPhone(phone: string): UserProfile | undefined {
    if (!phone) return undefined;
    const clean = phone.replace(/\D/g, '');
    if (!clean) return undefined;
    return this.data.users.find(u => u.phone && u.phone.replace(/\D/g, '') === clean);
  }

  createUser(user: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const newUser: UserProfile = {
      ...user,
      id: 'usr_' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  getAdmins(): UserProfile[] {
    return this.data.users.filter(u => u.role === 'admin' || u.role === 'super_admin');
  }

  createAdmin(admin: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const newAdmin: UserProfile = {
      ...admin,
      id: 'adm_' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString()
    };
    this.data.users.push(newAdmin);
    this.save();
    return newAdmin;
  }

  deleteAdmin(id: string): { success: boolean; error?: string } {
    const admin = this.data.users.find(u => u.id === id);
    if (!admin || (admin.role !== 'admin' && admin.role !== 'super_admin')) {
      return { success: false, error: 'Administrator not found' };
    }

    // STRICT SUPER ADMIN PROTECTION
    if (admin.role === 'super_admin') {
      const superAdmins = this.data.users.filter(u => u.role === 'super_admin');
      if (superAdmins.length <= 1) {
        return { success: false, error: 'You cannot remove the only Super Admin.' };
      }
    }

    this.data.users = this.data.users.filter(u => u.id !== id);
    this.save();
    return { success: true };
  }

  // --- Categories ---
  getCategories(onlyActive = false): Category[] {
    let cats = [...this.data.categories];
    if (onlyActive) {
      cats = cats.filter(c => c.is_active);
    }
    return cats.sort((a, b) => a.sort_order - b.sort_order);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find(c => c.slug === slug);
  }

  createCategory(cat: Omit<Category, 'id' | 'created_at'>): Category {
    const newCat: Category = {
      ...cat,
      id: 'cat_' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Products ---
  getProducts(filter?: {
    category_id?: string;
    category_slug?: string;
    status?: string;
    search?: string;
    brand?: string;
    is_featured?: boolean;
  }): Product[] {
    let prods = [...this.data.products];

    // Filter by status (default only published for customers)
    if (filter?.status) {
      if (filter.status !== 'all') {
        prods = prods.filter(p => p.status === filter.status);
      }
    } else {
      prods = prods.filter(p => p.status === 'published');
    }

    if (filter?.category_id) {
      prods = prods.filter(p => p.category_id === filter.category_id);
    }

    if (filter?.category_slug) {
      const cat = this.getCategoryBySlug(filter.category_slug);
      if (cat) {
        prods = prods.filter(p => p.category_id === cat.id);
      }
    }

    if (filter?.brand) {
      prods = prods.filter(p => p.brand.toLowerCase() === filter.brand!.toLowerCase());
    }

    if (filter?.is_featured !== undefined) {
      prods = prods.filter(p => p.is_featured === filter.is_featured);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.dietary_tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Attach category_name for convenience
    return prods.map(p => {
      const cat = this.data.categories.find(c => c.id === p.category_id);
      return { ...p, category_name: cat?.name || 'General' };
    });
  }

  getProductById(id: string): Product | undefined {
    const prod = this.data.products.find(p => p.id === id);
    if (!prod) return undefined;
    const cat = this.data.categories.find(c => c.id === prod.category_id);
    return { ...prod, category_name: cat?.name || 'General' };
  }

  createProduct(prod: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const now = new Date().toISOString();
    const newProd: Product = {
      ...prod,
      id: 'prd_' + crypto.randomUUID().slice(0, 8),
      created_at: now,
      updated_at: now
    };
    this.data.products.push(newProd);
    this.save();
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: string, softDelete = true): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    if (softDelete) {
      this.data.products[idx].status = 'archived';
      this.data.products[idx].updated_at = new Date().toISOString();
    } else {
      this.data.products.splice(idx, 1);
    }
    this.save();
    return true;
  }

  // --- Addresses ---
  getAddresses(userId: string): Address[] {
    return this.data.addresses.filter(a => a.user_id === userId);
  }

  getAddressById(id: string): Address | undefined {
    return this.data.addresses.find(a => a.id === id);
  }

  createAddress(addr: Omit<Address, 'id' | 'created_at'>): Address {
    const newAddr: Address = {
      ...addr,
      id: 'addr_' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString()
    };
    if (newAddr.is_default) {
      this.data.addresses.forEach(a => {
        if (a.user_id === newAddr.user_id) a.is_default = false;
      });
    }
    this.data.addresses.push(newAddr);
    this.save();
    return newAddr;
  }

  updateAddress(id: string, updates: Partial<Address>): Address | null {
    const idx = this.data.addresses.findIndex(a => a.id === id);
    if (idx === -1) return null;
    if (updates.is_default) {
      const uId = this.data.addresses[idx].user_id;
      this.data.addresses.forEach(a => {
        if (a.user_id === uId) a.is_default = false;
      });
    }
    this.data.addresses[idx] = { ...this.data.addresses[idx], ...updates };
    this.save();
    return this.data.addresses[idx];
  }

  deleteAddress(id: string): boolean {
    const initLen = this.data.addresses.length;
    this.data.addresses = this.data.addresses.filter(a => a.id !== id);
    if (this.data.addresses.length !== initLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Orders & Transactions ---
  generateOrderId(): string {
    this.data.order_counter += 1;
    const num = this.data.order_counter.toString().padStart(6, '0');
    this.save();
    return `VDL-${num}`;
  }

  getOrders(userId?: string): Order[] {
    let orders = [...this.data.orders];
    if (userId) {
      orders = orders.filter(o => o.user_id === userId);
    }
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Order {
    const orderId = this.generateOrderId();
    const now = new Date().toISOString();

    // 1. Ensure user association
    let assignedUserId = orderData.user_id;
    if (assignedUserId) {
      const existingUser = this.getUserById(assignedUserId);
      if (!existingUser) {
        let matchedUser = orderData.customer_email ? this.getUserByEmail(orderData.customer_email) : undefined;
        if (!matchedUser && orderData.customer_phone) {
          matchedUser = this.getUserByPhone(orderData.customer_phone);
        }
        if (matchedUser) {
          assignedUserId = matchedUser.id;
        } else {
          const generatedEmail = orderData.customer_email
            ? orderData.customer_email.toLowerCase()
            : `${orderData.customer_phone.replace(/\D/g, '') || Date.now()}@customer.villagedeli.in`;
          const newCust = this.createUser({
            email: generatedEmail,
            full_name: orderData.customer_name,
            phone: orderData.customer_phone,
            role: 'customer'
          });
          assignedUserId = newCust.id;
        }
      }
    } else {
      let matchedUser = orderData.customer_email ? this.getUserByEmail(orderData.customer_email) : undefined;
      if (!matchedUser && orderData.customer_phone) {
        matchedUser = this.getUserByPhone(orderData.customer_phone);
      }
      if (matchedUser) {
        assignedUserId = matchedUser.id;
      } else {
        const generatedEmail = orderData.customer_email
          ? orderData.customer_email.toLowerCase()
          : `${orderData.customer_phone.replace(/\D/g, '') || Date.now()}@customer.villagedeli.in`;
        const newCust = this.createUser({
          email: generatedEmail,
          full_name: orderData.customer_name,
          phone: orderData.customer_phone,
          role: 'customer'
        });
        assignedUserId = newCust.id;
      }
    }

    // 2. Decrement stock for ordered items (only for active orders, not cancelled) and link order_id
    for (const item of orderData.items) {
      item.order_id = orderId;
      if (orderData.order_status !== 'Cancelled') {
        const prod = this.data.products.find(p => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
          if (item.variant_id && prod.variants) {
            const v = prod.variants.find(varItem => varItem.id === item.variant_id);
            if (v) {
              v.stock_quantity = Math.max(0, v.stock_quantity - item.quantity);
            }
          }
          prod.updated_at = now;
        }
      }
    }

    const isPickup = orderData.delivery_type === 'pickup';
    const deliveryFee = isPickup ? 0 : (orderData.delivery_fee ?? 0);
    const totalAmount = isPickup ? orderData.subtotal : (orderData.total_amount ?? (orderData.subtotal + deliveryFee));

    const newOrder: Order = {
      ...orderData,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      user_id: assignedUserId,
      id: orderId,
      created_at: now,
      updated_at: now
    };

    this.data.orders.push(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['order_status']): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.order_status = status;
    order.updated_at = new Date().toISOString();
    this.save();
    return order;
  }

  updateOrderEmailStatus(orderId: string, type: 'customer' | 'admin', status: 'sent' | 'failed'): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    if (type === 'customer') {
      order.customer_email_status = status;
    } else {
      order.admin_email_status = status;
    }
    this.save();
    return order;
  }

  // --- Settings ---
  getStoreSettings(): StoreSettings {
    return this.data.store_settings;
  }

  updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
    this.data.store_settings = {
      ...this.data.store_settings,
      ...settings,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.store_settings;
  }

  getEmailSettings(): EmailSettings {
    return this.data.email_settings;
  }

  updateEmailSettings(settings: Partial<EmailSettings>): EmailSettings {
    this.data.email_settings = {
      ...this.data.email_settings,
      ...settings,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.email_settings;
  }

  // --- Email Logs ---
  getEmailLogs(): EmailLog[] {
    return [...this.data.email_logs].sort(
      (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
    );
  }

  addEmailLog(log: Omit<EmailLog, 'id' | 'sent_at'>): EmailLog {
    const newLog: EmailLog = {
      ...log,
      id: 'eml_' + crypto.randomUUID().slice(0, 8),
      sent_at: new Date().toISOString()
    };
    this.data.email_logs.push(newLog);
    this.save();
    return newLog;
  }

  // --- Payment Settings ---
  getPaymentSettings(): PaymentSettings {
    if (!this.data.payment_settings) {
      this.data.payment_settings = {
        razorpay_enabled: false,
        razorpay_key_id: process.env.RAZORPAY_KEY_ID || '',
        razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        require_admin_verification: false,
        cod_enabled: true,
        updated_at: new Date().toISOString()
      };
      this.save();
    }
    return this.data.payment_settings;
  }

  getPublicPaymentSettings() {
    const s = this.getPaymentSettings();
    return {
      razorpay_enabled: Boolean(s.razorpay_enabled),
      razorpay_key_id: s.razorpay_key_id || '',
      require_admin_verification: Boolean(s.require_admin_verification),
      cod_enabled: s.cod_enabled !== false
    };
  }

  updatePaymentSettings(settings: Partial<PaymentSettings>): PaymentSettings {
    this.data.payment_settings = {
      ...this.getPaymentSettings(),
      ...settings,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.payment_settings;
  }

  // --- Transactions ---
  generateTransactionId(): string {
    if (!this.data.transaction_counter) {
      this.data.transaction_counter = 100;
    }
    this.data.transaction_counter += 1;
    const num = this.data.transaction_counter.toString().padStart(6, '0');
    this.save();
    return `TXN-${num}`;
  }

  getTransactions(): Transaction[] {
    if (!this.data.transactions) {
      this.data.transactions = [];
    }
    return [...this.data.transactions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getTransactionById(id: string): Transaction | undefined {
    return (this.data.transactions || []).find(t => t.id === id);
  }

  getTransactionByRazorpayOrderId(orderId: string): Transaction | undefined {
    return (this.data.transactions || []).find(t => t.razorpay_order_id === orderId);
  }

  createTransaction(txnData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction {
    if (!this.data.transactions) {
      this.data.transactions = [];
    }
    const id = this.generateTransactionId();
    const now = new Date().toISOString();
    const newTxn: Transaction = {
      ...txnData,
      id,
      created_at: now,
      updated_at: now
    };
    this.data.transactions.push(newTxn);
    this.save();
    return newTxn;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    if (!this.data.transactions) return null;
    const idx = this.data.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.transactions[idx] = {
      ...this.data.transactions[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.transactions[idx];
  }

  verifyOrderPaymentByAdmin(orderId: string, adminName: string): { order: Order; transaction?: Transaction } | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    order.order_status = 'Confirmed';
    order.payment_status = 'Paid';
    order.payment_verified_by_admin = true;
    order.admin_verified_at = now;
    order.admin_verified_by = adminName;
    order.updated_at = now;

    let transaction: Transaction | undefined;
    if (this.data.transactions) {
      transaction = this.data.transactions.find(t => t.order_id === orderId || (order.transaction_id && t.id === order.transaction_id));
      if (transaction) {
        transaction.admin_verified = true;
        transaction.admin_verified_at = now;
        transaction.admin_verified_by = adminName;
        transaction.updated_at = now;
      }
    }

    this.save();
    return { order, transaction };
  }

  // --- Contact Inquiries ---
  getContactMessages(): ContactMessage[] {
    if (!this.data.contact_messages) {
      this.data.contact_messages = [];
    }
    return [...this.data.contact_messages].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  createContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at'>): ContactMessage {
    if (!this.data.contact_messages) {
      this.data.contact_messages = [];
    }
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg_' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString()
    };
    this.data.contact_messages.push(newMsg);
    this.save();
    return newMsg;
  }

  // --- Support Queries / Customer Helpdesk ---
  generateTicketNumber(): string {
    if (!this.data.query_counter) {
      this.data.query_counter = 1000;
    }
    this.data.query_counter += 1;
    this.save();
    return `TKT-${this.data.query_counter}`;
  }

  getSupportQueries(filter?: { user_id?: string; email?: string }): SupportQuery[] {
    if (!this.data.support_queries) {
      this.data.support_queries = [];
    }
    let queries = [...this.data.support_queries];
    if (filter?.user_id || filter?.email) {
      queries = queries.filter(q => {
        const matchesUser = filter.user_id && q.user_id === filter.user_id;
        const matchesEmail = filter.email && q.email.toLowerCase() === filter.email.toLowerCase();
        return matchesUser || matchesEmail;
      });
    }
    return queries.sort(
      (a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
    );
  }

  getSupportQueryById(id: string): SupportQuery | undefined {
    if (!this.data.support_queries) {
      this.data.support_queries = [];
    }
    return this.data.support_queries.find(q => q.id === id);
  }

  createSupportQuery(data: {
    user_id?: string;
    name: string;
    email: string;
    phone?: string;
    enquiry_type: string;
    subject?: string;
    initial_message: string;
  }): SupportQuery {
    if (!this.data.support_queries) {
      this.data.support_queries = [];
    }
    const ticketId = this.generateTicketNumber();
    const now = new Date().toISOString();

    // Check if user exists by email if user_id was not provided
    let userId = data.user_id;
    if (!userId && data.email) {
      const existingUser = this.getUserByEmail(data.email);
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    const firstReply: QueryReply = {
      id: 'rep_' + crypto.randomUUID().slice(0, 8),
      sender: 'user',
      sender_name: data.name,
      message: data.initial_message,
      created_at: now
    };

    const newQuery: SupportQuery = {
      id: ticketId,
      user_id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      enquiry_type: data.enquiry_type || 'General Support',
      subject: data.subject || `${data.enquiry_type} Inquiry`,
      status: 'Open',
      created_at: now,
      updated_at: now,
      messages: [firstReply]
    };

    this.data.support_queries.push(newQuery);
    this.save();
    return newQuery;
  }

  addReplyToSupportQuery(
    queryId: string,
    reply: { sender: 'user' | 'admin'; sender_name: string; message: string }
  ): SupportQuery | null {
    if (!this.data.support_queries) {
      this.data.support_queries = [];
    }
    const q = this.data.support_queries.find(item => item.id === queryId);
    if (!q) return null;

    const now = new Date().toISOString();
    const newReply: QueryReply = {
      id: 'rep_' + crypto.randomUUID().slice(0, 8),
      sender: reply.sender,
      sender_name: reply.sender_name,
      message: reply.message,
      created_at: now
    };

    q.messages.push(newReply);
    q.updated_at = now;
    if (reply.sender === 'admin' && q.status === 'Open') {
      q.status = 'In Progress';
    }
    this.save();
    return q;
  }

  updateSupportQueryStatus(queryId: string, status: SupportQuery['status']): SupportQuery | null {
    if (!this.data.support_queries) {
      this.data.support_queries = [];
    }
    const q = this.data.support_queries.find(item => item.id === queryId);
    if (!q) return null;
    q.status = status;
    q.updated_at = new Date().toISOString();
    this.save();
    return q;
  }

  // --- Stores & Locations (Requirement 2) ---
  getStores(activeOnly = false): StoreLocation[] {
    if (!this.data.stores || this.data.stores.length === 0) {
      this.data.stores = getInitialStores();
      this.save();
    }
    if (activeOnly) {
      return this.data.stores.filter(s => s.is_active);
    }
    return [...this.data.stores];
  }

  getStoreById(id: string): StoreLocation | undefined {
    return this.getStores().find(s => s.id === id);
  }

  createStore(storeData: Omit<StoreLocation, 'id' | 'created_at' | 'updated_at'>): StoreLocation {
    if (!this.data.stores) {
      this.data.stores = getInitialStores();
    }
    const now = new Date().toISOString();
    const newStore: StoreLocation = {
      ...storeData,
      id: 'loc-' + crypto.randomUUID().slice(0, 8),
      created_at: now,
      updated_at: now
    };
    this.data.stores.push(newStore);
    this.save();
    return newStore;
  }

  updateStore(id: string, updates: Partial<StoreLocation>): StoreLocation | null {
    if (!this.data.stores) {
      this.data.stores = getInitialStores();
    }
    const idx = this.data.stores.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.stores[idx] = {
      ...this.data.stores[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.stores[idx];
  }

  deleteStore(id: string): boolean {
    if (!this.data.stores) return false;
    const initialLen = this.data.stores.length;
    this.data.stores = this.data.stores.filter(s => s.id !== id);
    if (this.data.stores.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  getAdminsForStore(storeId: string): UserProfile[] {
    return this.data.users.filter(u =>
      (u.role === 'admin' || u.role === 'super_admin') &&
      u.assigned_store_ids &&
      u.assigned_store_ids.includes(storeId)
    );
  }
}

export const db = new Database();
