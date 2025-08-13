// src/components/ProjectCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  onEdit: (projectId: number) => void;
  onDelete: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, createdAt, onEdit, onDelete }) => {
  return (
    <div className="
      relative bg-white rounded-xl shadow-lg p-4 sm:p-6 
      flex flex-col justify-between 
      h-48 sm:h-56 md:h-60 lg:h-64
      transition duration-300 transform hover:scale-105 hover:shadow-xl
      border border-gray-100
    ">
      <Link to={`/projects/${id}`} className="absolute inset-0 z-0"></Link>
      
      <div className="flex-grow overflow-hidden">
        <h3 className="
          text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 
          mb-2 mt-2 sm:mt-4 line-clamp-2
        ">
          {title}
        </h3>
        <p className="
          text-gray-600 mb-3 sm:mb-4 
          text-xs sm:text-sm lg:text-base 
          line-clamp-3 sm:line-clamp-4 leading-relaxed
        ">
          {description}
        </p>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mt-auto mb-12 sm:mb-14">
        Créé le: {new Date(createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        })}
      </div>

      {/* Delete and edit icons in the bottom-right corner - Responsive */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex space-x-2 sm:space-x-3 z-10">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(id); }}
          className="
            p-2 sm:p-2.5 rounded-full bg-gray-100 text-gray-400 hover:text-violet-600 
            transition-all duration-300 transform hover:scale-125 hover:rotate-12 
            focus:outline-none focus:ring-2 focus:ring-violet-500
            min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]
            flex items-center justify-center
            hover:bg-violet-50
          "
          aria-label="Modifier le projet"
        >
          {/* New edit icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-pen-square sm:w-5 sm:h-5"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L11.5 16.5l-4 1 1-4Z"></path>
          </svg>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(id); }}
          className="
            p-2 sm:p-2.5 rounded-full bg-gray-100 text-gray-400 hover:text-red-600 
            transition-all duration-300 transform hover:scale-125 hover:rotate-6 
            focus:outline-none focus:ring-2 focus:ring-red-500
            min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]
            flex items-center justify-center
            hover:bg-red-50
          "
          aria-label="Supprimer le projet"
        >
          {/* Delete icon (trash can) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 sm:h-5 sm:w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;