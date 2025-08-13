// src/components/TaskCard.tsx
import React from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';

// Interface de la tâche mise à jour pour correspondre aux valeurs attendues par l'API backend
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'a_faire' | 'en_cours' | 'termine';
  due_date?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  isDeleting?: boolean;
}

// Fonction pour obtenir une classe de couleur basée sur le statut de la tâche
const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'a_faire':
      return 'bg-gray-400'; // Gris pour "À faire"
    case 'en_cours':
      return 'bg-blue-500'; // Bleu pour "En cours"
    case 'termine':
      return 'bg-green-500'; // Vert pour "Terminé"
    default:
      return 'bg-gray-400';
  }
};

// Fonction utilitaire pour afficher un statut plus joli pour l'UI
const displayStatus = (status: Task['status']) => {
  switch (status) {
    case 'a_faire':
      return 'À faire';
    case 'en_cours':
      return 'En cours';
    case 'termine':
      return 'Terminé';
    default:
      return 'Inconnu';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDeleting }) => {
  const statusColorClass = getStatusColor(task.status);

  return (
    <div className={`
      bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 
      hover:shadow-xl hover:-translate-y-1 
      transform transition-all duration-300 ease-in-out
      animate-fadeIn min-h-[180px] sm:min-h-[200px]
      ${isDeleting ? 'animate-pulse opacity-50 scale-95' : ''}
    `}>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-2">
        <div className="flex-1 w-full sm:pr-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-3">
            {task.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3 sm:gap-0">
        <span className={`
          text-xs font-semibold px-3 py-1.5 rounded-full text-white ${statusColorClass} 
          transition-all duration-200 hover:scale-105 inline-block w-fit
        `}>
          {displayStatus(task.status)}
        </span>
      </div>

      {/* Icônes en bas à droite - Responsive */}
      <div className="flex justify-end items-center space-x-2 mt-auto">
        {/* Bouton d'édition avec animation */}
        <button
          onClick={() => onEdit(task)}
          className="
            p-2 sm:p-2.5 rounded-full text-violet-600 hover:text-violet-700
            hover:bg-violet-100 active:bg-violet-200
            transform transition-all duration-200 ease-in-out
            hover:scale-110 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50
            min-w-[40px] min-h-[40px] flex items-center justify-center
          "
          aria-label="Modifier la tâche"
          disabled={isDeleting}
        >
          <BsPencil size={16} className="sm:w-[18px] sm:h-[18px] transition-transform duration-200" />
        </button>

        {/* Bouton de suppression avec animation */}
        <button
          onClick={() => onDelete(task.id)}
          className="
            p-2 sm:p-2.5 rounded-full text-red-600 hover:text-red-700
            hover:bg-red-100 active:bg-red-200
            transform transition-all duration-200 ease-in-out
            hover:scale-110 active:scale-95 hover:rotate-6
            focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50
            min-w-[40px] min-h-[40px] flex items-center justify-center
          "
          aria-label="Supprimer la tâche"
          disabled={isDeleting}
        >
          <BsTrash size={16} className={`sm:w-[18px] sm:h-[18px] transition-all duration-200 ${isDeleting ? 'animate-bounce' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;