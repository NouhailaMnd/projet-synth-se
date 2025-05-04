import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './components/Register';
import Dashboard from './pages/Dashboard'; 
import AfficherPrestataire from './pages/AfficherPrestataire'; 
import Layout from './components/Layout';  // Ajoutez le Layout ici
import AfficherPrestations from './pages/AfficherPrestations';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page sans layout */}
        <Route path="/register" element={<Register />} />

        {/* Pages avec layout */}

        
        <Route
          path="/AfficherPrestataire"
          element={
            <Layout>
              <AfficherPrestataire />
            </Layout>
          }
        />
  <Route
          path="/AfficherPrestations"
          element={
            <Layout>
              <AfficherPrestations />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
