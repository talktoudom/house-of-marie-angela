import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fashion Academy',
  description: 'Learn fashion design, styling, and business from experts at House of Marie-Angela Exquisite Academy.',
}

const courses = [
  { title: 'Fashion Design Fundamentals', duration: '8 weeks', level: 'Beginner', price: '₦150,000', icon: '✏️' },
  { title: 'Advanced Patternmaking', duration: '6 weeks', level: 'Intermediate', price: '₦180,000', icon: '📐' },
  { title: 'Personal Styling & Branding', duration: '4 weeks', level: 'All Levels', price: '₦120,000', icon: '✨' },
  { title: 'Fashion Business & E-Commerce', duration: '5 weeks', level: 'All Levels', price: '₦140,000', icon: '💼' },
  { title: 'Jewelry Design & Making', duration: '6 weeks', level: 'Beginner', price: '₦160,000', icon: '💎' },
  { title: 'African Textile Mastery', duration: '4 weeks', level: 'All Levels', price: '₦100,000', icon: '🌺' },
]

export default function AcademyPage() {
  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="bg-gradient-to-br from-fuchsia-950 via-fuchsia-800 to-fuchsia-900 py-24 text-white text-center px-4">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-fuchsia-300 mb-4">Fashion Academy</p>
        <h1 className="font-display text-4xl md:text-6xl font-400 leading-tight mb-6">
          Transform Your Passion<br />Into <span className="italic">Expertise</span>
        </h1>
        <p className="font-body text-lg text-fuchsia-100 max-w-2xl mx-auto mb-10">
          World-class fashion education rooted in African heritage. Learn from industry professionals and launch your fashion career.
        </p>
        <Link href="/contact" className="btn-outline-white">Inquire Now</Link>
      </div>

      {/* Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-fuchsia mb-3">Curriculum</p>
            <h2 className="section-title">Our Courses</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.title} className="bg-white p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{course.icon}</div>
                <span className="font-sans text-xs tracking-widest uppercase text-brand-fuchsia">{course.level}</span>
                <h3 className="font-display text-xl font-400 text-brand-charcoal my-2">{course.title}</h3>
                <p className="font-sans text-xs text-gray-400 mb-4">Duration: {course.duration}</p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-lg font-500 text-brand-charcoal">{course.price}</span>
                  <Link href="/contact" className="font-sans text-xs text-brand-fuchsia hover:underline tracking-widest uppercase">Enrol →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-fuchsia text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-400 mb-4">Ready to Begin Your Journey?</h2>
          <p className="font-body text-base text-white/80 mb-8">Contact us today for enrollment, custom training, or corporate packages.</p>
          <Link href="/contact" className="btn-outline-white">Get in Touch</Link>
        </div>
      </section>
    </div>
  )
}
