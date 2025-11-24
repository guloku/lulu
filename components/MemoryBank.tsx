import React, { useState } from 'react';
import { Memory } from '../types';
import { Trash2, Plus, Save } from 'lucide-react';

interface MemoryBankProps {
  memories: Memory[];
  onAddMemory: (memory: Memory) => void;
  onRemoveMemory: (id: string) => void;
}

const MemoryBank: React.FC<MemoryBankProps> = ({ memories, onAddMemory, onRemoveMemory }) => {
  const [newContent, setNewContent] = useState('');
  const [category, setCategory] = useState<Memory['category']>('misc');

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const memory: Memory = {
      id: Date.now().toString(),
      category,
      content: newContent.trim(),
    };
    onAddMemory(memory);
    setNewContent('');
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Core Memories 🧠</h2>
          <p className="text-gray-400">Teach Lulu about Guloku's prices, preferences, and clients. These facts are injected into her brain every session.</p>
        </div>

        {/* Add New Memory */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8 shadow-xl">
          <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New Memory
          </h3>
          <div className="flex flex-col gap-4">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none w-full md:w-1/3"
            >
              <option value="pricing">Pricing 💰</option>
              <option value="client">Client Info 👤</option>
              <option value="preference">Preference ⭐</option>
              <option value="misc">Miscellaneous 📝</option>
            </select>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g., 'Base rig price starts at $500' or 'Always use heart emojis'"
              className="bg-gray-900 border border-gray-700 text-white rounded-lg p-3 h-24 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
            />
            <button
              onClick={handleAdd}
              disabled={!newContent.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 self-end"
            >
              <Save className="w-4 h-4" /> Save Memory
            </button>
          </div>
        </div>

        {/* List Memories */}
        <div className="grid gap-4 md:grid-cols-2">
          {memories.map((m) => (
            <div key={m.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
                  ${m.category === 'pricing' ? 'bg-green-900/50 text-green-300' : 
                    m.category === 'client' ? 'bg-blue-900/50 text-blue-300' :
                    m.category === 'preference' ? 'bg-pink-900/50 text-pink-300' :
                    'bg-gray-700 text-gray-300'}`}
                >
                  {m.category}
                </span>
                <button 
                  onClick={() => onRemoveMemory(m.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-200">{m.content}</p>
            </div>
          ))}
          {memories.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No memories yet. Lulu is a blank slate! 😱
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryBank;
