import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/reservations")
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des réservations", error);
      });
  }, []);

  return (
<div className="container mx-auto p-4 mt-12">
<h2 className="text-2xl font-bold mb-2">Tableau des Réservations</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead className="bg-blue-900 text-white">
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Nom Client</th>
            <th className="py-2 px-4 text-left">Email Client</th>
            <th className="py-2 px-4 text-left">Nom de Prestation</th>
            <th className="py-2 px-4 text-left">Nom de Service</th>
            <th className="py-2 px-4 text-left">Nom de Prestataire</th>
            <th className="py-2 px-4 text-left">Téléphone Prestataire</th>
            <th className="py-2 px-4 text-left">Date Réservation</th>
            <th className="py-2 px-4 text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b">
              <td className="py-2 px-4">{reservation.reservation?.user?.name || '-'}</td>
              <td className="py-2 px-4">{reservation.reservation?.user?.email || '-'}</td>
              <td className="py-2 px-4">{reservation.service?.prestation?.nom || '-'}</td>
              <td className="py-2 px-4">{reservation.service?.nom || '-'}</td>
              <td className="py-2 px-4">{reservation.prestataire?.user?.name || '-'}</td>
              <td className="py-2 px-4">{reservation.prestataire?.telephone || '-'}</td>
              <td className="py-2 px-4">{reservation.reservation?.date_reservation || '-'}</td>
              <td className="py-2 px-4">{reservation.reservation?.status || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
