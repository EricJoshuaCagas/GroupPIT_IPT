import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { chatApi } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am your LoanTracker assistant. How can I help you today?'
    }
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(trimmed);
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant-error`,
        role: 'assistant',
        content: 'Sorry, I could not reach the AI service right now. Please try again.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-semibold">LoanTracker Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 transition"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-2xl text-sm bg-white text-slate-600 border border-slate-200 shadow-sm">
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-4 py-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about loans, payments, or reports..."
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-60"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};
