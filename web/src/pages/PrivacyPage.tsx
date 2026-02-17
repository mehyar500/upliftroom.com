export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-slate-700 dark:text-slate-300">
              UpliftRoom ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Information We Collect</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              As an informational website, we collect minimal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Newsletter Emails:</strong> If you subscribe to our newsletter (optional)</li>
              <li><strong>Analytics Data:</strong> Basic usage statistics (page views, device type, browser)</li>
              <li><strong>IP Addresses:</strong> For rate limiting and security purposes</li>
              <li><strong>Cookies:</strong> Essential cookies for site functionality and preferences</li>
            </ul>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">How We Use Your Information</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Send newsletter updates (only if you subscribe)</li>
              <li>Improve website performance and user experience</li>
              <li>Prevent abuse and maintain security</li>
              <li>Analyze usage patterns to enhance our content</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Data Storage & Security</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Your data is stored securely using industry-standard encryption and security practices. We use Supabase
              for data storage, which provides enterprise-grade security. We retain data only as long as necessary for
              the purposes outlined in this policy.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Third-Party Services</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Analytics:</strong> To understand how visitors use our site</li>
              <li><strong>Content Delivery:</strong> To serve content quickly and reliably</li>
              <li><strong>Email Services:</strong> To send newsletters (if subscribed)</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from newsletters at any time</li>
              <li>Opt-out of analytics tracking</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Cookies</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We use essential cookies to remember your preferences (like theme selection) and maintain site
              functionality. We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Age Restriction</h2>
            <p className="text-slate-700 dark:text-slate-300">
              This website is intended for adults 21 years of age or older in jurisdictions where cannabis is legal. We
              do not knowingly collect information from individuals under 21.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We may update this privacy policy from time to time to reflect changes in our practices or legal
              requirements. Changes will be posted on this page with an updated revision date. We encourage you to
              review this policy periodically.
            </p>
          </section>

          <section className="bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-cyan-900/20 dark:to-indigo-900/20 rounded-2xl p-4 md:p-6 border border-cyan-200 dark:border-cyan-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-slate-700 dark:text-slate-300">
              If you have questions about this privacy policy or wish to exercise your rights, please contact us through
              our website. We'll respond to your inquiry as soon as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}



