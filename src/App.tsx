// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthPage from './components/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Composant pour la page d'accueil (avec redirection si connecté)
const HomePage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage useEffect: isAuthenticated:', isAuthenticated, 'loading:', loading);
    if (!loading && isAuthenticated) {
      console.log('HomePage: Utilisateur authentifié et chargement terminé, redirection vers /');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Affiche le composant Hero uniquement si l'utilisateur n'est pas authentifié ou si l'authentification est en cours de chargement.
  return (
    <>
      {(!isAuthenticated || loading) && <Hero />}
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

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              {/* Route protégée pour le tableau de bord et la page de détails du projet */}
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
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
