// src/components/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RegisterForm from './RegisterForm';  
import LoginForm from './LoginForm';

const AuthPage: React.FC = () => {
  const location = useLocation();
  // Initialise l'état isRegister en fonction du paramètre formType passé via la navigation
  // Si formType est 'register', isRegister sera true, sinon false (par défaut pour 'login')
  const [isRegister, setIsRegister] = useState(location.state?.formType === 'register');

  useEffect(() => {
    // Ce useEffect s'exécute lorsque l'état de la localisation change.
    // Il permet de basculer entre les formulaires de connexion et d'inscription
    // si l'utilisateur clique sur les boutons "Connexion" ou "Inscription" de la Navbar.
    if (location.state?.formType) {
      setIsRegister(location.state.formType === 'register');
    }
  }, [location.state]); // Dépendance sur location.state pour réagir aux changements de navigation

  return (
    <div className="
      flex items-center justify-center min-h-screen -mt-16 p-4 sm:p-6
      bg-gradient-to-br from-violet-50 to-indigo-100
    ">
      <div className="
        bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl 
        w-full max-w-sm sm:max-w-md lg:max-w-lg
        transform transition-all duration-300
        border border-gray-100
      ">
        {/* Section des boutons de bascule Connexion / Inscription - Responsive */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6">
          <button
            onClick={() => setIsRegister(false)} // Passe au formulaire de Connexion
            className={`
              flex-1 p-3 sm:p-4 text-center font-semibold 
              text-sm sm:text-lg lg:text-xl
              transition-all duration-300 relative
              ${!isRegister 
                ? 'text-violet-600 border-b-2 border-violet-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            Connexion
            {!isRegister && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 animate-slideInLeft"></div>
            )}
          </button>
          <button
            onClick={() => setIsRegister(true)} // Passe au formulaire d'Inscription
            className={`
              flex-1 p-3 sm:p-4 text-center font-semibold 
              text-sm sm:text-lg lg:text-xl
              transition-all duration-300 relative
              ${isRegister 
                ? 'text-violet-600 border-b-2 border-violet-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            Inscription
            {isRegister && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 animate-slideInRight"></div>
            )}
          </button>
        </div>
        
        {/* Titre dynamique du formulaire - Responsive */}
        <h2 className="
          text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 
          mb-4 sm:mb-6 leading-tight
        ">
          {isRegister ? 'Créez votre compte' : 'Connectez-vous'}
        </h2>

        {/* Sous-titre informatif */}
        <p className="
          text-xs sm:text-sm text-gray-600 text-center mb-6 sm:mb-8 
          leading-relaxed px-2
        ">
          {isRegister 
            ? 'Rejoignez-nous pour gérer vos projets efficacement' 
            : 'Accédez à votre espace de gestion de projets'
          }
        </p>
        
        {/* Affichage conditionnel du formulaire avec animation */}
        <div className="transition-all duration-500 ease-in-out">
          {isRegister ? (
            <div className="animate-fadeIn">
              <RegisterForm /> {/* Affiche le formulaire d'inscription */}
            </div>
          ) : (
            <div className="animate-fadeIn">
              <LoginForm /> {/* Affiche le formulaire de connexion */}
            </div>
          )}
        </div>

        {/* Footer avec lien de basculement */}
        <div className="
          mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-center
        ">
          <p className="text-xs sm:text-sm text-gray-600">
            {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="
                ml-2 text-violet-600 hover:text-violet-700 font-semibold
                underline underline-offset-2 hover:underline-offset-4
                transition-all duration-200
              "
            >
              {isRegister ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;