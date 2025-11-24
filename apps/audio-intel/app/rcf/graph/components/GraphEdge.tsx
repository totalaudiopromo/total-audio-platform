/**
 * Graph Edge Component
 * Connection line between two nodes in the graph
 */

interface GraphEdgeProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  weight?: number;
  edgeType?: string;
}

export function GraphEdge({ startX, startY, endX, endY, weight = 0.5, edgeType }: GraphEdgeProps) {
  // Calculate line properties
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

  // Line opacity and thickness based on weight
  const opacity = Math.max(0.2, weight);
  const thickness = Math.max(1, weight * 3);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: startX,
        top: startY,
        width: length,
        height: thickness,
        backgroundColor: `rgba(58, 169, 190, ${opacity})`,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        transition: 'all 240ms ease-out',
      }}
      title={edgeType || 'Connection'}
    />
  );
}
