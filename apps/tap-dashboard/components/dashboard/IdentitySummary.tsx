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
      <h3 className="text-lg font-bold text-postcraft-black mb-4">
        Identity Profile
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
            Brand Voice
          </p>
          <p className="text-sm text-postcraft-gray-900">{identity.brandVoice.tone}</p>
        </div>

        <div>
          <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
            Primary Scene
          </p>
          <Badge variant="info">{identity.sceneIdentity.primaryScene}</Badge>
        </div>

        <div>
          <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
            Microgenres
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{identity.microgenreMap.primary}</Badge>
            {identity.microgenreMap.secondary.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="default" size="sm">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t-2 border-postcraft-gray-200">
          <a
            href="/identity"
            className="text-xs text-postcraft-blue hover:text-postcraft-blue/80 font-bold transition-colors duration-150"
          >
            View full identity profile →
          </a>
        </div>
      </div>
    </Card>
  );
}
