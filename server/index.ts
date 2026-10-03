import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { db } from './db';
import {
  sendOrderEmails,
  resendOrderEmail,
  sendTestEmail,
  sendContactInquiryEmail,
  sendCustomUserEmail,
  sendEmailOtp,
  sendWelcomeEmail,
  sendOrderStatusEmail,
  sendQueryAcknowledgmentEmail,
  sendQueryReplyEmail
} from './email';
import { createSessionToken, verifySessionToken } from './session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory store for email verification OTPs (10-minute expiry)
interface OtpRecord {
  otp: string;
  expires_at: number;
  payload?: any;
  type: 'login' | 'register';
}
const otpStore = new Map<string, OtpRecord>();

// ==========================================
// ADMIN AUTHENTICATION MIDDLEWARES
// ==========================================
function requireAdmin(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  const user = db.getUserById(session.uid);
  if (!user) {
    return res.status(401).json({ error: 'User account no longer exists.' });
  }

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return res.status(403).json({ error: '403 Unauthorized: Administrative privileges required' });
  }

  (req as any).adminUser = user;
  next();
}

function requireSuperAdmin(req: Request, res: Response, next: any) {
  requireAdmin(req, res, () => {
    const adminUser = (req as any).adminUser;
    if (adminUser?.role !== 'super_admin') {
      return res.status(403).json({ error: '403 Unauthorized: Super Admin privileges required' });
    }
    next();
  });
}

// Serve uploaded files statically
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    cb(null, `${cleanBase}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, WEBP and SVG images are allowed'));
    }
  }
});

// ==========================================
// 1. HEALTH & INFO
// ==========================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: db.getStoreSettings().store_name,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. AUTHENTICATION & PROFILES
// ==========================================
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const emailSettings = db.getEmailSettings();
    if (emailSettings.enable_otp_register) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(cleanEmail, {
        otp,
        expires_at: Date.now() + 10 * 60 * 1000,
        payload: { email: cleanEmail, password, full_name, phone },
        type: 'register'
      });

      sendEmailOtp({
        to: cleanEmail,
        name: full_name,
        otp,
        type: 'register'
      }).catch(err => console.error('Failed to dispatch register OTP:', err));

      return res.json({
        otp_required: true,
        email: cleanEmail,
        message: 'A 6-digit verification code has been dispatched to your email.'
      });
    }

    const password_hash = crypto.createHash('sha256').update(password).digest('hex');
    const user = db.createUser({
      email: cleanEmail,
      full_name,
      phone: phone || '',
      role: 'customer',
      password_hash
    });

    if (emailSettings.notify_customer_welcome !== false) {
      sendWelcomeEmail({ to: user.email, name: user.full_name }).catch(err =>
        console.error('Failed to send welcome email:', err)
      );
    }

    const { password_hash: _, ...safeUser } = user;
    return res.status(201).json({
      user: safeUser,
      token: createSessionToken(user)
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to create user account' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password_hash !== inputHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const emailSettings = db.getEmailSettings();
    // Only customers require OTP if enabled in settings (admins can sign in directly or via OTP)
    if (emailSettings.enable_otp_login && user.role === 'customer') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(cleanEmail, {
        otp,
        expires_at: Date.now() + 10 * 60 * 1000,
        payload: { userId: user.id },
        type: 'login'
      });

      sendEmailOtp({
        to: user.email,
        name: user.full_name,
        otp,
        type: 'login'
      }).catch(err => console.error('Failed to dispatch login OTP:', err));

      return res.json({
        otp_required: true,
        email: user.email,
        message: 'A 6-digit verification code has been dispatched to your email.'
      });
    }

    const { password_hash: _, ...safeUser } = user;
    return res.json({ user: safeUser, token: createSessionToken(user) });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp, type } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    const record = otpStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ error: 'No active verification code found for this email. Please request a new one.' });
    }

    if (Date.now() > record.expires_at) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (record.otp !== cleanOtp) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    otpStore.delete(cleanEmail);

    if (record.type === 'register') {
      const { email: regEmail, password, full_name, phone } = record.payload;
      const password_hash = crypto.createHash('sha256').update(password).digest('hex');
      const user = db.createUser({
        email: regEmail,
        full_name,
        phone: phone || '',
        role: 'customer',
        password_hash
      });

      const emailSettings = db.getEmailSettings();
      if (emailSettings.notify_customer_welcome !== false) {
        sendWelcomeEmail({ to: user.email, name: user.full_name }).catch(err =>
          console.error('Failed to send welcome email:', err)
        );
      }

      const { password_hash: _, ...safeUser } = user;
      return res.status(201).json({
        user: safeUser,
        token: createSessionToken(user),
        message: 'Account verified successfully!'
      });
    } else {
      const user = db.getUserById(record.payload.userId);
      if (!user) {
        return res.status(404).json({ error: 'User account not found' });
      }
      const { password_hash: _, ...safeUser } = user;
      return res.json({
        user: safeUser,
        token: createSessionToken(user),
        message: 'Signed in successfully!'
      });
    }
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ error: 'Failed to verify code' });
  }
});

app.post('/api/auth/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = otpStore.get(cleanEmail);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let name = 'Customer';
    if (type === 'login') {
      const user = db.getUserByEmail(cleanEmail);
      if (!user) return res.status(404).json({ error: 'User not found' });
      name = user.full_name;
      otpStore.set(cleanEmail, {
        otp,
        expires_at: Date.now() + 10 * 60 * 1000,
        payload: { userId: user.id },
        type: 'login'
      });
    } else {
      if (existing) {
        name = existing.payload?.full_name || 'Customer';
        existing.otp = otp;
        existing.expires_at = Date.now() + 10 * 60 * 1000;
      } else {
        return res.status(400).json({ error: 'Registration session expired. Please fill the registration form again.' });
      }
    }

    await sendEmailOtp({ to: cleanEmail, name, otp, type: type || 'login' });
    return res.json({ success: true, message: 'New verification code dispatched to your email.' });
  } catch (err: any) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ error: 'Failed to resend code' });
  }
});

app.post('/api/auth/google', (req: Request, res: Response) => {
  try {
    const { email, full_name, google_id, avatar_url } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google authentication' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.getUserByEmail(cleanEmail);

    if (user) {
      // Safe account linking:
      // GOOGLE USERS MUST NOT BECOME ADMINS.
      // If user is already a customer, role stays 'customer'.
      // If user was created prior, link google_id & avatar_url safely without altering administrative role.
      const updates: Partial<UserProfile> = {
        google_id: google_id || user.google_id || 'goog_' + crypto.randomUUID().slice(0, 10),
        avatar_url: avatar_url || user.avatar_url,
        auth_provider: user.password_hash ? 'both' : 'google'
      };
      if (!user.full_name && full_name) {
        updates.full_name = full_name;
      }
      user = db.updateUser(user.id, updates)!;
    } else {
      // Create new customer account:
      // STRICT REQUIREMENT: Role is ALWAYS 'customer'. Never admin or super_admin!
      const newCustomer: Omit<UserProfile, 'id' | 'created_at'> = {
        email: cleanEmail,
        full_name: full_name || cleanEmail.split('@')[0],
        phone: '',
        role: 'customer',
        google_id: google_id || 'goog_' + crypto.randomUUID().slice(0, 10),
        avatar_url: avatar_url || '',
        auth_provider: 'google'
      };
      user = db.createUser(newCustomer);
    }

    const { password_hash: _, ...safeUser } = user;
    return res.json({
      user: safeUser,
      token: createSessionToken(user)
    });
  } catch (err: any) {
    console.error('Google auth error:', err);
    return res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

// Session Verification Endpoint
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'No active session token provided.' });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  const user = db.getUserById(session.uid);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  const { password_hash: _, ...safeUser } = user;
  return res.json({ user: safeUser, valid: true });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  const session = verifySessionToken(token);
  if (!session) return res.status(401).json({ error: 'Session expired or invalid' });

  const user = db.getUserById(session.uid);
  if (!user) return res.status(404).json({ error: 'User account not found' });

  const { full_name, phone } = req.body;
  const updates: Partial<UserProfile> = {};
  if (full_name && typeof full_name === 'string' && full_name.trim()) {
    updates.full_name = full_name.trim();
  }
  if (phone !== undefined && typeof phone === 'string') {
    updates.phone = phone.trim();
  }

  const updated = db.updateUser(user.id, updates);
  if (!updated) return res.status(500).json({ error: 'Failed to update profile' });

  const { password_hash: _, ...safeUser } = updated;
  return res.json({ user: safeUser, message: 'Profile updated successfully' });
});

// ==========================================
// 3. CATEGORIES
// ==========================================
app.get('/api/categories', (req: Request, res: Response) => {
  const onlyActive = req.query.onlyActive === 'true';
  const categories = db.getCategories(onlyActive);
  res.json(categories);
});

app.post('/api/categories', (req: Request, res: Response) => {
  try {
    const { name, slug, description, image_url, sort_order, is_active } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cat = db.createCategory({
      name,
      slug: cleanSlug,
      description: description || '',
      image_url: image_url || '/assets/cat_fresh_produce.webp',
      sort_order: sort_order !== undefined ? Number(sort_order) : 10,
      is_active: is_active !== undefined ? Boolean(is_active) : true
    });
    return res.status(201).json(cat);
  } catch (err: any) {
    console.error('Create category error:', err);
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Category not found' });
  }
  return res.json({ success: true, message: 'Category deleted successfully' });
});

// ==========================================
// 4. PRODUCTS (Real Database — starts 0 products)
// ==========================================
app.get('/api/products', (req: Request, res: Response) => {
  const { category_id, category_slug, status, search, brand, is_featured } = req.query;
  const products = db.getProducts({
    category_id: category_id as string,
    category_slug: category_slug as string,
    status: status as string,
    search: search as string,
    brand: brand as string,
    is_featured: is_featured ? is_featured === 'true' : undefined
  });
  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      category_id,
      brand,
      sku,
      price,
      discount_price,
      unit,
      weight_quantity,
      stock_quantity,
      low_stock_threshold,
      image_url,
      additional_images,
      badge,
      dietary_tags,
      status,
      is_featured
    } = req.body;

    if (!name || price === undefined || !unit || !image_url) {
      return res.status(400).json({ error: 'Name, price, unit, and product image are required' });
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = db.createProduct({
      name,
      slug: cleanSlug,
      description: description || '',
      category_id: category_id || '',
      brand: brand || 'VillageDELI Fresh',
      sku: sku || 'VDL-' + Math.floor(100000 + Math.random() * 900000),
      price: Number(price),
      discount_price: discount_price ? Number(discount_price) : null,
      unit: unit || '1 unit',
      weight_quantity: weight_quantity || unit,
      stock_quantity: Number(stock_quantity || 0),
      low_stock_threshold: Number(low_stock_threshold || 5),
      image_url,
      additional_images: Array.isArray(additional_images) ? additional_images : [],
      badge: badge || null,
      dietary_tags: Array.isArray(dietary_tags) ? dietary_tags : [],
      status: status || 'published',
      is_featured: Boolean(is_featured)
    });

    return res.status(201).json(newProduct);
  } catch (err: any) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const soft = req.query.permanent !== 'true';
  const success = db.deleteProduct(req.params.id, soft);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ success: true, message: 'Product removed' });
});

// ==========================================
// 5. FILE UPLOAD (Local and Cloud Ready)
// ==========================================
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: publicUrl, filename: req.file.filename });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// ==========================================
// 6. ADDRESSES
// ==========================================
app.get('/api/addresses', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const addresses = db.getAddresses(userId);
  return res.json(addresses);
});

app.post('/api/addresses', (req: Request, res: Response) => {
  try {
    const {
      user_id,
      full_name,
      phone,
      house_flat,
      building_street,
      area_locality,
      city,
      state,
      pincode,
      landmark,
      address_type,
      is_default
    } = req.body;

    if (!user_id || !full_name || !phone || !house_flat || !area_locality || !city || !pincode) {
      return res.status(400).json({ error: 'All mandatory address fields must be provided' });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: 'PIN code must be a valid 6-digit Indian postal code' });
    }

    const addr = db.createAddress({
      user_id,
      full_name,
      phone,
      house_flat,
      building_street: building_street || '',
      area_locality,
      city,
      state: state || 'Haryana',
      pincode,
      landmark: landmark || '',
      address_type: address_type || 'Home',
      is_default: Boolean(is_default)
    });

    return res.status(201).json(addr);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save address' });
  }
});

app.put('/api/addresses/:id', (req: Request, res: Response) => {
  const updated = db.updateAddress(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Address not found' });
  return res.json(updated);
});

app.delete('/api/addresses/:id', (req: Request, res: Response) => {
  const success = db.deleteAddress(req.params.id);
  if (!success) return res.status(404).json({ error: 'Address not found' });
  return res.json({ success: true });
});

// ==========================================
// 7. ORDERS & CHECKOUT (Server-side recalculation & email)
// ==========================================
app.get('/api/orders', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const orders = db.getOrders(userId);
  return res.json(orders);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});
// Helper to validate and calculate order pricing & stock
function validateAndCalculateOrder(body: any) {
  const {
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    items,
    notes,
    delivery_type,
    pickup_store_id,
    pickup_store_name,
    pickup_store_address,
    pickup_store_phone,
    nearest_store_id,
    nearest_store_name
  } = body;

  const isPickup = delivery_type === 'pickup';

  // 1. Customer validation
  if (!customer_name || !customer_phone) {
    return { error: 'Customer name and phone number are required', status: 400 };
  }

  let finalDeliveryAddress = delivery_address;
  let cleanPincode = '';

  if (isPickup) {
    if (!pickup_store_id) {
      return { error: 'Please select a store location for pickup', status: 400 };
    }
    const store = db.getStoreById(pickup_store_id);
    if (!store) {
      return { error: 'Selected pickup store was not found', status: 400 };
    }
    cleanPincode = store.pincode ? String(store.pincode).trim() : '122001';
    finalDeliveryAddress = {
      house_flat: 'Store Pickup',
      road_area: store.name + (store.badge ? ` (${store.badge})` : ''),
      landmark: store.address,
      city: store.city || 'Gurugram',
      state: store.state || 'Haryana',
      pincode: cleanPincode,
      address_type: 'Other'
    };
  } else {
    // 2. Delivery address validation
    if (!delivery_address || !delivery_address.house_flat || !delivery_address.pincode) {
      return { error: 'Complete delivery address is required for doorstep delivery', status: 400 };
    }

    // 3. PIN code validation
    cleanPincode = String(delivery_address.pincode).trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return { error: 'Pincode must be exactly 6 numeric digits', status: 400 };
    }

    const storeSettings = db.getStoreSettings();
    if (
      storeSettings.serviceable_pincodes &&
      storeSettings.serviceable_pincodes.length > 0 &&
      !storeSettings.serviceable_pincodes.includes(cleanPincode)
    ) {
      return {
        error: `Sorry, delivery is currently unavailable in area PIN ${cleanPincode}. Serviceable PIN codes include: ${storeSettings.serviceable_pincodes.join(', ')}`,
        status: 400
      };
    }

    finalDeliveryAddress = {
      ...delivery_address,
      pincode: cleanPincode
    };
  }

  // 4. Cart items validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { error: 'Cart is empty. Please add products to order.', status: 400 };
  }

  // 5. Products, prices and stock verification
  let serverSubtotal = 0;
  const verifiedItems: any[] = [];

  for (const item of items) {
    const product = db.getProductById(item.product_id);
    if (!product) {
      return {
        error: `Product "${item.product_name || item.product_id}" is no longer available in catalog.`,
        status: 400
      };
    }

    if (product.status !== 'published') {
      return {
        error: `Product "${product.name}" is currently unavailable.`,
        status: 400
      };
    }

    const reqQty = Number(item.quantity) || 1;
    if (reqQty <= 0) {
      return { error: 'Invalid quantity', status: 400 };
    }

    let price = product.discount_price !== null && product.discount_price !== undefined
      ? product.discount_price
      : product.price;
    let variantName = item.variant_name || item.selected_variant?.name || '';
    let variantId = item.variant_id || item.selected_variant?.id || '';

    if (variantId || variantName) {
      const variant = product.variants?.find(
        v => (variantId && v.id === variantId) || (variantName && v.name === variantName)
      );
      if (variant) {
        variantName = variant.name;
        variantId = variant.id;
        price = variant.price;
        if (variant.stock_quantity < reqQty) {
          return {
            error: `Insufficient stock for "${product.name} (${variant.name})". Only ${variant.stock_quantity} left in stock.`,
            status: 400
          };
        }
      } else {
        if (product.stock_quantity < reqQty) {
          return {
            error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} left in stock.`,
            status: 400
          };
        }
      }
    } else {
      if (product.stock_quantity < reqQty) {
        return {
          error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} left in stock.`,
          status: 400
        };
      }
    }

    const itemSubtotal = price * reqQty;
    serverSubtotal += itemSubtotal;

    verifiedItems.push({
      id: 'itm_' + crypto.randomUUID().slice(0, 8),
      order_id: '',
      product_id: product.id,
      product_name: product.name,
      product_price: price,
      product_unit: variantName ? `${variantName}` : product.unit,
      product_image: product.image_url,
      quantity: reqQty,
      subtotal: itemSubtotal,
      variant_name: variantName,
      variant_id: variantId
    });
  }

  const storeSettings = db.getStoreSettings();

  // Minimum order value check
  if (storeSettings.min_order_value && serverSubtotal < storeSettings.min_order_value) {
    return {
      error: `Minimum order value is ₹${storeSettings.min_order_value}. Current subtotal is ₹${serverSubtotal}.`,
      status: 400
    };
  }

  // Delivery charge calculation: FREE for Store Pickup!
  let deliveryFee = 0;
  if (!isPickup) {
    deliveryFee = storeSettings.delivery_fee || 30;
    if (storeSettings.free_delivery_threshold && serverSubtotal >= storeSettings.free_delivery_threshold) {
      deliveryFee = 0;
    }
  }

  const finalTotal = serverSubtotal + deliveryFee;

  let chosenStore = pickup_store_id ? db.getStoreById(pickup_store_id) : (nearest_store_id ? db.getStoreById(nearest_store_id) : undefined);

  return {
    user_id,
    customer_name,
    customer_email: customer_email || '',
    customer_phone,
    delivery_address: finalDeliveryAddress,
    cleanPincode,
    serverSubtotal,
    deliveryFee,
    finalTotal,
    verifiedItems,
    notes: notes || '',
    delivery_type: isPickup ? ('pickup' as const) : ('delivery' as const),
    pickup_store_id: isPickup ? pickup_store_id : undefined,
    pickup_store_name: isPickup ? (pickup_store_name || chosenStore?.name) : undefined,
    pickup_store_address: isPickup ? (pickup_store_address || chosenStore?.address) : undefined,
    pickup_store_phone: isPickup ? (pickup_store_phone || chosenStore?.phone) : undefined,
    nearest_store_id: nearest_store_id || (isPickup ? pickup_store_id : undefined),
    nearest_store_name: nearest_store_name || (isPickup ? (pickup_store_name || chosenStore?.name) : chosenStore?.name)
  };
}

// 7.1 Cash on Delivery Order Placement
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const calc = validateAndCalculateOrder(req.body);
    if ('error' in calc) {
      return res.status(calc.status || 400).json({ error: calc.error });
    }

    const paySettings = db.getPaymentSettings();
    if (!paySettings.cod_enabled) {
      return res.status(400).json({
        error: 'Cash on Delivery is currently disabled by store management. Please select Razorpay online payment.'
      });
    }

    const createdOrder = db.createOrder({
      user_id: calc.user_id || undefined,
      customer_name: calc.customer_name,
      customer_email: calc.customer_email,
      customer_phone: calc.customer_phone,
      delivery_address: calc.delivery_address,
      subtotal: calc.serverSubtotal,
      delivery_fee: calc.deliveryFee,
      total_amount: calc.finalTotal,
      payment_method: 'COD',
      payment_status: 'Pending',
      order_status: 'Placed',
      estimated_delivery: calc.delivery_type === 'pickup' ? 'Ready in 20–30 mins' : '30–60 mins',
      notes: calc.notes,
      items: calc.verifiedItems,
      delivery_type: calc.delivery_type,
      pickup_store_id: calc.pickup_store_id,
      pickup_store_name: calc.pickup_store_name,
      pickup_store_address: calc.pickup_store_address,
      pickup_store_phone: calc.pickup_store_phone,
      nearest_store_id: calc.nearest_store_id,
      nearest_store_name: calc.nearest_store_name
    });

    for (const it of createdOrder.items) {
      it.order_id = createdOrder.id;
    }

    // Record Transaction for COD
    const txn = db.createTransaction({
      order_id: createdOrder.id,
      user_id: calc.user_id || undefined,
      customer_name: calc.customer_name,
      customer_email: calc.customer_email,
      customer_phone: calc.customer_phone,
      amount: calc.finalTotal,
      currency: 'INR',
      payment_gateway: 'cod',
      payment_status: 'Pending',
      admin_verified: false
    });
    createdOrder.transaction_id = txn.id;

    // Send confirmation emails in background
    sendOrderEmails(createdOrder).catch(err => console.error('Order email error:', err));

    return res.status(201).json(createdOrder);
  } catch (err: any) {
    console.error('Place order exception:', err);
    return res.status(500).json({
      error: 'Something went wrong while placing your order. Your cart has been preserved. Please try again.'
    });
  }
});

// ==========================================
// 7.2 RAZORPAY PAYMENT GATEWAY INTEGRATION
// ==========================================

// Create a Razorpay Order (pre-payment, does NOT place store order yet)
app.post('/api/payment/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const paySettings = db.getPaymentSettings();
    if (!paySettings.razorpay_enabled) {
      return res.status(400).json({
        error: 'Razorpay online payment is currently disabled in store settings. Please select Cash on Delivery or contact store support.'
      });
    }

    const keyId = paySettings.razorpay_key_id ? paySettings.razorpay_key_id.trim() : '';
    const keySecret = paySettings.razorpay_key_secret ? paySettings.razorpay_key_secret.trim() : '';

    if (!keyId || !keySecret) {
      return res.status(400).json({
        error: 'Razorpay API Key ID and Secret are not configured yet in Admin Settings. Please configure Razorpay keys in the Admin Panel.'
      });
    }

    const calc = validateAndCalculateOrder(req.body);
    if ('error' in calc) {
      return res.status(calc.status || 400).json({ error: calc.error });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const amountInPaise = Math.round(calc.finalTotal * 100);
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        customer_name: calc.customer_name,
        customer_phone: calc.customer_phone,
        pincode: calc.cleanPincode
      }
    });

    // Create a pending transaction record
    const txn = db.createTransaction({
      user_id: calc.user_id || undefined,
      customer_name: calc.customer_name,
      customer_email: calc.customer_email,
      customer_phone: calc.customer_phone,
      amount: calc.finalTotal,
      currency: 'INR',
      payment_gateway: 'razorpay',
      payment_status: 'Pending',
      razorpay_order_id: rzpOrder.id,
      admin_verified: false
    });

    return res.json({
      razorpay_order_id: rzpOrder.id,
      amount: rzpOrder.amount, // in paise
      amount_in_rupees: calc.finalTotal,
      currency: rzpOrder.currency,
      key_id: keyId,
      transaction_id: txn.id,
      store_name: db.getStoreSettings().store_name,
      customer_name: calc.customer_name,
      customer_email: calc.customer_email,
      customer_phone: calc.customer_phone
    });
  } catch (err: any) {
    console.error('Razorpay create order error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to initiate Razorpay transaction. Please verify API keys and network connection.'
    });
  }
});

// Verify Payment Signature and Place Order upon confirmed payment
app.post('/api/payment/razorpay/verify-and-place-order', async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transaction_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Incomplete payment credentials received from gateway. Payment verification failed.'
      });
    }

    const paySettings = db.getPaymentSettings();
    const keySecret = (paySettings.razorpay_key_secret || '').trim();

    if (!keySecret) {
      return res.status(500).json({
        error: 'Razorpay Key Secret is missing in store configuration.'
      });
    }

    // 1. Verify Razorpay HMAC SHA256 Signature (Requirement 1 & 4)
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('[Razorpay Security] Signature mismatch!', { expectedSignature, razorpay_signature });
      if (transaction_id) {
        db.updateTransaction(transaction_id, {
          payment_status: 'Failed',
          error_code: 'SIGNATURE_VERIFICATION_FAILED',
          error_description: 'Payment signature mismatch. Transaction authentication rejected.',
          razorpay_payment_id,
          razorpay_signature
        });
      }
      // CRITICAL: DO NOT PLACE ORDER ON PAYMENT FAILURE (Requirement 4)
      return res.status(400).json({
        error: 'Invalid payment signature. Payment verification failed and order was NOT placed.'
      });
    }

    // 2. Validate order items, stock, and calculate pricing
    const calc = validateAndCalculateOrder(req.body);
    if ('error' in calc) {
      return res.status(calc.status || 400).json({ error: calc.error });
    }

    // 3. Determine order status based on Admin Verification Requirement (Requirement 2):
    // If require_admin_verification is TRUE: order status is 'Placed' and payment_verified_by_admin = false
    // If require_admin_verification is FALSE: order status is 'Confirmed' and payment_verified_by_admin = true
    const requireAdminVerification = Boolean(paySettings.require_admin_verification);
    const initialOrderStatus: Order['order_status'] = requireAdminVerification ? 'Placed' : 'Confirmed';
    const isPaymentVerifiedByAdmin = !requireAdminVerification;

    // 4. Create Order in Database (decrements stock)
    const createdOrder = db.createOrder({
      user_id: calc.user_id || undefined,
      customer_name: calc.customer_name,
      customer_email: calc.customer_email,
      customer_phone: calc.customer_phone,
      delivery_address: calc.delivery_address,
      subtotal: calc.serverSubtotal,
      delivery_fee: calc.deliveryFee,
      total_amount: calc.finalTotal,
      payment_method: 'Razorpay',
      payment_status: 'Paid',
      order_status: initialOrderStatus,
      estimated_delivery: calc.delivery_type === 'pickup' ? 'Ready in 20–30 mins' : '30–45 mins',
      notes: calc.notes,
      items: calc.verifiedItems,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transaction_id: transaction_id || undefined,
      payment_verified_by_admin: isPaymentVerifiedByAdmin,
      admin_verified_at: isPaymentVerifiedByAdmin ? new Date().toISOString() : undefined,
      admin_verified_by: isPaymentVerifiedByAdmin ? 'System Auto-Confirmed' : undefined,
      delivery_type: calc.delivery_type,
      pickup_store_id: calc.pickup_store_id,
      pickup_store_name: calc.pickup_store_name,
      pickup_store_address: calc.pickup_store_address,
      pickup_store_phone: calc.pickup_store_phone,
      nearest_store_id: calc.nearest_store_id,
      nearest_store_name: calc.nearest_store_name
    });

    for (const it of createdOrder.items) {
      it.order_id = createdOrder.id;
    }

    // 5. Update or link Transaction
    if (transaction_id) {
      db.updateTransaction(transaction_id, {
        order_id: createdOrder.id,
        payment_status: 'Paid',
        razorpay_payment_id,
        razorpay_signature,
        admin_verified: isPaymentVerifiedByAdmin,
        admin_verified_at: isPaymentVerifiedByAdmin ? new Date().toISOString() : undefined,
        admin_verified_by: isPaymentVerifiedByAdmin ? 'System Auto-Confirmed' : undefined
      });
    } else {
      const txn = db.createTransaction({
        order_id: createdOrder.id,
        user_id: calc.user_id || undefined,
        customer_name: calc.customer_name,
        customer_email: calc.customer_email,
        customer_phone: calc.customer_phone,
        amount: calc.finalTotal,
        currency: 'INR',
        payment_gateway: 'razorpay',
        payment_status: 'Paid',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        admin_verified: isPaymentVerifiedByAdmin,
        admin_verified_at: isPaymentVerifiedByAdmin ? new Date().toISOString() : undefined,
        admin_verified_by: isPaymentVerifiedByAdmin ? 'System Auto-Confirmed' : undefined
      });
      createdOrder.transaction_id = txn.id;
    }

    // 6. Send confirmation emails in background
    sendOrderEmails(createdOrder).catch(e => console.error('Email dispatch error on Razorpay order:', e));

    return res.status(201).json({
      order: createdOrder,
      verified: true,
      require_admin_verification: requireAdminVerification
    });
  } catch (err: any) {
    console.error('Razorpay verify order exception:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while verifying your payment. Please contact customer support with your payment ID.'
    });
  }
});

// Record Payment Failure or Cancellation (Creates Cancelled Order record in history without decrementing stock)
app.post('/api/payment/razorpay/record-failure', (req: Request, res: Response) => {
  try {
    const {
      transaction_id,
      razorpay_order_id,
      razorpay_payment_id,
      error_code,
      error_description,
      customer_name,
      delivery_address,
      items
    } = req.body;

    const failureReason = error_description || 'Payment was cancelled or could not be completed.';

    // 1. Update or create failed Transaction
    let linkedTxnId = transaction_id;
    if (transaction_id) {
      db.updateTransaction(transaction_id, {
        payment_status: 'Failed',
        razorpay_payment_id: razorpay_payment_id || undefined,
        error_code: error_code || 'PAYMENT_FAILED',
        error_description: failureReason
      });
    } else if (razorpay_order_id) {
      const txn = db.getTransactionByRazorpayOrderId(razorpay_order_id);
      if (txn) {
        linkedTxnId = txn.id;
        db.updateTransaction(txn.id, {
          payment_status: 'Failed',
          razorpay_payment_id: razorpay_payment_id || undefined,
          error_code: error_code || 'PAYMENT_FAILED',
          error_description: failureReason
        });
      }
    }

    // 2. If order payload details were provided, record a Cancelled order for customer history (Requirement 3)
    let createdCancelledOrder: any = null;
    if (customer_name && delivery_address && items && Array.isArray(items) && items.length > 0) {
      const calc = validateAndCalculateOrder(req.body);
      if (!('error' in calc)) {
        createdCancelledOrder = db.createOrder({
          user_id: calc.user_id || undefined,
          customer_name: calc.customer_name,
          customer_email: calc.customer_email,
          customer_phone: calc.customer_phone,
          delivery_address: calc.delivery_address,
          subtotal: calc.serverSubtotal,
          delivery_fee: calc.deliveryFee,
          total_amount: calc.finalTotal,
          payment_method: 'Razorpay',
          payment_status: 'Failed',
          order_status: 'Cancelled',
          cancellation_reason: failureReason,
          estimated_delivery: 'Cancelled',
          notes: calc.notes || '',
          items: calc.verifiedItems,
          customer_email_status: 'pending',
          admin_email_status: 'pending',
          razorpay_order_id: razorpay_order_id || undefined,
          razorpay_payment_id: razorpay_payment_id || undefined,
          transaction_id: linkedTxnId || undefined
        });

        if (linkedTxnId) {
          db.updateTransaction(linkedTxnId, { order_id: createdCancelledOrder.id });
        }
      }
    }

    return res.json({
      success: true,
      recorded: true,
      order: createdCancelledOrder
    });
  } catch (err: any) {
    console.error('Record payment failure error:', err);
    return res.status(500).json({ error: 'Failed to record payment failure' });
  }
});

// Admin Payment Verification for Orders (Requirement 2)
app.post('/api/admin/orders/:id/verify-payment', requireAdmin, (req: Request, res: Response) => {
  const adminUser = (req as any).adminUser;
  const result = db.verifyOrderPaymentByAdmin(req.params.id, adminUser?.full_name || 'Administrator');
  if (!result) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Send / update order notification
  sendOrderEmails(result.order).catch(e => console.error('Verification email error:', e));

  return res.json({
    success: true,
    message: 'Payment manually verified and order confirmed successfully.',
    order: result.order,
    transaction: result.transaction
  });
});

// Admin Transactions Management (Requirement 3)
app.get('/api/admin/transactions', requireAdmin, (_req: Request, res: Response) => {
  const transactions = db.getTransactions();
  return res.json(transactions);
});

app.get('/api/admin/transactions/:id', requireAdmin, (req: Request, res: Response) => {
  const txn = db.getTransactionById(req.params.id);
  if (!txn) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  const order = txn.order_id ? db.getOrderById(txn.order_id) : undefined;
  return res.json({ transaction: txn, order });
});

// Payment Gateway Settings APIs (Requirement 1 & 2)
app.get('/api/settings/payment/public', (_req: Request, res: Response) => {
  return res.json(db.getPublicPaymentSettings());
});

app.get('/api/settings/payment', requireAdmin, (_req: Request, res: Response) => {
  return res.json(db.getPaymentSettings());
});

app.put('/api/settings/payment', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updatePaymentSettings(req.body);
  return res.json(updated);
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, cancellation_reason } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  if (cancellation_reason) {
    updated.cancellation_reason = cancellation_reason;
  }

  // Trigger granular status update email if enabled
  const settings = db.getEmailSettings();
  let shouldSendEmail = false;
  if (status === 'Preparing' && settings.notify_customer_order_preparing !== false) shouldSendEmail = true;
  if (status === 'Out for Delivery' && settings.notify_customer_order_out_for_delivery !== false) shouldSendEmail = true;
  if (status === 'Delivered' && settings.notify_customer_order_delivered !== false) shouldSendEmail = true;
  if (status === 'Cancelled' && settings.notify_customer_order_cancelled !== false) shouldSendEmail = true;

  if (shouldSendEmail && updated.customer_email) {
    sendOrderStatusEmail({ order: updated, status }).catch(err =>
      console.error(`Failed to send ${status} email for order ${updated.id}:`, err)
    );
  }

  return res.json(updated);
});

app.post('/api/admin/orders/:id/resend-email', async (req: Request, res: Response) => {
  const { type } = req.body;
  if (!type || (type !== 'customer_order_confirmation' && type !== 'admin_new_order')) {
    return res.status(400).json({ error: 'Valid email type is required' });
  }

  const success = await resendOrderEmail(req.params.id, type);
  return res.json({ success, message: success ? 'Email resent successfully' : 'Email failed to resend' });
});

app.post('/api/admin/email-logs/:id/retry', requireAdmin, async (req: Request, res: Response) => {
  const log = db.getEmailLogs().find(l => l.id === req.params.id);
  if (!log) {
    return res.status(404).json({ error: 'Email log not found' });
  }

  if (log.order_id && log.order_id !== 'TEST-EMAIL') {
    const success = await resendOrderEmail(log.order_id, log.email_type);
    return res.json({ success, message: success ? 'Email retried and dispatched successfully' : 'Retry dispatch failed' });
  } else {
    const result = await sendTestEmail(log.recipient);
    return res.json(result);
  }
});

// ==========================================
// 8. SETTINGS & ANALYTICS
// ==========================================
app.get('/api/settings/store', (_req: Request, res: Response) => {
  res.json(db.getStoreSettings());
});

app.put('/api/settings/store', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateStoreSettings(req.body);
  res.json(updated);
});

app.get('/api/settings/email', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getEmailSettings());
});

app.put('/api/settings/email', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateEmailSettings(req.body);
  res.json(updated);
});

app.post('/api/admin/send-test-email', requireAdmin, async (req: Request, res: Response) => {
  const { to } = req.body;
  const targetEmail = to || db.getEmailSettings().admin_notification_email;
  if (!targetEmail) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }
  const result = await sendTestEmail(targetEmail);
  return res.json(result);
});

// Admin Custom Email to ANY User (Requirement 5.1)
app.post('/api/admin/send-custom-email', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { to, subject, message, recipient_name } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Recipient email, subject, and message are required' });
    }
    const result = await sendCustomUserEmail({
      to: to.trim(),
      subject: subject.trim(),
      message: message.trim(),
      recipient_name: recipient_name?.trim()
    });
    return res.json(result);
  } catch (err: any) {
    console.error('Send custom email error:', err);
    return res.status(500).json({ error: err.message || 'Failed to dispatch email' });
  }
});

// Customer Contact Us Form & Support Queries (Requirement 3)
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, enquiry_type, message, user_id } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const cleanEmail = (email || '').trim().toLowerCase();

    // Detect authenticated user from Bearer token if user_id not provided
    let effectiveUserId = user_id;
    if (!effectiveUserId) {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      if (token) {
        const session = verifySessionToken(token);
        if (session) effectiveUserId = session.uid;
      }
    }

    const contactMsg = db.createContactMessage({
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      enquiry_type: enquiry_type || 'General Support',
      message: message.trim()
    });

    // Also create Support Ticket Query thread
    const supportQuery = db.createSupportQuery({
      user_id: effectiveUserId || undefined,
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      enquiry_type: enquiry_type || 'General Support',
      subject: `${enquiry_type || 'Customer'} Inquiry - ${name.trim()}`,
      initial_message: message.trim()
    });

    const settings = db.getEmailSettings();
    // 1. Send instant acknowledgment email to customer if enabled
    if (settings.notify_customer_query_received !== false && cleanEmail) {
      sendQueryAcknowledgmentEmail({ query: supportQuery }).catch(e =>
        console.error('Customer query acknowledgment email error:', e)
      );
    }

    // 2. Notify admin in background if enabled
    if (settings.notify_admin_new_query !== false) {
      sendContactInquiryEmail(contactMsg).catch(e =>
        console.error('Admin contact email dispatch error:', e)
      );
    }

    return res.status(201).json({
      success: true,
      message: `Thank you, ${name}! Your query has been logged (Ticket #${supportQuery.id}). Our team has received your request and will contact you shortly.`,
      id: contactMsg.id,
      ticket_id: supportQuery.id
    });
  } catch (err: any) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Failed to process inquiry. Please try again or call our support line.' });
  }
});

// ==========================================
// 8.1 CUSTOMER SUPPORT QUERIES & TICKETING (Requirement 3)
// ==========================================
app.get('/api/queries', (req: Request, res: Response) => {
  try {
    const { user_id, email, all } = req.query;
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : (req.headers['x-admin-token'] as string);

    const session = token ? verifySessionToken(token) : null;
    const authUser = session ? db.getUserById(session.uid) : null;
    const isAdmin = authUser && (authUser.role === 'admin' || authUser.role === 'super_admin');

    // Admin should see ALL queries unless specifically filtering
    if (isAdmin && !user_id && !email) {
      return res.json(db.getSupportQueries());
    }

    let filterUserId = (user_id as string) || (authUser && !isAdmin ? authUser.id : undefined);
    let filterEmail = (email as string) || (authUser && !isAdmin ? authUser.email : undefined);

    if (!filterUserId && !filterEmail) {
      if (isAdmin) {
        return res.json(db.getSupportQueries());
      }
      return res.json([]);
    }

    return res.json(db.getSupportQueries({ user_id: filterUserId, email: filterEmail }));
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load support queries' });
  }
});

app.get('/api/queries/:id', (req: Request, res: Response) => {
  const query = db.getSupportQueryById(req.params.id);
  if (!query) return res.status(404).json({ error: 'Support query not found' });
  return res.json(query);
});

app.post('/api/queries', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, enquiry_type, subject, message, user_id } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    const query = db.createSupportQuery({
      user_id,
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      enquiry_type: enquiry_type || 'General Support',
      subject: subject || `${enquiry_type || 'Customer'} Inquiry - ${name.trim()}`,
      initial_message: message.trim()
    });

    const settings = db.getEmailSettings();
    if (settings.notify_customer_query_received !== false && cleanEmail) {
      sendQueryAcknowledgmentEmail({ query }).catch(err =>
        console.error('Failed to send query ack email:', err)
      );
    }

    if (settings.notify_admin_new_query !== false) {
      sendContactInquiryEmail({
        id: query.id,
        name: query.name,
        email: query.email,
        phone: query.phone,
        enquiry_type: query.enquiry_type,
        message: message.trim(),
        created_at: query.created_at
      }).catch(err => console.error('Failed to alert admin on query:', err));
    }

    return res.status(201).json(query);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to submit query' });
  }
});

app.post('/api/queries/:id/reply', async (req: Request, res: Response) => {
  try {
    const { message, sender, sender_name } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const query = db.getSupportQueryById(req.params.id);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    const replySender = sender === 'admin' ? 'admin' : 'user';
    const replySenderName = sender_name || (replySender === 'admin' ? 'VillageDELI Support' : query.name);

    const updated = db.addReplyToSupportQuery(req.params.id, {
      sender: replySender,
      sender_name: replySenderName,
      message: message.trim()
    });

    // If admin replied, send email copy to the customer!
    const settings = db.getEmailSettings();
    if (replySender === 'admin' && settings.notify_customer_query_reply !== false && query.email) {
      sendQueryReplyEmail({ query, replyMessage: message.trim() }).catch(err =>
        console.error('Failed to send query reply email to user:', err)
      );
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add reply' });
  }
});

app.patch('/api/queries/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const updated = db.updateSupportQueryStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Query not found' });
  return res.json(updated);
});

app.get('/api/admin/contact-messages', requireAdmin, (_req: Request, res: Response) => {
  return res.json(db.getContactMessages());
});

app.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  const products = db.getProducts({ status: 'all' });
  const users = db.getUsers().filter(u => u.role !== 'admin' && u.role !== 'super_admin');

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter(
    o => o.order_status === 'Placed' || o.order_status === 'Confirmed' || o.order_status === 'Preparing'
  ).length;

  const lowStockProducts = products.filter(
    p => p.stock_quantity <= p.low_stock_threshold && p.status === 'published'
  );

  res.json({
    totalOrders,
    totalRevenue,
    pendingOrders,
    totalProducts: products.length,
    totalCustomers: users.length,
    recentOrders: orders.slice(0, 8),
    lowStockProducts
  });
});

app.get('/api/admin/email-logs', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getEmailLogs());
});

// ==========================================
// 9. ADMIN MANAGEMENT
// ==========================================
app.get('/api/admin/admins', requireAdmin, (_req: Request, res: Response) => {
  const admins = db.getAdmins().map(({ password_hash, ...safeAdmin }) => safeAdmin);
  res.json(admins);
});

app.post('/api/admin/admins', requireAdmin, (req: Request, res: Response) => {
  try {
    const { email, password, full_name, role } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const assignedRole = role === 'super_admin' ? 'super_admin' : 'admin';

    // Verify creator authorization if creating super_admin
    const creator = (req as any).adminUser;
    if (assignedRole === 'super_admin' && creator.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super Administrators can create Super Admin accounts.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const password_hash = crypto.createHash('sha256').update(password).digest('hex');
    const assignedStores = Array.isArray(req.body.assigned_store_ids) ? req.body.assigned_store_ids : [];
    const newAdmin = db.createAdmin({
      email,
      full_name,
      phone: req.body.phone || '',
      role: assignedRole,
      password_hash,
      assigned_store_ids: assignedStores
    });

    if (assignedStores.length > 0) {
      for (const storeId of assignedStores) {
        const store = db.getStoreById(storeId);
        if (store) {
          const admins = new Set(store.assigned_admin_ids || []);
          admins.add(newAdmin.id);
          db.updateStore(store.id, { assigned_admin_ids: Array.from(admins) });
        }
      }
    }

    const { password_hash: _, ...safeAdmin } = newAdmin;
    return res.status(201).json(safeAdmin);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create administrator' });
  }
});

app.put('/api/admin/admins/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const currentAdmin = (req as any).adminUser;
    const target = db.getUserById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Administrator not found' });
    }

    if (req.body.role && req.body.role !== target.role && currentAdmin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super Administrators can change administrator roles.' });
    }

    const updates: any = {};
    if (req.body.full_name) updates.full_name = req.body.full_name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.role && (req.body.role === 'admin' || req.body.role === 'super_admin')) {
      updates.role = req.body.role;
    }
    if (Array.isArray(req.body.assigned_store_ids)) {
      updates.assigned_store_ids = req.body.assigned_store_ids;
      // Sync store reverse mapping
      const stores = db.getStores(false);
      for (const s of stores) {
        const curAdmins = new Set(s.assigned_admin_ids || []);
        const shouldHave = req.body.assigned_store_ids.includes(s.id);
        if (shouldHave && !curAdmins.has(target.id)) {
          curAdmins.add(target.id);
          db.updateStore(s.id, { assigned_admin_ids: Array.from(curAdmins) });
        } else if (!shouldHave && curAdmins.has(target.id)) {
          curAdmins.delete(target.id);
          db.updateStore(s.id, { assigned_admin_ids: Array.from(curAdmins) });
        }
      }
    }
    if (req.body.password && typeof req.body.password === 'string' && req.body.password.length >= 6) {
      updates.password_hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    }

    const updated = db.updateUser(req.params.id, updates);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update administrator' });
    }

    const { password_hash: _, ...safeAdmin } = updated;
    return res.json(safeAdmin);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update administrator' });
  }
});

app.delete('/api/admin/admins/:id', requireAdmin, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser;
  const target = db.getUserById(req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'Administrator not found' });
  }

  if (target.role === 'super_admin' && currentAdmin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Only Super Administrators can remove Super Admin accounts.' });
  }

  const result = db.deleteAdmin(req.params.id);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  return res.json({ success: true, message: 'Administrator removed successfully' });
});

// ==========================================
// 9.1 STORE LOCATIONS MANAGEMENT (Admin & Public)
// ==========================================
app.get('/api/stores', (req: Request, res: Response) => {
  const all = req.query.all === 'true' || req.query.all === '1';
  const stores = db.getStores(!all);
  res.json(stores);
});

app.get('/api/stores/:id', (req: Request, res: Response) => {
  const store = db.getStoreById(req.params.id);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  res.json(store);
});

app.post('/api/stores', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, format, badge, address, pincode, city, state, phone, email, hours, manager, parking, icons, image, is_active, allow_pickup, assigned_admin_ids } = req.body;
    if (!name || !address || !pincode) {
      return res.status(400).json({ error: 'Store name, address, and pincode are required' });
    }

    const assignedAdmins = Array.isArray(assigned_admin_ids) ? assigned_admin_ids : [];

    const newStore = db.createStore({
      name,
      format: format || 'Neighbourhood',
      badge: badge || '',
      address,
      pincode: String(pincode).trim(),
      city: city || 'Gurugram',
      state: state || 'Haryana',
      phone: phone || '',
      email: email || '',
      hours: hours || 'Open 24 Hours (7 Days a Week)',
      manager: manager || '',
      parking: parking || 'Yes',
      icons: Array.isArray(icons) ? icons : ['Fresh Produce', 'Fresh Food', 'Groceries'],
      image: image || '/assets/mockup/store_sector_109_card.webp',
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      allow_pickup: allow_pickup !== undefined ? Boolean(allow_pickup) : true,
      assigned_admin_ids: assignedAdmins
    });

    // Sync admin users assigned_store_ids
    if (assignedAdmins.length > 0) {
      for (const adminId of assignedAdmins) {
        const adminUser = db.getUserById(adminId);
        if (adminUser) {
          const storeIds = new Set(adminUser.assigned_store_ids || []);
          storeIds.add(newStore.id);
          db.updateUser(adminUser.id, { assigned_store_ids: Array.from(storeIds) });
        }
      }
    }

    return res.status(201).json(newStore);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create store' });
  }
});

app.put('/api/stores/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const existing = db.getStoreById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const updates: any = { ...req.body };
    delete updates.id;
    delete updates.created_at;

    if (updates.pincode) {
      updates.pincode = String(updates.pincode).trim();
    }

    const updated = db.updateStore(req.params.id, updates);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update store' });
    }

    // If assigned_admin_ids was provided, sync with user records
    if (Array.isArray(req.body.assigned_admin_ids)) {
      const assignedIds = req.body.assigned_admin_ids;
      const admins = db.getAdmins();
      for (const a of admins) {
        const curStores = new Set(a.assigned_store_ids || []);
        const shouldHave = assignedIds.includes(a.id);
        if (shouldHave && !curStores.has(req.params.id)) {
          curStores.add(req.params.id);
          db.updateUser(a.id, { assigned_store_ids: Array.from(curStores) });
        } else if (!shouldHave && curStores.has(req.params.id)) {
          curStores.delete(req.params.id);
          db.updateUser(a.id, { assigned_store_ids: Array.from(curStores) });
        }
      }
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update store' });
  }
});

app.delete('/api/stores/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteStore(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Store not found' });
  }
  // Remove from admin assignments
  const admins = db.getAdmins();
  for (const a of admins) {
    if (a.assigned_store_ids && a.assigned_store_ids.includes(req.params.id)) {
      db.updateUser(a.id, {
        assigned_store_ids: a.assigned_store_ids.filter(id => id !== req.params.id)
      });
    }
  }
  return res.json({ success: true, message: 'Store removed successfully' });
});

// ==========================================
// 10. CUSTOMERS & ORDER SYNCHRONIZATION
// ==========================================
app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
  const users = db.getUsers().filter(u => u.role !== 'admin' && u.role !== 'super_admin');
  const orders = db.getOrders();

  const customerStats = users.map(u => {
    const userOrders = orders.filter(
      o => o.user_id === u.id || o.customer_email.toLowerCase() === u.email.toLowerCase()
    );
    const validOrders = userOrders.filter(o => o.order_status !== 'Cancelled');
    const totalSpent = validOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const avgOrderValue = userOrders.length > 0 ? Math.round(totalSpent / userOrders.length) : 0;
    const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

    return {
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      joined_date: u.created_at,
      created_at: u.created_at,
      order_count: userOrders.length,
      orders_count: userOrders.length,
      total_spent: totalSpent,
      average_order_value: avgOrderValue,
      last_order_id: lastOrder ? lastOrder.id : null,
      last_order_date: lastOrder ? lastOrder.created_at : null,
      orders: userOrders
    };
  });

  res.json(customerStats);
});

app.get('/api/admin/customers/:id', requireAdmin, (req: Request, res: Response) => {
  const user = db.getUserById(req.params.id);
  if (!user || user.role === 'admin' || user.role === 'super_admin') {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const orders = db.getOrders();
  const userOrders = orders.filter(
    o => o.user_id === user.id || o.customer_email.toLowerCase() === user.email.toLowerCase()
  );
  const validOrders = userOrders.filter(o => o.order_status !== 'Cancelled');
  const totalSpent = validOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgOrderValue = userOrders.length > 0 ? Math.round(totalSpent / userOrders.length) : 0;
  const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

  res.json({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    joined_date: user.created_at,
    created_at: user.created_at,
    order_count: userOrders.length,
    orders_count: userOrders.length,
    total_spent: totalSpent,
    average_order_value: avgOrderValue,
    last_order_id: lastOrder ? lastOrder.id : null,
    last_order_date: lastOrder ? lastOrder.created_at : null,
    orders: userOrders
  });
});

// Serve production Vite assets and SPA fallback when dist/ exists
const DIST_PATH = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.use((req: Request, res: Response, next: any) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(DIST_PATH, 'index.html'));
    }
    next();
  });
}

// Start Express server
app.listen(PORT, () => {
  console.log(`[VillageDELI Server] running on http://localhost:${PORT}`);
});
// Initialized with zero demo products per production specs

