/* REACT */
import React from 'react';
import ReactDOM from 'react-dom/client';
/* CUSTOM COMPONENTS */
import App from './App';
import reportWebVitals from './reportWebVitals';
/* STYLES */
import './index.css';
// const loc = window.location;
// axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${loc.hostname === 'localhost' ? ':8080' : ''}`
// import socketIO from 'socket.io-client';

// const socket = socketIO.connect('http://localhost:5001');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
