
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Report, ReportType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.readAsDataURL(file);
  });
};

export const generateReport = async (files: File[], type: ReportType): Promise<Report> => {
  const model = "gemini-3-pro-preview";
  const fileParts = await Promise.all(files.map(fileToPart));

  const systemInstruction = `Eres un experto analista de datos especializado en métricas ${type === 'commercial' ? 'comerciales y de ventas' : 'editoriales y de contenido'}.
  Analiza los archivos adjuntos y genera un informe estructurado en JSON.
  
  El JSON debe seguir este esquema:
  {
    "title": "Título del Informe",
    "summary": "Resumen ejecutivo del análisis",
    "metrics": [
      { "label": "Nombre Métrica", "value": "Valor", "trend": "up|down|neutral" }
    ],
    "actionItems": ["Acción sugerida 1", "Acción sugerida 2"]
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...fileParts,
        { text: `Genera una agenda ${type} detallada basada en estos archivos.` }
      ],
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                trend: { type: Type.STRING }
              },
              required: ["label", "value"]
            }
          },
          actionItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "summary", "metrics", "actionItems"]
      }
    },
  });

  return JSON.parse(response.text) as Report;
};

export const createChat = async (files: File[]): Promise<Chat> => {
  const fileParts = await Promise.all(files.map(fileToPart));
  
  // We initialize the chat and "prime" it with the files by sending them as part of the system instruction 
  // or initial context if supported, but typically in the first message or system prompt.
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "Eres un asistente experto que ayuda a interpretar informes de métricas. El usuario te ha proporcionado archivos de datos. Responde preguntas basadas estrictamente en esos datos.",
    },
  });

  // Sending the files as initial context
  await chat.sendMessage({
    message: {
        parts: [
            ...fileParts,
            { text: "Aquí están los archivos sobre los que te preguntaré. Por favor, analízalos para estar listo para mis preguntas." }
        ]
    }
  });

  return chat;
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  const response = await chat.sendMessage({ message });
  return response.text || "No se pudo obtener una respuesta.";
};
