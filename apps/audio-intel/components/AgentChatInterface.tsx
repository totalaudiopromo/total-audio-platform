'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentType?: string;
}

interface AgentChatProps {
  agentType: 'orchestrator' | 'marketing' | 'content' | 'performance' | 'newsletter' | 'competitive';
}

const AgentChatInterface: React.FC<AgentChatProps> = ({ agentType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message from agent
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'agent',
      content: getWelcomeMessage(agentType),
      timestamp: new Date(),
      agentType
    };
    setMessages([welcomeMessage]);
  }, [agentType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (type: 'orchestrator' | 'marketing' | 'content' | 'performance' | 'newsletter' | 'competitive'): string => {
    const messages = {
      orchestrator: "🤖 **Orchestrator Agent Online** - I control all 5 sub-agents. Ask me about strategy, coordination, or agent performance. I can deploy, pause, or modify any agent on command.",
      marketing: "📈 **Marketing Agent Ready** - I monitor Reddit, track email performance, and identify beta prospects 24/7. Currently scanning 5 music subreddits every 4 hours.",
      content: "📝 **Content Agent Active** - I generate daily content ideas, social posts, and blog topics. I've already created 12 weeks of newsletter content.",
      performance: "📊 **Performance Agent Monitoring** - I track all KPIs, analyze trends, and generate alerts. Current focus: 1,000 beta user goal progress.",
      newsletter: "📧 **Newsletter Agent Standing By** - I manage weekly newsletter automation, subscriber segmentation, and email sequences. Next send: Tuesday 9am.",
      competitive: "🎯 **Competitive Intel Agent Deployed** - I monitor Muck Rack, Cision, and competitor mentions across Reddit and social media. Weekly competitive reports generated."
    };
    return messages[type] || "Agent online and ready for commands.";
  };

  const getAgentPersonality = (type: 'orchestrator' | 'marketing' | 'content' | 'performance' | 'newsletter' | 'competitive') => {
    const personalities = {
      orchestrator: {
        name: "Commander",
        emoji: "🤖",
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      marketing: {
        name: "Scout",
        emoji: "📈", 
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      content: {
        name: "Creator",
        emoji: "📝",
        color: "text-green-600", 
        bgColor: "bg-green-50"
      },
      performance: {
        name: "Analyst",
        emoji: "📊",
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      newsletter: {
        name: "Communicator", 
        emoji: "📧",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
      },
      competitive: {
        name: "Intel",
        emoji: "🎯",
        color: "text-red-600",
        bgColor: "bg-red-50"
      }
    };
    return personalities[type] || personalities.orchestrator;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType,
          message: inputValue,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      });

      const data = await response.json();

      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.response || 'Agent is processing your request...',
        timestamp: new Date(),
        agentType
      };

      setMessages(prev => [...prev, agentResponse]);

      // If orchestrator is commanding sub-agents, show system messages
      if (agentType === 'orchestrator' && data.subAgentCommands) {
        data.subAgentCommands.forEach((command: any, index: number) => {
          setTimeout(() => {
            const systemMessage: ChatMessage = {
              id: (Date.now() + index + 2).toString(),
              role: 'system',
              content: `🤖 ${command.agent} Agent: ${command.action}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, systemMessage]);
          }, (index + 1) * 1000);
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Error communicating with agent. Please try again.',
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

  const personality = getAgentPersonality(agentType);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className={`${personality.bgColor} border-b`}>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{personality.emoji}</span>
          <span className={personality.color}>{personality.name} Agent</span>
          <div className="ml-auto flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-100 text-gray-700 text-sm'
                    : `${personality.bgColor} ${personality.color}`
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`${personality.bgColor} p-3 rounded-lg`}>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${personality.name} Agent...`}
            className="flex-1 p-2 border rounded-lg resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-2 flex flex-wrap gap-2">
          {getQuickActions(agentType).map((action, index) => (
            <button
              key={index}
              onClick={() => setInputValue(action)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
            >
              {action}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const getQuickActions = (agentType: 'orchestrator' | 'marketing' | 'content' | 'performance' | 'newsletter' | 'competitive'): string[] => {
  const actions = {
    orchestrator: [
      "Status report from all agents",
      "Deploy marketing blitz mode", 
      "Pause competitive agent",
      "Scale up content creation",
      "Emergency beta push campaign"
    ],
    marketing: [
      "Find high-value Reddit opportunities",
      "Check email performance", 
      "Update beta metrics",
      "Scan for competitor complaints",
      "Generate lead magnet ideas"
    ],
    content: [
      "Generate 5 social posts",
      "Create blog topic ideas",
      "Write newsletter content",
      "Suggest viral content angles",
      "Create competitor comparison post"
    ],
    performance: [
      "Show beta progress",
      "Analyze email metrics",
      "Generate performance alerts",
      "Track conversion rates",
      "Compare to industry benchmarks"
    ],
    newsletter: [
      "Preview next newsletter",
      "Check subscriber growth",
      "Segment beta users",
      "Schedule special announcement",
      "Optimize send times"
    ],
    competitive: [
      "Scan Muck Rack complaints",
      "Find switcher opportunities", 
      "Generate competitive responses",
      "Track mention volume",
      "Identify pricing pain points"
    ]
  };
  
  return actions[agentType] || [];
};

export default AgentChatInterface;