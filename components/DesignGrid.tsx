'use client'

import { useState, useEffect, useRef } from 'react'

interface CapDesign {
  id: number
  name: string
  description: string
  image: string
  tag: string
}

const capDesigns: CapDesign[] = [
  {
    id: 1,
    name: 'Neon Velocity',
    description: 'Electric vibes for the night crawlers',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop',
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Cyber Punk',
    description: 'Future-forward aesthetic',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
    tag: 'New Drop'
  },
  {
    id: 3,
    name: 'Street Legend',
    description: 'Classic with an edge',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
    tag: 'Limited'
  },
  {
    id: 4,
    name: 'Retro Wave',
    description: '80s nostalgia reimagined',
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop',
    tag: 'Trending'
  },
  {
    id: 5,
    name: 'Midnight Hype',
    description: 'Dark mode activated',
    image: 'https://images.unsplash.com/photo-1575428652377-a2697242636b?w=600&h=600&fit=crop',
    tag: 'Exclusive'
  },
  {
    id: 6,
    name: 'Solar Flare',
    description: 'Bold and unapologetic',
    image: 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?w=600&h=600&fit=crop',
    tag: 'Hot'
  }
]

function DesignCard({ design, index }: { design: CapDesign; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const tagColors: Record<string, string> = {
    'Best Seller': 'bg-primary',
    'New Drop': 'bg-accent-cyan',
    'Limited': 'bg-accent-purple',
    'Trending': 'bg-accent-yellow',
    'Exclusive': 'bg-primary',
    'Hot': 'bg-red-500'
  }

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl bg-dark-lighter transition-all duration-700 hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={design.image}
          alt={design.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
        
        {/* Tag */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${tagColors[design.tag] || 'bg-primary'}`}>
          {design.tag}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
          {design.name}
        </h3>
        <p className="text-gray-400 text-sm">
          {design.description}
        </p>
      </div>
    </div>
  )
}

export default function DesignGrid() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="designs" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            The Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Drop-Ready <span className="gradient-text">Designs</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Each piece is crafted for those who dare to stand out. Limited quantities. Maximum impact.
          </p>
        </div>

        {/* Design grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capDesigns.map((design, index) => (
            <DesignCard key={design.id} design={design} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Want to see these drops first?</p>
          <a
            href="#waitlist-form"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Join the waitlist
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}