import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../layouts/NavBar";
import axios from "axios";
import { toast } from "react-toastify"; // si tu utilises react-toastify

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const fixedCart = cart.map(item => {
      if (!item.total && item.duree && item.prix) {
        item.total = parseFloat(item.duree) * parseFloat(item.prix);
      }
      return item;
    });
    setCartItems(fixedCart);
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleRemove = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Fonction qui vérifie si la date est dispo dans la base (API) + dans le panier
  const isDateAvailable = async (serviceId, prestataireId, date, currentIndex) => {
    // Vérifier localement dans le panier
    const existsInCart = cartItems.some((item, idx) =>
      idx !== currentIndex &&
      item.id === serviceId &&
      item.prestataire_id === prestataireId &&
      item.date === date
    );
    if (existsInCart) {
      toast.warn("⚠️ Cette date est déjà utilisée dans votre panier pour ce service et prestataire.");
      return false;
    }

    // Vérifier côté API (base de données)
    try {
      const { data } = await axios.get("http://localhost:8000/api/disponibilite", {
        params: {
          service_id: serviceId,
          prestataire_id: prestataireId,
          date,
          user_id: user?.id || null,
        }
      });
      if (!data.disponible) {
        toast.error("❌ Ce prestataire est déjà réservé pour cette date.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erreur vérification disponibilité:", error);
      toast.error("Erreur lors de la vérification de la disponibilité.");
      return false;
    }
  };

  // Handler pour changer la date avec validation
  const handleChange = async (index, field, value) => {
    if (field === "date") {
      const item = cartItems[index];
      const available = await isDateAvailable(item.id, item.prestataire_id, value, index);
      if (!available) {
        return; // bloquer le changement de date
      }
    }

    const updatedCart = [...cartItems];
    updatedCart[index][field] = value;

    if (field === "duree") {
      const prix = parseFloat(updatedCart[index].prix || 0);
      const duree = parseFloat(value || 0);
      updatedCart[index].total = prix * duree;
    }

    setCartItems(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleProceedToPayment = () => {
    navigate("/payer");
  };

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">🛠️ Modifier ma commande</h2>
        {cartItems.length > 0 ? (
          <>
            <ul className="space-y-4">
              {cartItems.map((item, idx) => (
                <li
                  key={idx}
                  className="p-4 border rounded-lg shadow flex justify-between items-center flex-wrap gap-4"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{item.nom}</p>
                    <label>
                      Durée (heures) :
                      <input
                        type="number"
                        min="1"
                        value={item.duree}
                        onChange={(e) => handleChange(idx, "duree", e.target.value)}
                        className="ml-2 border px-2 py-1 rounded w-20"
                      />
                    </label>
                    <br />
                    <label>
                      Date :
                     <input
  type="date"
  value={item.date}
  min={new Date().toISOString().split("T")[0]}  // Date du jour au format yyyy-mm-dd
  onChange={(e) => handleChange(idx, "date", e.target.value)}
  className="ml-2 border px-2 py-1 rounded"
/>

                    </label>
                    <p>Prestataire : {item.prestataire_nom}</p>
                    <p className="font-bold">Total : {item.total} DH</p>
                  </div>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center font-semibold">
              <span>Total global : {total.toFixed(2)} DH</span>
              <button
                onClick={handleProceedToPayment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Passer à la caisse
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Votre panier est vide.</p>
        )}
      </div>
    </>
  );
}
