import React from 'react';
import MainLayout from '../components/MainLayout';
import StatsCards from '../components/StatsCards';
import RecentReservations from '../components/RecentReservations';
import RecentReviews from '../components/RecentReviews';
import ReservationCalendar from '../components/ReservationCalendar';

const Dashboard = () => {
  return (
    <MainLayout>
      <StatsCards />
      <ReservationCalendar />
      <RecentReservations />
      <RecentReviews />
    </MainLayout>
  );
};

export default Dashboard;