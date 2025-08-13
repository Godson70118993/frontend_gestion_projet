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
      const response = await fetch('https://backend-gestion-projet-5.onrender.com/projects', {
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
      const response = await fetch(`https://backend-gestion-projet-3.onrender.com/projects/${projectToDelete.id}`, {
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
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-8 mb-4">
        Bienvenue, {user.username || user.email}!
      </h1>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-700">Mes Projets</h2>
        <button
          onClick={() => { setProjectToEdit(null); setIsFormModalOpen(true); }}
          className="bg-violet-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-violet-700 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
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
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="relative group">
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                createdAt={project.created_at}
                onEdit={() => handleEdit(project.id)} // CORRECTION APPLIQUÉE ICI
                onDelete={() => handleDelete(project.id)} // CORRECTION APPLIQUÉE ICI
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">Aucun projet trouvé. Créez-en un pour commencer !</p>
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
