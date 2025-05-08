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


function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<RegisterPrestataire />} />
          <Route path="Entreprise" element={<RegisterEntreprise />} />
          <Route path="Client" element={<RegisterClient />} />
        </Route>

        <Route path="/login" element={<Login />} />
        
        
        <Route path="/" element={<Index />} />
        <Route path="/Services" element={<ServiceList />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/ServiceDetail/:id" element={<ServiceDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payer" element={<Payment />} />
        <Route path="/facture" element={<Invoice />} />
        <Route path="/client" element={<ClientDashboard />} />



      </Routes>
    </Router>
  );
}


export default App;
