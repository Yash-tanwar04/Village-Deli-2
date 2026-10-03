export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'admin' | 'super_admin';
  password_hash?: string;
  google_id?: string;
  avatar_url?: string;
  auth_provider?: 'local' | 'google' | 'both';
  assigned_store_ids?: string[];
  created_at: string;
}

export interface StoreLocation {
  id: string; // e.g. "loc-109"
  name: string;
  format: 'Neighbourhood' | 'VillageDELI Hub' | 'Highway' | 'Petrol Pump';
  badge: string;
  address: string;
  pincode: string;
  city: string;
  state?: string;
  phone: string;
  email?: string; // Store specific order notification email
  hours: string;
  manager: string;
  parking: string;
  icons: string[];
  image: string;
  is_active: boolean;
  allow_pickup: boolean;
  assigned_admin_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "500g", "1kg", "250ml", "Standard"
  sku?: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  is_available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  brand: string;
  sku: string;
  price: number;
  discount_price: number | null;
  unit: string;
  weight_quantity: string;
  stock_quantity: number;
  low_stock_threshold: number;
  image_url: string;
  additional_images: string[];
  badge: string | null;
  dietary_tags: string[];
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  has_variants?: boolean;
  variant_title?: string;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  house_flat: string;
  building_street: string;
  area_locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  address_type: 'Home' | 'Work' | 'Other';
  is_default: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_unit: string;
  product_image: string;
  quantity: number;
  subtotal: number;
  variant_name?: string;
  variant_id?: string;
}

export interface Order {
  id: string; // e.g. VDL-000101
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type?: 'delivery' | 'pickup';
  pickup_store_id?: string;
  pickup_store_name?: string;
  pickup_store_address?: string;
  pickup_store_phone?: string;
  nearest_store_id?: string;
  nearest_store_name?: string;
  delivery_address: Address;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: 'COD' | 'Razorpay';
  payment_status: 'Pending' | 'Paid' | 'Failed';
  order_status: 'Placed' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  estimated_delivery: string;
  notes?: string;
  cancellation_reason?: string;
  items: OrderItem[];
  customer_email_status?: 'sent' | 'failed' | 'pending';
  admin_email_status?: 'sent' | 'failed' | 'pending';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  transaction_id?: string;
  payment_verified_by_admin?: boolean;
  admin_verified_at?: string;
  admin_verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSettings {
  razorpay_enabled: boolean;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  require_admin_verification: boolean;
  cod_enabled: boolean;
  updated_at: string;
}

export interface Transaction {
  id: string; // e.g. TXN-10001
  order_id?: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  currency: string;
  payment_gateway: 'razorpay' | 'cod';
  payment_status: 'Paid' | 'Failed' | 'Pending';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  error_code?: string;
  error_description?: string;
  admin_verified: boolean;
  admin_verified_at?: string;
  admin_verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  store_name: string;
  store_address: string;
  support_phone: string;
  support_email: string;
  opening_hours: string;
  delivery_enabled: boolean;
  delivery_fee: number;
  free_delivery_threshold: number;
  min_order_value: number;
  serviceable_pincodes: string[];
  updated_at: string;
}

export interface EmailSettings {
  admin_notification_email: string;
  sender_name: string;
  from_email?: string;
  admin_cc_email: string;
  admin_bcc_email: string;
  customer_email_subject: string;
  customer_email_header: string;
  customer_email_footer: string;
  admin_email_subject: string;
  admin_email_header: string;
  admin_email_footer: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  enable_customer_emails?: boolean;
  enable_admin_emails?: boolean;
  enable_contact_emails?: boolean;
  enable_otp_login?: boolean;
  enable_otp_register?: boolean;
  notify_customer_order_placed?: boolean;
  notify_customer_order_preparing?: boolean;
  notify_customer_order_out_for_delivery?: boolean;
  notify_customer_order_delivered?: boolean;
  notify_customer_order_cancelled?: boolean;
  notify_customer_welcome?: boolean;
  notify_customer_query_received?: boolean;
  notify_customer_query_reply?: boolean;
  notify_admin_new_order?: boolean;
  notify_admin_order_cancelled?: boolean;
  notify_admin_new_query?: boolean;
  query_ack_subject?: string;
  query_ack_message?: string;
  resend_api_key?: string;
  brevo_api_key?: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  order_id: string;
  recipient: string;
  email_type:
    | 'customer_order_confirmation'
    | 'admin_new_order'
    | 'contact_inquiry'
    | 'admin_custom_message'
    | 'query_acknowledgment'
    | 'query_reply'
    | 'auth_otp'
    | 'order_status_update'
    | 'welcome_email';
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  provider_message_id: string | null;
  preview_url?: string | null;
  sent_at: string;
  error_message: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  enquiry_type: string;
  message: string;
  created_at: string;
}

export interface QueryReply {
  id: string;
  sender: 'user' | 'admin';
  sender_name: string;
  message: string;
  created_at: string;
}

export interface SupportQuery {
  id: string; // e.g. "TKT-1001"
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  enquiry_type: string;
  subject?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  created_at: string;
  updated_at: string;
  messages: QueryReply[];
}
