// src/components/ProjectCard.tsx
import React from 'react';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (id: number, e?: React.MouseEvent) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  id, 
  title, 
  description, 
  createdAt, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(e);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id, e);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-full flex flex-col">
      {/* En-tête avec titre */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Description */}
      <div className="flex-1 mb-4">
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {description || "Aucune description disponible"}
        </p>
      </div>

      {/* Footer avec date et actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(createdAt)}
        </div>
        
        {/* Actions en bas à droite */}
        <div className="flex space-x-1">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
            title="Modifier le projet"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
            title="Supprimer le projet"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Indicateur de clic */}
      <div className="mt-4 pt-2 border-t border-gray-50">
        <div className="flex items-center text-xs text-gray-400 justify-center">
          <span>Cliquer pour ouvrir</span>
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;