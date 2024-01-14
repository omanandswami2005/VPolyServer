import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataProvider } from './DataContext';
import { DarkModeProvider } from './DarkModeContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

const RootComponent = () => {
  const storedDarkMode = localStorage.getItem('darkMode');
  const [isDarkMode, setDarkMode] = useState(storedDarkMode ? JSON.parse(storedDarkMode) : false);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  return (
    <Router>
      <DarkModeProvider>
        <DataProvider>
          <App isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </DataProvider>
      </DarkModeProvider>
    </Router>
  );
};

root.render(<RootComponent />);
