'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioCharacter } from '@/components/ui/audio-character';
import Image from 'next/image';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface LiveChatBotProps {
  userTier?: 'free' | 'professional' | 'agency';
}

export default function LiveChatBot({ userTier = 'free' }: LiveChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: "Hi! I'm here to help. Ask me anything about Audio Intel.",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userTier]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call our chat API
      const response = await fetch('/api/chat-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userTier,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again or email us at support@totalaudiopromo.com",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-black text-white flex items-center justify-center ${
          userTier === 'agency'
            ? 'bg-blue-600 hover:bg-blue-700'
            : userTier === 'professional'
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[calc(100vw-2rem)] sm:w-80 max-w-sm h-[380px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-white flex flex-col">
          <div
            className={`${
              userTier === 'agency'
                ? 'bg-blue-600'
                : userTier === 'professional'
                ? 'bg-blue-600'
                : 'bg-green-600'
            } text-white rounded-t-lg px-3 py-2 border-b-2 border-black`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-bold text-sm">Audio Support</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border-2 border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-xl px-3 py-2 border-2 border-gray-200">
                  <span className="text-sm text-gray-600">Audio is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-gray-200 p-2 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`h-9 px-3 rounded-lg font-bold text-white text-sm ${
                  userTier === 'agency'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : userTier === 'professional'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
