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
      const projectResponse = await fetch(`https://backend-gestion-projet-3.onrender.com/projects/${projectId}`, {
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

      const tasksResponse = await fetch(`https://backend-gestion-projet-3.onrender.com/projects/${projectId}/tasks`, {
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
      const response = await fetch(`https://backend-gestion-projet-3.onrender.com/tasks/${taskToDeleteId}`, {
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
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <Link to="/dashboard" className="text-violet-600 hover:underline">Retour au tableau de bord</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Projet non trouvé.</p>
        <Link to="/dashboard" className="text-violet-600 hover:underline">Retour au tableau de bord</Link>
      </div>
    );
  }

  // Filtrage des tâches avec les valeurs de statut correctes
  const tasksAFaire = tasks.filter(task => task.status === 'a_faire');
  const tasksEnCours = tasks.filter(task => task.status === 'en_cours');
  const tasksTermine = tasks.filter(task => task.status === 'termine');

  return (
    <div className="container mx-auto p-8">
      <Link to="/dashboard" className="flex items-center text-violet-600 hover:underline mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Retour au tableau de bord
      </Link>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.title}</h1>
      <p className="text-gray-600 mb-8">{project.description}</p>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">Tâches</h2>
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="bg-violet-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-violet-700 transition duration-300 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Ajouter une Tâche</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne "À faire" */}
        <div className="bg-gray-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">À faire ({tasksAFaire.length})</h3>
          <div className="space-y-4">
            {tasksAFaire.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteConfirmation} />
            ))}
          </div>
        </div>
        
        {/* Colonne "En cours" */}
        <div className="bg-gray-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">En cours ({tasksEnCours.length})</h3>
          <div className="space-y-4">
            {tasksEnCours.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteConfirmation} />
            ))}
          </div>
        </div>

        {/* Colonne "Terminé" */}
        <div className="bg-gray-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Terminé ({tasksTermine.length})</h3>
          <div className="space-y-4">
            {tasksTermine.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteConfirmation} />
            ))}
          </div>
        </div>
      </div>

      {(isTaskFormOpen || taskToEdit) && (
        <TaskForm
          projectId={Number(projectId)}
          onClose={() => { setIsTaskFormOpen(false); setTaskToEdit(null); }}
          onSuccess={handleTaskFormSuccess}
          taskToEdit={taskToEdit}
        />
      )}

      {taskToDeleteId !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900">Confirmation de suppression</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Oui
              </button>
              <button
                onClick={() => setTaskToDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
