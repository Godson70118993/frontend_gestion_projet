// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // AJOUTÉ : État de chargement
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // AJOUTÉ : Démarre le chargement
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
        navigate('/auth', { state: { formType: 'login' } }); 
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false); // AJOUTÉ : Arrête le chargement
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
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          placeholder="votre nom d'utilisateur"
          required
          disabled={isLoading} // AJOUTÉ : Désactive le champ pendant le chargement
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
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          placeholder="votre.email@exemple.com"
          required
          disabled={isLoading} // AJOUTÉ : Désactive le champ pendant le chargement
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
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          placeholder="********"
          required
          disabled={isLoading} // AJOUTÉ : Désactive le champ pendant le chargement
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
        disabled={isLoading} // AJOUTÉ : Désactive le bouton pendant le chargement
        className="
          w-full bg-violet-600 text-white py-3 sm:py-4 px-4 rounded-md 
          hover:bg-violet-700 transition duration-300 font-semibold
          text-sm sm:text-base
          transform hover:scale-[1.02] active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          relative overflow-hidden
        "
      >
        {/* AJOUTÉ : Affichage conditionnel du texte et du spinner */}
        <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          Inscription
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
