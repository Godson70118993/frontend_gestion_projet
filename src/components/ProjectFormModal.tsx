// src/components/ProjectFormModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Interfaces pour le projet
interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

// Props pour le composant de la modale du formulaire
interface ProjectFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: Project | null;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ onClose, onSuccess, projectToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();
  const isEditing = !!projectToEdit;

  useEffect(() => {
    if (isEditing && projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [projectToEdit, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!token) {
      logout();
      return;
    }
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `https://backend-gestion-projet-4.onrender.com/projects/${projectToEdit?.id}` : 'https://backend-gestion-projet-4.onrender.com/projects/';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        onSuccess();
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setError(`Erreur: ${errorData.detail || response.statusText}`);
      }
    } catch (err) {
      setError('Erreur réseau. Impossible de sauvegarder le projet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative p-8 bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto transform transition-all duration-300 scale-95 md:scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Modifier le projet' : 'Créer un nouveau projet'}
        </h3>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Erreur!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              placeholder="Titre de votre projet"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              placeholder="Décrivez votre projet en détail..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium rounded-full text-white bg-violet-600 hover:bg-violet-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-violet-400 shadow-md"
            >
              {loading ? 'Sauvegarde...' : isEditing ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
