import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import RegisterPrestataire from './pages/RegisterPrestataire';
import RegisterClient from './pages/RegisterClient';
import RegisterEntreprise from './pages/RegisterEntreprise';
import Login from './pages/Login';

import Index from './landing';
import ServiceList from './landing/ServiceList';
import Contact from './landing/Contact';
import HowItWorks from './landing/HowItWorks';
import ServiceDetail from './landing/ServiceDetail';
import Checkout from "./landing/Checkout";
import Payment from './landing/Payment';
import Invoice from './landing/Invoice';
import ClientDashboard from './landing/ClientDashboard';
import PrestatairesList from './pages/PrestatairesList';


import Profil from './presatataire/components/Profil';

import PrestationsList from './presatataire/components/PrestationsList';

import Dashboard from './pages/Dashboard'; 
import AfficherPrestataire from './pages/AfficherPrestataire'; 
import Layout from './components/Layout';  // Ajoutez le Layout ici
import AfficherPrestations from './pages/AfficherPrestations';
import UserTable from './pages/UserTable';
import Gestionservices from './pages/Gestionservices';
import UserStats from './pages/UserStats';
import ReservationTable from './pages/ReservationTable';
import ReservationChart from './pages/ReservationChart';
import RecentReservations from './presatataire/components/RecentReservations';
import DashboardPrestataire from './presatataire/components/DashboardPrestataire';
import MainLayout from './presatataire/components/MainLayout';

import Abonnement from './presatataire/components/Abonnement';

import TypeAbonnementForm from './pages/TypeAbonnementForm'; 


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>

       {/*----------------------------kawtar------------------------------------*/}

      
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<RegisterPrestataire />} />
          <Route path="Entreprise" element={<RegisterEntreprise />} />
          <Route path="Client" element={<RegisterClient />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/prestataire" element={<MainLayout />}>
          <Route index element={<DashboardPrestataire/>} />
          <Route path="list" element={<PrestationsList/>} />
          <Route path="profil" element={<Profil/>} />
          <Route path="reservations" element={<RecentReservations/>} />
          <Route path="abonnement" element={<Abonnement/>} />

      </Route>
        {/*----------------------------kawtar------------------------------------*/}
        
        
        <Route path="/" element={<Index />} />
        <Route path="/Services" element={<ServiceList />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/ServiceDetail/:id" element={<ServiceDetail />} />
        <Route path="/checkout" element={<Checkout />} />


      




        {/* Page sans layout */}

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
          path="/TypeAbonnementForm"
          element={
            
            <Layout >
  <TypeAbonnementForm />           
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
          path="/PrestatairesList"
          element={
            <Layout>
              <PrestatairesList />
            </Layout>
          }
        />
        <Route
          path="/Dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route path="/payer" element={<Payment />} />
        <Route path="/facture" element={<Invoice />} />
        <Route path="/client" element={<ClientDashboard />} />

      </Routes>
     
    </Router>
</>
    
  );
}


export default App;
