// src/pages/ProjectDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

// Mise à jour de l'interface Task pour correspondre aux valeurs attendues par le backend
// 'a_faire' | 'en_cours' | 'termine' sont les valeurs attendues par le backend.
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'a_faire' | 'en_cours' | 'termine';
}

interface Project {
  id: number;
  title: string;
  description: string;
}

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { token, logout } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);

  const fetchProjectAndTasks = async () => {
    if (!token) {
      logout();
      return;
    }
    setLoading(true);
    try {
      const projectResponse = await fetch(`https://backend-gestion-projet-14.onrender.com/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (projectResponse.ok) {
        const projectData: Project = await projectResponse.json();
        setProject(projectData);
      } else if (projectResponse.status === 401) {
        logout();
        return;
      } else {
        const errorData = await projectResponse.json();
        setError(`Erreur lors du chargement du projet: ${errorData.detail || projectResponse.statusText}`);
      }

      const tasksResponse = await fetch(`https://backend-gestion-projet-14.onrender.com/projects/${projectId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (tasksResponse.ok) {
        const tasksData: Task[] = await tasksResponse.json();
        setTasks(tasksData);
      } else if (tasksResponse.status === 401) {
        logout();
        return;
      } else {
        const errorData = await tasksResponse.json();
        setError(`Erreur lors du chargement des tâches: ${errorData.detail || tasksResponse.statusText}`);
      }
    } catch (err) {
      setError('Erreur réseau. Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId, token]);

  const handleTaskFormSuccess = () => {
    setIsTaskFormOpen(false);
    setTaskToEdit(null);
    fetchProjectAndTasks();
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteConfirmation = (taskId: number) => {
    setTaskToDeleteId(taskId);
  };

  const handleDeleteTask = async () => {
    if (!taskToDeleteId || !token) return;
    try {
      const response = await fetch(`https://backend-gestion-projet-14.onrender.com/tasks/${taskToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTaskToDeleteId(null);
        fetchProjectAndTasks();
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setError(`Erreur lors de la suppression de la tâche: ${errorData.detail || response.statusText}`);
      }
    } catch (err) {
      setError('Erreur réseau. Impossible de supprimer la tâche.');
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-700">Chargement du projet...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 sm:p-8">
        <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>
        <Link to="/dashboard" className="text-violet-600 hover:underline text-sm sm:text-base">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center p-4 sm:p-8">
        <p className="text-gray-500 text-sm sm:text-base mb-4">Projet non trouvé.</p>
        <Link to="/dashboard" className="text-violet-600 hover:underline text-sm sm:text-base">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  // Filtrage des tâches avec les valeurs de statut correctes
  const tasksAFaire = tasks.filter(task => task.status === 'a_faire');
  const tasksEnCours = tasks.filter(task => task.status === 'en_cours');
  const tasksTermine = tasks.filter(task => task.status === 'termine');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Lien de retour - Responsive */}
      <Link 
        to="/dashboard" 
        className="flex items-center text-violet-600 hover:underline mb-6 sm:mb-8 text-sm sm:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="truncate">Retour au tableau de bord</span>
      </Link>

      {/* Informations du projet - Responsive */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 break-words">
          {project.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 break-words">
          {project.description}
        </p>
      </div>

      {/* Section titre tâches et bouton - Layout responsive */}
      <div className="mb-6">
        {/* Mobile: Stack vertical */}
        <div className="flex flex-col space-y-4 sm:hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 text-center">
            Tâches
          </h2>
          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="bg-violet-600 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-violet-700 transition duration-300 flex items-center justify-center space-x-2 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm sm:text-base">Ajouter une Tâche</span>
          </button>
        </div>

        {/* Tablet et Desktop: Layout horizontal */}
        <div className="hidden sm:flex sm:justify-between sm:items-center flex-wrap gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
            Tâches
          </h2>
          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="bg-violet-600 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg hover:bg-violet-700 transition duration-300 flex items-center space-x-2 text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="whitespace-nowrap">Ajouter une Tâche</span>
          </button>
        </div>
      </div>

      {/* Colonnes des tâches - Layout responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Colonne "À faire" */}
        <div className="bg-gray-100 p-3 sm:p-4 rounded-xl shadow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center md:text-left">
            À faire ({tasksAFaire.length})
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {tasksAFaire.length > 0 ? (
              tasksAFaire.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteConfirmation} />
              ))
            ) : (
              <div className="text-center py-4 sm:py-6">
                <div className="text-gray-400 mb-2">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Aucune tâche</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Colonne "En cours" */}
        <div className="bg-gray-100 p-3 sm:p-4 rounded-xl shadow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center md:text-left">
            En cours ({tasksEnCours.length})
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {tasksEnCours.length > 0 ? (
              tasksEnCours.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteConfirmation} />
              ))
            ) : (
              <div className="text-center py-4 sm:py-6">
                <div className="text-gray-400 mb-2">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Aucune tâche</p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne "Terminé" */}
        <div className="bg-gray-100 p-3 sm:p-4 rounded-xl shadow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center md:text-left">
            Terminé ({tasksTermine.length})
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {tasksTermine.length > 0 ? (
              tasksTermine.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteConfirmation} />
              ))
            ) : (
              <div className="text-center py-4 sm:py-6">
                <div className="text-gray-400 mb-2">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Aucune tâche</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Responsive par défaut */}
      {(isTaskFormOpen || taskToEdit) && (
        <TaskForm
          projectId={Number(projectId)}
          onClose={() => { setIsTaskFormOpen(false); setTaskToEdit(null); }}
          onSuccess={handleTaskFormSuccess}
          taskToEdit={taskToEdit}
        />
      )}

      {taskToDeleteId !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-sm sm:max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4">
              Confirmation de suppression
            </h3>
            <div className="mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-0 sm:space-x-2">
              <button
                onClick={() => setTaskToDeleteId(null)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 text-xs sm:text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Non
              </button>
              <button
                onClick={handleDeleteTask}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 text-white text-xs sm:text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;