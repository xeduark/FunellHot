
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAssistantStore } from '../store/useAssistantStore';
import { mockService } from '../services/mockService';
import AssistantCard from '../components/AssistantCard';
import AssistantModal from '../components/AssistantModal';
import { PlusIcon } from '../components/Icons';
import Toast from '../components/Toast';
import { AssistantFormData } from '../types';

interface DashboardProps {
  onTrain: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTrain }) => {
  const queryClient = useQueryClient();
  const { 
    assistants: localAssistants, 
    isModalOpen, 
    editingAssistantId, 
    openModal, 
    closeModal,
    addAssistant,
    updateAssistant,
    deleteAssistant
  } = useAssistantStore();
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['assistants'],
    queryFn: () => mockService.getAssistants(localAssistants),
  });

  const saveMutation = useMutation({
    mutationFn: (data: AssistantFormData) => {
      if (editingAssistantId) {
        return mockService.updateAssistant(editingAssistantId, data);
      }
      return mockService.createAssistant(data);
    },
    onSuccess: (savedAssistant) => {
      if (editingAssistantId) {
        updateAssistant({ ...savedAssistant, rules: localAssistants.find(a => a.id === editingAssistantId)?.rules || '' } as any);
        setToast({ message: 'Asistente actualizado con éxito', type: 'success' });
      } else {
        addAssistant(savedAssistant as any);
        setToast({ message: 'Asistente creado con éxito', type: 'success' });
      }
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mockService.deleteAssistant(id),
    onSuccess: (_, id) => {
      deleteAssistant(id);
      setToast({ message: 'Asistente eliminado con éxito', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
    },
    onError: (error: Error) => {
      setToast({ message: error.message, type: 'error' });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este asistente?')) {
      deleteMutation.mutate(id);
    }
  };

  const currentEditingAssistant = editingAssistantId ? localAssistants.find(a => a.id === editingAssistantId) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Gestión de Asistentes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Crea y entrena tus modelos de IA para automatizar interacciones</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:-translate-y-0.5"
        >
          <PlusIcon />
          <span>Crear Asistente</span>
        </button>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl h-64 animate-pulse border border-slate-100 dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4" />
              <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-2/3 mb-2" />
              <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-1/2 mb-4" />
              <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded w-full mt-auto" />
            </div>
          ))}
        </div>
      ) : localAssistants.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-200 dark:text-indigo-800 rounded-full flex items-center justify-center mb-6">
            <PlusIcon className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No tienes asistentes todavía</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">Empieza creando tu primer asistente de IA para optimizar tus canales de ventas y soporte.</p>
          <button 
            onClick={() => openModal()}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Configurar mi primer asistente →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localAssistants.map(assistant => (
            <AssistantCard 
              key={assistant.id}
              assistant={assistant}
              onEdit={openModal}
              onDelete={handleDelete}
              onTrain={onTrain}
            />
          ))}
        </div>
      )}

      <AssistantModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        assistant={currentEditingAssistant}
        onSave={(data) => saveMutation.mutate(data)}
        isLoading={saveMutation.isPending}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
