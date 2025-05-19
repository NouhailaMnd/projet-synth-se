import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrestatairesList = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au chargement du composant
  useEffect(() => {
    axios.get('/api/prestataires') // adapte l'URL selon ton API
      .then(res => {
        setPrestataires(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement des prestataires');
        setLoading(false);
      });
  }, []);

  // Fonction pour modifier le status d'une prestation d'un prestataire
  const handleStatusChange = (prestataireId, prestationId, newStatus) => {
    // Ici, tu appelles ton API pour mettre à jour le status
    axios.put(`/api/prestataires/${prestataireId}/prestations/${prestationId}/status`, {
    status_validation: newStatus,
    })
    .then(response => {
      // Mise à jour locale du state pour refléter le changement sans reload
      setPrestataires(prev =>
        prev.map(p => {
          if (p.id === prestataireId) {
            return {
              ...p,
              prestations: p.prestations.map(prest => {
                if (prest.id === prestationId) {
                  return {
                    ...prest,
                    pivot: {
                      ...prest.pivot,
                      status_validation: newStatus,
                    }
                  };
                }
                return prest;
              }),
            };
          }
          return p;
        })
      );
    })
    .catch(error => {
      alert('Erreur lors de la mise à jour du statut');
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Liste des Prestataires</h1>
      {prestataires.map(prestataire => (
        <div key={prestataire.id} style={{border: '1px solid #ccc', marginBottom: '20px', padding: '10px'}}>
          <h2>{prestataire.user?.name || 'Nom utilisateur non disponible'}</h2>
          {prestataire.photo && <img src={prestataire.photo} alt="Photo Prestataire" width={100} />}
          <p>Téléphone : {prestataire.telephone}</p>
          <h3>Prestations :</h3>
          <ul>
            {prestataire.prestations.length === 0 && <li>Aucune prestation</li>}
            {prestataire.prestations.map(prestation => (
              <li key={prestation.id} style={{marginBottom: '10px'}}>
                <strong>{prestation.nom}</strong><br />
                    {prestation.pivot.document_justificatif && (
  <div style={{ marginTop: '10px' }}>
    <a
      href={`http://localhost:8000/storage/${prestation.pivot.document_justificatif}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Voir le document justificatif
    </a>
  </div>
)}                Statut : 
                <select 
                  value={prestation.pivot.status_validation || 'en_attente'}
                  onChange={(e) => handleStatusChange(prestataire.id, prestation.id, e.target.value)}
                >
                  <option value="en_attente">En attente</option>
                  <option value="valide">Validé</option>
                  <option value="refuse">Refusé</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PrestatairesList;
