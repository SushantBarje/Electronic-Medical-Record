import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login/Login';
import PatientDashboard from './components/PatientDashboard/PatientDashboard';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/admin/login" element={<Login/>}></Route>
        <Route path="/patient/dashboard" element={<PatientDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

