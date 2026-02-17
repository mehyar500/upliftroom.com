import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

type Tile = {
  title: string
  description: string
  to: string
  type: 'product' | 'article'
  span?: string
  image: string
}

const spotlightTiles: Tile[] = [
  {
    title: 'Microdose Gummies',
    description: 'Functional, balanced, and easy to dose for daytime flow.',
    to: '/products',
    type: 'product',
    span: 'md:col-span-2',
    image: '/images/tile-gummies.png',
  },
  {
    title: 'Night Ritual Picks',
    description: 'Calming blends curated for a slower evening landing.',
    to: '/products',
    type: 'product',
    image: '/images/tile-night.png',
  },
  {
    title: "What's Trending",
    description: 'Fresh reads on cannabis culture, wellness, and design.',
    to: '/latest',
    type: 'article',
    image: '/images/tile-trending.png',
  },
  {
    title: 'Pre-roll Edit',
    description: 'Staff-favorite pre-rolls for social and creative sessions.',
    to: '/products',
    type: 'product',
    image: '/images/tile-preroll.png',
  },
  {
    title: 'Find Your Profile',
    description: 'Match your vibe to the right product profile.',
    to: '/latest',
    type: 'article',
    span: 'md:col-span-2',
    image: '/images/tile-profile.png',
  },
]

const guides = [
  {
    title: 'Know Your Product Types',
    excerpt: 'Flower, vapes, edibles, concentrates — understand each format and what to expect.',
  },
  {
    title: 'Session Design 101',
    excerpt: 'Rituals, playlists, and pairings for a premium at-home experience.',
  },
  {
    title: 'Culture Snapshot',
    excerpt: 'The creators, trends, and communities shaping modern cannabis lifestyle.',
  },
]

function SpotlightCard({ tile }: { tile: Tile }) {
  const isArticle = tile.type === 'article'

  return (
    <Link
      to={tile.to}
      className={`card group relative overflow-hidden flex flex-col ${tile.span ?? ''}`}
    >
      <div
        className="w-full overflow-hidden"
        style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
      >
        <img
          src={tile.image}
          alt={tile.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div style={{ padding: '20px 24px 24px' }} className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${isArticle ? 'badge-accent' : 'badge-cyan'}`}>
            {isArticle ? 'Guide' : 'Product'}
          </span>
        </div>
        <h3
          className="text-lg font-semibold mb-1.5 transition-colors"
          style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
        >
          {tile.title}
        </h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-text-secondary)' }}>
          {tile.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold gradient-text">
          Explore
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  useSEO()

  return (
    <div>
      <section className="relative overflow-hidden" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="absolute inset-0">
          <img
            src="/images/hero-gradient.png"
            alt=""
            className="w-full h-full object-cover opacity-40"
            style={{ mixBlendMode: 'screen' }}
          />
          <div className="absolute inset-0" style={{ background: 'var(--color-bg)', opacity: 0.6 }} />
        </div>

        <div
          className="relative"
          style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <img
              src="/upliftroom-logo.svg"
              alt="UpliftRoom"
              style={{ width: '96px', height: '96px' }}
            />
          </div>

          <h1
            className="gradient-text"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
            }}
          >
            UpliftRoom
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.375rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '540px',
              margin: '24px auto 0',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            Explore cannabis culture, learn about products, and find your vibe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ marginTop: '40px' }}>
            <Link to="/products" className="btn-primary w-full sm:w-auto">
              Explore Products
            </Link>
            <Link to="/latest" className="btn-secondary w-full sm:w-auto">
              Read &amp; Learn
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Curated for You</h2>
            <p className="section-subtitle mx-auto" style={{ maxWidth: '480px' }}>
              Handpicked products and reads based on what people love right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {spotlightTiles.map(tile => (
              <SpotlightCard key={tile.title} tile={tile} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="text-sm font-semibold transition-opacity hover:opacity-70 inline-flex items-center gap-1"
              style={{ color: 'var(--color-accent)' }}
            >
              View all products &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Learn &amp; Discover</h2>
            <p className="section-subtitle mx-auto" style={{ maxWidth: '500px' }}>
              Guides, culture, and everything you need to make informed choices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {guides.map(item => (
              <article key={item.title} className="card" style={{ padding: '28px 28px 24px' }}>
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

      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div
            className="rounded-3xl text-center relative overflow-hidden"
            style={{
              padding: '56px 32px',
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
            <p className="mb-8 mx-auto" style={{ color: 'var(--color-text-secondary)', maxWidth: '440px' }}>
              Browse our curated product menu or dive into guides and culture reads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu" className="btn-primary">
                View Menu
              </Link>
              <Link to="/latest" className="btn-secondary">
                Latest Reads
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
