// utils/auth.js (ou dans ton composant)
import axios from 'axios';

export const logout = async (navigate) => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    await axios.post(
      'http://localhost:8000/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Supprimer le token du localStorage
    localStorage.removeItem('authToken');
    

    // Redirection vers la page de login
    navigate('/login');
  } catch (error) {
    console.error('Erreur de déconnexion :', error);
  }
};
