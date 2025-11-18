/**
 * Autosave Status Indicator - Shows save status
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface AutosaveStatusIndicatorProps {
  status: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedAt?: Date;
}

export const AutosaveStatusIndicator: React.FC<AutosaveStatusIndicatorProps> = ({
  status,
  lastSavedAt,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          text: 'Saved',
          color: '#10B981',
          icon: '✓',
        };
      case 'saving':
        return {
          text: 'Saving...',
          color: '#3AA9BE',
          icon: '○',
        };
      case 'unsaved':
        return {
          text: 'Unsaved changes',
          color: '#F59E0B',
          icon: '●',
        };
      case 'error':
        return {
          text: 'Save failed',
          color: '#EF4444',
          icon: '✗',
        };
    }
  };

  const config = getStatusConfig();

  const getTimeAgo = () => {
    if (!lastSavedAt) return '';
    const seconds = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    return 'over an hour ago';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm"
    >
      <motion.span
        animate={status === 'saving' ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: status === 'saving' ? Infinity : 0 }}
        style={{ color: config.color }}
      >
        {config.icon}
      </motion.span>
      <span className="text-gray-400">
        {config.text}
        {status === 'saved' && lastSavedAt && (
          <span className="ml-1 text-gray-600">({getTimeAgo()})</span>
        )}
      </span>
    </motion.div>
  );
};
