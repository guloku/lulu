import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { BASE_SYSTEM_INSTRUCTION } from '../constants';
import { Memory, Message, MessageRole } from '../types';

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

// Initialize the API client
const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    // We assume process.env.API_KEY is available as per instructions
    const apiKey = process.env.API_KEY; 
    if (!apiKey) {
      console.warn("API Key is missing from environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
  }
  return aiInstance;
};

const buildSystemInstruction = (memories: Memory[]): string => {
  const memoryString = memories.map(m => `[${m.category.toUpperCase()}] ${m.content}`).join('\n');
  return `${BASE_SYSTEM_INSTRUCTION}\n\n📌 CURRENT CORE MEMORIES:\n${memoryString}`;
};

export const initializeChat = async (memories: Memory[]): Promise<Chat> => {
  const ai = getAI();
  const systemInstruction = buildSystemInstruction(memories);
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.9, // Higher creativity for Lulu's chaos
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (
  text: string, 
  imageBase64?: string, 
  mimeType?: string
): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    let result;
    if (imageBase64 && mimeType) {
      result = await chatSession.sendMessage({
        message: {
          role: 'user',
          parts: [
            { text },
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType
              }
            }
          ]
        }
      });
    } else {
      result = await chatSession.sendMessage({ message: text });
    }

    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
