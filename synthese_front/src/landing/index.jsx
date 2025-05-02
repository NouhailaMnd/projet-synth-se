import React from 'react';

export default function Index() {
  const categories = [
    { name: 'Ménage', color: 'bg-blue-100', icon: '🧹' },
    { name: 'Jardinage', color: 'bg-green-100', icon: '🌱' },
    { name: 'Bricolage', color: 'bg-orange-100', icon: '🔨' },
    { name: "Garde d'enfants", color: 'bg-purple-100', icon: '👶' },
    { name: 'Cours à domicile', color: 'bg-red-100', icon: '📚' },
    { name: 'Aide aux personnes', color: 'bg-yellow-100', icon: '👋' },
  ];

  const services = [
    {
      title: 'Ménage complet',
      category: 'Ménage',
      rating: 4.8,
      price: 20,
      description: 'Service de nettoyage complet pour votre domicile.',
      image: 'https://via.placeholder.com/300x180?text=Menage',
    },
    {
      title: 'Tonte de pelouse',
      category: 'Jardinage',
      rating: 4.7,
      price: 25,
      description: 'Entretien de votre jardin, tonte de pelouse et taille de haies.',
      image: 'https://via.placeholder.com/300x180?text=Jardinage',
    },
    {
      title: 'Montage de meubles',
      category: 'Bricolage',
      rating: 4.9,
      price: 30,
      description: 'Assemblage et montage de vos meubles en kit.',
      image: 'https://via.placeholder.com/300x180?text=Bricolage',
    },
  ];
  const steps = [
    {
      number: 1,
      title: 'Recherchez un service',
      description: 'Parcourez notre catalogue de services à domicile et trouvez celui dont vous avez besoin.',
    },
    {
      number: 2,
      title: 'Réservez un prestataire',
      description: 'Choisissez un prestataire selon ses disponibilités, ses compétences et ses évaluations.',
    },
    {
      number: 3,
      title: 'Profitez du service',
      description: 'Le prestataire vient à votre domicile à la date convenue pour effectuer le service demandé.',
    },
  ];

  const testimonials = [
    {
      name: 'Sophie Martin',
      rating: 5,
      comment: 'J’utilise régulièrement ce service pour le ménage de mon appartement. Les prestataires sont toujours ponctuels et professionnels. Je recommande vivement !',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Thomas Dubois',
      rating: 5,
      comment: 'Grâce à cette plateforme, j’ai pu trouver un excellent jardinier pour entretenir mon jardin. Le système de réservation est simple et efficace.',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    },
    {
      name: 'Émilie Petit',
      rating: 5,
      comment: 'J’ai fait appel à un bricoleur pour monter mes meubles. Travail rapide et soigné. Je n’hésiterai pas à utiliser à nouveau ce service !',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
  ];

  return (
    <>
      {/* SECTION HÉROS */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white min-h-screen flex items-center">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez un professionnel pour vos services à domicile
            </h1>
            <p className="text-lg mb-6">
              Des prestataires qualifiés pour le ménage, jardinage, bricolage et plus encore. Réservez en quelques clics !
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                Découvrir les services
              </button>
              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                En savoir plus
              </button>
            </div>
          </div>

          <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-blue-600 font-semibold text-lg mb-4">
              Quel service cherchez-vous ?
            </h2>
            <input
              type="text"
              placeholder="Ex: ménage, jardinage..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* CATÉGORIES + SERVICES POPULAIRES */}
      <div className="bg-gray-50 py-10 px-6 md:px-16">
        {/* Catégories */}
        <h2 className="text-2xl font-bold text-center mb-6">Nos catégories de services</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 justify-items-center mb-10">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`w-full md:w-auto ${cat.color} rounded-xl py-6 px-4 text-center hover:shadow-md transition`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="font-medium text-sm">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* Services populaires */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Services populaires</h2>
          <a href="#" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
            Voir tous les services <span>→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-sm text-blue-600 mb-1">{service.category}</p>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                    ⭐ {service.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{service.price} €/h</span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      <section className="bg-white py-12 text-center">
        <h2 className="text-2xl font-bold mb-10">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-white bg-blue-500 w-10 h-10 flex items-center justify-center rounded-full mb-4 text-lg font-bold">
                {step.number}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
              {index === 1 && (
                <button className="mt-4 bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600">
                  En savoir plus
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-white py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Témoignages de nos clients</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 px-6">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 max-w-sm mx-auto">
              <div className="flex items-center mb-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <div className="text-yellow-400 text-xs">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                </div>
              </div>
              <p className="text-sm italic text-gray-700">"{t.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Inscription */}
      <section className="bg-blue-500 text-white py-14 text-center">
        <h2 className="text-2xl font-bold mb-3">Prêt à simplifier votre quotidien ?</h2>
        <p className="mb-6">Rejoignez notre plateforme et trouvez le prestataire idéal pour tous vos besoins de services à domicile.</p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition">
          S’inscrire comme client
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-sm">
          <div>
            <h4 className="font-semibold mb-3">ServicesÀDomicile</h4>
            <p>Plateforme de mise en relation entre clients et prestataires de services à domicile.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul>
              <li>Ménage</li>
              <li>Jardinage</li>
              <li>Bricolage</li>
              <li>Garde d’enfants</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Aide</h4>
            <ul>
              <li>À propos</li>
              <li>Comment ça marche</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Légal</h4>
            <ul>
              <li>Conditions générales</li>
              <li>Politique de confidentialité</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
