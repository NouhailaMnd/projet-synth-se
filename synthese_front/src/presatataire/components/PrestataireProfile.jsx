import React, { useState } from 'react';

const PrestataireProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [availability, setAvailability] = useState([
    { day: 'Lundi', morning: true, afternoon: true, evening: false },
    { day: 'Mardi', morning: true, afternoon: true, evening: false },
    { day: 'Mercredi', morning: false, afternoon: true, evening: true },
    { day: 'Jeudi', morning: true, afternoon: true, evening: false },
    { day: 'Vendredi', morning: true, afternoon: true, evening: true },
    { day: 'Samedi', morning: false, afternoon: false, evening: false },
    { day: 'Dimanche', morning: false, afternoon: false, evening: false }
  ]);

  const [services, setServices] = useState([
    { id: 1, name: 'Ménage complet', selected: true },
    { id: 2, name: 'Repassage', selected: true },
    { id: 3, name: 'Garde d\'enfants', selected: false },
    { id: 4, name: 'Bricolage', selected: false }
  ]);

  const [profile, setProfile] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    address: '15 Rue de la République, 75001 Paris',
    bio: 'Professionnel des services à domicile avec 5 ans d\'expérience. Méticuleux et fiable.'
  });

  const toggleService = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, selected: !service.selected } : service
    ));
  };

  const toggleAvailability = (dayIndex, period) => {
    const updated = [...availability];
    updated[dayIndex][period] = !updated[dayIndex][period];
    setAvailability(updated);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header avec photo et boutons */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="absolute -bottom-16 left-6">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
              <img 
                src="https://via.placeholder.com/128" 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
              {editMode && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="text-white p-2 rounded-full bg-indigo-600 hover:bg-indigo-700">
                    <i className="fas fa-camera"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-medium ${editMode ? 'bg-gray-200 text-gray-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {editMode ? 'Annuler' : 'Modifier le profil'}
            </button>
          </div>
        </div>

        <div className="mt-20 px-6 pb-8">
          {/* Informations personnelles */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Informations Personnelles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                {editMode ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.address}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg whitespace-pre-line">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Services proposés */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Services Proposés</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center">
                  {editMode ? (
                    <button
                      onClick={() => toggleService(service.id)}
                      className={`flex-1 py-3 px-4 rounded-lg border ${service.selected ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                    >
                      {service.name}
                    </button>
                  ) : (
                    <span className={`flex-1 py-3 px-4 rounded-lg ${service.selected ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-500'}`}>
                      {service.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Disponibilités */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Disponibilités</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Jour</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Matin</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Après-midi</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Soir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {availability.map((day, index) => (
                    <tr key={day.day}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{day.day}</td>
                      {['morning', 'afternoon', 'evening'].map((period) => (
                        <td key={period} className="py-3 px-4 text-center">
                          {editMode ? (
                            <button
                              onClick={() => toggleAvailability(index, period)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${day[period] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                              <i className={`fas ${day[period] ? 'fa-check' : 'fa-times'} text-xs`}></i>
                            </button>
                          ) : (
                            <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${day[period] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              <i className={`fas ${day[period] ? 'fa-check' : 'fa-times'} text-xs`}></i>
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section mot de passe */}
          {editMode && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Changer le mot de passe</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bouton de sauvegarde */}
          {editMode && (
            <div className="flex justify-end mt-6">
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200">
                Enregistrer les modifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrestataireProfile;