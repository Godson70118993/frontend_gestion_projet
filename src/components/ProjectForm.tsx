// src/components/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Interface for a project's structure
interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

// Props for the ProjectForm component
interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  // Optional prop for editing. If it is present, the form will be in "editing" mode
  projectToEdit?: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSuccess, projectToEdit }) => {
  const { token, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // Fill the form if a project is passed for editing (useEffect runs on every change to projectToEdit)
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
    } else {
      // Reset the form if we are in "creation" mode
      setTitle('');
      setDescription('');
    }
  }, [projectToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Erreur: Vous n'êtes pas authentifié.");
      logout();
      return;
    }

    setMessage('Traitement en cours...');
    
    const projectData = {
      title,
      description,
    };

    // Determine the API URL and HTTP method based on the mode (creation or modification)
    const apiUrl = projectToEdit 
      ? `https://backend-gestion-projet-6.onrender.com/projects/${projectToEdit.id}` 
      : 'https://backend-gestion-projet-6.onrender.com/projects';
    const method = projectToEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setMessage(projectToEdit ? 'Projet mis à jour avec succès !' : 'Projet créé avec succès !');
        onSuccess(); // Call the parent's success function to refresh the data
      } else if (response.status === 401) {
        logout(); // Disconnect if the token is invalid
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setMessage('Erreur réseau. Impossible de contacter le serveur.');
    }
  };

  // Title and button text that changes depending on the mode
  const formTitle = projectToEdit ? 'Modifier le projet' : 'Créer un projet';
  const buttonText = projectToEdit ? 'Mettre à jour' : 'Créer';

  return (
    // Full-screen container with a semi-transparent background for the modal
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-xl bg-white transform transition-all sm:my-8 sm:align-middle">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{formTitle}</h3>
        {/* The form element handles submission via the Enter key */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre du projet
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2"
              placeholder="Entrer le titre"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2"
              placeholder="Entrer la description"
            ></textarea>
          </div>
          {message && (
            <div className={`text-sm font-medium text-center ${message.startsWith('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
