import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './components/Register';
import Dashboard from './pages/Dashboard'; 
import AfficherPrestataire from './pages/AfficherPrestataire'; 
import Layout from './components/Layout';  // Ajoutez le Layout ici
import AfficherPrestations from './pages/AfficherPrestations';
import UserTable from './pages/UserTable';
import Gestionservices from './pages/Gestionservices';
import UserStats from './pages/UserStats';
import ReservationTable from './pages/ReservationTable';
import ReservationChart from './pages/ReservationChart';


function App() {
  return (
    <Router>
      <Routes>
        {/* Page sans layout */}
        <Route path="/register" element={<Register />} />

        {/* Pages avec layout */}

        <Route
          path="/UserStats"
          element={
            
            <Layout >
  <UserStats />           
  </Layout>
          }
        />
        <Route
          path="/ReservationTable"
          element={
            
            <Layout >
  <ReservationTable />           
  </Layout>
          }
        />
         <Route
          path="/ReservationChart"
          element={
            
            <Layout >
  <ReservationChart />           
  </Layout>
          }
        />
        <Route
          path="/UserTable"
          element={
            <Layout>
              <UserTable />
            </Layout>
          }
        />
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
          path="/Gestionservices"
          element={
            <Layout>
              <Gestionservices />
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
