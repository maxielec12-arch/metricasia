
import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ReportDisplay from './components/ReportDisplay';
import Chat from './components/Chat';
import { generateReport, createChat, sendMessage } from './services/geminiService';
import type { Report, ChatMessage, ReportType } from './types';
import type { Chat as ChatSession } from '@google/genai';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const [chat, setChat] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setReport(null);
    setError(null);
    setChatHistory([]);
    setChat(null);
  };
  
  const handleReset = () => {
    setFiles([]);
    setReport(null);
    setError(null);
    setChatHistory([]);
    setChat(null);
    setIsLoading(false);
    setGenerating(null);
    setIsChatLoading(false);
    setResetKey(prev => prev + 1);
  };

  const handleGenerate = useCallback(async (type: ReportType) => {
    if (files.length === 0) {
      setError("Por favor, selecciona al menos un archivo para comenzar.");
      return;
    }

    setIsLoading(true);
    setGenerating(type);
    setError(null);

    try {
      const generatedReport = await generateReport(files, type);
      setReport(generatedReport);
      const chatSession = await createChat(files);
      setChat(chatSession);
    } catch (err: any) {
      console.error(err);
      setError(`Error crítico: ${err.message || 'No se pudo procesar la solicitud'}`);
    } finally {
      setIsLoading(false);
      setGenerating(null);
    }
  }, [files]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !chat) return;

    const newUserMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);

    try {
      const modelResponse = await sendMessage(chat, message);
      const newModelMessage: ChatMessage = { role: 'model', text: modelResponse };
      setChatHistory(prev => [...prev, newModelMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = { role: 'model', text: "Error en la conexión con la IA. Inténtalo de nuevo." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chat]);

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 flex flex-col items-center">
      <main className="w-full max-w-5xl px-6 py-12">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-brand-red/10 rounded-full border border-brand-red/20 mb-4 animate-pulse">
            <svg className="w-10 h-10 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            METRICS<span className="text-brand-red">.AI</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Análisis de datos de alto rendimiento impulsado por inteligencia artificial.
          </p>
        </header>

        {!report && (
          <div className="max-w-2xl mx-auto bg-brand-card border border-brand-border rounded-3xl p-8 shadow-2xl transition-all hover:border-brand-red/30">
            <FileUpload key={resetKey} onFileChange={handleFileChange} />
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleGenerate('commercial')}
                disabled={isLoading || files.length === 0}
                className="group relative overflow-hidden bg-brand-red text-white font-bold py-4 px-6 rounded-2xl hover:bg-brand-redHover disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-brand-red/20"
              >
                {isLoading && generating === 'commercial' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : "Agenda Comercial"}
              </button>
              <button
                onClick={() => handleGenerate('editorial')}
                disabled={isLoading || files.length === 0}
                className="bg-transparent border border-brand-border text-white font-bold py-4 px-6 rounded-2xl hover:bg-white/5 disabled:border-gray-800 disabled:text-gray-600 transition-all flex items-center justify-center"
              >
                {isLoading && generating === 'editorial' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                    <span>Analizando...</span>
                  </div>
                ) : "Agenda Editorial"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 max-w-2xl mx-auto bg-red-950/30 border border-red-500/50 text-red-200 p-5 rounded-2xl flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        {report && !isLoading && (
          <div className="space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center bg-brand-card p-4 rounded-2xl border border-brand-border">
              <button
                onClick={handleReset}
                className="flex items-center text-sm font-bold text-gray-400 hover:text-brand-red transition-colors px-4 py-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                NUEVO ANÁLISIS
              </button>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-brand-red/20 text-brand-red text-xs font-black rounded-full uppercase tracking-widest border border-brand-red/30">
                  {generating || 'REPORTE'}
                </span>
              </div>
            </div>

            <ReportDisplay report={report} />

            {chat && (
              <div className="max-w-4xl mx-auto">
                <Chat 
                  history={chatHistory} 
                  isLoading={isChatLoading} 
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
          </div>
        )}

        <footer className="mt-32 text-center border-t border-brand-border pt-12 text-gray-600 text-xs">
          <p className="uppercase tracking-[0.2em]">High Performance Data Analytics System v2.0</p>
          <p className="mt-2 font-mono">EST: 2024 // POWERED BY GEMINI PRO</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
