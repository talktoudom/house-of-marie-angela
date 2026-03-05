-- House of Marie-Angela Exquisite - Supabase Migration
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- PROFILES
-- =====================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Admins can read profiles" on profiles
  for select using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================
-- PRODUCTS
-- =====================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  category text not null check (category in ('women', 'men', 'children', 'jewelry')),
  subcategory text,
  price numeric not null check (price >= 0),
  sale_price numeric check (sale_price >= 0),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock_quantity integer not null default 0,
  sku text not null,
  short_description text not null default '',
  full_description text not null default '',
  admin_review_notes text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table products enable row level security;

-- Public can read published products
create policy "Public read published products" on products
  for select using (status = 'published');

-- Authenticated (admins) can do everything
create policy "Admins full access products" on products
  for all using (auth.role() = 'authenticated');

-- =====================
-- PRODUCT IMAGES
-- =====================
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  public_id text not null,
  secure_url text not null,
  is_primary boolean not null default false,
  sort_order integer not null default 0
);

alter table product_images enable row level security;

create policy "Public read product images" on product_images
  for select using (
    exists (select 1 from products where products.id = product_images.product_id and products.status = 'published')
  );

create policy "Admins full access product images" on product_images
  for all using (auth.role() = 'authenticated');

-- =====================
-- BLOG POSTS
-- =====================
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text not null default '',
  excerpt text not null default '',
  cover_image_url text,
  cover_image_public_id text,
  author text not null default 'Marie-Angela',
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  reading_time integer not null default 1,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table blog_posts enable row level security;

create policy "Public read published posts" on blog_posts
  for select using (status = 'published');

create policy "Admins full access posts" on blog_posts
  for all using (auth.role() = 'authenticated');

-- =====================
-- ORDERS
-- =====================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  user_name text not null,
  user_phone text not null,
  items jsonb not null default '[]',
  subtotal numeric not null,
  total numeric not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  paystack_reference text unique not null,
  paystack_transaction_id text,
  shipping_address jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;

-- Only admins can read orders
create policy "Admins full access orders" on orders
  for all using (auth.role() = 'authenticated');

-- =====================
-- ORDER ITEMS
-- =====================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  price numeric not null,
  size text,
  color text
);

alter table order_items enable row level security;

create policy "Admins full access order items" on order_items
  for all using (auth.role() = 'authenticated');

-- =====================
-- CONTACT MESSAGES
-- =====================
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

-- Allow anonymous inserts (contact form)
create policy "Anyone can insert contact messages" on contact_messages
  for insert with check (true);

create policy "Admins read contact messages" on contact_messages
  for select using (auth.role() = 'authenticated');

create policy "Admins update contact messages" on contact_messages
  for update using (auth.role() = 'authenticated');

-- =====================
-- NEWSLETTER SUBSCRIBERS
-- =====================
create table if not exists newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

-- Allow anonymous inserts
create policy "Anyone can subscribe" on newsletter_subscribers
  for insert with check (true);

create policy "Anyone can upsert newsletter" on newsletter_subscribers
  for update using (true);

create policy "Admins read subscribers" on newsletter_subscribers
  for select using (auth.role() = 'authenticated');

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at before update on products
  for each row execute function update_updated_at_column();

create trigger update_blog_posts_updated_at before update on blog_posts
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at before update on orders
  for each row execute function update_updated_at_column();

-- =====================
-- INDEXES
-- =====================
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category on products(category);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_status on blog_posts(status);
create index if not exists idx_orders_reference on orders(paystack_reference);
create index if not exists idx_newsletter_email on newsletter_subscribers(email);
