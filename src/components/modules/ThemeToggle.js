import { useState, useEffect } from 'react';
import Sol from '../../images/sol.png';
import Luna from '../../images/luna.png';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const darkMode = savedTheme === 'dark';
      setIsDarkMode(darkMode);
      document.body.classList.toggle('dark-mode', darkMode);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button className="ThemeToggle" onClick={toggleTheme}>
      {isDarkMode ? <img className="sol" src={Sol} alt="Sol" />  : <img className="luna" src={Luna} alt="Luna" />}
    </button>
  );
};

export default ThemeToggle;
