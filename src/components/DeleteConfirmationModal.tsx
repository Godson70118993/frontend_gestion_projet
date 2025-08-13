// src/components/DeleteConfirmationModal.tsx
import React from 'react';

// Interface for the project, we only need the title
interface Project {
  title: string;
}

interface DeleteConfirmationModalProps {
  project: Project;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ project, onConfirm, onCancel }) => {
  return (
    <div className="
      fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 
      flex items-center justify-center p-4 sm:p-6
    ">
      <div className="
        relative p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-2xl 
        w-full max-w-sm sm:max-w-md mx-auto
        transform transition-all duration-300 scale-95 sm:scale-100
        animate-slideInUp
      ">
        {/* Icône d'alerte */}
        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg 
            className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h3 className="
          text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 text-center mb-4
        ">
          Confirmation de suppression
        </h3>
        
        <div className="mt-4 mb-6">
          <p className="
            text-sm sm:text-base text-gray-600 text-center leading-relaxed px-2
          ">
            Êtes-vous sûr de vouloir supprimer le projet 
            <br className="hidden sm:inline" />
            "<span className="font-semibold text-gray-800 break-words">{project.title}</span>" ?
            <br />
            <span className="text-red-600 font-medium text-xs sm:text-sm">
              Cette action est irréversible.
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="
              px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg
              text-gray-700 bg-gray-200 hover:bg-gray-300 
              transition-all duration-200 transform hover:scale-105 active:scale-95 
              focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md
              w-full sm:w-auto order-2 sm:order-1
            "
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="
              px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg
              text-white bg-red-600 hover:bg-red-700 
              transition-all duration-200 transform hover:scale-105 active:scale-95 
              focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md
              w-full sm:w-auto order-1 sm:order-2
            "
          >
            <span className="hidden sm:inline">Oui, supprimer le projet</span>
            <span className="sm:hidden">Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;