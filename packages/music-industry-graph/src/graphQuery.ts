/**
 * Music Industry Graph (MIG) - Natural Language Query Parser
 *
 * Implements rule-based natural language to graph traversal operations.
 * Examples:
 * - "Show me all London alt-R&B artists"
 * - "Who covers UK rap?"
 * - "What scenes are Garage DJs influencing right now?"
 * - "Which journalists are connected to artists similar to me?"
 * - "Find playlist curators adjacent to Bristol bass scene"
 */

import { listNodesByType, searchNodesByType, getNeighbors, supabase } from './client';
import { getGraphForScene, getNodesByCountry } from './graphStore';
import type {
  NLQuery,
  GraphQueryResult,
  MIGNodeType,
  MIGRelationshipType,
  MIGNode,
  MIGEdge,
} from './types';
import { logger } from './utils/logger';

// ============================================================================
// NATURAL LANGUAGE PARSING
// ============================================================================

/**
 * Parse natural language query into structured query
 */
export function parseNLQuery(query: string): NLQuery {
  const lowerQuery = query.toLowerCase();

  // Determine intent
  let intent: NLQuery['parsed']['intent'] = 'find';
  if (
    lowerQuery.includes('recommend') ||
    lowerQuery.includes('suggest') ||
    lowerQuery.includes('similar to')
  ) {
    intent = 'recommend';
  } else if (lowerQuery.includes('path') || lowerQuery.includes('connect')) {
    intent = 'path';
  } else if (lowerQuery.includes('influence') || lowerQuery.includes('influenced')) {
    intent = 'influence';
  } else if (
    lowerQuery.includes('scene') ||
    lowerQuery.includes('microgenre') ||
    lowerQuery.includes('community')
  ) {
    intent = 'scene';
  }

  // Determine node types
  const node_types: MIGNodeType[] = [];
  if (lowerQuery.includes('artist')) node_types.push('artist');
  if (lowerQuery.includes('journalist')) node_types.push('journalist');
  if (lowerQuery.includes('radio host') || lowerQuery.includes('dj')) {
    node_types.push('radio_host');
    node_types.push('dj');
  }
  if (lowerQuery.includes('playlist')) node_types.push('playlist');
  if (lowerQuery.includes('blog')) node_types.push('blog');
  if (lowerQuery.includes('label')) node_types.push('label');
  if (lowerQuery.includes('scene')) node_types.push('scene');
  if (lowerQuery.includes('microgenre')) node_types.push('microgenre');
  if (lowerQuery.includes('event') || lowerQuery.includes('festival')) {
    node_types.push('event');
    node_types.push('festival');
  }
  if (lowerQuery.includes('venue')) node_types.push('venue');
  if (lowerQuery.includes('podcast')) node_types.push('podcast');

  // Extract location filter
  let location: string | undefined;
  const locationPatterns = [
    /in ([a-z]+)/i,
    /from ([a-z]+)/i,
    /([a-z]+) based/i,
    /(london|manchester|bristol|glasgow|birmingham|leeds|liverpool|brighton)/i,
  ];
  for (const pattern of locationPatterns) {
    const match = query.match(pattern);
    if (match) {
      location = match[1];
      break;
    }
  }

  // Extract genre filter
  let genre: string | undefined;
  const genrePatterns = [
    /(alt-r&b|alternative r&b|alt r&b)/i,
    /(uk rap|grime|drill)/i,
    /(garage|uk garage|bass|bassline)/i,
    /(indie|alternative|rock)/i,
    /(electronic|techno|house)/i,
    /(hip-hop|hip hop)/i,
    /(jazz|soul|funk)/i,
  ];
  for (const pattern of genrePatterns) {
    const match = query.match(pattern);
    if (match) {
      genre = match[1];
      break;
    }
  }

  // Determine relationships
  const relationships: MIGRelationshipType[] = [];
  if (lowerQuery.includes('cover') || lowerQuery.includes('write')) {
    relationships.push('covers', 'writes_for');
  }
  if (lowerQuery.includes('influence')) {
    relationships.push('influences', 'influenced_by');
  }
  if (lowerQuery.includes('support')) {
    relationships.push('supports');
  }
  if (lowerQuery.includes('collaborat')) {
    relationships.push('collaborates');
  }
  if (lowerQuery.includes('similar') || lowerQuery.includes('adjacent')) {
    relationships.push('similar_to', 'similar_audience');
  }

  return {
    raw_query: query,
    parsed: {
      intent,
      node_types: node_types.length > 0 ? node_types : undefined,
      filters: {
        location,
        genre,
      },
      relationships: relationships.length > 0 ? relationships : undefined,
    },
  };
}

// ============================================================================
// QUERY EXECUTION
// ============================================================================

/**
 * Execute a natural language query
 */
export async function executeNLQuery(query: string): Promise<GraphQueryResult> {
  const startTime = Date.now();
  const parsed = parseNLQuery(query);

  logger.info('Executing NL query', { query, parsed });

  let nodes: MIGNode[] = [];
  let edges: MIGEdge[] = [];

  try {
    switch (parsed.parsed.intent) {
      case 'find':
        ({ nodes, edges } = await executeFindQuery(parsed));
        break;

      case 'scene':
        ({ nodes, edges } = await executeSceneQuery(parsed));
        break;

      case 'influence':
        ({ nodes, edges } = await executeInfluenceQuery(parsed));
        break;

      case 'recommend':
      case 'path':
        // These would integrate with recommendations.ts and pathfinding.ts
        logger.warn('Recommend and path queries not yet implemented in NL interface');
        break;

      default:
        logger.warn('Unknown query intent', { intent: parsed.parsed.intent });
    }
  } catch (err) {
    logger.error('Error executing NL query', err);
  }

  return {
    nodes,
    edges,
    total_results: nodes.length,
    query_time_ms: Date.now() - startTime,
  };
}

/**
 * Execute a "find" query
 * Example: "Show me all London alt-R&B artists"
 */
async function executeFindQuery(parsed: NLQuery): Promise<{ nodes: MIGNode[]; edges: MIGEdge[] }> {
  if (!supabase) {
    return { nodes: [], edges: [] };
  }

  let query = supabase.from('migraph_nodes').select('*');

  // Apply node type filter
  if (parsed.parsed.node_types && parsed.parsed.node_types.length > 0) {
    query = query.in('type', parsed.parsed.node_types);
  }

  // Apply location filter
  if (parsed.parsed.filters?.location) {
    const location = parsed.parsed.filters.location;
    query = query.or(
      `country.ilike.%${location}%,metadata->location->city.ilike.%${location}%`
    );
  }

  // Apply genre filter via metadata
  if (parsed.parsed.filters?.genre) {
    const genre = parsed.parsed.filters.genre;
    query = query.contains('metadata', { genres: [genre] });
  }

  const { data, error } = await query.limit(100);

  if (error) {
    logger.error('Error executing find query', error);
    return { nodes: [], edges: [] };
  }

  return { nodes: (data as MIGNode[]) || [], edges: [] };
}

/**
 * Execute a "scene" query
 * Example: "What scenes are Garage DJs influencing right now?"
 */
async function executeSceneQuery(
  parsed: NLQuery
): Promise<{ nodes: MIGNode[]; edges: MIGEdge[] }> {
  if (!supabase) {
    return { nodes: [], edges: [] };
  }

  // Get all scene nodes
  const { data: sceneData, error: sceneError } = await supabase
    .from('migraph_nodes')
    .select('*')
    .eq('type', 'scene')
    .limit(50);

  if (sceneError) {
    logger.error('Error fetching scenes', sceneError);
    return { nodes: [], edges: [] };
  }

  const scenes = (sceneData as MIGNode[]) || [];

  // Filter by location if specified
  let filteredScenes = scenes;
  if (parsed.parsed.filters?.location) {
    const location = parsed.parsed.filters.location.toLowerCase();
    filteredScenes = scenes.filter(
      (scene) =>
        scene.country?.toLowerCase().includes(location) ||
        scene.metadata?.location?.city?.toLowerCase().includes(location) ||
        scene.name.toLowerCase().includes(location)
    );
  }

  return { nodes: filteredScenes, edges: [] };
}

/**
 * Execute an "influence" query
 * Example: "Who influences X artist?"
 */
async function executeInfluenceQuery(
  parsed: NLQuery
): Promise<{ nodes: MIGNode[]; edges: MIGEdge[] }> {
  // This would require a target node to be specified
  // For now, return empty results
  logger.warn('Influence queries require a specific target node');
  return { nodes: [], edges: [] };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine if a query is asking about a specific entity
 */
function extractTargetEntity(query: string): string | null {
  // Look for quoted strings or capitalized phrases
  const quotedMatch = query.match(/"([^"]+)"/);
  if (quotedMatch) {
    return quotedMatch[1];
  }

  // Look for capitalized words (likely entity names)
  const capitalizedMatch = query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/);
  if (capitalizedMatch) {
    return capitalizedMatch[0];
  }

  return null;
}

/**
 * Simple query builder for common patterns
 */
export async function buildSimpleQuery(
  nodeType: MIGNodeType,
  location?: string,
  genre?: string
): Promise<MIGNode[]> {
  if (!supabase) {
    return [];
  }

  let query = supabase.from('migraph_nodes').select('*').eq('type', nodeType);

  if (location) {
    query = query.or(`country.ilike.%${location}%,metadata->location->city.ilike.%${location}%`);
  }

  if (genre) {
    query = query.contains('metadata', { genres: [genre] });
  }

  const { data, error } = await query.limit(100);

  if (error) {
    logger.error('Error in buildSimpleQuery', error);
    return [];
  }

  return (data as MIGNode[]) || [];
}
