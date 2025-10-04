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
        content: "Hey, I'm Audio. I'm here to help ya with anything you need.",
        timestamp: new Date()
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
      timestamp: new Date()
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
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();

      if (data.reply) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or email us at support@totalaudiopromo.com",
        timestamp: new Date()
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
    <div className="hidden md:block">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black text-white ${
          userTier === 'agency'
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
            : userTier === 'professional'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
            : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
        }`}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] sm:w-96 max-w-md h-[500px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-white">
          <CardHeader className={`${
            userTier === 'agency' 
              ? 'bg-gradient-to-r from-purple-600 to-purple-500' 
              : userTier === 'professional'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500'
              : 'bg-gradient-to-r from-green-600 to-green-500'
          } text-white rounded-t-xl border-4 border-black border-b-0`}>
            <CardTitle className="flex items-center gap-3 text-lg font-black">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] bg-white">
                <Image 
                  src="/assets/loading-states/analyzing-data.png" 
                  alt="Audio mascot analyzing data" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span>Audio</span>
                  {userTier === 'agency' && (
                    <span className="text-xs bg-black/20 px-2 py-1 rounded-full font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">VIP TREATMENT</span>
                  )}
                  {userTier === 'professional' && (
                    <span className="text-xs bg-black/20 px-2 py-1 rounded-full font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">PRIORITY</span>
                  )}
                </div>
                <span className="text-xs text-white/80 font-normal">Built by working promoters</span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[420px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white border-black rounded-2xl'
                        : 'bg-gray-100 text-gray-900 border-black rounded-2xl'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === 'bot' ? (
                        <div className="w-4 h-4 rounded-full overflow-hidden bg-white">
                          <Image 
                            src="/assets/loading-states/analyzing-data.png" 
                            alt="Audio" 
                            width={16} 
                            height={16}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                      <span className={`text-xs ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-white animate-pulse">
                        <Image 
                          src="/assets/loading-states/analyzing-data.png" 
                          alt="Audio thinking" 
                          width={16} 
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Audio is checking the platform knowledge base...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t-4 border-black p-4 bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Audio about contact enrichment, pricing, or platform features..."
                  className="flex-1 h-14 sm:h-12 text-base sm:text-sm border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className={`h-14 sm:h-12 px-4 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black text-white ${
                    userTier === 'agency' 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600' 
                      : userTier === 'professional'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                      : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {userTier === 'agency' 
                  ? "Agency priority support - fastest response times for platform questions"
                  : userTier === 'professional'
                  ? "Professional support - priority responses typically under 1 minute" 
                  : "Standard support - responses within 5 minutes during business hours"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}