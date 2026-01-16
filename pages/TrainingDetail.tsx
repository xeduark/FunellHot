
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAssistantStore } from '../store/useAssistantStore';
import { mockService } from '../services/mockService';
import { ChevronLeftIcon } from '../components/Icons';
import ChatSimulation from '../components/ChatSimulation';
import Toast from '../components/Toast';

interface TrainingDetailProps {
  id: string;
  onBack: () => void;
}

const TrainingDetail: React.FC<TrainingDetailProps> = ({ id, onBack }) => {
  const queryClient = useQueryClient();
  const { assistants, updateAssistant } = useAssistantStore();
  const [rules, setRules] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const assistant = assistants.find(a => a.id === id);

  useEffect(() => {
    if (assistant) {
      setRules(assistant.rules);
    }
  }, [assistant]);

  const saveRulesMutation = useMutation({
    mutationFn: (newRules: string) => mockService.saveRules(id, newRules),
    onSuccess: () => {
      if (assistant) {
        updateAssistant({ ...assistant, rules });
        setToast({ message: 'Entrenamiento guardado con éxito', type: 'success' });
        queryClient.invalidateQueries({ queryKey: ['assistants'] });
      }
    }
  });

  if (!assistant) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500 dark:text-slate-400">Asistente no encontrado</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium">Volver</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors font-medium group"
      >
        <ChevronLeftIcon className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Volver al listado
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <header className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold">
                {assistant.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{assistant.name}</h1>
                <div className="text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 text-sm mt-1">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{assistant.language}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span>Tono {assistant.tone}</span>
                  {assistant.audioEnabled && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Audio Habilitado</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">🧠</span>
              Instrucciones y Entrenamiento
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Define las reglas de comportamiento, conocimientos específicos y restricciones que debe seguir el asistente para sus interacciones.
            </p>
            
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Ej. Eres un experto en soporte técnico de Funnelhot. Tu objetivo es resolver dudas de forma concisa..."
              className="w-full h-64 p-4 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50/50 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 transition-all"
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => saveRulesMutation.mutate(rules)}
                disabled={saveRulesMutation.isPending}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center space-x-2"
              >
                {saveRulesMutation.isPending && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>Guardar Entrenamiento</span>
              </button>
            </div>
          </section>
        </div>

        <aside className="w-full lg:w-96 h-[calc(100vh-12rem)] min-h-[500px] lg:sticky lg:top-24">
          <ChatSimulation assistantId={id} />
        </aside>
      </div>

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

export default TrainingDetail;
