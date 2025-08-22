// src/components/ResetPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Shield, ArrowRight } from 'lucide-react';

const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setMessage('Token de réinitialisation manquant ou invalide.');
      return;
    }
    setToken(resetToken);
  }, [searchParams]);

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
    
    if (!token) {
      setMessage('Token de réinitialisation manquant.');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setMessage(`Mot de passe invalide: ${passwordErrors.join(', ')}`);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Erreur: Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    setMessage('Réinitialisation en cours...');
    
    const resetData = {
      token: token,
      new_password: password,
    };

    try {
      const response = await fetch('https://backend-gestion-projet-14.onrender.com/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        await response.json();
        setMessage('Mot de passe réinitialisé avec succès ! Redirection vers la connexion...');
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/auth', { state: { formType: 'login' } });
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la réinitialisation:', errorData);
        setMessage(`Erreur: ${errorData.detail || 'Token expiré ou invalide'}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage('Erreur réseau. Veuillez réessayer.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordErrors = validatePassword(password);
  const isPasswordValid = password.length > 0 && passwordErrors.length === 0;

  if (!token) {
    return (
      <div className="
        flex items-center justify-center min-h-screen -mt-16 p-4 sm:p-6
        bg-gradient-to-br from-violet-50 via-white to-indigo-50
      ">
        <div className="
          bg-white p-6 sm:p-8 rounded-2xl shadow-2xl 
          w-full max-w-md
          border border-gray-100
        ">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Lien invalide</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="
                inline-flex items-center justify-center
                bg-violet-600 text-white py-3 px-6 rounded-lg 
                hover:bg-violet-700 transition-all duration-300 font-semibold
                transform hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-violet-500/50
                shadow-lg hover:shadow-xl
              "
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="
      flex items-center justify-center min-h-screen -mt-16 p-4 sm:p-6
      bg-gradient-to-br from-violet-50 via-white to-indigo-50
    ">
      <div className="
        bg-white p-6 sm:p-8 rounded-2xl shadow-2xl 
        w-full max-w-md
        transform transition-all duration-300
        border border-gray-100
      ">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Nouveau mot de passe
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Choisissez un mot de passe sécurisé pour protéger votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 sm:text-base">
              Nouveau mot de passe
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
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                <p className="text-xs font-semibold text-gray-700 mb-3">Exigences du mot de passe :</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { test: password.length >= 8, text: '8+ caractères' },
                    { test: /(?=.*[a-z])/.test(password), text: 'Minuscule' },
                    { test: /(?=.*[A-Z])/.test(password), text: 'Majuscule' },
                    { test: /(?=.*\d)/.test(password), text: 'Chiffre' }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className={`
                        w-2 h-2 rounded-full mr-2 transition-colors duration-200
                        ${req.test ? 'bg-green-500' : 'bg-gray-300'}
                      `} />
                      <span className={`
                        transition-colors duration-200
                        ${req.test ? 'text-green-700 font-medium' : 'text-gray-500'}
                      `}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 sm:text-base">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
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
              <p className="text-xs text-red-600 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Les mots de passe ne correspondent pas
              </p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Les mots de passe correspondent parfaitement
              </p>
            )}
          </div>
          
          {/* Message Display */}
          {message && (
            <div className={`
              p-4 rounded-lg border text-sm sm:text-base font-medium
              transition-all duration-300 ease-in-out
              ${!isSuccess && message.startsWith('Erreur') 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-green-50 border-green-200 text-green-800'
              }
            `}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {isSuccess ? (
                    <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  {message}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess || !isPasswordValid || password !== confirmPassword}
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
              flex items-center justify-center
            "
          >
            {isSuccess ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Mot de passe changé avec succès
              </>
            ) : isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Changement en cours...
              </div>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </>
            )}
          </button>
        </form>

        {/* Success Additional Info */}
        {isSuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-semibold text-green-900 mb-1">Parfait !</h4>
                <p className="text-xs text-green-800">
                  Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion dans quelques secondes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;