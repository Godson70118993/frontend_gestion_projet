// src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Interface for a task's structure - Updated to match backend expectations
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'a_faire' | 'en_cours' | 'termine';
}

// Props for the TaskForm component
interface TaskFormProps {
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, onClose, onSuccess, taskToEdit }) => {
  const { token, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'a_faire' | 'en_cours' | 'termine'>('a_faire');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation d'apparition du modal
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fill the form if a task is passed for editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('a_faire');
    }
  }, [taskToEdit]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Délai pour l'animation de fermeture
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Erreur: Vous n'êtes pas authentifié.");
      logout();
      return;
    }

    setIsSubmitting(true);
    setMessage('Traitement en cours...');
    
    const taskData = {
      title,
      description,
      status,
    };

    const apiUrl = taskToEdit 
    ? `https://backend-gestion-projet-14.onrender.com/tasks/${taskToEdit.id}` 
    : `https://backend-gestion-projet-14.onrender.com/projects/${projectId}/tasks`;
    const method = taskToEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setMessage(taskToEdit ? 'Tâche mise à jour avec succès !' : 'Tâche créée avec succès !');
        
        // Animation de succès avec délai
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 300);
        }, 1500);
      } else if (response.status === 401) {
        logout();
      } else {
        const errorText = await response.text();
        try {
            const errorData = JSON.parse(errorText);
            setMessage(`Erreur: ${errorData.detail || response.statusText}`);
        } catch (e) {
            setMessage(`Erreur: ${errorText || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage('Erreur réseau. Impossible de contacter le serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTitle = taskToEdit ? 'Modifier la tâche' : 'Ajouter une tâche';
  const buttonText = taskToEdit ? 'Mettre à jour' : 'Ajouter';

  return (
    <div className={`
      fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 
      flex items-center justify-center p-4
      transition-opacity duration-300 ease-in-out
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        relative mx-auto p-6 border w-full max-w-md shadow-2xl rounded-xl bg-white 
        transform transition-all duration-300 ease-in-out sm:my-8 sm:align-middle
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleClose}
            className="
              text-gray-400 hover:text-gray-600 
              transition-colors duration-200 
              hover:rotate-90 transform
            "
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center animate-fadeIn">
          {formTitle}
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la tâche
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="
                mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-3 border
                transition-all duration-200 ease-in-out
                hover:border-violet-300 focus:scale-105
              "
              placeholder="Entrer le titre de la tâche"
              disabled={isSubmitting}
            />
          </div>

          <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="
                mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-3 border
                transition-all duration-200 ease-in-out
                hover:border-violet-300 focus:scale-105 resize-none
              "
              placeholder="Entrer la description détaillée"
              disabled={isSubmitting}
            />
          </div>

          <div className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'a_faire' | 'en_cours' | 'termine')} 
              className="
                mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-3 border
                transition-all duration-200 ease-in-out
                hover:border-violet-300 focus:scale-105
              "
              disabled={isSubmitting}
            >
              <option value="a_faire">À faire</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          {message && (
            <div className={`
              text-sm font-medium text-center p-3 rounded-lg animate-bounce
              transition-all duration-300
              ${message.startsWith('Erreur') 
                ? 'text-red-600 bg-red-50 border border-red-200' 
                : 'text-green-600 bg-green-50 border border-green-200'
              }
              ${isSubmitting ? 'animate-pulse' : ''}
            `}>
              {message}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="
                px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
                transition-all duration-200 ease-in-out
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
                transition-all duration-200 ease-in-out
                hover:scale-105 active:scale-95 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden
              "
            >
              <span className={`${isSubmitting ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                {buttonText}
              </span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;