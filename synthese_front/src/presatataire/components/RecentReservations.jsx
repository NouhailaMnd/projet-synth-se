import React from 'react';

const reservations = [
  {
    id: 1,
    client: { name: 'Marie Lambert', location: 'Paris 15e', avatar: 'https://via.placeholder.com/40' },
    service: 'Ménage complet',
    date: '15/06/2023 - 14:00',
    status: { text: 'Confirmée', color: 'green' }
  },
  {
    id: 2,
    client: { name: 'Pierre Durand', location: 'Boulogne-Billancourt', avatar: 'https://via.placeholder.com/40' },
    service: 'Repassage',
    date: '16/06/2023 - 10:00',
    status: { text: 'En attente', color: 'yellow' }
  }
];

const RecentReservations = () => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Dernières réservations</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Heure</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={reservation.client.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{reservation.client.name}</div>
                      <div className="text-sm text-gray-500">{reservation.client.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${reservation.status.color}-100 text-${reservation.status.color}-800`}>
                    {reservation.status.text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Voir</button>
                  <button className="text-indigo-600 hover:text-indigo-900">Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200">
        <a href="#" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Voir toutes les réservations</a>
      </div>
    </div>
  );
};

export default RecentReservations;