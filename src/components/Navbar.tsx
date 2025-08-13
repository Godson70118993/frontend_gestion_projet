// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importation du hook d'authentification

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Utilise le hook useAuth pour accéder à l'état d'authentification,
  // à la fonction de déconnexion et aux informations de l'utilisateur.
  const { isAuthenticated, logout, user } = useAuth(); 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Ferme le menu mobile après déconnexion
  };

  return (
    <header className="bg-white shadow-sm p-4 fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-violet-700">
          ProjetApp
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            // Si l'utilisateur est authentifié, affiche le message de bienvenue et le bouton de déconnexion
            <>
              <span className="text-gray-700 font-semibold text-sm lg:text-base mr-2 truncate max-w-48">
                Bienvenue, {user?.username || user?.email || 'Utilisateur'}!
              </span>
              <button
                onClick={handleLogout}
                className="
                  bg-red-600 text-white font-semibold px-4 py-2 rounded-md 
                  hover:bg-red-700 transition duration-300
                  transform hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  text-sm lg:text-base
                "
              >
                Déconnexion
              </button>
            </>
          ) : (
            // Si l'utilisateur n'est PAS authentifié, affiche les boutons Connexion et Inscription
            <>
              <button
                onClick={() => navigate('/auth', { state: { formType: 'login' } })}
                className="
                  text-violet-700 font-semibold px-4 py-2 rounded-md transition duration-300 
                  transform hover:scale-105 active:scale-95
                  hover:bg-violet-50
                  text-sm lg:text-base
                "
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/auth', { state: { formType: 'register' } })}
                className="
                  bg-violet-600 text-white font-semibold px-4 py-2 rounded-md 
                  hover:bg-violet-700 transition duration-300 
                  transform hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                  text-sm lg:text-base
                "
              >
                Inscription
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="
            md:hidden flex flex-col items-center justify-center w-8 h-8
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded
          "
          aria-label="Toggle mobile menu"
        >
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
          }`}></span>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
          }`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`
        md:hidden transition-all duration-300 ease-in-out overflow-hidden
        ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-4 pt-4 pb-2 space-y-3 bg-white border-t border-gray-100">
          {isAuthenticated ? (
            <>
              <div className="text-gray-700 font-semibold text-sm py-2 border-b border-gray-100">
                Bienvenue, <br />
                <span className="text-violet-600">{user?.username || user?.email || 'Utilisateur'}!</span>
              </div>
              <button
                onClick={handleLogout}
                className="
                  w-full bg-red-600 text-white font-semibold px-4 py-3 rounded-md 
                  hover:bg-red-700 transition duration-300
                  transform active:scale-95
                  text-sm
                "
              >
                Déconnexion
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/auth', { state: { formType: 'login' } });
                  setIsMobileMenuOpen(false);
                }}
                className="
                  w-full text-violet-700 font-semibold px-4 py-3 rounded-md 
                  transition duration-300 border border-violet-600
                  hover:bg-violet-50 active:scale-95
                  text-sm
                "
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  navigate('/auth', { state: { formType: 'register' } });
                  setIsMobileMenuOpen(false);
                }}
                className="
                  w-full bg-violet-600 text-white font-semibold px-4 py-3 rounded-md 
                  hover:bg-violet-700 transition duration-300
                  transform active:scale-95
                  text-sm
                "
              >
                Inscription
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;