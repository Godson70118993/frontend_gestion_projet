// src/components/CreateProjectForm.tsx
import React, { useState } from 'react';

interface CreateProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Création en cours...');

    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Erreur: Utilisateur non authentifié.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://backend-gestion-projet-14.onrender.com/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setMessage('Projet créé avec succès !');
        setTimeout(() => {
          onSuccess(); // Rafraîchit la liste des projets
          onClose(); // Ferme le formulaire
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="
      fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 z-50
      backdrop-blur-sm
    ">
      <div className="
        bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl 
        w-full max-w-sm sm:max-w-md lg:max-w-lg
        transform transition-all duration-300 scale-95 sm:scale-100
        animate-slideInUp max-h-[90vh] overflow-y-auto
      ">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Créer un projet
          </h3>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="
              text-gray-400 hover:text-gray-600 transition-colors p-1
              hover:bg-gray-100 rounded-full
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Fermer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 sm:h-6 sm:w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Titre du projet
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="
                bg-gray-100 text-gray-800 rounded-md p-3 sm:p-4
                focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white
                text-sm sm:text-base w-full
                transition-all duration-200 ease-in-out
                hover:bg-gray-50 border border-gray-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="Nom de votre projet"
              required
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="
                bg-gray-100 text-gray-800 rounded-md p-3 sm:p-4
                focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white
                text-sm sm:text-base w-full
                transition-all duration-200 ease-in-out
                hover:bg-gray-50 border border-gray-200 resize-none
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              rows={4}
              placeholder="Décrivez votre projet..."
              required
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
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="
                flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg
                text-gray-700 bg-gray-200 hover:bg-gray-300 
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-gray-400
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                order-2 sm:order-1
              "
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="
                flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg
                text-white bg-violet-600 hover:bg-violet-700 
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-violet-500
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                order-1 sm:order-2 relative overflow-hidden
              "
            >
              <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                Créer
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;