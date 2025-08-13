// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Inscription en cours...');

    try {
      const response = await fetch('https://backend-gestion-projet-4.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        // Redirige vers la page de connexion après une inscription réussie
        navigate('/auth', { state: { formType: 'login' } }); 
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-5">
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="
            bg-gray-800 text-white rounded-md p-3 sm:p-4
            focus:outline-none focus:ring-2 focus:ring-violet-600
            text-sm sm:text-base w-full
            transition-all duration-200 ease-in-out
            hover:bg-gray-700 focus:bg-gray-700
          "
          placeholder="votre nom d'utilisateur"
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            bg-gray-800 text-white rounded-md p-3 sm:p-4
            focus:outline-none focus:ring-2 focus:ring-violet-600
            text-sm sm:text-base w-full
            transition-all duration-200 ease-in-out
            hover:bg-gray-700 focus:bg-gray-700
          "
          placeholder="votre.email@exemple.com"
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            bg-gray-800 text-white rounded-md p-3 sm:p-4
            focus:outline-none focus:ring-2 focus:ring-violet-600
            text-sm sm:text-base w-full
            transition-all duration-200 ease-in-out
            hover:bg-gray-700 focus:bg-gray-700
          "
          placeholder="********"
          required
        />
      </div>
      
      {message && (
        <div className="
          text-sm sm:text-base font-medium text-center p-3 sm:p-4 rounded-lg
          bg-gray-100 text-gray-800 border border-gray-300
        ">
          {message}
        </div>
      )}
      
      <button 
        type="submit" 
        className="
          bg-violet-600 text-white font-semibold py-3 sm:py-4 px-4
          rounded-md hover:bg-violet-700 transition duration-300
          text-sm sm:text-base w-full
          transform hover:scale-[1.02] active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
        "
      >
        Inscription
      </button>
    </form>
  );
};

export default RegisterForm;