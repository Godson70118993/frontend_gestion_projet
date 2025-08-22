// src/pages/DashboardPage.tsx - Version avec diagnostic
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ProjectFormModal from '../components/ProjectFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

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
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // États pour les modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setFetchError(null);
    setIsLoading(true);
    
    if (!token) {
      setDebugInfo({ error: "Pas de token d'authentification" });
      logout();
      return;
    }

    try {
      console.log('🔍 Tentative de récupération des projets...');
      console.log('Token présent:', !!token);
      console.log('User:', user);

      const response = await fetch('https://backend-gestion-projet-14.onrender.com/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Réponse du serveur:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const data: Project[] = await response.json();
        console.log('📦 Données récupérées:', data);
        
        setProjects(data);
        setDebugInfo({
          success: true,
          projectCount: data.length,
          response: {
            status: response.status,
            statusText: response.statusText
          },
          token: token.substring(0, 20) + '...', // Afficher seulement le début du token
          userId: user?.id || 'Non défini'
        });
      } else if (response.status === 401) {
        console.error('🚫 Token invalide ou expiré');
        setDebugInfo({ error: 'Token invalide ou expiré', status: 401 });
        logout();
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
        const errorMessage = errorData.detail || response.statusText;
        console.error('❌ Erreur serveur:', errorData);
        
        setFetchError(`Erreur lors du chargement des projets: ${errorMessage}`);
        setDebugInfo({
          error: errorMessage,
          status: response.status,
          errorData: errorData
        });
      }
    } catch (error) {
      console.error('🌐 Erreur réseau:', error);
      setFetchError('Erreur réseau. Impossible de charger les projets.');
      setDebugInfo({
        error: 'Erreur réseau',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || !token) {
      return;
    }

    try {
      console.log('🗑️ Suppression du projet:', projectToDelete.id);
      const response = await fetch(`https://backend-gestion-projet-14.onrender.com/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        console.log('✅ Projet supprimé avec succès');
        setProjectToDelete(null);
        await fetchProjects(); // Actualiser la liste
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

  // Test de l'API au chargement
  const testAPI = async () => {
    try {
      console.log('🧪 Test de l\'API...');
      const response = await fetch('https://backend-gestion-projet-14.onrender.com/health', {
        method: 'GET'
      });
      console.log('API Health Check:', response.status);
    } catch (error) {
      console.log('❌ API non accessible:', error);
    }
  };

  useEffect(() => {
    testAPI(); // Test initial de l'API
    if (isAuthenticated && !loading) {
      fetchProjects();
    }
  }, [isAuthenticated, loading, token]);

  if (loading || !user) {
    return (
      <div className="text-center p-8 text-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
        Chargement du tableau de bord...
      </div>
    );
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

  const handleRefresh = () => {
    console.log('🔄 Actualisation manuelle des projets');
    fetchProjects();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Titre de bienvenue */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mt-4 sm:mt-6 lg:mt-8 mb-4 px-2">
        Bienvenue, {user.username || user.email}!
      </h1>

      {/* Informations de debug - À SUPPRIMER EN PRODUCTION */}
      {debugInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-blue-800">🔍 Informations de débogage</h3>
            <button
              onClick={() => setDebugInfo(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Utilisateur ID:</strong> {debugInfo.userId || 'Non défini'}</p>
            <p><strong>Token:</strong> {debugInfo.token || 'Non défini'}</p>
            <p><strong>Nombre de projets:</strong> {debugInfo.projectCount || 0}</p>
            <p><strong>Statut:</strong> {debugInfo.success ? '✅ Succès' : '❌ Erreur'}</p>
            {debugInfo.error && <p><strong>Erreur:</strong> {debugInfo.error}</p>}
          </div>
        </div>
      )}

      {/* Section titre et boutons */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col space-y-4 sm:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-700">
              Mes Projets ({projects.length})
            </h2>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors duration-200"
              title="Actualiser"
            >
              <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
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

        <div className="hidden sm:flex sm:justify-between sm:items-center flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
              Mes Projets ({projects.length})
            </h2>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors duration-200"
              title="Actualiser"
            >
              <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
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

      {/* Messages d'erreur */}
      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
          <div className="flex items-center justify-between">
            <div>
              <strong className="font-bold">Erreur!</strong>
              <span className="block sm:inline"> {fetchError}</span>
            </div>
            <button
              onClick={() => setFetchError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Boutons de diagnostic */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          🔄 Recharger projets
        </button>
        <button
          onClick={() => console.log('Current state:', { projects, user, token: !!token })}
          className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
        >
          🔍 Debug console
        </button>
        <button
          onClick={testAPI}
          className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
        >
          🧪 Test API
        </button>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      )}

      {/* Grille des projets */}
      {!isLoading && (
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
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  {debugInfo?.error ? 'Erreur de chargement' : 'Aucun projet trouvé'}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  {debugInfo?.error 
                    ? 'Impossible de récupérer vos projets. Vérifiez votre connexion et réessayez.'
                    : 'Vous n\'avez pas encore créé de projet.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => { setProjectToEdit(null); setIsFormModalOpen(true); }}
                    className="bg-violet-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-violet-700 transition duration-300 text-sm sm:text-base"
                  >
                    Créer un projet
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="border border-violet-600 text-violet-600 px-4 sm:px-6 py-2 rounded-lg hover:bg-violet-50 transition duration-300 text-sm sm:text-base"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de formulaire */}
      {isFormModalOpen && (
        <ProjectFormModal
          projectToEdit={projectToEdit}
          onClose={() => { setIsFormModalOpen(false); setProjectToEdit(null); }}
          onSuccess={() => { setIsFormModalOpen(false); setProjectToEdit(null); fetchProjects(); }}
        />
      )}

      {/* Modal de confirmation de suppression */}
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