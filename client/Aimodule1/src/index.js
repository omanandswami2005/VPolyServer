import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
// import './styles/welToastStyle.css'; // Import your global CSS file
    import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataProvider } from './DataContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
     <DataProvider>
    <App />
    </DataProvider>
  </Router>
    
  
);