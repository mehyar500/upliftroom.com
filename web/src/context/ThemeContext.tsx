import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './theme'
import type { Theme } from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
    }
    return 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme

    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const root = window.document.documentElement
    const currentTheme: Theme = root.classList.contains('dark') ? 'dark' : 'light'
    const nextTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
