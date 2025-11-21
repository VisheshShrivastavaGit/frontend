import React from 'react'

const ThemeContext = React.createContext(null)

export function useTheme() {
  return React.useContext(ThemeContext)
}

function applyDocumentTheme(theme) {
  try {
    const el = document.body;
    if (!el) return;
    if (theme === 'dark') {
      el.classList.add('dark');
      el.setAttribute('data-theme', 'dark');
    } else {
      el.classList.remove('dark');
      el.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    alert('Failed to apply theme');
  }
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(() => {
    try {
      const t = localStorage.getItem('theme')
      return t === 'dark' ? 'dark' : 'light'
    } catch (e) {
      return 'light'
    }
  })

  React.useEffect(() => {
    applyDocumentTheme(theme)
    try { localStorage.setItem('theme', theme) } catch (e) {}
  }, [theme])

  const toggle = React.useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = React.useMemo(() => ({ theme, setTheme, toggle }), [theme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
