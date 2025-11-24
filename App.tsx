import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import MemoryBank from './components/MemoryBank';
import { Message, MessageRole, Memory, AppView, Attachment } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { INITIAL_MEMORIES, TEMPLATES } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('lulu_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });
  const [inputTemplate, setInputTemplate] = useState('');

  // Persist memories
  useEffect(() => {
    localStorage.setItem('lulu_memories', JSON.stringify(memories));
    // Re-initialize chat when memories change to update system prompt
    initializeChat(memories).catch(console.error);
  }, [memories]);

  // Initial chat setup
  useEffect(() => {
    initializeChat(memories).then(() => {
        // Optional: Trigger a greeting if chat is empty
        if (messages.length === 0) {
            // We could auto-send a greeting, but let's wait for user
        }
    }).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSendMessage = async (text: string, image?: { data: string; mimeType: string }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text,
      timestamp: Date.now(),
      attachments: image ? [{ type: 'image', ...image } as Attachment] : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text, image?.data, image?.mimeType);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: "Oop! My brain short-circuited! 😖 (API Error: Check console/keys)",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMemory = (memory: Memory) => {
    setMemories(prev => [...prev, memory]);
  };

  const handleRemoveMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleTemplateSelect = (prompt: string) => {
    setInputTemplate(prompt);
    setView(AppView.CHAT);
  };

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      <Sidebar currentView={view} onChangeView={setView} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-gray-900 shadow-2xl shadow-black relative z-10">
        {view === AppView.CHAT && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            initialInputText={inputTemplate}
          />
        )}
        
        {view === AppView.MEMORIES && (
          <MemoryBank 
            memories={memories}
            onAddMemory={handleAddMemory}
            onRemoveMemory={handleRemoveMemory}
          />
        )}

        {view === AppView.TEMPLATES && (
          <div className="flex-1 p-8 overflow-y-auto">
             <h2 className="text-3xl font-bold mb-6">Quick Templates ⚡</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map((t, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleTemplateSelect(t.prompt)}
                        className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 hover:border-purple-500 transition-all text-left group"
                    >
                        <h3 className="text-lg font-semibold text-purple-300 mb-2 group-hover:text-purple-200">{t.label}</h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300">{t.prompt}</p>
                    </button>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
