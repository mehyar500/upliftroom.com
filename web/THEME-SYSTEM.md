# Theme System Documentation

## Overview
The theme system uses Tailwind CSS v4 with class-based dark mode. The theme is managed globally through React Context and persists across sessions using localStorage.

## How It Works

### 1. Theme Context (`src/context/ThemeContext.tsx`)
- Provides `theme` state ('light' | 'dark')
- Provides `toggleTheme()` function
- Automatically applies theme class to `<html>` element
- Saves preference to localStorage
- Includes console logs for debugging

### 2. Initial Theme Loading (`index.html`)
- Script runs before React loads to prevent flash
- Reads theme from localStorage (defaults to 'dark')
- Applies class to `<html>` element immediately

### 3. Tailwind Configuration (`tailwind.config.ts`)
- Configured with `darkMode: 'class'`
- Watches all component files for class names

### 4. CSS (`src/index.css`)
- Minimal, clean setup
- Only imports Tailwind and basic resets
- No conflicting styles

## Usage

### In Components
```tsx
import { useTheme } from '../context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

### Tailwind Classes
Use `dark:` prefix for dark mode styles:
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

## Files Structure
```
web/
├── index.html                    # Theme initialization script
├── tailwind.config.ts            # Tailwind v4 config
├── postcss.config.js             # PostCSS config
├── src/
│   ├── index.css                 # Global styles (minimal)
│   ├── main.tsx                  # ThemeProvider wrapper
│   ├── context/
│   │   └── ThemeContext.tsx      # Theme state management
│   └── components/
│       ├── Layout.tsx            # Uses theme classes
│       └── Navbar.tsx            # Theme toggle button
```

## Debugging
The ThemeContext includes console.log statements:
- Check browser console for "Theme changed to: [theme]"
- Check "Classes: [html classes]"
- Verify localStorage has 'theme' key

## Common Issues

### Theme not switching?
1. Check browser console for errors
2. Verify `<html>` element has 'dark' or 'light' class
3. Check localStorage has correct value
4. Restart dev server

### Styles not applying?
1. Ensure Tailwind classes use `dark:` prefix
2. Check that component is wrapped in ThemeProvider
3. Verify tailwind.config.ts has `darkMode: 'class'`

## DRY Principle
- Single CSS file (`index.css`)
- Single theme context
- All components use same theme classes
- Layout component wraps all pages
- No duplicate theme logic
