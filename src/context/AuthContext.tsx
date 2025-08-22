// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction pour récupérer les informations complètes de l'utilisateur depuis le backend
  const fetchCurrentUser = async (accessToken: string): Promise<boolean> => {
    console.log('AuthContext: Récupération des infos utilisateur avec token:', accessToken.substring(0, 20) + '...');
    
    try {
      const response = await fetch('https://backend-gestion-projet-14.onrender.com/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData: User = await response.json();
        console.log('✅ Infos utilisateur récupérées:', userData);
        setUser(userData);
        return true;
      } else {
        console.error('❌ Token invalide ou expiré. Status:', response.status);
        // Token invalide - nettoyer le stockage
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur réseau lors de la récupération des infos utilisateur:', error);
      // En cas d'erreur réseau, on considère que le token est invalide
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  // Initialisation : Vérifier s'il y a un token stocké au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initialisation de l\'authentification...');
      setLoading(true);

      const storedToken = localStorage.getItem('access_token');
      console.log('📱 Token stocké trouvé:', storedToken ? storedToken.substring(0, 20) + '...' : 'Aucun');

      if (storedToken) {
        // Vérifier la validité du token en récupérant les infos utilisateur
        const isValid = await fetchCurrentUser(storedToken);
        
        if (isValid) {
          console.log('✅ Session restaurée avec succès');
          setToken(storedToken);
        } else {
          console.log('❌ Session expirée, nettoyage effectué');
        }
      } else {
        console.log('📭 Aucun token stocké trouvé');
      }

      setLoading(false);
      console.log('✅ Initialisation terminée');
    };

    initializeAuth();
  }, []); // ✅ Effet d'initialisation uniquement

  // Fonction de connexion
  const login = async (accessToken: string) => {
    console.log('🔐 Tentative de connexion...');
    setLoading(true);

    try {
      // Sauvegarder le token
      localStorage.setItem('access_token', accessToken);
      setToken(accessToken);
      
      // Récupérer les infos utilisateur
      const success = await fetchCurrentUser(accessToken);
      
      if (success) {
        console.log('✅ Connexion réussie - Redirection vers dashboard');
        navigate('/dashboard');
      } else {
        console.error('❌ Échec de la récupération des infos utilisateur');
        // Nettoyer en cas d'échec
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log('🚪 Déconnexion en cours...');
    
    // Nettoyer le stockage local
    localStorage.removeItem('access_token');
    
    // Réinitialiser l'état
    setToken(null);
    setUser(null);
    
    // Rediriger vers la page d'authentification
    navigate('/auth');
    
    console.log('✅ Déconnexion terminée');
  };

  // État d'authentification
  const isAuthenticated = !!token && !!user && !loading;

  // Debug : Afficher l'état actuel
  useEffect(() => {
    console.log('📊 État AuthContext:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated,
      loading,
      username: user?.username || 'Non défini'
    });
  }, [token, user, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};