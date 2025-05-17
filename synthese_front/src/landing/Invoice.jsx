import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

export default function Invoice() {
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const invoiceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Récupérer token stocké (adapter la clé selon ton stockage)
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Token non trouvé. Veuillez vous connecter.");
        }

        const response = await fetch('/api/client/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Fusionner user et client
        const mergedUser = { ...data.user, ...data.client };
        setUser(mergedUser);

        // Stockage en session (facultatif)
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("client", JSON.stringify(data.client));
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }

    fetchUserProfile();

    // Récupérer panier dans sessionStorage (clé "last_order")
    const storedCart = JSON.parse(sessionStorage.getItem("last_order")) || [];
    setCart(storedCart);

    // Calcul total panier
    const totalPrice = storedCart.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
    setTotal(totalPrice);
  }, []);

  // Calcul TVA 20% et total TTC
  const tva = (total * 0.2).toFixed(2);
  const totalTTC = (total * 1.2).toFixed(2);

  // Fonction de téléchargement PDF
  const downloadPDF = () => {
  const doc = new jsPDF();

  // Couleurs
  const bluePrimary = "#1E40AF";  // bleu foncé
  const blueLight = "#BFDBFE";    // bleu clair

  // Titre Facture - fond bleu + texte blanc
  doc.setFillColor(bluePrimary);
  doc.rect(0, 0, 210, 25, "F");  // barre bleue
  doc.setTextColor("white");
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE", 14, 17);

  // Date alignée à droite
  doc.setFontSize(11);
  const dateText = `Date : ${new Date().toLocaleDateString()}`;
  doc.text(dateText, 200 - doc.getTextWidth(dateText), 17);

  // Réinitialiser les couleurs
  doc.setTextColor("black");
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Position de départ
  let cursorY = 30;

  // Bloc "De" (fournisseur) - sans cadre
  doc.setTextColor(bluePrimary);
  doc.setFont("helvetica", "bold");
  doc.text("De :", 18, cursorY + 8);

  doc.setTextColor("black");
  doc.setFont("helvetica", "normal");
  doc.text("Ma Société", 18, cursorY + 15);
  doc.text("123 Rue Exemple", 18, cursorY + 22);
  doc.text("75000 Paris", 18, cursorY + 29);
  doc.text("France", 18, cursorY + 36);
  doc.setTextColor(bluePrimary);
  doc.text("contact@masociete.com", 18, cursorY + 43);

  // Bloc "À" (client) - sans cadre
  doc.setTextColor(bluePrimary);
  doc.setFont("helvetica", "bold");
  doc.text("À :", 114, cursorY + 8);

  doc.setTextColor("black");
  doc.setFont("helvetica", "normal");
  doc.text(user.name || "N/A", 114, cursorY + 15);

  const adresse = [user.quartier, user.ville].filter(Boolean).join(", ");
  if (adresse) doc.text(adresse, 114, cursorY + 22);

  const coderegion = [user.code_postal, user.region].filter(Boolean).join(", ");
  if (coderegion) doc.text(coderegion, 114, cursorY + 29);

  if (user.numero_telephone) doc.text(`Tél : ${user.numero_telephone}`, 114, cursorY + 36);

  if (user.email) {
    doc.setTextColor(bluePrimary);
    doc.text(user.email, 114, cursorY + 43);
  }

  cursorY += 55;

  // Tableau des services
  const columns = [
    { header: "DESCRIPTION", dataKey: "desc" },
    { header: "QUANTITÉ", dataKey: "qty" },
    { header: "PRIX UNITAIRE", dataKey: "unitPrice" },
    { header: "MONTANT", dataKey: "total" },
  ];

  const rows = cart.map((item) => ({
    desc: item.nom || "Service",
    qty: "1",
    unitPrice: `${parseFloat(item.total).toFixed(2)} DH`,
    total: `${parseFloat(item.total).toFixed(2)} DH`,
  }));

  autoTable(doc, {
    startY: cursorY,
    headStyles: {
      fillColor: bluePrimary,
      textColor: "white",
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
      valign: "middle",
      fontSize: 11,
    },
    alternateRowStyles: {
      fillColor: blueLight,
    },
    columns,
    body: rows,
    styles: { overflow: "linebreak" },
    columnStyles: {
      desc: { halign: "left" },
      qty: { halign: "center" },
      unitPrice: { halign: "right" },
      total: { halign: "right" },
    },
  });

  // Position après tableau
  const finalY = doc.lastAutoTable.finalY + 10;

  // Totaux
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("black");
  doc.text("Sous-total :", 140, finalY);
  doc.text(`${total.toFixed(2)} DH`, 190, finalY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.text("TVA (20%) :", 140, finalY + 8);
  doc.text(`${tva} DH`, 190, finalY + 8, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(bluePrimary);
  doc.text("Total TTC :", 140, finalY + 20);
  doc.text(`${totalTTC} DH`, 190, finalY + 20, { align: "right" });

  // Message final - sans cadre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(bluePrimary);
  doc.text("Merci pour votre paiement !", 20, finalY + 45);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("black");
  doc.text("Cette facture sert de confirmation de votre achat.", 20, finalY + 52);

  doc.save("facture.pdf");
};



  // Si panier vide, affichage message
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

  // Affichage facture
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
              Payé
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
