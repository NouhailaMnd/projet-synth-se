import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-white mb-2">ServicesÀDomicile</h4>
          <p className="text-sm">
            Plateforme de mise en relation entre clients et prestataires de services à domicile.
          </p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Services</h5>
          <ul className="space-y-1 text-sm">
            <li>Ménage</li>
            <li>Jardinage</li>
            <li>Bricolage</li>
            <li>Tous les services</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Aide</h5>
          <ul className="space-y-1 text-sm">
            <li>À propos</li>
            <li>Comment ça marche</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Légal</h5>
          <ul className="space-y-1 text-sm">
            <li>Conditions générales</li>
            <li>Politique de confidentialité</li>
            <li>Cookies</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-sm text-center py-4">
        © 2023 ServicesÀDomicile. Tous droits réservés.
        <div className="flex justify-center mt-2 space-x-4 text-lg">
          <span className="hover:text-white cursor-pointer">🌐</span>
          <span className="hover:text-white cursor-pointer">🐦</span>
          <span className="hover:text-white cursor-pointer">📘</span>
        </div>
      </div>
    </footer>
  );
}
