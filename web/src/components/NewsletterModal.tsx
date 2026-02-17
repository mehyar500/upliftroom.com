import { useState, useEffect } from 'react'

interface NewsletterModalProps {
  onClose: () => void
}

export default function NewsletterModal({ onClose }: NewsletterModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zip: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'
      
      const response = await fetch(`${API_URL}/newsletter/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.status === 'ok') {
        setSubmitted(true)
        
        // Show different message for retry
        if (data.data?.isRetry) {
          console.log('Re-signup successful, Brevo sync retried')
        }
        
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError(data.message || 'Failed to subscribe. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Newsletter signup error:', err)
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
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

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                {error && (
                  <div 
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444'
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      name="given-name"
                      autoComplete="given-name"
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
                      name="family-name"
                      autoComplete="family-name"
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
                    name="email"
                    autoComplete="email"
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
                    name="tel"
                    autoComplete="tel"
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
                    name="postal-code"
                    autoComplete="postal-code"
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
