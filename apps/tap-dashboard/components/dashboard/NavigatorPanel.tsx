'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { useNavigator } from '@/lib/hooks/use-intelligence';
import { SparklesIcon } from '@heroicons/react/24/outline';

export function NavigatorPanel() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigator();

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await navigator.ask(question);
      setAnswer(result);
    } catch (error) {
      console.error('Navigator error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-postcraft-blue/10 to-postcraft-white">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-postcraft-blue rounded-lg flex items-center justify-center border-2 border-postcraft-black">
          <SparklesIcon className="w-6 h-6 text-postcraft-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-postcraft-black mb-2">
            AI Navigator
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask the Navigator anything..."
              className="postcraft-input flex-1"
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="px-6 py-2.5 bg-postcraft-blue text-postcraft-white rounded-lg text-sm font-bold border-2 border-postcraft-black shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>

          {answer && (
            <div className="space-y-3">
              <p className="text-sm text-postcraft-gray-900 leading-relaxed">
                {answer.answer}
              </p>
              {answer.recommendedActions && answer.recommendedActions.length > 0 && (
                <div className="pt-3 border-t-2 border-postcraft-gray-200">
                  <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                    Recommended Actions
                  </p>
                  <ul className="space-y-1">
                    {answer.recommendedActions.map((action: string, i: number) => (
                      <li key={i} className="text-xs text-postcraft-gray-900 flex items-start gap-2 font-medium">
                        <span className="text-postcraft-blue font-bold">→</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
