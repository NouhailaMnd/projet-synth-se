import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Bell } from 'lucide-react'; // Assure-toi d'avoir installé lucide-react

const Navbar = () => {
  const [openMailDropdown, setOpenMailDropdown] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openNotificationDropdown, setOpenNotificationDropdown] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [username, setUsername] = useState('');
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [userData, setUserData] = useState({ id: '', name: '', email: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [messagesRes, clientsRes] = await Promise.all([
          axios.get('/api/contacts/latest'),
          axios.get('/api/users/latest-clients'),
        ]);
        setMessages(messagesRes.data);
        setClients(clientsRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement initial :", error);
      }
    };

    // Récupérer l'utilisateur connecté
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name);
      setUserData({ id: user.id, name: user.name, email: user.email });
    }

    fetchInitialData();
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 60000);
    if (diff < 1) return "à l'instant";
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)} h`;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/update', userData);
      sessionStorage.setItem('user', JSON.stringify(res.data));
      setUsername(res.data.name);
      setShowEditPopup(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <header className="h-16 bg-white shadow-lg px-6 flex items-center justify-between fixed top-0 left-64 right-0 z-50 border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Centre de contrôle</h1>
      <div className="flex items-center gap-6 relative">
        {/* Icône Messages */}
        <div className="relative">
          <button
            onClick={() => setOpenMailDropdown(!openMailDropdown)}
            className="relative text-gray-600 hover:text-blue-600"
          >
            <Mail className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
              {messages.length}
            </span>
          </button>

          {openMailDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
              <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">📥 Messages récents</div>
              <div className="p-2 max-h-80 overflow-auto divide-y divide-gray-100">
                {messages.length === 0 ? (
                  <div className="text-gray-500 text-sm p-4 text-center">Aucun message</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        setOpenMailDropdown(false);
                      }}
                      className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer transition rounded-md"
                    >
                      <img
                        src={`https://i.pravatar.cc/40?u=${msg.email}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">✉️ {msg.nom}</div>
                        <div className="text-xs text-gray-500 truncate">{msg.message.slice(0, 40)}...</div>
                        <div className="text-[10px] text-gray-400 mt-1">{timeAgo(msg.created_at)} ago</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Icône Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpenNotificationDropdown(!openNotificationDropdown)}
            className="relative text-gray-600 hover:text-blue-600"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
              {clients.length}
            </span>
          </button>

          {openNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
              <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">🧑‍💼 Nouveaux clients</div>
              <div className="p-2 max-h-80 overflow-auto divide-y divide-gray-100">
                {clients.length === 0 ? (
                  <div className="text-gray-500 text-sm p-4 text-center">Aucun nouveau client</div>
                ) : (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setOpenNotificationDropdown(false);
                      }}
                      className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer transition rounded-md"
                    >
                      <img
                        src={`https://i.pravatar.cc/40?u=${client.email}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">🆕 {client.name}</div>
                        <div className="text-xs text-gray-500">Inscrit {timeAgo(client.created_at)} ago</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Utilisateur connecté */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setOpenUserDropdown(!openUserDropdown)}
          >
            <div className="text-sm text-gray-700 font-medium">
              Bonjour, <span className="text-blue-600 font-semibold">{username || 'Admin'}</span>
            </div>
            <img
              src="https://i.pravatar.cc/40"
              alt="Avatar utilisateur"
              className="rounded-full w-10 h-10 border border-gray-300 shadow"
            />
          </div>

          {openUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
              <div className="p-2 space-y-2">
                <button
                  onClick={() => {
                    setShowEditPopup(true);
                    setOpenUserDropdown(false);
                  }}
                  className="w-full text-left text-gray-600 hover:bg-gray-100 py-2 px-3 rounded-md"
                >
                  Modifier mes infos
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 hover:bg-gray-100 py-2 px-3 rounded-md"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pop-ups */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md shadow-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">📨 Détail du message</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>👤 Nom:</strong> {selectedMessage.nom}</p>
              <p><strong>✉️ Email:</strong> {selectedMessage.email}</p>
              <p><strong>📝 Message:</strong><br /> {selectedMessage.message}</p>
              <p className="text-[11px] text-gray-500 mt-3">⏰ Reçu {timeAgo(selectedMessage.created_at)} ago</p>
            </div>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md shadow-2xl relative">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">🧾 Détails du client</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>👤 Nom:</strong> {selectedClient.name}</p>
              <p><strong>✉️ Email:</strong> {selectedClient.email}</p>
              <p className="text-[11px] text-gray-500 mt-3">⏰ Inscrit {timeAgo(selectedClient.created_at)} ago</p>
            </div>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowEditPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">✏️ Modifier mes informations</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nom</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
