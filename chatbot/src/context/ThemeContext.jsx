import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('chatTheme') || 'blue';
  });
  useEffect(()=>
    {
    localStorage.setItem('chatTheme', theme);
    applyTheme(theme);
  }, [theme]);
  const applyTheme=(themeName)=>
    {
    const root=document.documentElement;
    root.style.setProperty('--primary', getThemeColor(themeName).primary);
    root.style.setProperty('--primary-hover', getThemeColor(themeName).hover);
    root.style.setProperty('--primary-dark', getThemeColor(themeName).dark);
    root.style.setProperty('--bg-light', getThemeColor(themeName).bgLight);
    root.style.setProperty('--bg-dark', getThemeColor(themeName).bgDark);
    root.style.setProperty('--text-light', getThemeColor(themeName).textLight);
    root.style.setProperty('--text-dark', getThemeColor(themeName).textDark);
    root.style.setProperty('--border-light', getThemeColor(themeName).borderLight);
    root.style.setProperty('--border-dark', getThemeColor(themeName).borderDark);
  };
  const getThemeColor=(name)=>
    {
    const themes=
    {
      blue:
      {
        primary: '#1976d2',
        hover: '#1565c0',
        dark: '#005bb3',
        bgLight: '#e3f2fd',
        bgDark: '#007bff',
        textLight: '#2c3e50',
        textDark: '#ffffff',
        borderLight: '#e0e0e0',
        borderDark: '#333'
      },
      green:
    {
        primary: '#388e3c',
        hover: '#2e7d32',
        dark: '#1b5e20',
        bgLight: '#e8f5e9',
        bgDark: '#4caf50',
        textLight: '#2c3e50',
        textDark: '#ffffff',
        borderLight: '#e0e0e0',
        borderDark: '#333'
      },
      purple:
      {
        primary: '#7b1fa2',
        hover: '#6a1b9a',
        dark: '#4a148c',
        bgLight: '#f3e5f5',
        bgDark: '#9c27b0',
        textLight: '#2c3e50',
        textDark: '#ffffff',
        borderLight: '#e0e0e0',
        borderDark: '#333'
      }
    };
    return themes[name] || themes.blue;
  };
  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: ['blue', 'green', 'purple'] }}>
      {children}
    </ThemeContext.Provider>
  );
};