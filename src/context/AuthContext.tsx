// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, type ReactNode, useRef } from 'react';
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Ref pour éviter les appels multiples
  const isInitialized = useRef(false);

  console.log('AuthContext: useEffect déclenché. Token actuel:', 
    token ? token.substring(0, 20) + '...' : 'Aucun');

  // Fonction pour récupérer les informations complètes de l'utilisateur depuis le backend
  const fetchCurrentUser = async (accessToken: string) => {
    console.log('AuthContext: Tentative de récupération des infos utilisateur...');
    try {
      const response = await fetch('https://backend-gestion-projet-6.onrender.com/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        console.log('AuthContext: Infos utilisateur récupérées:', userData);
        return true;
      } else {
        console.error("AuthContext: Échec de la récupération des infos utilisateur:", response.status, response.statusText);
        // Token invalide
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("AuthContext: Erreur réseau lors de la récupération des infos utilisateur:", error);
      // En cas d'erreur réseau, on déconnecte
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  // Effet UNIQUEMENT pour l'initialisation au montage du composant
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initialisation...');
      
      if (token && !isInitialized.current) {
        isInitialized.current = true;
        console.log('AuthContext: Token trouvé, récupération des infos...');
        await fetchCurrentUser(token);
      } else if (!token) {
        console.log('AuthContext: Pas de token trouvé');
      }
      
      setLoading(false);
      console.log('AuthContext: Loading set to false.');
    };

    if (loading) {
      initializeAuth();
    }
  }, []); // ✅ IMPORTANT: Tableau vide pour éviter la boucle

  // Fonction de connexion
  const login = async (accessToken: string) => {
    console.log('AuthContext: Fonction login appelée.');
    setLoading(true);
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);
    
    // Récupérer les infos utilisateur
    const success = await fetchCurrentUser(accessToken);
    setLoading(false);
    
    if (success) {
      console.log('AuthContext: Connexion réussie - Redirection vers dashboard');
      navigate('/dashboard');
    } else {
      console.error('AuthContext: Échec de la connexion');
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log('AuthContext: Fonction logout appelée.');
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    isInitialized.current = false; // Reset pour la prochaine connexion
    navigate('/auth');
  };

  const isAuthenticated = !!token && !!user;
  console.log('AuthContext: isAuthenticated:', isAuthenticated, 'Loading:', loading, 'User:', user?.username);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
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