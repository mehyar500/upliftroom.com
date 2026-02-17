import { useSEO } from '../hooks/useSEO'

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy',
    description: 'UpliftRoom privacy policy. Learn how we collect, use, and protect your personal information.',
    canonical: 'https://upliftroom.com/privacy',
  })

  const sections = [
    {
      title: 'Introduction',
      content: `UpliftRoom ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.`,
    },
    {
      title: 'Information We Collect',
      content: 'As an informational website, we collect minimal data:',
      list: [
        'Newsletter Emails \u2014 If you subscribe to our newsletter (optional)',
        'Analytics Data \u2014 Basic usage statistics (page views, device type, browser)',
        'IP Addresses \u2014 For rate limiting and security purposes',
        'Cookies \u2014 Essential cookies for site functionality and preferences',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: 'We use collected information to:',
      list: [
        'Send newsletter updates (only if you subscribe)',
        'Improve website performance and user experience',
        'Prevent abuse and maintain security',
        'Analyze usage patterns to enhance our content',
        'Comply with legal obligations',
      ],
    },
    {
      title: 'Data Storage & Security',
      content: 'Your data is stored securely using industry-standard encryption and security practices. We use Supabase for data storage, which provides enterprise-grade security. We retain data only as long as necessary for the purposes outlined in this policy.',
    },
    {
      title: 'Third-Party Services',
      content: 'We may use third-party services for:',
      list: [
        'Analytics \u2014 To understand how visitors use our site',
        'Content Delivery \u2014 To serve content quickly and reliably',
        'Email Services \u2014 To send newsletters (if subscribed)',
      ],
      footer: 'These services have their own privacy policies. We encourage you to review them.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to:',
      list: [
        'Access your personal data',
        'Request correction of inaccurate data',
        'Request deletion of your data',
        'Unsubscribe from newsletters at any time',
        'Opt-out of analytics tracking',
        'Export your data in a portable format',
      ],
    },
    {
      title: 'Cookies',
      content: 'We use essential cookies to remember your preferences (like theme selection) and maintain site functionality. We do not use tracking cookies for advertising purposes.',
    },
    {
      title: 'Age Restriction',
      content: 'This website is intended for adults 21 years of age or older in jurisdictions where cannabis is legal. We do not knowingly collect information from individuals under 21.',
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. Changes will be posted on this page with an updated revision date.',
    },
  ]

  return (
    <div className="page-section">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-5">
          {sections.map(section => (
            <div key={section.title} className="card p-6 md:p-8">
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
              Contact Us
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              If you have questions about this privacy policy or wish to exercise your rights, please contact us through
              our website. We'll respond to your inquiry as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
