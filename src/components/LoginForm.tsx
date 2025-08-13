// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importation du hook d'authentification

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Utilisation de la fonction login du contexte

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Connexion en cours...');
    
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('https://backend-gestion-projet-5.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        // CHANGÉ: Attendre la résolution de la fonction login du contexte
        await login(data.access_token); 
        setMessage('Connexion réussie ! Redirection...');
        // La redirection est maintenant gérée par le AuthContext ou ProtectedRoute
        // Plus besoin de navigate ici, car login() gère la navigation si nécessaire
      } else {
        const errorData = await response.json();
        console.error('Erreur de connexion:', errorData);
        setMessage(`Erreur: ${errorData.detail || 'Email ou mot de passe incorrect'}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-5">
      <div className="flex flex-col">
        <label htmlFor="email" className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="
            bg-gray-800 text-white rounded-md p-3 sm:p-4
            focus:outline-none focus:ring-2 focus:ring-violet-600
            text-sm sm:text-base w-full
            transition-all duration-200 ease-in-out
            hover:bg-gray-700 focus:bg-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          placeholder="votre.email@exemple.com"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="
            bg-gray-800 text-white rounded-md p-3 sm:p-4
            focus:outline-none focus:ring-2 focus:ring-violet-600
            text-sm sm:text-base w-full
            transition-all duration-200 ease-in-out
            hover:bg-gray-700 focus:bg-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          placeholder="********"
        />
      </div>
      
      {message && (
        <div className={`
          text-sm sm:text-base font-medium text-center p-3 sm:p-4 rounded-lg
          transition-all duration-300
          ${message.startsWith('Erreur') 
            ? 'text-red-600 bg-red-50 border border-red-200' 
            : 'text-green-600 bg-green-50 border border-green-200'
          }
        `}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
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
        <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          Se connecter
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

export default LoginForm;