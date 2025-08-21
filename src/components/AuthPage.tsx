// src/components/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(location.state?.formType === 'register');

  useEffect(() => {
    if (location.state?.formType) {
      setIsRegister(location.state.formType === 'register');
    }
  }, [location.state]);

  return (
    <div className="
      min-h-screen flex items-center justify-center p-4 sm:p-6
      bg-gradient-to-br from-violet-50 via-white to-indigo-50
      -mt-16
    ">
      <div className="
        bg-white rounded-2xl shadow-2xl 
        w-full max-w-lg
        transform transition-all duration-300
        border border-gray-100
        overflow-hidden
      ">
        {/* Header avec tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setIsRegister(false)}
              className={`
                flex-1 p-4 sm:p-6 text-center font-bold text-lg sm:text-xl
                transition-all duration-300 relative
                ${!isRegister 
                  ? 'text-violet-600 bg-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Connexion
              {!isRegister && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`
                flex-1 p-4 sm:p-6 text-center font-bold text-lg sm:text-xl
                transition-all duration-300 relative
                ${isRegister 
                  ? 'text-violet-600 bg-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Inscription
              {isRegister && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>
        
        {/* Contenu du formulaire */}
        <div className="p-6 sm:p-8">
          {/* Titre et description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {isRegister ? 'Rejoignez-nous' : 'Bon retour !'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
              {isRegister 
                ? 'Créez votre compte pour commencer à gérer vos projets de manière efficace et collaborative.' 
                : 'Connectez-vous à votre espace personnel pour accéder à vos projets et collaborations.'
              }
            </p>
          </div>
          
          {/* Formulaires avec animation de transition */}
          <div className="transition-all duration-500 ease-in-out">
            <div className={`transform transition-all duration-500 ${
              isRegister 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-0 opacity-100'
            }`}>
              {isRegister ? <RegisterForm /> : <LoginForm />}
            </div>
          </div>

          {/* Footer de basculement */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isRegister ? 'Vous avez déjà un compte ?' : 'Vous n\'avez pas encore de compte ?'}
              </p>
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="
                  mt-2 inline-flex items-center text-violet-600 hover:text-violet-700 
                  font-semibold text-sm transition-all duration-200
                  hover:underline underline-offset-4
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                  rounded px-2 py-1
                "
              >
                {isRegister ? 'Se connecter maintenant' : 'Créer un compte gratuit'}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;