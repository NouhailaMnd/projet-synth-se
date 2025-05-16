import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Bell } from 'lucide-react'; // Assure-toi d'avoir installé lucide-react
import { ListChecks } from 'lucide-react';  
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
const [tasks, setTasks] = useState([]);
const [newTask, setNewTask] = useState('');
const [showTaskPopup, setShowTaskPopup] = useState(false);
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
const addTask = () => {
  if (newTask.trim() !== '') {
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
    setNewTask('');
  }
};

const toggleTask = (id) => {
  setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
};

const deleteTask = (id) => {
  setTasks(tasks.filter(task => task.id !== id));
};

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
      <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">             </h1>
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
{/* Icône bloc-notes */}
<button
  onClick={() => setShowTaskPopup(true)}
  className="relative text-gray-600 hover:text-blue-600"
>
  <ListChecks className="w-5 h-5" />
</button>
{showTaskPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 md:p-8 rounded-2xl w-[95%] max-w-lg shadow-2xl relative transition-all duration-300">

      {/* Bouton de fermeture */}
      <button
        onClick={() => setShowTaskPopup(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold"
      >
        &times;
      </button>

      {/* Titre */}
      <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center flex items-center justify-center gap-2">
        📝 Mes tâches
      </h2>

      {/* Formulaire d'ajout */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Ajouter une tâche..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      <ul className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {tasks.length === 0 ? (
          <li className="text-center text-gray-500 italic text-sm">Aucune tâche pour l’instant</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="accent-blue-600"
                />
                <span className={`text-sm ${task.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {task.text}
                </span>
              </label>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Supprimer
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
)}

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
  <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl z-50 border border-gray-200 overflow-hidden transition-all duration-300">
    <div className="p-3 space-y-2">
      <button
        onClick={() => {
          setShowEditPopup(true);
          setOpenUserDropdown(false);
        }}
        className="w-full flex items-center gap-2 text-left text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Modifier mes infos
      </button>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
        Se déconnecter
      </button>
    </div>
  </div>
)}

        </div>
      </div>

      {/* Pop-ups */}
     {selectedMessage && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white p-6 md:p-8 rounded-2xl w-[95%] max-w-lg shadow-2xl relative transition-all duration-300">
      
      {/* Bouton de fermeture */}
      <button
        onClick={() => setSelectedMessage(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
      >
        &times;
      </button>

      {/* Titre */}
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center gap-2">
        📨 Détail du message
      </h2>

      {/* Contenu du message */}
      <div className="space-y-4 text-base text-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">👤</span>
          <p><strong className="text-gray-800">Nom :</strong> {selectedMessage.nom}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">✉️</span>
          <p><strong className="text-gray-800">Email :</strong> {selectedMessage.email}</p>
        </div>

        <div className="flex gap-2">
          <span className="text-xl">📝</span>
          <div>
            <p className="font-semibold text-gray-800">Message :</p>
            <p className="mt-1 text-gray-600 whitespace-pre-line">{selectedMessage.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 italic">
          <span className="text-lg">⏰</span>
          <p>Reçu {timeAgo(selectedMessage.created_at)} ago</p>
        </div>
      </div>
    </div>
  </div>
)}

{selectedClient && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white p-6 md:p-8 rounded-2xl w-[95%] max-w-lg shadow-2xl relative transition-all duration-300">
      
      {/* Bouton de fermeture */}
      <button
        onClick={() => setSelectedClient(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
      >
        &times;
      </button>

      {/* Titre */}
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center gap-2">
        🧾 Détails du client
      </h2>

      {/* Contenu client */}
      <div className="space-y-4 text-base text-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">👤</span>
          <p><strong className="text-gray-800">Nom :</strong> {selectedClient.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">✉️</span>
          <p><strong className="text-gray-800">Email :</strong> {selectedClient.email}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 italic">
          <span className="text-lg">⏰</span>
          <p>Inscrit {timeAgo(selectedClient.created_at)} ago</p>
        </div>
      </div>
    </div>
  </div>
)}


     {showEditPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white p-6 md:p-8 rounded-2xl w-[95%] max-w-lg shadow-2xl relative transition-all duration-300">
      
      {/* Bouton de fermeture */}
      <button
        onClick={() => setShowEditPopup(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
      >
        &times;
      </button>

      {/* Titre */}
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center gap-2">
        ✏️ Modifier mes informations
      </h2>

      {/* Formulaire */}
      <form onSubmit={handleUpdateUser} className="space-y-5">
        {/* Champ Nom */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            required
          />
        </div>

        {/* Champ Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </div>

        {/* Bouton Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            💾 Enregistrer
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
