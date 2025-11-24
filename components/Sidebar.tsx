import React from 'react';
import { MessageSquare, Database, Wand2, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.CHAT, icon: MessageSquare, label: 'Chat' },
    { id: AppView.MEMORIES, icon: Database, label: 'Core Memory' },
    { id: AppView.TEMPLATES, icon: Wand2, label: 'Templates' },
  ];

  return (
    <div className="w-20 md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3 justify-center md:justify-start">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hidden md:block">
          Lulu AI
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'animate-pulse' : ''}`} />
            <span className="font-medium hidden md:block">{item.label}</span>
            
            {currentView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden md:block" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-xl p-4 hidden md:block">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-200">Online & Chaotic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
