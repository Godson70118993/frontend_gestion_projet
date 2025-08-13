// src/components/Hero.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex flex-col items-center justify-center 
        h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)]
        text-center p-4 sm:p-6 lg:p-8
        relative hero-background
        min-h-[500px] sm:min-h-[600px]
      "
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
          font-bold text-white mb-4 sm:mb-6 lg:mb-8
          leading-tight sm:leading-tight
          animate-fadeIn
        ">
          Bienvenue sur 
          <br className="sm:hidden" />
          <span className="text-violet-300"> ProjetApp</span>
        </h1>
        
        <p className="
          text-base sm:text-lg md:text-xl lg:text-2xl 
          text-white mb-6 sm:mb-8 lg:mb-10
          max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto
          leading-relaxed opacity-90
          animate-slideInUp
        ">
          Votre solution de gestion de projets simple et efficace.
        </p>
        
        <button
          onClick={() => navigate('/auth')}
          className="
            bg-violet-600 text-white font-semibold 
            text-base sm:text-lg lg:text-xl
            px-6 sm:px-8 lg:px-10
            py-3 sm:py-4 lg:py-5
            rounded-full shadow-lg hover:bg-violet-700 
            transition-all duration-300 
            transform hover:scale-105 active:scale-95
            focus:outline-none focus:ring-4 focus:ring-violet-300 focus:ring-opacity-50
            hover:shadow-2xl animate-bounce-slow
            min-w-[200px] sm:min-w-[250px]
          "
        >
          Commencer gratuitement
        </button>
        
        {/* Ajout d'éléments décoratifs pour mobile */}
        <div className="mt-8 sm:mt-12 flex justify-center space-x-4 opacity-60">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;