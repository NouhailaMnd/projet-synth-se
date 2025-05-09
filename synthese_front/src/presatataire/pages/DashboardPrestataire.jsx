import React from 'react';
import MainLayout from '../components/MainLayout';
import StatsCards from '../components/StatsCards';
import RecentReservations from '../components/RecentReservations';
import RecentReviews from '../components/RecentReviews';
import ReservationCalendar from '../components/ReservationCalendar';
import PrestationsList from '../components/PrestationsList';

const DashboardPrestataire = () => {
  return (
    <MainLayout>
      <StatsCards />
      <RecentReviews />
      <ReservationCalendar />
      <RecentReservations />
       <PrestationsList/>
    </MainLayout>
  );
};

export default DashboardPrestataire;