/* REACT */
import React from 'react';
import ReactDOM from 'react-dom/client';
/* AXIOS */
import axios from 'axios';
/* STYLES */
import './index.css';
// const loc = window.location;
// axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${loc.hostname === 'localhost' ? ':8080' : ''}`
/* CUSTOM COMPONENTS */
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
