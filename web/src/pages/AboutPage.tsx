export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
          About UpliftRoom
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300">
              UpliftRoom is your modern lifestyle destination for cannabis culture and education. We're building a
              community-focused platform that celebrates cannabis in a responsible, informed, and lifestyle-forward way.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What We Do</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We provide an informational platform where you can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Explore curated cannabis products with detailed, compliance-friendly descriptions</li>
                <li>Stay updated with the latest cannabis industry news and culture</li>
                <li>Learn about different product types, effects, and responsible use</li>
                <li>Discover lifestyle content that celebrates cannabis culture</li>
              </ul>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Approach</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We believe in a modern, responsible approach to cannabis:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Compliance First:</strong> We use experience-based language and avoid medical claims</li>
                <li><strong>Education Focused:</strong> Providing accurate, helpful information for informed decisions</li>
                <li><strong>Lifestyle Forward:</strong> Celebrating cannabis as part of a balanced, modern lifestyle</li>
                <li><strong>Community Driven:</strong> Building a welcoming space for cannabis enthusiasts</li>
              </ul>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Important Information</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>This is an informational website.</strong> We do not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sell products online</li>
                <li>Process payments or transactions</li>
                <li>Offer delivery services</li>
                <li>Provide medical advice or make health claims</li>
              </ul>
              <p className="mt-4">
                All product information is for educational purposes. Effects may vary by person. This site is intended
                for adults 21+ in jurisdictions where cannabis is legal.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 md:p-8 border border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Built for the Community</h2>
            <p className="text-gray-700 dark:text-gray-300">
              UpliftRoom is built by cannabis enthusiasts, for cannabis enthusiasts. We're constantly evolving based on
              community feedback and industry developments. Our goal is to create the most helpful, modern, and
              accessible cannabis information platform.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technology & Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use modern web technologies to provide a fast, secure, and accessible experience. We collect minimal
              data and prioritize your privacy. Learn more in our{' '}
              <a href="/privacy" className="text-green-500 hover:text-green-600 dark:hover:text-green-400">
                Privacy Policy
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
