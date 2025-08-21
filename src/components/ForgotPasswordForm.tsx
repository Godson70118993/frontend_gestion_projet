// src/components/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Envoi de l\'email en cours...');
    
    const resetData = {
      email: email,
    };

    try {
      const response = await fetch('https://backend-gestion-projet-6.onrender.com/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        await response.json();
        setMessage('Email de réinitialisation envoyé avec succès ! Vérifiez votre boîte de réception et vos spams.');
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'envoi:', errorData);
        setMessage(`Erreur: ${errorData.detail || 'Email non trouvé ou erreur serveur'}`);
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

  return (
    <div className="w-full max-w-md mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
          <Mail className="w-8 h-8 text-violet-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Mot de passe oublié ?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 sm:text-base">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="reset-email"
              name="email"
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

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || isSuccess}
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
            {!isLoading && !isSuccess && (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer le lien de réinitialisation
              </>
            )}
            {isSuccess && (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email envoyé avec succès
              </>
            )}
            {isLoading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="
              w-full py-3 sm:py-4 px-6 
              bg-gray-100 hover:bg-gray-200
              text-gray-700 font-semibold rounded-lg
              transform transition-all duration-200 ease-in-out
              hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-4 focus:ring-gray-500/20
              text-sm sm:text-base
              flex items-center justify-center
            "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </button>
        </div>
      </form>

      {/* Additional Info */}
      {isSuccess && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Étapes suivantes :</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Vérifiez votre boîte de réception</li>
                <li>• Regardez aussi dans vos spams</li>
                <li>• Le lien expire dans 1 heure</li>
                <li>• Cliquez sur le lien pour créer un nouveau mot de passe</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;