import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css'; // Asumsikan Anda punya file CSS global
import App from './App';

// 1. Cari elemen HTML dengan id 'root' di file public/index.html
const rootElement = document.getElementById('root');

// 2. Buat "akar" aplikasi React di dalam elemen tersebut
const root = ReactDOM.createRoot(rootElement);

// 3. Render komponen utama kita (<App />) ke dalam akar tersebut
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);