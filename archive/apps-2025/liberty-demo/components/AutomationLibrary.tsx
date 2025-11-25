import React from 'react';
import {
  Radio,
  FileText,
  Mail,
  Activity,
  Clock,
  TrendingUp,
  MessageSquare,
  UserPlus,
  UserCheck,
  ListTodo,
  Tag,
} from 'lucide-react';

const AutomationLibrary: React.FC = () => {
  const triggers = [
    {
      id: 'coverage_found',
      icon: Radio,
      label: 'Coverage Found',
      description: 'WARM / CoverageBook detection',
    },
    {
      id: 'typeform_submitted',
      icon: FileText,
      label: 'Typeform Submitted',
      description: 'Artist intake form completed',
    },
    {
      id: 'email_opened',
      icon: Mail,
      label: 'Email Opened',
      description: 'Pitch email engagement tracked',
    },
    {
      id: 'pitch_opened',
      icon: Mail,
      label: 'Pitch Opened',
      description: 'Recipient opened pitch email',
    },
    {
      id: 'pitch_replied',
      icon: MessageSquare,
      label: 'Pitch Replied',
      description: 'Recipient replied to pitch',
    },
    {
      id: 'radio_spin_logged',
      icon: Activity,
      label: 'Radio Spin Logged',
      description: 'New radio play detected',
    },
    {
      id: 'schedule',
      icon: Clock,
      label: 'Scheduled Check',
      description: 'Time-based automation trigger',
    },
  ];

  const actions = [
    {
      id: 'google_chat_message',
      icon: MessageSquare,
      label: 'Google Chat Message',
      description: 'Send notification to team channel',
    },
    {
      id: 'create_crm_contact',
      icon: UserPlus,
      label: 'Create CRM Contact',
      description: 'Add new contact to Liberty CRM',
    },
    {
      id: 'update_crm_contact',
      icon: UserCheck,
      label: 'Update CRM Contact',
      description: 'Modify existing contact data',
    },
    {
      id: 'create_task',
      icon: ListTodo,
      label: 'Create Task',
      description: 'Add task to Monday.com board',
    },
    {
      id: 'tag_contact',
      icon: Tag,
      label: 'Tag Contact',
      description: 'Apply label or category tag',
    },
  ];

  const handleSelect = (type: 'trigger' | 'action', id: string) => {
    console.log(`select-${type}`, id);
  };

  return (
    <div className="space-y-8">
      {/* Triggers */}
      <div>
        <h2 className="text-lg font-heading font-medium tracking-tight text-tap-text mb-4 pb-2 border-b border-tap-line">
          Trigger Library
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {triggers.map(trigger => (
            <div
              key={trigger.id}
              draggable
              onDragStart={event => {
                event.dataTransfer.setData(
                  'application/reactflow',
                  JSON.stringify({
                    type: 'trigger',
                    kind: trigger.id,
                    label: trigger.label,
                    description: trigger.description,
                  })
                );
                event.dataTransfer.effectAllowed = 'move';
              }}
              className="w-full text-left p-4 bg-white border border-tap-line rounded-xl hover:border-tap-accent hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-tap-bg rounded-lg flex items-center justify-center shrink-0 border border-tap-line group-hover:border-tap-accent/30 transition-colors">
                  <trigger.icon
                    size={18}
                    className="text-tap-muted group-hover:text-tap-accent transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-medium text-sm text-tap-text mb-1">
                    {trigger.label}
                  </p>
                  <p className="font-sans text-xs text-tap-muted leading-relaxed">
                    {trigger.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <h2 className="text-lg font-heading font-medium tracking-tight text-tap-text mb-4 pb-2 border-b border-tap-line">
          Action Library
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {actions.map(action => (
            <div
              key={action.id}
              draggable
              onDragStart={event => {
                event.dataTransfer.setData(
                  'application/reactflow',
                  JSON.stringify({
                    type: 'action',
                    kind: action.id,
                    label: action.label,
                    description: action.description,
                  })
                );
                event.dataTransfer.effectAllowed = 'move';
              }}
              className="w-full text-left p-4 bg-white border border-tap-line rounded-xl hover:border-tap-accent hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-tap-bg rounded-lg flex items-center justify-center shrink-0 border border-tap-line group-hover:border-tap-accent/30 transition-colors">
                  <action.icon
                    size={18}
                    className="text-tap-muted group-hover:text-tap-accent transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-medium text-sm text-tap-text mb-1">
                    {action.label}
                  </p>
                  <p className="font-sans text-xs text-tap-muted leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomationLibrary;
