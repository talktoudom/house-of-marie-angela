import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'
import { BlogCard } from '@/components/blog/BlogCard'
import { NewsletterForm } from '@/components/home/NewsletterForm'
import { Product, BlogPost } from '@/types'

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('updated_at', { ascending: false })
    .limit(8)

  return (data as any[]) || []
}

async function getLatestPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  return (data as BlogPost[]) || []
}

const testimonials = [
  { name: 'Adaeze O.', text: 'The quality is absolutely divine. I get compliments every time I wear my HMA pieces. Truly luxury fashion.', role: 'Lagos' },
  { name: 'Funmilayo B.', text: 'The fashion academy changed how I see style. Marie-Angela is a visionary. I\'m now a confident dresser!', role: 'Abuja' },
  { name: 'Chidinma E.', text: 'Ordered a custom piece and was blown away by the craftsmanship. This is what Nigerian luxury looks like.', role: 'Port Harcourt' },
]

const categories = [
  { label: 'Women', href: '/shop/women', desc: 'Elegant silhouettes & bold statements', bg: 'bg-fuchsia-900' },
  { label: 'Men', href: '/shop/men', desc: 'Tailored precision & modern sophistication', bg: 'bg-brand-charcoal' },
  { label: 'Children', href: '/shop/children', desc: 'Tiny luxury for little royals', bg: 'bg-fuchsia-700' },
  { label: 'Jewelry', href: '/shop/jewelry', desc: 'Adornments that tell your story', bg: 'bg-fuchsia-800' },
]

export default async function HomePage() {
  const [featuredProducts, latestPosts] = await Promise.all([getFeaturedProducts(), getLatestPosts()])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-fuchsia-deep">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950 via-fuchsia-800 to-fuchsia-950" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-fuchsia-200 mb-6 animate-fade-in">
            Luxury · Fashion · Heritage
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-normal leading-tight mb-6 animate-fade-up">
            House of{' '}
            <span className="italic">Marie-Angela</span>
            <br />
            <span className="text-fuchsia-200">Exquisite</span>
          </h1>
          <p
            className="font-body text-lg sm:text-xl text-fuchsia-100 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Where African elegance meets couture precision. Discover fashion that tells your story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/shop" className="btn-outline-white">
              Shop Collection
            </Link>
            <Link
              href="/academy"
              className="bg-white text-brand-fuchsia px-8 py-3 font-sans font-medium tracking-widest uppercase text-sm hover:bg-fuchsia-50 transition-colors"
            >
              Fashion Academy
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-3">Explore</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="group relative overflow-hidden aspect-square">
                <div className={`absolute inset-0 ${cat.bg} transition-transform duration-700 group-hover:scale-105`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="font-display text-2xl lg:text-3xl font-normal italic mb-2">{cat.label}</h3>
                  <p className="font-sans text-xs text-white/70 text-center tracking-wide hidden lg:block">{cat.desc}</p>
                  <div className="mt-4 w-8 h-px bg-white/50 group-hover:w-16 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-brand-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-3">Curated</p>
                <h2 className="section-title">Featured Pieces</h2>
              </div>
              <Link href="/shop" className="btn-outline hidden sm:inline-flex">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
            <div className="text-center mt-10 sm:hidden">
              <Link href="/shop" className="btn-outline">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* Academy CTA */}
      <section className="py-24 bg-gradient-to-r from-fuchsia-950 to-fuchsia-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-fuchsia-300 mb-4">Fashion Academy</p>
              <h2 className="font-display text-4xl lg:text-5xl font-normal leading-tight mb-6">
                Learn the Art of <span className="italic">Fashion</span>
              </h2>
              <p className="font-body text-lg text-fuchsia-100 leading-relaxed mb-8">
                Join our world-class fashion academy and transform your passion into expertise. From sketching to styling, we teach it all.
              </p>
              <ul className="space-y-3 mb-10">
                {['Fashion Design & Sketching', 'Styling & Wardrobe Curation', 'Fabric & Textile Mastery', 'Business of Fashion'].map(item => (
                  <li key={item} className="flex items-center gap-3 font-sans text-sm text-fuchsia-100">
                    <span className="w-1.5 h-1.5 bg-fuchsia-300 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/academy" className="btn-outline-white inline-flex">Explore Academy</Link>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square bg-fuchsia-700/30 rounded-sm flex items-center justify-center">
                <span className="font-display text-7xl text-white/20 italic">HMA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-3">Journal</p>
                <h2 className="section-title">Fashion Stories</h2>
              </div>
              <Link href="/blog" className="btn-outline hidden sm:inline-flex">All Posts</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} priority={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-3">Testimonials</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 relative">
                <div className="text-5xl font-display text-brand-fuchsia/20 leading-none mb-4">&ldquo;</div>
                <p className="font-body text-base text-gray-600 leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-fuchsia rounded-full flex items-center justify-center">
                    <span className="font-display text-white text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-brand-charcoal">{t.name}</p>
                    <p className="font-sans text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-brand-fuchsia">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-white/70 mb-4">Stay Connected</p>
          <h2 className="font-display text-3xl lg:text-4xl font-normal text-white mb-4">
            Join the HMA <span className="italic">Family</span>
          </h2>
          <p className="font-body text-base text-white/80 mb-8">
            Get exclusive access to new collections, styling tips, and academy updates.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}