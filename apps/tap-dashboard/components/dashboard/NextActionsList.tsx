import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { List, ListItem } from '../ui/List';

interface NextActionsListProps {
  actions: Array<{
    id: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
}

export function NextActionsList({ actions }: NextActionsListProps) {
  const priorityVariant = (priority: string) => {
    if (priority === 'high') return 'error';
    if (priority === 'medium') return 'warning';
    return 'default';
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-postcraft-black mb-4">
        Next Actions
      </h3>
      {actions.length === 0 ? (
        <p className="text-sm text-postcraft-gray-600">No actions available</p>
      ) : (
        <List variant="bordered">
          {actions.map((item) => (
            <ListItem key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-postcraft-gray-900 mb-1 font-medium">
                    {item.action}
                  </p>
                  <p className="text-xs text-postcraft-gray-600">{item.category}</p>
                </div>
                <Badge variant={priorityVariant(item.priority)} size="sm">
                  {item.priority}
                </Badge>
              </div>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}
