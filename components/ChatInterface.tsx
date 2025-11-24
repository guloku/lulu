import React, { useEffect, useRef } from 'react';
import { Message, MessageRole } from '../types';
import InputArea from './InputArea';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, image?: { data: string; mimeType: string }) => void;
  isLoading: boolean;
  initialInputText?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, initialInputText }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50 select-none">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Yoshallooo~ I'm Lulu! 💜</h2>
            <p className="text-gray-400 max-w-sm">I'm ready to help you with tweets, commissions, and chaos! Let's gooo!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                ${msg.role === MessageRole.USER 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'}`}>
                {msg.role === MessageRole.USER ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-2 ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                
                <div className={`rounded-2xl px-5 py-3 shadow-md text-sm md:text-base leading-relaxed overflow-hidden
                  ${msg.role === MessageRole.USER 
                    ? 'bg-gray-800 text-white rounded-tr-sm border border-gray-700' 
                    : 'bg-gradient-to-br from-purple-900/80 to-slate-900/80 backdrop-blur-sm text-gray-100 rounded-tl-sm border border-purple-500/30'}`}>
                  
                  {/* Attachments */}
                  {msg.attachments?.map((att, idx) => (
                    <div key={idx} className="mb-3 rounded-lg overflow-hidden border border-gray-600/50">
                      <img 
                        src={`data:${att.mimeType};base64,${att.data}`} 
                        alt="Attachment" 
                        className="max-w-full h-auto max-h-64 object-cover"
                      />
                    </div>
                  ))}

                  {/* Text Content */}
                  <div className="prose prose-invert prose-p:my-1 prose-headings:my-2 prose-strong:text-purple-300 max-w-none">
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-gray-500 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea 
        onSendMessage={onSendMessage} 
        isLoading={isLoading} 
        initialText={initialInputText}
      />
    </div>
  );
};

export default ChatInterface;
