/* REACT */
import React from 'react';
import ReactDOM from 'react-dom/client';
/* CUSTOM COMPONENTS */
import App from './App';
import reportWebVitals from './reportWebVitals';
/* STYLES */
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
