// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import de Link pour la navigation
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
// La ligne suivante a été supprimée : import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const { user, token, logout, isAuthenticated, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // La ligne suivante a été supprimée : const navigate = useNavigate();

  const fetchProjects = async () => {
    setFetchError(null);
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await fetch('https://backend-gestion-projet-3.onrender.com/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: Project[] = await response.json();
        setProjects(data);
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || response.statusText;
        setFetchError(`Erreur lors du chargement des projets: ${errorMessage}`);
      }
    } catch (error) {
      setFetchError('Erreur réseau. Impossible de charger les projets.');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleDeleteConfirmation = (projectId: number) => {
    setProjectToDeleteId(projectId);
  };

  const handleDeleteProject = async () => {
    if (!projectToDeleteId || !token) {
      return;
    }

    try {
      const response = await fetch(`https://backend-gestion-projet-3.onrender.com/projects/${projectToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setProjectToDeleteId(null);
        await fetchProjects();
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || response.statusText;
        setFetchError(`Erreur lors de la suppression du projet: ${errorMessage}`);
      }
    } catch (error) {
      setFetchError('Erreur réseau. Impossible de supprimer le projet.');
    }
  };

  const handleCreateProject = () => {
    setEditingProject({
      id: 0,
      title: '',
      description: '',
      created_at: ''
    });
  }

  const handleFormClose = () => {
    setEditingProject(null);
  }

  const handleFormSuccess = () => {
    handleFormClose();
    fetchProjects();
  }

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchProjects();
    }
  }, [isAuthenticated, loading, token]);

  if (loading || !user) {
    return <div className="text-center p-8 text-gray-700">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-8 mb-4">
        Bienvenue, {user.username || user.email}!
      </h1>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-700">Mes Projets</h2>
        <button
          onClick={handleCreateProject}
          className="bg-violet-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-violet-700 transition duration-300 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 h011-1z" clipRule="evenodd" />
          </svg>
          <span>Créer un Projet</span>
        </button>
      </div>
      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {fetchError}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                createdAt={project.created_at}
                onEdit={() => handleEditProject(project)}
                onDelete={handleDeleteConfirmation}
              />
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">Aucun projet trouvé. Créez-en un pour commencer !</p>
        )}
      </div>

      {editingProject && (
        <ProjectForm
          projectToEdit={editingProject.id === 0 ? null : editingProject}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {projectToDeleteId !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900">Confirmation de suppression</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Oui
              </button>
              <button
                onClick={() => setProjectToDeleteId(null)}
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

export default DashboardPage;
