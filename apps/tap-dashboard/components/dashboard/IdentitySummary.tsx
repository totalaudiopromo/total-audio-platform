import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface IdentitySummaryProps {
  identity: {
    brandVoice: {
      tone: string;
      themes: string[];
    };
    sceneIdentity: {
      primaryScene: string;
    };
    microgenreMap: {
      primary: string;
      secondary: string[];
    };
  };
}

export function IdentitySummary({ identity }: IdentitySummaryProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-foreground mb-4">Identity Profile</h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            Brand Voice
          </p>
          <p className="text-sm text-foreground">{identity.brandVoice.tone}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            Primary Scene
          </p>
          <Badge variant="teal">{identity.sceneIdentity.primaryScene}</Badge>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            Microgenres
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="amber">{identity.microgenreMap.primary}</Badge>
            {identity.microgenreMap.secondary.slice(0, 3).map(genre => (
              <Badge key={genre} variant="default" size="sm">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <a
            href="/identity"
            className="text-xs text-brand-slate hover:text-brand-slate-dark font-medium transition-colors duration-180"
          >
            View full identity profile →
          </a>
        </div>
      </div>
    </Card>
  );
}
