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
    title: 'What’s Trending in 2026',
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
      className={`group relative rounded-2xl border p-5 md:p-6 transition-all hover:shadow-lg ${tile.span ?? ''} ${
        isArticle
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400/60 dark:hover:border-indigo-500/60'
          : 'bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-cyan-200/70 dark:border-slate-700 hover:border-cyan-400/60 dark:hover:border-cyan-500/60'
      }`}
    >
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold mb-4 ${
        isArticle
          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
          : 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300'
      }`}>
        {isArticle ? 'Article' : 'Product'}
      </span>
      <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">{tile.title}</h3>
      <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">{tile.description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400">
        Explore
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent dark:from-cyan-500/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-6 md:space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              UpliftRoom
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto px-4">
              Products + stories, mixed for a modern cannabis lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 md:pt-8 px-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all transform hover:scale-105 text-center"
              >
                Shop the Edit
              </Link>

              <Link
                to="/latest"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/95 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center"
              >
                Read Latest
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">Featured Mix</h2>
          <Link to="/latest" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
            View more articles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {spotlightTiles.map(tile => (
            <SpotlightCard key={tile.title} tile={tile} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {articleHighlights.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{item.excerpt}</p>
              <Link to="/latest" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View more →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
