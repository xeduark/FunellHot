
import React from 'react';
import { Assistant } from '../types';
import { EditIcon, TrashIcon, PlayIcon } from './Icons';

interface AssistantCardProps {
  assistant: Assistant;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTrain: (id: string) => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ assistant, onEdit, onDelete, onTrain }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md dark:hover:shadow-indigo-900/10 transition-all group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <span className="text-xl font-bold">{assistant.name.charAt(0)}</span>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(assistant.id)}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="Editar"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(assistant.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{assistant.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{assistant.language} • {assistant.tone}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            C: {assistant.responseLength.short}%
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            M: {assistant.responseLength.medium}%
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            L: {assistant.responseLength.long}%
          </span>
          {assistant.audioEnabled && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
              Audio
            </span>
          )}
        </div>

        <button 
          onClick={() => onTrain(assistant.id)}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <PlayIcon className="w-4 h-4" />
          <span>Entrenar & Probar</span>
        </button>
      </div>
    </div>
  );
};

export default AssistantCard;
