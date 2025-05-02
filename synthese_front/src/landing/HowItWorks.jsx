import React from "react";
import Footer from "./footer"; // Adapte le chemin selon ton architecture
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <>
      <section className="bg-white text-gray-800 py-16 px-4 max-w-7xl mx-auto">
        {/* Étapes */}
        <h2 className="text-center text-2xl md:text-3xl font-bold text-blue-600 mb-2">Comment ça marche ?</h2>
        <p className="text-center text-gray-600 mb-10">
          Découvrez comment notre plateforme simplifie vos services à domicile en quelques étapes simples.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: "📋",
              title: "Étape 1 : Recherchez un service",
              desc: "Parcourez notre catalogue de services et trouvez celui qui répond à vos besoins.",
            },
            {
              icon: "👤",
              title: "Étape 2 : Sélectionnez un prestataire",
              desc: "Choisissez un prestataire selon ses disponibilités, compétences et évaluations.",
            },
            {
              icon: "📅",
              title: "Étape 3 : Réservez et profitez",
              desc: "Réservez en ligne, le prestataire viendra à votre domicile à la date convenue.",
            },
          ].map((item, i) => (
            <div key={i} className="border rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Nos avantages */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h3 className="text-center font-bold text-lg mb-6">Nos avantages</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: "✔️",
                title: "Prestataires vérifiés",
                desc: "Tous nos prestataires sont soigneusement sélectionnés et leurs compétences sont validées.",
              },
              {
                icon: "⭐",
                title: "Service de qualité",
                desc: "Nous garantissons un service de qualité et un suivi personnalisé pour chaque intervention.",
              },
              {
                icon: "🕒",
                title: "Réservation flexible",
                desc: "Réservez facilement à l'heure qui vous convient, même pour des interventions urgentes.",
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Témoignages */}
        <h3 className="text-center font-bold text-lg mb-6">Ce que disent nos clients</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              name: "Marie Dupont",
              role: "Cliente régulière",
              text: "Un service exemplaire ! Toute cette plateforme m’a facilité la vie. Je recommande vivement.",
            },
            {
              name: "Thomas Martin",
              role: "Client entreprise",
              text: "Notre société fait appel aux services de ménage réguliers : professionnalisme et ponctualité !",
            },
            {
              name: "Sophie Laurent",
              role: "Télétravailleuse",
              text: "En tant que personne très occupée, j’apprécie la flexibilité et la qualité du service.",
            },
          ].map((client, i) => (
            <div key={i} className="bg-white border rounded-lg shadow p-6 text-sm text-center">
              <p className="mb-4 text-gray-600">"{client.text}"</p>
              <div className="font-bold">{client.name}</div>
              <div className="text-xs text-gray-500">{client.role}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h4 className="font-bold text-lg mb-4">Prêt à simplifier votre quotidien ?</h4>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
  <Link to="/Services">
    <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
      Découvrir les services
    </button>
  </Link>
  <Link to="/Register">
    <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50">
      Créer un compte
    </button>
  </Link>
</div>

        </div>
      </section>

      {/* Footer en bas de page */}
      <Footer />
    </>
  );
}
