import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string, image?: { data: string; mimeType: string }) => void;
  isLoading: boolean;
  initialText?: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, initialText = '' }) => {
  const [text, setText] = useState(initialText);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update text if initialText changes (e.g. from template)
  React.useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || isLoading) return;
    onSendMessage(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract pure base64
        const base64Data = base64String.split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-800">
      <div className="max-w-4xl mx-auto relative">
        {/* Image Preview */}
        {selectedImage && (
          <div className="absolute bottom-full left-0 mb-4 bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-xl">
            <div className="relative">
              <img 
                src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                alt="Preview" 
                className="h-32 rounded-md object-cover"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3 bg-gray-800 rounded-2xl p-2 border border-gray-700 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all shadow-lg">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-purple-400 hover:bg-gray-700/50 rounded-xl transition-colors"
            title="Upload Image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lulu something... (e.g., 'Reply to this tweet')"
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none py-3 max-h-32 focus:outline-none scrollbar-hide"
            rows={1}
            style={{ minHeight: '44px' }}
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage) || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all
              ${(!text.trim() && !selectedImage) || isLoading 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-500">Lulu can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
