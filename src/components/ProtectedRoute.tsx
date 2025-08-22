// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);

  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log('❌ Non authentifié, redirection vers /auth');
    return <Navigate to="/auth" replace />;
  }

  // Afficher le contenu protégé si authentifié
  console.log('✅ Authentifié, affichage du contenu protégé');
  return <>{children}</>;
};

export default ProtectedRoute;