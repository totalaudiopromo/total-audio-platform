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
    <Card variant="gradient">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-brand-slate rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-center">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">AI Navigator</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Ask the navigator anything..."
              className="input-brutal flex-1"
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="btn-primary min-w-[100px]"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>

          {answer && (
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{answer.answer}</p>
              {answer.recommendedActions && answer.recommendedActions.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
                    Recommended Actions
                  </p>
                  <ul className="space-y-1">
                    {answer.recommendedActions.map((action: string, i: number) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <span className="text-brand-slate font-bold">→</span>
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
