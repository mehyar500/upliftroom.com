import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import LatestPage from './pages/LatestPage'
import PrivacyPage from './pages/PrivacyPage'
import AboutPage from './pages/AboutPage'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { useState } from 'react'
import './index.css'

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

  return (
    <Layout>
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
      <Route path="/latest" element={<Layout><LatestPage /></Layout>} />
      <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
      <Route path="/terms" element={<Layout><PrivacyPage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
