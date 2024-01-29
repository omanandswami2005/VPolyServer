import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataProvider } from './DataContext';
import { DarkModeProvider } from './DarkModeContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </LocalizationProvider>
        </DataProvider>
      </DarkModeProvider>
    </Router>
  );
};

root.render(<RootComponent />);
