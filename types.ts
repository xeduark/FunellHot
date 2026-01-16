//aqui lo que hacemos es enviar los idiomas IMPORTANTE
export type Language = 'Español' | 'Inglés' | 'Portugués';
export type Tone = 'Formal' | 'Casual' | 'Profesional' | 'Amigable';
// TIPAMOS LAS RESPUESTAS
export interface ResponseLength {
  short: number;
  medium: number;
  long: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface Assistant {
  id: string;
  name: string;
  language: Language;
  tone: Tone;
  responseLength: ResponseLength;
  audioEnabled: boolean;
  rules: string;
}

export interface AssistantFormData {
  name: string;
  language: Language;
  tone: Tone;
  responseLength: ResponseLength;
  audioEnabled: boolean;
}

export interface ChatHistory {
  [assistantId: string]: Message[];
}
