import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface HealthResponse {
  status: string
  timestamp: string
  requests_today: number
  supabase: string
  message?: string
}

function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${API_URL}/health`)
        const data: HealthResponse = await res.json()

        if (res.ok && data.status === 'ok') {
          setConnectionStatus('connected')
          setHealth(data)
        } else {
          setConnectionStatus('error')
          setErrorMessage(data.message || `Status: ${data.status}`)
        }
      } catch (err) {
        setConnectionStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Failed to reach backend')
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        UpliftRoom
      </h1>
      <p className="text-lg mb-8 text-gray-400">
        Cannabis Lifestyle Website Boilerplate
      </p>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">System Status</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Frontend (Vite + React):</span>
            <span className="text-green-400 font-mono">Active</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Backend (Worker):</span>
            <span className={`font-mono px-2 py-1 rounded text-sm ${connectionStatus === 'connected' ? 'bg-green-900 text-green-300' :
              connectionStatus === 'error' ? 'bg-red-900 text-red-300' :
                'bg-yellow-900 text-yellow-300'
              }`}>
              {connectionStatus === 'checking' ? 'Checking...' :
                connectionStatus === 'connected' ? 'Connected' : 'Error'}
            </span>
          </div>

          {health && connectionStatus === 'connected' && (
            <div className="mt-2 p-3 bg-green-900/30 border border-green-800 rounded text-sm text-green-200 space-y-1">
              <p><span className="text-gray-400">Supabase:</span> {health.supabase}</p>
              <p><span className="text-gray-400">Requests Today:</span> {health.requests_today}</p>
              <p><span className="text-gray-400">Timestamp:</span> {health.timestamp}</p>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-sm text-red-200">
              <p className="font-bold">Connection Failed:</p>
              <p>{errorMessage}</p>
              <p className="mt-2 text-xs opacity-75">Check that the backend Worker is deployed and accessible.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-gray-500 text-sm">
        <p>Edit <code className="text-gray-400">src/App.tsx</code> to start building.</p>
      </div>
    </div>
  )
}

function AdminPage() {
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null)

  function handleLoginSuccess(username: string) {
    setAuthenticatedUser(username)
  }

  function handleLogout() {
    setAuthenticatedUser(null)
  }

  if (authenticatedUser) {
    return <AdminDashboard username={authenticatedUser} onLogout={handleLogout} />
  }

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatusPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
