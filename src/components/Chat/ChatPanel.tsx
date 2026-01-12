import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialMessage?: string;
}

export function ChatPanel({
  title = 'Ask',
  subtitle = 'Assistant',
  placeholder = 'Type a message...',
  initialMessage = 'Hello! How can I help you today?'
}: ChatPanelProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: initialMessage }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', content: chatMessage }]);
    setChatMessage('');

    // Simulate response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I understand. Let me help you with that.'
      }]);
    }, 500);
  };

  return (
    <div className="bg-card border border-card rounded-2xl h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                <span className="text-xs text-white">AI</span>
              </div>
            )}
            <div
              className={`rounded-2xl p-3 max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-white text-black rounded-tr-none'
                  : 'bg-gray-800 rounded-tl-none'
              }`}
            >
              <p className={`text-sm ${msg.role === 'user' ? 'text-black' : 'text-gray-300'}`}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={placeholder}
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
