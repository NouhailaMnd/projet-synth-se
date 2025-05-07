import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';

const ReservationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  // Données simulées de réservations
  const reservations = [
    {
      id: 1,
      client: 'Marie Lambert',
      service: 'Ménage complet',
      date: new Date(2023, 5, 15, 14, 0),
      status: 'confirmée'
    },
    {
      id: 2,
      client: 'Pierre Durand',
      service: 'Repassage',
      date: new Date(2023, 5, 16, 10, 0),
      status: 'en attente'
    },
    {
      id: 3,
      client: 'Sophie Martin',
      service: 'Garde d\'enfants',
      date: new Date(2023, 5, 20, 16, 0),
      status: 'confirmée'
    },
    {
      id: 4,
      client: 'Thomas Leroy',
      service: 'Bricolage',
      date: new Date(2023, 5, 22, 9, 0),
      status: 'annulée'
    }
  ];

  // Fonctions de navigation
  const nextPeriod = () => {
    setCurrentDate(viewMode === 'month' ? addMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const prevPeriod = () => {
    setCurrentDate(viewMode === 'month' ? subMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  // Générer les jours à afficher
  const getDaysToRender = () => {
    if (viewMode === 'month') {
      // Pour le mois, nous affichons simplement le mois en cours
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return eachDayOfInterval({ start, end });
    } else {
      // Pour la semaine, nous affichons la semaine en cours
      const start = startOfWeek(currentDate, { locale: fr });
      const end = endOfWeek(currentDate, { locale: fr });
      return eachDayOfInterval({ start, end });
    }
  };

  const days = getDaysToRender();

  // Obtenir les réservations pour un jour spécifique
  const getReservationsForDay = (day) => {
    return reservations.filter(reservation => isSameDay(reservation.date, day));
  };

  // Styles conditionnels pour les réservations
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmée':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'annulée':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Calendrier des Réservations</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Mois
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Semaine
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevPeriod}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <DatePicker
              selected={currentDate}
              onChange={(date) => setCurrentDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker={viewMode === 'month'}
              showWeekPicker={viewMode === 'week'}
              locale={fr}
              className="text-center py-1 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <button 
              onClick={nextPeriod}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* En-tête des jours */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.slice(0, 7).map((day, index) => (
            <div key={index} className="text-center font-medium text-gray-500 text-sm py-2">
              {format(day, 'EEE', { locale: fr })}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayReservations = getReservationsForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={index} 
                className={`border rounded-md min-h-24 p-1 ${isToday ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'}`}
              >
                <div className={`text-right text-sm p-1 ${isToday ? 'font-bold text-indigo-700' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-20">
                  {dayReservations.map(reservation => (
                    <div 
                      key={reservation.id}
                      className={`text-xs p-1 rounded border ${getStatusColor(reservation.status)}`}
                    >
                      <div className="font-medium truncate">{reservation.client}</div>
                      <div className="truncate">{format(reservation.date, 'HH:mm')} - {reservation.service}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="p-4 border-t border-gray-200 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-2"></div>
          <span className="text-xs text-gray-600">Confirmée</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-2"></div>
          <span className="text-xs text-gray-600">En attente</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2"></div>
          <span className="text-xs text-gray-600">Annulée</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;