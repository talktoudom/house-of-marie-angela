import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn the story behind House of Marie-Angela Exquisite — luxury fashion, education, and culture.',
}

const team = [
  { name: 'Marie-Angela', role: 'Founder & Creative Director', bio: 'Visionary designer with over 15 years crafting luxury fashion for discerning clients across Africa and beyond.' },
  { name: 'Chisom Obi', role: 'Head of Design', bio: 'Award-winning fashion designer specializing in contemporary African silhouettes and sustainable luxury.' },
  { name: 'Emeka Nwosu', role: 'Academy Director', bio: 'Fashion educator and stylist dedicated to nurturing the next generation of African fashion talent.' },
]

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="bg-gradient-to-br from-fuchsia-950 via-fuchsia-800 to-fuchsia-900 py-24 text-white text-center px-4">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-fuchsia-300 mb-4">Our Story</p>
        <h1 className="font-display text-4xl md:text-6xl font-400 leading-tight mb-6">
          Where Culture Meets <span className="italic">Couture</span>
        </h1>
        <p className="font-body text-lg text-fuchsia-100 max-w-2xl mx-auto leading-relaxed">
          House of Marie-Angela Exquisite was born from a dream — to bring world-class luxury fashion rooted in African heritage to the global stage.
        </p>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-4">Brand Story</p>
              <h2 className="font-display text-3xl font-400 text-brand-charcoal mb-6">More Than Fashion</h2>
              <div className="space-y-4 font-body text-base text-gray-600 leading-relaxed">
                <p>Founded by Marie-Angela with a singular vision: to create fashion that doesn't just clothe the body but celebrates the soul. Every piece tells a story of craftsmanship, culture, and confidence.</p>
                <p>From our atelier in Lagos to homes across Nigeria and beyond, we have dressed kings, queens, and everyday royals who understand that true style is a language.</p>
                <p>We believe fashion should transform — not just your wardrobe, but your presence, your confidence, your story.</p>
              </div>
            </div>
            <div className="bg-fuchsia-50 aspect-square flex items-center justify-center">
              <span className="font-display text-7xl text-brand-fuchsia/20 italic">HMA</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-4">What We Do</p>
            <h2 className="section-title">Three Pillars of Excellence</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎓', title: 'Fashion Education', desc: 'Our Academy trains aspiring designers, stylists, and fashion entrepreneurs through hands-on courses taught by industry experts.' },
              { icon: '✂️', title: 'Fashion Services', desc: 'From custom bespoke garments to personal styling consultations and wardrobe curation — we offer comprehensive fashion services.' },
              { icon: '👗', title: 'Fashion Retail', desc: 'Our curated collections of clothing and jewelry embody luxury, quality, and cultural pride. Available for Women, Men, Children, and in Jewelry.' },
            ].map(item => (
              <div key={item.title} className="bg-white p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-xl font-400 text-brand-charcoal mb-4">{item.title}</h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-4">The Team</p>
            <h2 className="section-title">Faces Behind the Brand</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map(member => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-brand-fuchsia rounded-full flex items-center justify-center">
                  <span className="font-display text-3xl text-white italic">{member.name[0]}</span>
                </div>
                <h3 className="font-display text-xl font-400 text-brand-charcoal">{member.name}</h3>
                <p className="font-sans text-xs tracking-widest uppercase text-brand-fuchsia mt-1 mb-4">{member.role}</p>
                <p className="font-body text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
