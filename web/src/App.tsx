import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './index.css'

function App() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('site_settings').select('count', { count: 'exact', head: true })
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') { // Ignore "relation does not exist" or "no rows" as success connection
          // Actually, if table doesn't exist, it returns 42P01 (undefined_table). This means we connected but table is missing. 
          // That demands we allow 42P01 as a "connected" state for now.
          if (error.code === '42P01') {
            console.log('Connected to Supabase (Table site_settings missing, but connection worked)')
            setConnectionStatus('connected')
            return
          }
          throw error
        }
        setConnectionStatus('connected')
      } catch (err: any) {
        console.error('Supabase connection error:', err)
        setConnectionStatus('error')
        setErrorMessage(err.message || 'Unknown error')
      }
    }

    checkConnection()
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
            <span className="text-gray-300">Backend (Supabase):</span>
            <span className={`font-mono px-2 py-1 rounded text-sm ${connectionStatus === 'connected' ? 'bg-green-900 text-green-300' :
                connectionStatus === 'error' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
              }`}>
              {connectionStatus === 'checking' ? 'Checking...' :
                connectionStatus === 'connected' ? 'Connected' : 'Error'}
            </span>
          </div>

          {connectionStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-sm text-red-200">
              <p className="font-bold">Connection Failed:</p>
              <p>{errorMessage}</p>
              <p className="mt-2 text-xs opacity-75">Check your .env file and ensure Supabase URL/Key are correct.</p>
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

export default App
