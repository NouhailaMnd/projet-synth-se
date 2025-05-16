import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/reservations")
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des réservations", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const userName = reservation.reservation?.user?.name || '';
    const userEmail = reservation.reservation?.user?.email || '';
    const prestationName = reservation.service?.prestation?.nom || '';
    const serviceName = reservation.service?.nom || '';
    const prestataireName = reservation.prestataire?.user?.name || '';
    const prestatairePhone = reservation.prestataire?.telephone || '';
    const reservationDate = reservation.reservation?.date_reservation || '';
    const status = reservation.reservation?.status || '';

    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestataireName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestatairePhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-20 border-b pb-2">
        Tableau des Réservations</h2>

      {/* Conteneur Flex pour aligner l'icône de filtre à droite */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1"></div> {/* Cette div pousse l'icône à droite */}
        {/* Icône de filtre à droite */}
        <span
          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-800 ml-2 cursor-pointer"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          🔍
        </span>
      </div>

      {/* Affichage de la barre de recherche */}
      {isFilterVisible && (
        <div className="mb-6 flex justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Filtrer par Nom Client, Email, Prestation, Service, etc..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 text-sm"
            value={searchTerm}
            onChange={handleFilterChange}
          />
        </div>
      )}

      {/* Tableau des réservations */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-blue-600 text-white">
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
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 text-center">Aucune réservation ne correspond à votre recherche</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;
