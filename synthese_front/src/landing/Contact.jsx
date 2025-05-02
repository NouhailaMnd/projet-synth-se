import Footer from "./footer";
export default function Contact() {
    return (
      <div className="bg-white text-gray-800">
        {/* Contact Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Contactez-nous</h2>
          <p className="mb-10 text-gray-600">
            Une question, un besoin ? N'hésitez pas à nous contacter. Nous sommes là pour vous aider.
          </p>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Coordonnées */}
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
  
            {/* Formulaire de contact */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="email"
                placeholder="votre-email@example.com"
                className="w-full border rounded px-4 py-2"
              />
              <textarea
                placeholder="Écrivez votre message..."
                className="w-full border rounded px-4 py-2 h-32"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition flex justify-center items-center gap-2"
              >
                💬 Envoyer le message
              </button>
            </form>
          </div>
        </section>
  
        {/* Footer */}
        <Footer/>
      </div>
    );
  }
  