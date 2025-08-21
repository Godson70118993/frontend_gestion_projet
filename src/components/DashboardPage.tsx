// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ProjectFormModal from '../components/ProjectFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// Interface for a project
interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const { user, token, logout, isAuthenticated, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // States to manage modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setFetchError(null);
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await fetch('https://backend-gestion-projet-6.onrender.com/projects', {
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

  const handleDeleteProject = async () => {
    if (!projectToDelete || !token) {
      return;
    }

    try {
      const response = await fetch(`https://backend-gestion-projet-6.onrender.com/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setProjectToDelete(null); // Close the modal
        await fetchProjects(); // Refresh the list
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

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchProjects();
    }
  }, [isAuthenticated, loading, token]);

  if (loading || !user) {
    return <div className="text-center p-8 text-gray-700">Chargement du tableau de bord...</div>;
  }
  
  const handleEdit = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setProjectToEdit(project);
      setIsFormModalOpen(true);
    }
  };

  const handleDelete = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setProjectToDelete(project);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Titre de bienvenue - Responsive */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mt-4 sm:mt-6 lg:mt-8 mb-4 px-2">
        Bienvenue, {user.username || user.email}!
      </h1>

      {/* Section titre et bouton - Layout responsive */}
      <div className="mb-6 sm:mb-8">
        {/* Mobile: Stack vertical */}
        <div className="flex flex-col space-y-4 sm:hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 text-center">
            Mes Projets
          </h2>
          <button
            onClick={() => { setProjectToEdit(null); setIsFormModalOpen(true); }}
            className="bg-violet-600 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-violet-700 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm sm:text-base">Créer un Projet</span>
          </button>
        </div>

        {/* Tablet et Desktop: Layout horizontal */}
        <div className="hidden sm:flex sm:justify-between sm:items-center flex-wrap gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
            Mes Projets
          </h2>
          <button
            onClick={() => { setProjectToEdit(null); setIsFormModalOpen(true); }}
            className="bg-violet-600 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg hover:bg-violet-700 hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="whitespace-nowrap">Créer un Projet</span>
          </button>
        </div>
      </div>

      {/* Messages d'erreur - Responsive */}
      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {fetchError}</span>
        </div>
      )}

      {/* Grille des projets - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="relative group">
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                createdAt={project.created_at}
                onEdit={() => handleEdit(project.id)}
                onDelete={() => handleDelete(project.id)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 sm:py-12">
            <div className="max-w-sm mx-auto px-4">
              <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Aucun projet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">Vous n'avez pas encore créé de projet. Commencez dès maintenant !</p>
              <button
                onClick={() => { setProjectToEdit(null); setIsFormModalOpen(true); }}
                className="bg-violet-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-violet-700 transition duration-300 text-sm sm:text-base"
              >
                Créer mon premier projet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form modal for create/edit */}
      {isFormModalOpen && (
        <ProjectFormModal
          projectToEdit={projectToEdit}
          onClose={() => { setIsFormModalOpen(false); setProjectToEdit(null); }}
          onSuccess={() => { setIsFormModalOpen(false); setProjectToEdit(null); fetchProjects(); }}
        />
      )}

      {/* Delete confirmation modal */}
      {projectToDelete && (
        <DeleteConfirmationModal
          project={projectToDelete}
          onConfirm={handleDeleteProject}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;