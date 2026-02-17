import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const KEYBOARD_NAV_ORDER = ['/', '/products', '/menu', '/latest']

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    function handleArrowPageNavigation(event: KeyboardEvent) {
      if (event.defaultPrevented) return

      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
          return
        }
      }

      const currentIndex = KEYBOARD_NAV_ORDER.indexOf(location.pathname)
      if (currentIndex < 0) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % KEYBOARD_NAV_ORDER.length
        navigate(KEYBOARD_NAV_ORDER[nextIndex])
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prevIndex = (currentIndex - 1 + KEYBOARD_NAV_ORDER.length) % KEYBOARD_NAV_ORDER.length
        navigate(KEYBOARD_NAV_ORDER[prevIndex])
      }
    }

    window.addEventListener('keydown', handleArrowPageNavigation)
    return () => {
      window.removeEventListener('keydown', handleArrowPageNavigation)
    }
  }, [location.pathname, navigate])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
