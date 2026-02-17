import { useState } from 'react'
import { Link } from 'react-router-dom'

function NewsletterModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zip: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Dummy endpoint for now
    await new Promise(resolve => setTimeout(resolve, 800))
    
    console.log('Newsletter signup:', formData)
    setSubmitted(true)
    
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[480px] rounded-3xl overflow-hidden animate-[slideUp_0.3s_ease-out] relative"
        style={{ background: 'var(--color-bg-elevated)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)', boxShadow: 'var(--shadow-md)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div style={{ padding: '32px' }}>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-accent)', opacity: 0.15 }}>
                <svg className="w-8 h-8" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>You're all set!</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Thanks for signing up. We'll keep you updated.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                Stay in the loop
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Get updates on new products, articles, and cannabis culture.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm"
                      style={{ 
                        background: 'var(--color-bg)', 
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm"
                      style={{ 
                        background: 'var(--color-bg)', 
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Email <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{ 
                      background: 'var(--color-bg)', 
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{ 
                      background: 'var(--color-bg)', 
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{ 
                      background: 'var(--color-bg)', 
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="12345"
                    maxLength={5}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                  style={{ marginTop: '24px' }}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>

                <p className="text-[11px] text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                  By signing up, you agree to receive updates from UpliftRoom. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const [showNewsletter, setShowNewsletter] = useState(false)

  return (
    <>
      <footer
        className="mt-auto"
        style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
      >
        <div className="container py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img src="/upliftroom-logo.svg" alt="UpliftRoom" className="w-8 h-8 rounded-lg" />
                <span className="text-lg font-bold tracking-tight gradient-text">UpliftRoom</span>
              </Link>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                Cannabis education, curated products, and lifestyle culture.
              </p>
              <button
                onClick={() => setShowNewsletter(true)}
                className="text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-accent)' }}
              >
                Join our newsletter &rarr;
              </button>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '/products', label: 'Products' },
                  { to: '/menu', label: 'Menu' },
                  { to: '/latest', label: 'Latest News' },
                ].map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms of Service' },
                ].map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              &copy; {new Date().getFullYear()} UpliftRoom. All rights reserved.
            </p>
            <p className="text-xs text-center sm:text-right" style={{ color: 'var(--color-text-tertiary)' }}>
              Informational website. We do not sell products online. Effects may vary.
            </p>
          </div>
        </div>
      </footer>

      {showNewsletter && <NewsletterModal onClose={() => setShowNewsletter(false)} />}
    </>
  )
}
