import React, { useState } from "react";
import Footer from "./footer";
import NavBar from "../layouts/NavBar";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      await axios.post("http://localhost:8000/api/contact", form);
      setSuccess(true);
      setForm({ nom: "", email: "", message: "" });
    } catch (err) {
      setError("Erreur lors de l'envoi du message");
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-white text-gray-800">
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Contactez-nous</h2>
          <p className="mb-10 text-gray-600">
            Une question, un besoin ? N'hésitez pas à nous contacter. Nous sommes là pour vous aider.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="text-blue-600 text-2xl">📧</span>
                <div>
                  <h4 className="font-bold">E-mail</h4>
                  <p>contact@servicesadomicile.fr</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-blue-600 text-2xl">📞</span>
                <div>
                  <h4 className="font-bold">Téléphone</h4>
                  <p>01 23 45 67 89</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-blue-600 text-2xl">📍</span>
                <div>
                  <h4 className="font-bold">Adresse</h4>
                  <p>15 rue des Services, 75000 Paris</p>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="email"
                name="email"
                placeholder="votre-email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
              <textarea
                name="message"
                placeholder="Écrivez votre message..."
                value={form.message}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 h-32"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition flex justify-center items-center gap-2"
              >
                💬 Envoyer le message
              </button>
              {success && <p className="text-green-600">Message envoyé avec succès ✅</p>}
              {error && <p className="text-red-600">{error}</p>}
            </form>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
