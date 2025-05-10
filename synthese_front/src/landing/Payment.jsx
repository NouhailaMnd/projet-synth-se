import { useEffect, useState } from "react";
import NavBar from "../layouts/NavBar";

export default function PaymentForm() {
  const [user, setUser] = useState({ id: "", name: "", email: "" });
  const [montant, setMontant] = useState(0);
  const [method, setMethod] = useState("carte");

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const total = cart.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
    setMontant(total);

    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (!token || !userData) {
      alert("Vous devez être connecté pour effectuer un paiement.");
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log("✅ Utilisateur récupéré :", parsedUser);
      setUser(parsedUser);
    } catch (e) {
      console.error("❌ Erreur de parsing user :", e);
      alert("Erreur lors de la récupération des informations utilisateur.");
      window.location.href = "/login";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Token manquant. Veuillez vous reconnecter.");
      return;
    }

    if (cart.length === 0) {
      alert("Le panier est vide.");
      return;
    }

    try {
      const formattedCart = cart.map(item => ({
        id: item.id,
        total: item.total * 1.2,
        duree: item.duree,
        prestataire_id: item.prestataire_id,
        date: item.date
      }));

      const payload = {
        methode_paiment: method,
        cart: formattedCart
      };

      const res = await fetch("http://127.0.0.1:8000/api/passer-commande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Paiement réussi !");
        sessionStorage.setItem("last_order", JSON.stringify(cart));
        sessionStorage.removeItem("cart");
        window.location.href = "/facture";
      } else {
        alert("Erreur : " + (data.message || "Échec du paiement"));
      }
    } catch (err) {
      console.error("Erreur réseau ou serveur :", err);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 rounded shadow-md w-full md:w-2/3">
          <h2 className="text-xl font-semibold mb-4">💳 Informations de paiement</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={user.email} readOnly className="w-full mt-1 px-4 py-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Nom</label>
              <input type="text" value={user.name} readOnly className="w-full mt-1 px-4 py-2 border rounded bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium">Méthode de paiement</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded"
              >
                <option value="carte">Carte bancaire</option>
                <option value="paypal">PayPal</option>
                <option value="especes">Espèces</option>
              </select>
            </div>

            {method === "carte" && (
              <>
                <div>
                  <label className="block text-sm font-medium">Nom sur la carte</label>
                  <input type="text" placeholder="John Doe" required className="w-full mt-1 px-4 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Numéro de carte</label>
                  <input type="text" placeholder="1234 5678 9012 3456" required className="w-full mt-1 px-4 py-2 border rounded" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Date d'expiration</label>
                    <input type="text" placeholder="MM/YY" required className="w-full mt-1 px-4 py-2 border rounded" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">CVV</label>
                    <input type="text" placeholder="123" required className="w-full mt-1 px-4 py-2 border rounded" />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold text-lg">
              Payer {(montant * 1.2).toFixed(2)} €
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded shadow-md w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">📦 Résumé de commande</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>€ {montant.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>TVA (20%)</span>
              <span>€ {(montant * 0.2).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total TTC</span>
              <span>€ {(montant * 1.2).toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Paiement sécurisé</p>
        </div>
      </div>
    </>
  );
}
