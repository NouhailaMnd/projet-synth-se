import React from 'react';

const StatsCards = () => {
  const stats = [
    { icon: 'fa-calendar-check', color: 'indigo', label: 'Réservations', value: '24' },
    { icon: 'fa-euro-sign', color: 'green', label: 'Revenus', value: '€1,240' },
    { icon: 'fa-clock', color: 'yellow', label: 'En attente', value: '5' },
    { icon: 'fa-star', color: 'blue', label: 'Note moyenne', value: '4.8/5' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;