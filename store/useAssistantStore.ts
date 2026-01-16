
import { create } from 'zustand';
import { Assistant, ChatHistory, Message } from '../types';

const INITIAL_DATA: Assistant[] = [
  {
    id: "1",
    name: "Asistente de Ventas",
    language: "Español",
    tone: "Profesional",
    responseLength: {
      short: 30,
      medium: 50,
      long: 20
    },
    audioEnabled: true,
    rules: "Eres un asistente especializado en ventas. Siempre sé cordial y enfócate en identificar necesidades del cliente antes de ofrecer productos."
  },
  {
    id: "2",
    name: "Soporte Técnico",
    language: "Inglés",
    tone: "Amigable",
    responseLength: {
      short: 20,
      medium: 30,
      long: 50
    },
    audioEnabled: false,
    rules: "Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar."
  }
];

interface AssistantState {
  assistants: Assistant[];
  chatHistories: ChatHistory;
  isModalOpen: boolean;
  editingAssistantId: string | null;
  theme: 'light' | 'dark';
  
  // Acciones
  setAssistants: (assistants: Assistant[]) => void;
  addAssistant: (assistant: Assistant) => void;
  updateAssistant: (assistant: Assistant) => void;
  deleteAssistant: (id: string) => void;
  
  openModal: (id?: string) => void;
  closeModal: () => void;
  
  addChatMessage: (assistantId: string, message: Message) => void;
  clearChat: (assistantId: string) => void;
  toggleTheme: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  assistants: INITIAL_DATA,
  chatHistories: {},
  isModalOpen: false,
  editingAssistantId: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  setAssistants: (assistants) => set({ assistants }),
  
  addAssistant: (assistant) => set((state) => ({ 
    assistants: [...state.assistants, assistant] 
  })),
  
  updateAssistant: (updated) => set((state) => ({
    assistants: state.assistants.map((a) => (a.id === updated.id ? updated : a))
  })),
  
  deleteAssistant: (id) => set((state) => ({
    assistants: state.assistants.filter((a) => a.id !== id)
  })),
  
  openModal: (id) => set({ isModalOpen: true, editingAssistantId: id || null }),
  
  closeModal: () => set({ isModalOpen: false, editingAssistantId: null }),

  addChatMessage: (assistantId, message) => set((state) => {
    const history = state.chatHistories[assistantId] || [];
    return {
      chatHistories: {
        ...state.chatHistories,
        [assistantId]: [...history, message]
      }
    };
  }),

  clearChat: (assistantId) => set((state) => ({
    chatHistories: {
      ...state.chatHistories,
      [assistantId]: []
    }
  })),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
}));
