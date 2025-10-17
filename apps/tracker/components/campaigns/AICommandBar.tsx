'use client';

import { useState, useRef, useEffect } from 'react';
import type { Campaign } from '@/lib/types';

interface AICommandBarProps {
  campaigns: Campaign[];
  onCommand: (command: CommandResult) => void;
}

type CommandResult = {
  type: 'filter' | 'create' | 'search' | 'export' | 'report';
  data: any;
  message: string;
};

export function AICommandBar({ campaigns, onCommand }: AICommandBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setInput('');
        setConversationHistory([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI-powered command parsing (local, fast)
  const parseCommand = (text: string): CommandResult | null => {
    const lower = text.toLowerCase();

    // Filter commands
    if (lower.includes('show') || lower.includes('filter') || lower.includes('find')) {
      // Extract client name
      if (lower.includes('client')) {
        const clientMatch = text.match(/client\s+([a-z0-9\s]+)/i);
        if (clientMatch) {
          return {
            type: 'filter',
            data: { client_name: clientMatch[1].trim() },
            message: `Filtering campaigns for client: ${clientMatch[1].trim()}`,
          };
        }
      }

      // Extract platform filter
      if (lower.includes('bbc') || lower.includes('radio')) {
        return {
          type: 'filter',
          data: { platform: 'BBC Radio' },
          message: 'Showing BBC Radio campaigns',
        };
      }

      if (lower.includes('playlist')) {
        return {
          type: 'filter',
          data: { platform: 'Playlists' },
          message: 'Showing playlist campaigns',
        };
      }

      // Extract status filter
      if (lower.includes('active')) {
        return {
          type: 'filter',
          data: { status: 'active' },
          message: 'Showing active campaigns',
        };
      }

      if (lower.includes('completed')) {
        return {
          type: 'filter',
          data: { status: 'completed' },
          message: 'Showing completed campaigns',
        };
      }
    }

    // Create campaign commands
    if (lower.includes('add') || lower.includes('create') || lower.includes('new')) {
      if (lower.includes('campaign')) {
        const clientMatch = text.match(/for\s+([a-z0-9\s]+)/i);
        return {
          type: 'create',
          data: {
            client_name: clientMatch ? clientMatch[1].trim() : null,
          },
          message: `Creating new campaign${clientMatch ? ` for ${clientMatch[1].trim()}` : ''}`,
        };
      }
    }

    // Export commands
    if (lower.includes('export')) {
      const clientMatch = text.match(/client\s+([a-z0-9\s]+)/i);
      return {
        type: 'export',
        data: { client_name: clientMatch?.[1]?.trim() },
        message: `Exporting campaigns${clientMatch ? ` for client: ${clientMatch[1].trim()}` : ''}`,
      };
    }

    // Report generation
    if (lower.includes('report') || lower.includes('summary')) {
      const clientMatch = text.match(/for\s+([a-z0-9\s]+)/i);
      return {
        type: 'report',
        data: { client_name: clientMatch?.[1]?.trim() },
        message: `Generating report${clientMatch ? ` for ${clientMatch[1].trim()}` : ''}`,
      };
    }

    return null;
  };

  // Conversational suggestions based on context
  const getConversationalSuggestions = (): string[] => {
    // Extract unique client names
    const clients = Array.from(new Set(
      campaigns.map((c) => c.client_name).filter(Boolean)
    ));

    if (!input.trim()) {
      // Opening suggestions (conversational)
      return [
        "Show me all my active campaigns",
        clients.length > 0 ? `What campaigns do I have for ${clients[0]}?` : "Create a new campaign",
        "Which campaigns have the best response rates?",
        "Show me all BBC Radio campaigns",
        "Export all my campaign data",
      ];
    }

    const lower = input.toLowerCase();
    const suggestions: string[] = [];

    // Context-aware conversational responses
    if (lower.includes('show') || lower.includes('what')) {
      clients.forEach((client) => {
        suggestions.push(`Show me campaigns for ${client}`);
      });
      suggestions.push("Show active campaigns only");
      suggestions.push("Show completed campaigns");
    }

    if (lower.includes('create') || lower.includes('new')) {
      clients.forEach((client) => {
        suggestions.push(`Create a campaign for ${client}`);
      });
      suggestions.push("Create a BBC Radio campaign");
      suggestions.push("Create a Spotify playlist campaign");
    }

    if (lower.includes('export')) {
      clients.forEach((client) => {
        suggestions.push(`Export ${client} campaign data`);
      });
      suggestions.push("Export all campaigns to CSV");
    }

    return suggestions.slice(0, 5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    const result = parseCommand(input);

    // Add to conversation history
    setConversationHistory([
      ...conversationHistory,
      { role: 'user', content: input },
      { role: 'assistant', content: result?.message || `Searching for: ${input}` },
    ]);

    if (result) {
      onCommand(result);
      setTimeout(() => {
        setInput('');
        setIsOpen(false);
        setConversationHistory([]);
      }, 1500);
    } else {
      // Fallback: treat as search
      onCommand({
        type: 'search',
        data: { query: input },
        message: `Searching for: ${input}`,
      });
      setTimeout(() => {
        setInput('');
        setIsOpen(false);
        setConversationHistory([]);
      }, 1500);
    }

    setIsProcessing(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const suggestions = getConversationalSuggestions();

  return (
    <>
      {/* Command Bar Trigger Button - Chatbot Style */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto px-6 py-3 bg-[#14B8A6] hover:bg-[#0F9488] text-white rounded-xl font-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all border-4 border-black flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Ask AI Assistant
        <kbd className="hidden md:inline-block px-2 py-1 text-xs bg-black/20 rounded font-mono">⌘K</kbd>
      </button>

      {/* Chatbot Modal (Conversational Style) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border-4 border-black shadow-brutal overflow-hidden">
            {/* Chatbot Header */}
            <div className="bg-[#14B8A6] px-6 py-4 border-b-4 border-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Campaign AI Assistant</h3>
                  <p className="text-xs font-bold text-white/80">Ask me anything about your campaigns</p>
                </div>
              </div>
            </div>

            {/* Conversation History (Chatbot Style) */}
            {conversationHistory.length > 0 && (
              <div className="p-6 space-y-3 bg-gray-50 border-b-2 border-gray-200 max-h-48 overflow-y-auto">
                {conversationHistory.map((message, idx) => (
                  <div key={idx} className={`flex gap-3 ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-xl font-medium ${
                      message.role === 'assistant'
                        ? 'bg-white border-2 border-gray-200 text-gray-900'
                        : 'bg-[#14B8A6] border-2 border-black text-white'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Command Input */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question... (e.g., 'Show me Royal Blood campaigns')"
                  className="flex-1 px-4 py-3 text-lg font-medium border-2 border-gray-300 rounded-xl focus:border-[#14B8A6] focus:outline-none"
                  autoFocus
                />
                {isProcessing && (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#14B8A6] border-t-transparent" />
                )}
              </div>

              {/* Conversational Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">💬 Try asking...</p>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#14B8A6]/10 transition-colors border-2 border-transparent hover:border-[#14B8A6] flex items-center gap-3 group"
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-[#14B8A6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-700 group-hover:text-[#14B8A6] transition-colors">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Quick Actions Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t-2 border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span>⏎ Send</span>
                <span>ESC Close</span>
              </div>
              <div className="text-xs font-bold text-[#14B8A6]">
                Powered by AI ✨
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
