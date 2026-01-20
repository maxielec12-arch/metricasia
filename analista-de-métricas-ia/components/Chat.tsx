
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ history, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-brand-card rounded-3xl shadow-2xl border border-brand-border flex flex-col h-[600px] overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-border bg-brand-card/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-brand-red rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-brand-red rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Link</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-mono">Status: Connected to Metrics.AI</p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-brand-dark/30"
      >
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-400 text-sm font-light italic">Inicia una consulta técnica sobre el análisis...</p>
          </div>
        )}
        
        {history.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-brand-red text-white font-medium rounded-br-none shadow-lg shadow-brand-red/10' 
                  : 'bg-brand-card border border-brand-border text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-card border border-brand-border px-5 py-3 rounded-2xl rounded-bl-none flex space-x-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-brand-card border-t border-brand-border">
        <div className="flex items-center space-x-3 bg-brand-dark border border-brand-border rounded-2xl px-4 py-2 focus-within:border-brand-red/50 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analiza puntos específicos..."
            className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-gray-600 py-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-brand-red text-white rounded-xl hover:bg-brand-redHover disabled:bg-gray-800 disabled:text-gray-600 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
