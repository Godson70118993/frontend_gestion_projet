// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthPage from './components/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Composant pour la page d'accueil (avec redirection si connecté)
const HomePage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage useEffect: isAuthenticated:', isAuthenticated, 'loading:', loading);
    if (!loading && isAuthenticated) {
      console.log('HomePage: Utilisateur authentifié, redirection vers /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Affiche le composant Hero uniquement si l'utilisateur n'est pas authentifié
  if (loading) {
    return <div className="text-center p-8 text-gray-700">Chargement...</div>;
  }

  return (
    <>
      {!isAuthenticated && <Hero />}
    </>
  );
};

// Composant de route protégée
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  console.log('ProtectedRoute: Rendu. isAuthenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    console.log('ProtectedRoute: Chargement en cours...');
    return <div className="text-center p-8 text-gray-700">Chargement...</div>;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Non authentifié, redirection vers /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute: Authentifié, affichage du contenu protégé.');
  return <>{children}</>;
};

// Composant pour rediriger les utilisateurs authentifiés depuis /auth
const AuthRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8 text-gray-700">Chargement...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <div className="pt-16">
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<HomePage />} />
              
              {/* Page d'authentification avec redirection si déjà connecté */}
              <Route path="/auth" element={<AuthRoute />} />
              
              {/* Routes protégées */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/projects/:projectId"
                element={
                  <ProtectedRoute>
                    <ProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Route par défaut pour les URLs non trouvées */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;