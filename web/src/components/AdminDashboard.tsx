import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductsTab from './admin/ProductsTab'
import NewsletterTab from './admin/NewsletterTab'
import Footer from './Footer'

interface AdminDashboardProps {
  username: string
  onLogout: () => void
}

type TabType = 'products' | 'newsletter' | 'blog' | 'settings'

export default function AdminDashboard({ username, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('products')

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              UpliftRoom Admin
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                <span className="text-white font-medium">{username}</span>
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'newsletter'
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
              }`}
            >
              Newsletter
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'blog'
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'products' && <ProductsTab />}
        
        {activeTab === 'newsletter' && <NewsletterTab />}
        
        {activeTab === 'blog' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Blog management coming soon</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Settings coming soon</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
