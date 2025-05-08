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
    const storedCart = JSON.parse(sessionStorage.getItem("last_order")) || [];
    const storedUser = {
      name: sessionStorage.getItem("user_name"),
      email: sessionStorage.getItem("user_email"),
    };
    setCart(storedCart);
    setUser(storedUser);

    const totalPrice = storedCart.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
    setTotal(totalPrice);
  }, []);

  const tva = (total * 0.2).toFixed(2);
  const totalTTC = (total * 1.2).toFixed(2);

  const printInvoice = () => {
    window.print();
  };
  

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Facture", 14, 20);
    doc.setFontSize(12);
    doc.text(`Client : ${user.name}`, 14, 30);
    doc.text(`Email : ${user.email}`, 14, 36);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 14, 42);

    const rows = cart.map((item, index) => [
      item.nom || "Service",
      "1",
      `${item.total.toFixed(2)} €`,
      `${item.total.toFixed(2)} €`,
    ]);

    autoTable(doc, {
      head: [["DESCRIPTION", "QUANTITÉ", "PRIX UNITAIRE", "MONTANT"]],
      body: rows,
      startY: 50,
    });

    const finalY = doc.lastAutoTable.finalY || 80;

    doc.text(`Sous-total : ${total.toFixed(2)} €`, 140, finalY + 10, { align: "right" });
    doc.text(`TVA (20%) : ${tva} €`, 140, finalY + 16, { align: "right" });
    doc.setFontSize(14);
    doc.text(`Total TTC : ${totalTTC} €`, 140, finalY + 25, { align: "right" });

    doc.save("facture.pdf");
  };

  return (
    <>
      
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <div
          ref={invoiceRef}
          className="bg-white max-w-4xl mx-auto rounded-xl shadow-md p-8 text-sm text-gray-700 print:bg-white"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-blue-600">📄 Facture</h2>
              <p className="text-xs text-gray-400">#INV-2025-001</p>
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
              <p>{user.name}</p>
              <p>Adresse Client</p>
              <p>69000 Lyon</p>
              <p>France</p>
              <p className="text-blue-500">{user.email}</p>
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
                  <td className="py-2 px-3 text-right">{item.total.toFixed(2)} €</td>
                  <td className="py-2 px-3 text-right">{item.total.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <table className="text-sm w-64">
              <tbody>
                <tr>
                  <td className="py-1">Sous-total</td>
                  <td className="text-right">{total.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td className="py-1">TVA (20%)</td>
                  <td className="text-right">{tva} €</td>
                </tr>
                <tr className="font-bold text-blue-700 border-t border-gray-200">
                  <td className="py-2 text-base">Total</td>
                  <td className="text-right text-base">{totalTTC} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded mb-6">
            <p className="font-medium">Merci pour votre paiement !</p>
            <p>Cette facture sert de confirmation de votre achat.</p>
          </div>

          <div className="flex justify-between items-center text-sm">
          <button
  onClick={() => navigate("/")}
  className="text-gray-500 hover:underline"
>
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
    </>
  );
}
