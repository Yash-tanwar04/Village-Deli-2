-- ==============================================================================
-- VillageDELI Production Database Schema (Supabase PostgreSQL)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked with Supabase Auth auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  phone text default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Categories Table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text default '',
  image_url text default '',
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products Table (Starts completely EMPTY — no dummy products)
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null,
  description text default '',
  category_id uuid references public.categories(id) on delete set null,
  brand text default 'VillageDELI Fresh',
  sku text default '',
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  unit text not null default '1 unit',
  weight_quantity text default '',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer default 5,
  image_url text not null,
  additional_images text[] default '{}',
  badge text default null, -- 'BESTSELLER', 'SEASONAL', 'ORGANIC', 'FARM FRESH'
  dietary_tags text[] default '{}', -- 'Organic', 'Pesticide Free', etc.
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Customer Addresses Table
create table if not exists public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  phone text not null,
  house_flat text not null,
  building_street text not null,
  area_locality text not null,
  city text not null,
  state text not null,
  pincode varchar(6) not null check (pincode ~ '^[0-9]{6}$'),
  landmark text default '',
  address_type text not null default 'Home' check (address_type in ('Home', 'Work', 'Other')),
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Order Sequence for human-readable IDs (VDL-000001)
create sequence if not exists order_code_seq start with 1;

-- 6. Orders Table
create table if not exists public.orders (
  id text primary key, -- e.g. 'VDL-000101'
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address jsonb not null,
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) not null,
  payment_method text not null default 'COD' check (payment_method in ('COD')),
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Failed')),
  order_status text not null default 'Placed' check (order_status in ('Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')),
  estimated_delivery text default '30–60 mins',
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Order Items Table (Immutable historical snapshot)
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_price numeric(10, 2) not null,
  product_unit text not null,
  product_image text default '',
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null
);

-- 8. Store & Delivery Settings Table
create table if not exists public.store_settings (
  id text primary key default 'primary',
  store_name text default 'VillageDELI Sector 109, Gurugram',
  store_address text default 'Plot 12, Sector 109, Gurugram, Haryana - 122017',
  support_phone text default '+91 98765 43210',
  support_email text default 'orders@villagedeli.in',
  opening_hours text default 'Open 24/7 (All days)',
  delivery_enabled boolean default true,
  delivery_fee numeric(10, 2) default 30.00,
  free_delivery_threshold numeric(10, 2) default 500.00,
  min_order_value numeric(10, 2) default 150.00,
  serviceable_pincodes text[] default '{ "122001", "122002", "122003", "122017", "122018", "122050", "160017", "160022" }',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Email Settings Table
create table if not exists public.email_settings (
  id text primary key default 'primary',
  admin_notification_email text not null default 'admin@villagedeli.in',
  sender_name text not null default 'VillageDELI Orders',
  admin_cc_email text default '',
  admin_bcc_email text default '',
  customer_email_subject text default 'VillageDELI — Your Order {{order_id}} Has Been Confirmed',
  customer_email_header text default 'Thank you for shopping with VillageDELI! Your fresh groceries and everyday essentials are being prepared.',
  customer_email_footer text default 'Need help with your order? Reach our customer care team anytime at support@villagedeli.in or +91 98765 43210.',
  admin_email_subject text default '🛒 New VillageDELI Order — {{order_id}} (₹{{order_total}})',
  admin_email_header text default 'A new Cash on Delivery order has been received and requires confirmation.',
  admin_email_footer text default 'Manage this order live in your VillageDELI Admin Portal.',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Email Logs Table
create table if not exists public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  recipient text not null,
  email_type text not null check (email_type in ('customer_order_confirmation', 'admin_new_order')),
  subject text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  provider_message_id text default null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  error_message text default null
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;
alter table public.email_settings enable row level security;
alter table public.email_logs enable row level security;

-- Public read access for active categories and published products
create policy "Anyone can read active categories" on public.categories for select using (is_active = true or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Anyone can read published products" on public.products for select using (status = 'published' or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Anyone can read store settings" on public.store_settings for select using (true);

-- Customers can read and edit only their own addresses & profiles
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can read own addresses" on public.addresses for select using (auth.uid() = user_id or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Users can manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- Customers can read their own orders and order items
create policy "Users can read own orders" on public.orders for select using (auth.uid() = user_id or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Users can insert own orders" on public.orders for insert with check (true);

create policy "Users can read own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or auth.uid() in (select id from public.profiles where role = 'admin')))
);

-- Admin full control policies
create policy "Admins can manage categories" on public.categories for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can manage products" on public.products for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can manage orders" on public.orders for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can manage store settings" on public.store_settings for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can manage email settings" on public.email_settings for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can read email logs" on public.email_logs for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
