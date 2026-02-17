export default function AboutPage() {
  const sections = [
    {
      title: 'Our Mission',
      content: `UpliftRoom is your modern lifestyle destination for cannabis culture and education. We're building a community-focused platform that celebrates cannabis in a responsible, informed, and lifestyle-forward way.`,
    },
    {
      title: 'What We Do',
      content: 'We provide an informational platform where you can:',
      list: [
        'Explore curated cannabis products with detailed, compliance-friendly descriptions',
        'Stay updated with the latest cannabis industry news and culture',
        'Learn about different product types, effects, and responsible use',
        'Discover lifestyle content that celebrates cannabis culture',
      ],
    },
    {
      title: 'Our Approach',
      content: 'We believe in a modern, responsible approach to cannabis:',
      list: [
        'Compliance First \u2014 We use experience-based language and avoid medical claims',
        'Education Focused \u2014 Providing accurate, helpful information for informed decisions',
        'Lifestyle Forward \u2014 Celebrating cannabis as part of a balanced, modern lifestyle',
        'Community Driven \u2014 Building a welcoming space for cannabis enthusiasts',
      ],
    },
    {
      title: 'Important Information',
      content: 'This is an informational website. We do not:',
      list: [
        'Sell products online',
        'Process payments or transactions',
        'Offer delivery services',
        'Provide medical advice or make health claims',
      ],
      footer: 'All product information is for educational purposes. Effects may vary by person. This site is intended for adults 21+ in jurisdictions where cannabis is legal.',
    },
  ]

  return (
    <div className="page-section">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/upliftroom-logo.svg"
              alt="UpliftRoom"
              className="w-16 h-16"
            />
          </div>
          <h1 className="section-title mb-3">About UpliftRoom</h1>
          <p className="section-subtitle mx-auto" style={{ maxWidth: '480px' }}>
            Cannabis education, curated products, and lifestyle culture.
          </p>
        </div>

        <div className="space-y-5">
          {sections.map(section => (
            <div key={section.title} className="card p-8 md:p-10">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
              >
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {section.content}
              </p>
              {section.list && (
                <ul className="space-y-2.5 mb-4">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: 'var(--color-accent)' }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {section.footer && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
                  {section.footer}
                </p>
              )}
            </div>
          ))}

          <div
            className="card p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.06))',
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
            >
              Built for the Community
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              UpliftRoom is built by cannabis enthusiasts, for cannabis enthusiasts. We're constantly evolving based on
              community feedback and industry developments. Our goal is to create the most helpful, modern, and
              accessible cannabis information platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
