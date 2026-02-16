
import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState<string>('Connecting...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Simple query to check if we can connect to Supabase
        // We might not have a table yet, but auth.getSession() is a safe public method to check basic connectivity
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setStatus('Connected to Supabase! ✅')
        console.log('Supabase Session Data:', data)
      } catch (err: any) {
        setStatus('Connection Failed ❌')
        setError(err.message || 'Unknown error')
        console.error('Supabase connection error:', err)
      }
    }

    checkConnection()
  }, [])

  return (
    <>
      <h1>Uplift Room</h1>
      <div className="card">
        <h2>System Status</h2>
        <p>
          Supabase Connection: <strong>{status}</strong>
        </p>
        {error && (
          <p style={{ color: 'red' }}>
            Error: {error}
          </p>
        )}
        <p>
          Edit <code>src/App.tsx</code> to start building.
        </p>
      </div>
    </>
  )
}

export default App
