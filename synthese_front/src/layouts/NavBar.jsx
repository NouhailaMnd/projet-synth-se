import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false); // 👈

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("Utilisateur récupéré :", storedUser); // 👈 debug
    if (storedUser) setUser(storedUser);
    setIsUserLoaded(true); // 👈 important pour attendre le chargement

    const updateCart = () => {
      let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
      cart = cart.map(item => {
        if (!item.total) {
          const prixUnitaire = parseFloat(item.prix || 30);
          const dureeHeures = parseFloat(item.duree) || 1;
          return {
            ...item,
            total: parseFloat((prixUnitaire * dureeHeures).toFixed(2)),
          };
        }
        return item;
      });

      setCartItems(cart);
      sessionStorage.setItem("cart", JSON.stringify(cart));
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Services<span className="text-gray-800">ÀDomicile</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/Services" className="text-gray-700 hover:text-blue-600">Services</Link>
            <a href="/HowItWorks" className="text-gray-700 hover:text-blue-600">Comment ça marche</a>
            <a href="/Contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4 relative">
            {/* Panier */}
            <div className="relative">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative text-2xl hover:text-blue-600"
              >
                <span role="img" aria-label="panier">🛒</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              </button>


              {showCart && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-base">🛒 Mon Panier</h4>
                    {cartItems.length > 0 ? (
                      <>
                        <ul className="space-y-3 text-sm text-gray-700">
                          {cartItems.map((item, idx) => (
                            <li key={idx} className="flex flex-col border-b pb-2 last:border-none">
                              <span className="font-medium">{item.nom}</span>
                              <span>Durée : {item.duree}h</span>
                              <span>Date : {item.date}</span>
                              <span>Prestataire : {item.prestataire_nom}</span>
                              <span className="font-bold text-right">{item.total.toFixed(2)} €</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4 mt-2 border-t flex justify-between font-semibold text-sm text-gray-800">
                          <span>Total</span>
                          <span>{total.toFixed(2)} €</span>
                        </div>
                        <Link to="/checkout" className="block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md text-sm font-medium transition">
                          Voir mes Services
                        </Link>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Votre panier est vide.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Utilisateur connecté ou pas */}
            {isUserLoaded && (
              user ? (
                <div className="relative">
                  <button
  onClick={() => setShowUserMenu(!showUserMenu)}
  className="flex items-center space-x-2 text-2xl hover:text-blue-600"
>
  <span role="img" aria-label="profil">👤</span>
</button>


                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
<Link to="/client" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
  Mon Profil
</Link>
                      <button
                        onClick={() => {
                          sessionStorage.removeItem("user");
                          window.location.reload();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
                    Connexion
                  </Link>
                  <Link to="/auth" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Inscription
                  </Link>
                </>
              )
            )}
          </div>

          {/* Burger menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" strokeWidth={2}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-sm px-4 py-2 space-y-2">
          <Link to="/Services" className="block text-gray-700 hover:text-blue-600">Services</Link>
          <a href="/HowItWorks" className="block text-gray-700 hover:text-blue-600">Comment ça marche</a>
          <a href="/Contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
          {isUserLoaded && (
            user ? (
              <>
                <Link to="/profil" className="block text-gray-700 hover:text-blue-600">Mon Profil</Link>
                <Link to="/mes-commandes" className="block text-gray-700 hover:text-blue-600">Mes Commandes</Link>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="block text-left w-full text-red-600 hover:bg-gray-100 px-4 py-2 rounded"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600">Connexion</Link>
                <Link to="/auth" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Inscription
                </Link>
              </>
            )
          )}
        </div>
      )}
    </header>
  );
}
