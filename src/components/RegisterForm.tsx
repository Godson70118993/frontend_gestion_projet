// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Une lettre minuscule');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Une lettre majuscule');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Un chiffre');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    if (password !== confirmPassword) {
      setMessage('Erreur: Les mots de passe ne correspondent pas.');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setMessage(`Mot de passe invalide: ${passwordErrors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setMessage('Inscription en cours...');

    try {
      const response = await fetch('https://backend-gestion-projet-14.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setMessage('Inscription réussie ! Redirection vers la connexion...');
        setTimeout(() => {
          navigate('/auth', { state: { formType: 'login' } });
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordErrors = validatePassword(password);
  const isPasswordValid = password.length > 0 && passwordErrors.length === 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 sm:text-base">
            Nom d'utilisateur
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="
                w-full pl-10 pr-4 py-3 sm:py-4 
                bg-white border-2 border-gray-200 
                rounded-lg text-gray-900 
                placeholder-gray-400 
                focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20
                transition-all duration-200 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm sm:text-base
                hover:border-gray-300 focus:outline-none
              "
              placeholder="Votre nom d'utilisateur"
            />
          </div>
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 sm:text-base">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="
                w-full pl-10 pr-4 py-3 sm:py-4 
                bg-white border-2 border-gray-200 
                rounded-lg text-gray-900 
                placeholder-gray-400 
                focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20
                transition-all duration-200 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm sm:text-base
                hover:border-gray-300 focus:outline-none
              "
              placeholder="votre.email@exemple.com"
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 sm:text-base">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="
                w-full pl-10 pr-12 py-3 sm:py-4 
                bg-white border-2 border-gray-200 
                rounded-lg text-gray-900 
                placeholder-gray-400 
                focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20
                transition-all duration-200 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm sm:text-base
                hover:border-gray-300 focus:outline-none
              "
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Password Requirements */}
          {password && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Exigences du mot de passe :</p>
              <div className="space-y-1">
                {[
                  { test: password.length >= 8, text: 'Au moins 8 caractères' },
                  { test: /(?=.*[a-z])/.test(password), text: 'Une lettre minuscule' },
                  { test: /(?=.*[A-Z])/.test(password), text: 'Une lettre majuscule' },
                  { test: /(?=.*\d)/.test(password), text: 'Un chiffre' }
                ].map((req, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${req.test ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={req.test ? 'text-green-700' : 'text-gray-500'}>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 sm:text-base">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className={`
                w-full pl-10 pr-12 py-3 sm:py-4 
                bg-white border-2 
                rounded-lg text-gray-900 
                placeholder-gray-400 
                focus:ring-4 transition-all duration-200 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm sm:text-base
                hover:border-gray-300 focus:outline-none
                ${confirmPassword && password !== confirmPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : confirmPassword && password === confirmPassword
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                  : 'border-gray-200 focus:border-violet-500 focus:ring-violet-500/20'
                }
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
          )}
          {confirmPassword && password === confirmPassword && (
            <p className="text-xs text-green-600 mt-1">Les mots de passe correspondent ✓</p>
          )}
        </div>
        
        {/* Message Display */}
        {message && (
          <div className={`
            p-4 rounded-lg border text-sm sm:text-base font-medium text-center
            transition-all duration-300 ease-in-out
            ${message.startsWith('Erreur') || message.includes('invalide')
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
            }
          `}>
            {message}
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading || !isPasswordValid || password !== confirmPassword}
          className="
            w-full py-3 sm:py-4 px-6 
            bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-700 hover:to-indigo-700
            text-white font-semibold rounded-lg
            transform transition-all duration-200 ease-in-out
            hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-4 focus:ring-violet-500/50
            disabled:opacity-50 disabled:cursor-not-allowed 
            disabled:transform-none disabled:hover:scale-100
            shadow-lg hover:shadow-xl
            text-sm sm:text-base
            relative overflow-hidden
          "
        >
          <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
            Créer mon compte
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;