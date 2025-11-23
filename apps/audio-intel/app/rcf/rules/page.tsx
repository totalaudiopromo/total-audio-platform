/**
 * RCF Rules Page
 * Manage ingestion rules for filtering and weighting events
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { RCFRule } from '@total-audio/rcf/rules';
import { RuleCard } from './components/RuleCard';
import { RuleForm } from './components/RuleForm';

export default function RCFRulesPage() {
  const [rules, setRules] = useState<RCFRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<RCFRule | undefined>();

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      setLoading(true);
      const response = await fetch('/api/rcf/rules');
      const result = await response.json();

      if (result.success) {
        setRules(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createRule(rule: Partial<RCFRule>) {
    try {
      const response = await fetch('/api/rcf/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });

      const result = await response.json();

      if (result.success) {
        await fetchRules();
        setShowForm(false);
        setEditingRule(undefined);
      }
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  }

  async function deleteRule(ruleId: string) {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rcf/rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRules((prev) => prev.filter((r) => r.id !== ruleId));
      }
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  }

  function handleEdit(rule: RCFRule) {
    setEditingRule(rule);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingRule(undefined);
  }

  // Sort rules by priority
  const sortedRules = [...rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/rcf"
                className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors duration-240"
              >
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Ingestion Rules</h1>
              <p className="text-sm text-slate-400 mt-1">
                {rules.length} {rules.length === 1 ? 'rule' : 'rules'} configured
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-240 ease-out
                ${
                  showForm
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-[#3AA9BE] text-white hover:bg-[#3AA9BE]/80'
                }
              `}
            >
              {showForm ? 'Cancel' : '+ Create Rule'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Rule Form */}
          {showForm && (
            <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h2>
              <RuleForm
                initialRule={editingRule}
                onSubmit={createRule}
                onCancel={handleCancelForm}
              />
            </div>
          )}

          {/* Rules List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse text-[#3AA9BE]">Loading rules...</div>
            </div>
          ) : sortedRules.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-lg mb-2">No rules configured</div>
              <div className="text-sm mb-4">
                Create rules to filter unwanted sources or modify event weights
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-[#3AA9BE] text-white rounded-lg font-medium hover:bg-[#3AA9BE]/80 transition-colors"
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">Active Rules</h2>
                <div className="text-sm text-slate-400 font-mono">
                  Sorted by priority (high to low)
                </div>
              </div>

              {sortedRules.map((rule) => (
                <RuleCard
                  key={rule.id || `rule-${rule.priority}`}
                  rule={rule}
                  onEdit={handleEdit}
                  onDelete={deleteRule}
                />
              ))}
            </div>
          )}

          {/* Info Panel */}
          {!showForm && sortedRules.length > 0 && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">How Rules Work</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Rules are executed in priority order (highest first)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Block rules prevent matching events from being ingested</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Weight rules multiply event weights (0.0 = ignore, 2.0 = double importance)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Use source patterns with wildcards (e.g., "spam-*") for flexible matching</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
