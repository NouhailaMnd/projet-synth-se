import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Ajout de l'état pour le message de succès

  // Charger les utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
      setError("Erreur lors du chargement des utilisateurs.");
    }
  };

  const deleteUser = async () => {
    try {
      if (!userToDelete?.id) {
        console.error("Aucun ID d'utilisateur à supprimer.");
        return;
      }
      const response = await axios.delete(`/api/users/${userToDelete.id}`);
      if (response.status === 200) {
        fetchUsers(); // Recharge la liste après suppression
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        setSuccessMessage("Utilisateur supprimé avec succès."); // Message de succès
        setTimeout(() => setSuccessMessage(null), 1000); // Disparaît après 5 secondes
      } else {
        console.error("Erreur lors de la suppression de l'utilisateur.");
        setError("Erreur lors de la suppression de l'utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Liste des Utilisateurs</h2>

      {/* Affichage du message de succès */}
      {successMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg text-center z-50">
          {successMessage}
        </div>
      )}

      {/* Affichage de l'erreur */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-xl shadow text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2 text-left text-xs">Nom</th>
              <th className="p-2 text-left text-xs">Email</th>
              <th className="p-2 text-left text-xs">Rôle</th>
              <th className="p-2 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-blue-50 text-xs">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900">Supprimer l'utilisateur ?</h3>
            <p className="text-sm text-gray-700 mt-2">Cette action est irréversible.</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={deleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Oui, supprimer
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
