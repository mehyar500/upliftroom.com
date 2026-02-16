interface AdminDashboardProps {
  username: string
  onLogout: () => void
}

export default function AdminDashboard({ username, onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                UpliftRoom Admin
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Logged in as <span className="text-white font-medium">{username}</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {username}!</h2>
          <p className="text-gray-400 mb-6">
            You are successfully logged in to the admin dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Products</h3>
              <p className="text-gray-400 text-sm">Manage your product catalog</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Blog Posts</h3>
              <p className="text-gray-400 text-sm">Create and edit blog content</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Settings</h3>
              <p className="text-gray-400 text-sm">Configure site settings</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
