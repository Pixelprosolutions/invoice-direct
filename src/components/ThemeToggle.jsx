import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={styles.toggleContainer}>
      <button 
        className={`${styles.themeToggle} ${isDarkMode ? styles.dark : styles.light}`}
        onClick={toggleTheme}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className={styles.toggleTrack}>
          <FaSun className={`${styles.icon} ${styles.sunIcon}`} />
          <FaMoon className={`${styles.icon} ${styles.moonIcon}`} />
        </div>
        <div className={styles.toggleThumb}>
          {isDarkMode ? <FaMoon className={styles.activeIcon} /> : <FaSun className={styles.activeIcon} />}
        </div>
        <span className={styles.toggleRipple} />
      </button>
    </div>
  );
};

export default ThemeToggle;
