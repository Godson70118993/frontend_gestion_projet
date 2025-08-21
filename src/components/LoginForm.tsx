import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Connexion en cours...');
    
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('https://backend-gestion-projet-6.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.access_token);
        setMessage('Connexion réussie ! Redirection...');
      } else {
        const errorData = await response.json();
        console.error('Erreur de connexion:', errorData);
        setMessage(`Erreur: ${errorData.detail || 'Email ou mot de passe incorrect'}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 sm:text-base">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
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
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 sm:text-base">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
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
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="
              text-sm font-medium text-violet-600 hover:text-violet-700 
              transition-colors duration-200
              hover:underline underline-offset-4
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
              rounded px-1 py-1
            "
          >
            Mot de passe oublié ?
          </button>
        </div>
        
        {/* Message Display */}
        {message && (
          <div className={`
            p-4 rounded-lg border text-sm sm:text-base font-medium text-center
            transition-all duration-300 ease-in-out
            ${message.startsWith('Erreur') 
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
          disabled={isLoading}
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
            Se connecter
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

export default LoginForm;