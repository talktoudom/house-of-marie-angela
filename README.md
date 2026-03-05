# House of Marie-Angela Exquisite

A production-ready luxury fashion e-commerce platform built with Next.js 14, Supabase, Cloudinary, and Paystack.

## Features

- 🛍️ **E-Commerce** — Shop by category (Women, Men, Children, Jewelry), product search, filters, cart, Paystack checkout
- 📝 **Blog** — Fashion journal with markdown content, tags, reading time
- 🎓 **Fashion Academy** — Course listings and inquiry system
- 🔐 **Admin Panel** — Full CRUD for products, blog posts, orders, messages, newsletter subscribers
- 🖼️ **Cloudinary** — Signed image uploads with replace/delete support
- 💳 **Paystack** — Initialize, verify, webhook (idempotent)
- 📧 **Newsletter** — Subscriber management with CSV export
- 🗺️ **SEO** — Sitemap, robots.txt, OpenGraph, metadata
- 🔒 **Security** — Supabase RLS, sanitized markdown, protected admin routes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database/Auth**: Supabase (Postgres + Row Level Security)
- **Media**: Cloudinary
- **Payments**: Paystack (NGN / Kobo)
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as CLOUDINARY_CLOUD_NAME |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (`sk_live_...` or `sk_test_...`) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (`pk_live_...`) |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL (e.g. `https://yourapp.vercel.app`) |

### 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard → **SQL Editor**
3. Paste and run the entire contents of `supabase/migration.sql`
4. Go to **Authentication → Users** → **Add User** to create your admin account
5. Copy your project URL and keys from **Settings → API**

### 4. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Find your **Cloud Name**, **API Key**, and **API Secret** on the dashboard
3. Images upload to `hma-products/` and `hma-blog/` folders automatically

### 5. Paystack Setup

1. Create account at [paystack.com](https://paystack.com)
2. Go to **Settings → API Keys & Webhooks**
3. Copy your test/live keys
4. Add a webhook endpoint: `https://your-domain.com/api/paystack/webhook`
5. Enable the `charge.success` event

### 6. Run Locally

```bash
npm run dev
```

- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

### 7. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Project Structure

```
house-of-marie-angela/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Homepage
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── sitemap.ts                # Dynamic sitemap
│   │   ├── robots.ts                 # robots.txt
│   │   ├── shop/                     # Shop + category pages
│   │   ├── product/[slug]/           # Product detail
│   │   ├── blog/                     # Blog list + post
│   │   ├── cart/                     # Cart page
│   │   ├── checkout/                 # Checkout + success + cancel
│   │   ├── about/                    # About page
│   │   ├── contact/                  # Contact page
│   │   ├── academy/                  # Fashion academy
│   │   ├── privacy/                  # Privacy policy
│   │   ├── terms/                    # Terms & conditions
│   │   ├── returns/                  # Return policy
│   │   ├── shipping/                 # Shipping info
│   │   ├── admin/                    # Protected admin panel
│   │   │   ├── login/                # Admin login
│   │   │   ├── products/             # Product CRUD
│   │   │   ├── blog/                 # Blog CRUD
│   │   │   ├── orders/               # Order management
│   │   │   ├── messages/             # Contact messages
│   │   │   └── newsletter/           # Subscribers + CSV export
│   │   └── api/
│   │       ├── paystack/             # initialize, verify, webhook
│   │       ├── cloudinary/           # sign, delete
│   │       ├── newsletter/           # Subscribe endpoint
│   │       └── contact/              # Contact form endpoint
│   ├── components/
│   │   ├── layout/                   # Navbar, Footer
│   │   ├── shop/                     # ProductCard, ProductDetail, ShopFilters
│   │   ├── blog/                     # BlogCard
│   │   ├── home/                     # NewsletterForm
│   │   └── admin/                    # AdminSidebar, ProductForm, BlogPostForm, etc.
│   ├── hooks/
│   │   └── useCart.ts                # Cart with localStorage persistence
│   ├── lib/
│   │   ├── supabase/                 # Browser + server Supabase clients
│   │   ├── cloudinary.ts             # Signed upload helper
│   │   ├── paystack.ts               # Paystack API helpers
│   │   └── utils.ts                  # Formatting, slugs, etc.
│   ├── middleware.ts                  # Admin route protection
│   └── types/                        # TypeScript types
├── supabase/
│   └── migration.sql                 # Complete DB schema + RLS policies
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Admin Panel Guide

### Products (`/admin/products`)
- Create, edit, delete products
- Upload multiple images via Cloudinary (signed uploads)
- Set sizes, colors, stock, pricing, sale price
- Markdown description with live preview
- Toggle featured / draft / published status

### Blog (`/admin/blog`)
- Write posts in Markdown with live preview
- Upload cover images via Cloudinary
- Tag posts, set author, publish/draft toggle

### Orders (`/admin/orders`)
- View all orders with status tracking
- Orders update automatically via Paystack webhook

### Messages (`/admin/messages`)
- View all contact form submissions
- Unread messages highlighted

### Newsletter (`/admin/newsletter`)
- View all active subscribers
- Export to CSV with one click

---

## Payment Flow

```
User fills checkout → POST /api/paystack/initialize
  → Creates pending order in Supabase
  → Calls Paystack API → gets authorization_url
  → Redirects user to Paystack hosted page
  → User pays → Paystack redirects to /checkout/success?reference=xxx
  → GET /api/paystack/verify?reference=xxx
  → Verifies with Paystack → marks order "paid"
  → Paystack also fires webhook → POST /api/paystack/webhook
  → Idempotent update (skips if already paid)
```

---

## Implemented Features Checklist

- [x] Next.js 14 App Router + TypeScript
- [x] Tailwind CSS with luxury fuchsia brand palette
- [x] Supabase Postgres schema with Row Level Security
- [x] Supabase Auth (admin login/logout)
- [x] Admin route protection via middleware
- [x] Product CRUD (title, slug, category, sizes, colors, price, sale price, stock, SKU, images, featured, status)
- [x] Cloudinary signed image uploads (products + blog)
- [x] Blog CRUD with Markdown editor + live preview + sanitized rendering
- [x] E-commerce cart with localStorage persistence
- [x] Paystack payment (initialize + verify + webhook)
- [x] Newsletter subscribe + CSV export
- [x] Contact form → Supabase
- [x] Shop filters (category, sort, search)
- [x] Pagination (shop + blog)
- [x] Product detail: image gallery, sizes, colors, stock, related products, breadcrumbs
- [x] Admin dashboard with stats (products, orders, messages, subscribers)
- [x] SEO: metadata, OpenGraph, sitemap.xml, robots.txt
- [x] Mobile-first responsive design
- [x] Loading/empty states
- [x] Homepage: hero, categories, featured products, academy CTA, blog preview, testimonials, newsletter
- [x] About page with brand story + team
- [x] Fashion Academy page with course listings
- [x] Policy pages (privacy, terms, returns, shipping)
- [x] Cart page with quantity controls
- [x] Checkout success + cancel pages
- [x] Vercel-ready build configuration
