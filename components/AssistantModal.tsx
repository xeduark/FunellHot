
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Assistant, AssistantFormData } from '../types';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  assistant?: Assistant | null;
  onSave: (data: AssistantFormData) => void;
  isLoading: boolean;
}

const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose, assistant, onSave, isLoading }) => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, reset, trigger, formState: { errors } } = useForm<AssistantFormData>({
    defaultValues: {
      name: '',
      language: 'Español',
      tone: 'Profesional',
      responseLength: { short: 33, medium: 34, long: 33 },
      audioEnabled: false
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (assistant) {
        reset({
          name: assistant.name,
          language: assistant.language,
          tone: assistant.tone,
          responseLength: assistant.responseLength,
          audioEnabled: assistant.audioEnabled
        });
      } else {
        reset({
          name: '',
          language: 'Español',
          tone: 'Profesional',
          responseLength: { short: 33, medium: 34, long: 33 },
          audioEnabled: false
        });
      }
      setStep(1);
    }
  }, [assistant, reset, isOpen]);

  const responseLength = watch('responseLength');
  const sum = Number(responseLength?.short || 0) + Number(responseLength?.medium || 0) + Number(responseLength?.long || 0);
  const isValidSum = sum === 100;

  const handleNext = async () => {
    const isStep1Valid = await trigger(['name', 'language', 'tone']);
    if (isStep1Valid) setStep(2);
  };

  const onSubmit = (data: AssistantFormData) => {
    if (!isValidSum) return;
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {assistant ? 'Editar Asistente' : 'Nuevo Asistente'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 transition-colors">
            ✕
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className={`text-sm font-medium ${step === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Datos Básicos</span>
            </div>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${step === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>Configuración</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Asistente</label>
                  <input
                    {...register('name', { required: 'El nombre es requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 dark:text-white ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                    placeholder="Ej. Soporte Ventas"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Idioma</label>
                    <select
                      {...register('language', { required: true })}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 dark:text-white"
                    >
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                      <option value="Portugués">Portugués</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tono</label>
                    <select
                      {...register('tone', { required: true })}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 dark:text-white"
                    >
                      <option value="Profesional">Profesional</option>
                      <option value="Amigable">Amigable</option>
                      <option value="Formal">Formal</option>
                      <option value="Casual">Casual</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Distribución de Longitud de Respuesta (%)</label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm text-slate-500 dark:text-slate-400">Cortas</span>
                      <input
                        type="number"
                        {...register('responseLength.short', { required: true, min: 0, max: 100 })}
                        className="w-24 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                      />
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full transition-all" style={{ width: `${responseLength.short}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm text-slate-500 dark:text-slate-400">Medias</span>
                      <input
                        type="number"
                        {...register('responseLength.medium', { required: true, min: 0, max: 100 })}
                        className="w-24 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                      />
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all" style={{ width: `${responseLength.medium}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-20 text-sm text-slate-500 dark:text-slate-400">Largas</span>
                      <input
                        type="number"
                        {...register('responseLength.long', { required: true, min: 0, max: 100 })}
                        className="w-24 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                      />
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all" style={{ width: `${responseLength.long}%` }} />
                      </div>
                    </div>
                  </div>
                  {!isValidSum && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-3 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-100 dark:border-red-900/50 text-center">
                      La suma debe ser exactamente 100%. Actual: <span className="font-bold">{sum}%</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <input
                    type="checkbox"
                    id="audioEnabled"
                    {...register('audioEnabled')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="audioEnabled" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Habilitar respuestas de audio por voz
                  </label>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between space-x-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Atrás
                </button>
              )}
              <div className="flex-1" />
              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValidSum || isLoading}
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:shadow-none text-white font-medium rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{assistant ? 'Actualizar' : 'Guardar'} Asistente</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;
