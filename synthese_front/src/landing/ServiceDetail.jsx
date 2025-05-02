import { useState } from 'react';
import Footer from './footer'; // Assure-toi que ce chemin est correct

export default function ServiceDetail() {
  const [selectedOption, setSelectedOption] = useState('standard');

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
        {/* Colonne gauche : Détails du service */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-2">Ménage complet</h1>
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">Ménage</span>
            <span className="text-yellow-500 text-sm">⭐ 4.8 (3 avis)</span>
          </div>

          <img
            src="https://images.unsplash.com/photo-1581578017426-3b3a997a2746?auto=format&fit=crop&w=1200&q=80"
            alt="Ménage"
            className="rounded-lg mb-6 w-full object-cover h-64"
          />

          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-6">
            {['Description', 'Prestataire', 'Avis'].map((tab, i) => (
              <button key={i} className="py-2 px-4 text-sm font-medium text-gray-700 hover:text-blue-600">
                {tab}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-2">À propos de ce service</h2>
            <p className="text-sm text-gray-700 mb-6">
              Service de nettoyage complet pour votre domicile, adapté à tous types de logements...
            </p>

            {/* Options */}
            <h3 className="font-semibold mb-2">Les options disponibles</h3>
            <div className="space-y-2">
              {[
                { key: 'standard', label: 'Service standard', price: '20 €/h', duration: 'Durée estimée 2 heures' },
                { key: 'approfondi', label: 'Service approfondi', price: '30 €/h', duration: 'Durée estimée 3 heures' },
                { key: 'grand', label: 'Grand nettoyage', price: '40 €/h', duration: 'Durée estimée 4 heures' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedOption(opt.key)}
                  className={`w-full text-left border rounded-lg p-4 ${selectedOption === opt.key ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between font-medium text-sm">
                    <span>{opt.label}</span>
                    <span>{opt.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{opt.duration}</p>
                </button>
              ))}
            </div>

            {/* Qualités */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Qualités du service</h4>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                {['Fiabilité', 'Ponctualité', 'Matériel fourni', 'Expérience'].map((item, i) => (
                  <span key={i} className="bg-gray-100 px-3 py-1 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite : Réservation */}
        <div className="bg-white border rounded-lg shadow p-6 h-fit">
          <h3 className="text-sm font-semibold mb-2">Réserver ce service</h3>
          <p className="text-lg font-bold text-blue-600 mb-4">20 €<span className="text-sm font-normal text-gray-500">/heure</span></p>

          <label className="text-sm text-gray-700 mb-2 block">Choisissez une date</label>
          <div className="border rounded-lg p-4 mb-4">
            <div className="text-center text-sm mb-2 font-medium">May 2025</div>
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-600">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="text-center font-medium">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <span key={i} className={`text-center py-1 ${i + 1 === 6 ? 'bg-blue-600 text-white rounded-full' : ''}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2">Pré-réserver</button>
          <p className="text-[10px] text-gray-400">
            En cliquant sur “Pré-réserver”, vous acceptez les conditions générales et la politique de confidentialité.
          </p>
        </div>
      </div>

      {/* Footer en bas de la page */}
      <Footer />
    </>
  );
}
