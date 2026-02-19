'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

interface FormData {
  fullName: string
  phoneNumber: string
  emailAddress: string
}

interface FormErrors {
  fullName?: string
  phoneNumber?: string
  emailAddress?: string
}

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    emailAddress: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    // Phone validation
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required'
    } else if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            full_name: formData.fullName.trim(),
            phone_number: formData.phoneNumber.trim(),
            email_address: formData.emailAddress.trim().toLowerCase(),
            status: 'waitlist'
          }
        ])

      if (error) {
        // Check for unique constraint violation
        if (error.code === '23505') {
          setErrors({ emailAddress: 'This email is already on the waitlist!' })
          setSubmitStatus('error')
        } else {
          throw error
        }
      } else {
        setSubmitStatus('success')
        setFormData({ fullName: '', phoneNumber: '', emailAddress: '' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    if (submitStatus === 'error') {
      setSubmitStatus('idle')
    }
  }

  return (
    <section
      id="waitlist-form"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-3xl bg-dark-lighter border border-white/10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Limited Spots Available
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Join the <span className="gradient-text">Waitlist</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Be the first to know when our exclusive drops go live. No spam, just fresh caps.
              </p>
            </div>

            {/* Success message */}
            {submitStatus === 'success' && (
              <div className="mb-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center animate-float">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You&apos;re on the list! 🔥</h3>
                <p className="text-gray-400">We&apos;ll hit you up when the next drop is ready.</p>
              </div>
            )}

            {/* Form */}
            {submitStatus !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-5 py-4 rounded-xl bg-dark border transition-all duration-300 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-5 py-4 rounded-xl bg-dark border transition-all duration-300 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                      errors.phoneNumber
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-5 py-4 rounded-xl bg-dark border transition-all duration-300 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                      errors.emailAddress
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {errors.emailAddress && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.emailAddress}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 animate-glow hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      Join the Waitlist
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Privacy note */}
                <p className="text-center text-sm text-gray-500">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}