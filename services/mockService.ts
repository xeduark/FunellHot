
import { Assistant, AssistantFormData } from '../types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockService = {
  getAssistants: async (localAssistants: Assistant[]): Promise<Assistant[]> => {
    await sleep(800);
    return localAssistants;
  },
// Simula la creación de un nuevo asistente
  createAssistant: async (data: AssistantFormData): Promise<Assistant> => {
    await sleep(1000);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      rules: ""
    };
  },

  updateAssistant: async (id: string, data: Partial<Assistant>): Promise<Assistant> => {
    await sleep(800);
    // regresata el asistente actualizado
    return { id, ...data } as Assistant;
  },

  deleteAssistant: async (id: string): Promise<void> => {
    await sleep(600);
    // 10% probabilidad de error simulado
    if (Math.random() < 0.1) {
      throw new Error("Error aleatorio al eliminar el asistente. Inténtalo de nuevo.");
    }
  },
// Simula guardar las reglas del asistente RECORDAR QUE ES LOCAL
  saveRules: async (id: string, rules: string): Promise<void> => {
    await sleep(1000);
  }
};

export const SIMULATED_RESPONSES = [
  "Entendido, ¿en qué más puedo ayudarte?",
  "Esa es una excelente pregunta. Déjame explicarte...",
  "Claro, con gusto te ayudo con eso.",
  "¿Podrías darme más detalles sobre tu consulta?",
  "Perfecto, he registrado esa información.",
  "Estoy analizando tu solicitud, dame un momento.",
  "¡Excelente! Vamos a proceder con el siguiente paso."
];
