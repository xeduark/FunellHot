
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { useAssistantStore } from '../store/useAssistantStore';
import { SIMULATED_RESPONSES } from '../services/mockService';
import { SendIcon, RefreshIcon } from './Icons';

interface ChatSimulationProps {
  assistantId: string;
}

const ChatSimulation: React.FC<ChatSimulationProps> = ({ assistantId }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatHistories = useAssistantStore(state => state.chatHistories);
  const addChatMessage = useAssistantStore(state => state.addChatMessage);
  const clearChat = useAssistantStore(state => state.clearChat);
  const scrollRef = useRef<HTMLDivElement>(null);

  const history = chatHistories[assistantId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    addChatMessage(assistantId, userMsg);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)];
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response,
        timestamp: new Date()
      };
      addChatMessage(assistantId, assistantMsg);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner">
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Simulación de Chat
        </h3>
        <button 
          onClick={() => clearChat(assistantId)}
          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center space-x-1"
          title="Reiniciar chat"
        >
          <RefreshIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Limpiar</span>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {history.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-center space-y-2 opacity-60">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
              <SendIcon className="w-8 h-8 rotate-45" />
            </div>
            <p className="text-sm">Envía un mensaje para comenzar</p>
          </div>
        )}
        
        {history.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-br-none shadow-sm shadow-indigo-100 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-1.5 font-medium ${msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400 dark:text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 dark:text-white dark:placeholder:text-slate-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl transition-all shadow-md shadow-indigo-100 dark:shadow-none"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSimulation;
