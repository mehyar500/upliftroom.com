import { Link } from 'react-router-dom'

type Tile = {
  title: string
  description: string
  to: string
  type: 'product' | 'article'
  span?: string
}

const spotlightTiles: Tile[] = [
  {
    title: 'Microdose Gummies',
    description: 'Functional, balanced, and easy to dose for daytime flow.',
    to: '/products',
    type: 'product',
    span: 'md:col-span-2',
  },
  {
    title: 'Night Ritual Picks',
    description: 'Calming blends curated for a slower evening landing.',
    to: '/products',
    type: 'product',
  },
  {
    title: "What's Trending Today",
    description: 'Fresh reads on cannabis culture, wellness, and design.',
    to: '/latest',
    type: 'article',
  },
  {
    title: 'Pre-roll Edit',
    description: 'Staff-favorite pre-rolls for social and creative sessions.',
    to: '/products',
    type: 'product',
  },
  {
    title: 'How to Pick Your Profile',
    description: 'A quick guide to matching product profile with your vibe.',
    to: '/latest',
    type: 'article',
    span: 'md:col-span-2',
  },
]

const articleHighlights = [
  {
    title: 'Beginner-Friendly Product Types',
    excerpt: 'Understand the differences between flower, vapes, edibles, and concentrates.',
  },
  {
    title: 'Designing a Better Session',
    excerpt: 'Simple rituals, playlists, and pairings for a premium at-home setup.',
  },
  {
    title: 'Culture Snapshot',
    excerpt: 'The creators, trends, and communities defining modern cannabis lifestyle.',
  },
]

function SpotlightCard({ tile }: { tile: Tile }) {
  const isArticle = tile.type === 'article'

  return (
    <Link
      to={tile.to}
      className={`card group relative p-6 md:p-8 flex flex-col justify-between ${tile.span ?? ''}`}
    >
      <div>
        <span className={`badge mb-4 ${isArticle ? 'badge-accent' : 'badge-cyan'}`}>
          {isArticle ? 'Article' : 'Product'}
        </span>
        <h3
          className="text-xl font-semibold mb-2 transition-colors"
          style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
        >
          {tile.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {tile.description}
        </p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold gradient-text">
        Explore
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </span>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden page-section" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="absolute inset-0">
          <img
            src="/images/hero-gradient.png"
            alt=""
            className="w-full h-full object-cover opacity-40"
            style={{ mixBlendMode: 'screen' }}
          />
          <div className="absolute inset-0" style={{ background: 'var(--color-bg)', opacity: 0.6 }} />
        </div>

        <div className="container relative text-center">
          <div className="flex justify-center mb-8">
            <img
              src="/upliftroom-logo.svg"
              alt="UpliftRoom"
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl"
              style={{ boxShadow: 'var(--shadow-xl)' }}
            />
          </div>

          <h1
            className="gradient-text mx-auto"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              maxWidth: '700px',
            }}
          >
            UpliftRoom
          </h1>

          <p
            className="mx-auto mt-6"
            style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.375rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '520px',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            Products + stories, mixed for a modern cannabis lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link to="/products" className="btn-primary w-full sm:w-auto">
              Shop the Edit
            </Link>
            <Link to="/latest" className="btn-secondary w-full sm:w-auto">
              Read Latest
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="section-title">Featured Mix</h2>
            <Link
              to="/latest"
              className="text-sm font-semibold transition-opacity hover:opacity-70 hidden sm:block"
              style={{ color: 'var(--color-accent)' }}
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {spotlightTiles.map(tile => (
              <SpotlightCard key={tile.title} tile={tile} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title text-center mb-4">From the Blog</h2>
          <p className="section-subtitle text-center mb-10 mx-auto" style={{ maxWidth: '480px' }}>
            Explore guides, culture, and lifestyle reads.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {articleHighlights.map(item => (
              <article key={item.title} className="card p-6 md:p-8">
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.excerpt}
                </p>
                <Link
                  to="/latest"
                  className="text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08), rgba(34,197,94,0.05))',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2
              className="gradient-text mb-4"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em' }}
            >
              Ready to explore?
            </h2>
            <p className="mb-8 mx-auto" style={{ color: 'var(--color-text-secondary)', maxWidth: '420px' }}>
              Discover curated products and stories designed for your lifestyle.
            </p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
