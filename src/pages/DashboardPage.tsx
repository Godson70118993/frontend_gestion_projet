// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate pour la navigation programmatique
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';

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
  const navigate = useNavigate(); // Ajout de useNavigate pour la navigation

  const fetchProjects = async () => {
    setFetchError(null);
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await fetch('https://backend-gestion-projet-4.onrender.com/projects', {
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
      const response = await fetch(`https://backend-gestion-projet-4.onrender.com/projects/${projectToDeleteId}`, {
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

  // Nouvelle fonction pour gérer la navigation vers un projet
  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchProjects();
    }
  }, [isAuthenticated, loading, token]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 text-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
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
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Créer un Projet</span>
        </button>
      </div>

      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {fetchError}</span>
          <button
            onClick={() => setFetchError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fermer</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <div 
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
            >
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                createdAt={project.created_at}
                onEdit={(e) => {
                  e.stopPropagation(); // Empêche la navigation quand on clique sur éditer
                  handleEditProject(project);
                }}
                onDelete={(projectId, e) => {
                  e?.stopPropagation(); // Empêche la navigation quand on clique sur supprimer
                  handleDeleteConfirmation(projectId);
                }}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun projet</h3>
              <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de projet. Commencez dès maintenant !</p>
              <button
                onClick={handleCreateProject}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition duration-300"
              >
                Créer mon premier projet
              </button>
            </div>
          </div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-96 shadow-xl rounded-lg bg-white">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 14c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmation de suppression</h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible et toutes les données associées seront perdues.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDeleteProject}
                  className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                >
                  Oui, supprimer
                </button>
                <button
                  onClick={() => setProjectToDeleteId(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;