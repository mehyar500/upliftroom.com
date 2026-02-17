import { Link } from 'react-router-dom'

export default function Footer() {
  return (
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
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
              Your lifestyle destination for premium cannabis products and culture.
            </p>
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
  )
}
