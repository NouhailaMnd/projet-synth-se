import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import RegisterPrestataire from './pages/RegisterPrestataire';
import RegisterClient from './pages/RegisterClient';
import RegisterEntreprise from './pages/RegisterEntreprise';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<RegisterPrestataire />} />
          <Route path="/Entreprise" element={<RegisterEntreprise />} />
          <Route path="/Client" element={<RegisterClient />} />

        </Route>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' />dashboard
      </Routes>
    </Router>
  );
}

export default App;
