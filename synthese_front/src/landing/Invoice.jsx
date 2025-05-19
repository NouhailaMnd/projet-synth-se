import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

export default function Invoice() {
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState(null);
  const invoiceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Token non trouvé. Veuillez vous connecter.");
        }

        // Récupérer profil utilisateur
        const responseUser = await fetch('/api/client/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!responseUser.ok) {
          const errorText = await responseUser.text();
          throw new Error(`Erreur API: ${responseUser.status} - ${errorText}`);
        }
        const dataUser = await responseUser.json();
        const mergedUser = { ...dataUser.user, ...dataUser.client };
        setUser(mergedUser);

        // Récupérer paiement
        const responsePayment = await fetch("/api/client/last-payment", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!responsePayment.ok && responsePayment.status !== 204) {
          const errorText = await responsePayment.text();
          throw new Error(`Erreur paiement: ${responsePayment.status} - ${errorText}`);
        }
        const dataPayment = await responsePayment.json();
        setPayment(dataPayment);

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }

    fetchUserProfile();

    // Récupérer panier dans sessionStorage
    const storedCart = JSON.parse(sessionStorage.getItem("last_order")) || [];
    setCart(storedCart);

    // Calcul total panier
    const totalPrice = storedCart.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
    setTotal(totalPrice);
  }, []);

  const tva = (total * 0.2).toFixed(2);
  const totalTTC = (total * 1.2).toFixed(2);

  // Fonction téléchargement PDF (inchangée)
  const downloadPDF = () => {
    // ... (ton code actuel pour le PDF, inchangé)
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <h2 className="text-xl font-semibold mb-4">Aucune commande à afficher.</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div
        ref={invoiceRef}
        className="bg-white max-w-4xl mx-auto rounded-xl shadow-md p-8 text-sm text-gray-700 print:bg-white"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-blue-600">📄 Facture</h2>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-500">
              Date : <strong>{new Date().toLocaleDateString()}</strong>
            </p>
            <span className="inline-block mt-1 px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full font-semibold">
              {payment?.status ? payment.status : "Non défini"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <p className="font-semibold text-gray-800">De</p>
            <p>Ma Société</p>
            <p>123 Rue Exemple</p>
            <p>75000 Paris</p>
            <p>France</p>
            <p className="text-blue-500">contact@masociete.com</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">À</p>
            <p>{user.name || "N/A"}</p>
            {(user.quartier || user.ville) && (
              <p>{[user.quartier, user.ville].filter(Boolean).join(", ")}</p>
            )}
            {(user.code_postal || user.region) && (
              <p>{[user.code_postal, user.region].filter(Boolean).join(", ")}</p>
            )}
            {user.numero_telephone && <p>Tél : {user.numero_telephone}</p>}
            <p className="text-blue-500">{user.email || "N/A"}</p>
          </div>
        </div>

        <table className="w-full text-left border-t border-b border-gray-200 mb-6">
          <thead className="bg-blue-50 text-gray-600">
            <tr>
              <th className="py-2 px-3">DESCRIPTION</th>
              <th className="py-2 px-3 text-center">QUANTITÉ</th>
              <th className="py-2 px-3 text-right">PRIX UNITAIRE</th>
              <th className="py-2 px-3 text-right">MONTANT</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="py-2 px-3">{item.nom || "Service"}</td>
                <td className="py-2 px-3 text-center">1</td>
                <td className="py-2 px-3 text-right">{parseFloat(item.total).toFixed(2)} DH</td>
                <td className="py-2 px-3 text-right">{parseFloat(item.total).toFixed(2)} DH</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <table className="text-sm w-64">
            <tbody>
              <tr>
                <td className="py-1">Sous-total</td>
                <td className="text-right">{total.toFixed(2)} DH</td>
              </tr>
              <tr>
                <td className="py-1">TVA (20%)</td>
                <td className="text-right">{tva} DH</td>
              </tr>
              <tr className="font-bold text-blue-700 border-t border-gray-200">
                <td className="py-2 text-base">Total</td>
                <td className="text-right text-base">{totalTTC} DH</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded mb-6">
          <p className="font-medium">Merci pour votre paiement !</p>
          <p>Cette facture sert de confirmation de votre achat.</p>
        </div>

        <div className="flex justify-between items-center text-sm">
          <button onClick={() => navigate("/")} className="text-gray-500 hover:underline">
            ← Retour à l'accueil
          </button>
          <div className="space-x-2 print:hidden">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              📥 Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
