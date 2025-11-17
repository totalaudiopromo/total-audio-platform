/**
 * MIG AI Console - GraphQL-like Q&A Layer
 * Natural language queries over the Music Industry Graph
 */

import {
  executeNLQuery,
  findShortestPath,
  getDegreesOfSeparation,
  recommendSimilarArtists,
  getGraphNeighborhood,
} from '@total-audio/music-industry-graph';

export interface ConsoleQuery {
  query: string;
  intent: 'path' | 'recommendation' | 'discovery' | 'analysis';
  entities: string[];
}

export interface ConsoleResponse {
  query: string;
  answer: string;
  data: any;
  visualization_hint?: 'graph' | 'list' | 'table' | 'heatmap';
  suggested_followups?: string[];
}

// ============================================================================
// QUERY PARSER
// ============================================================================

export function parseConsoleQuery(query: string): ConsoleQuery {
  const lowerQuery = query.toLowerCase();

  // Determine intent
  let intent: ConsoleQuery['intent'] = 'discovery';

  if (lowerQuery.includes('path') || lowerQuery.includes('connect')) {
    intent = 'path';
  } else if (lowerQuery.includes('recommend') || lowerQuery.includes('similar')) {
    intent = 'recommendation';
  } else if (lowerQuery.includes('how many') || lowerQuery.includes('analyze')) {
    intent = 'analysis';
  }

  // Extract entities (simplified)
  const entities: string[] = [];
  const entityPatterns = [
    /\"([^\"]+)\"/g, // Quoted strings
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, // Capitalized words
  ];

  for (const pattern of entityPatterns) {
    const matches = query.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 2) {
        entities.push(match[1]);
      }
    }
  }

  return {
    query,
    intent,
    entities: [...new Set(entities)],
  };
}

// ============================================================================
// QUERY EXECUTOR
// ============================================================================

export async function executeConsoleQuery(query: string): Promise<ConsoleResponse> {
  const parsed = parseConsoleQuery(query);

  try {
    switch (parsed.intent) {
      case 'path':
        return await executePathQuery(query, parsed);

      case 'recommendation':
        return await executeRecommendationQuery(query, parsed);

      case 'discovery':
        return await executeDiscoveryQuery(query, parsed);

      case 'analysis':
        return await executeAnalysisQuery(query, parsed);

      default:
        return {
          query,
          answer: 'Query not understood. Try asking about paths, recommendations, or discoveries.',
          data: null,
        };
    }
  } catch (error) {
    return {
      query,
      answer: `Error: ${error.message}`,
      data: null,
    };
  }
}

// ============================================================================
// QUERY HANDLERS
// ============================================================================

async function executePathQuery(query: string, parsed: ConsoleQuery): Promise<ConsoleResponse> {
  // Example: "What's the shortest path from my artist to NME journalists?"

  if (parsed.entities.length < 2) {
    return {
      query,
      answer: 'Please specify two entities to find a path between them.',
      data: null,
    };
  }

  const [from, to] = parsed.entities;
  const path = await findShortestPath(from, to);

  if (!path) {
    return {
      query,
      answer: `No path found between ${from} and ${to} in the graph.`,
      data: null,
      suggested_followups: [
        `Find similar entities to ${to}`,
        `Explore ${from}'s neighborhood`,
      ],
    };
  }

  return {
    query,
    answer: `Found a path with ${path.degrees_of_separation} degrees of separation between ${from} and ${to}.`,
    data: {
      path: path.path,
      degrees: path.degrees_of_separation,
      total_weight: path.total_weight,
      nodes: path.path.nodes.map((n) => n.name),
    },
    visualization_hint: 'graph',
    suggested_followups: [
      `Analyze influence along this path`,
      `Find alternative paths`,
      `Who else is connected to ${to}?`,
    ],
  };
}

async function executeRecommendationQuery(
  query: string,
  parsed: ConsoleQuery
): Promise<ConsoleResponse> {
  // Example: "Recommend journalists similar to Pitchfork writers"

  const target = parsed.entities[0];
  if (!target) {
    return {
      query,
      answer: 'Please specify an entity to get recommendations for.',
      data: null,
    };
  }

  const recommendations = await recommendSimilarArtists(target, { limit: 10 });

  return {
    query,
    answer: `Found ${recommendations.length} recommendations similar to ${target}.`,
    data: {
      recommendations: recommendations.map((r) => ({
        name: r.node.name,
        score: r.score,
        reasoning: r.reasoning,
      })),
    },
    visualization_hint: 'list',
    suggested_followups: [
      `Analyze ${recommendations[0]?.node.name}`,
      `Find paths to these recommendations`,
    ],
  };
}

async function executeDiscoveryQuery(
  query: string,
  parsed: ConsoleQuery
): Promise<ConsoleResponse> {
  // Example: "Which journalists cover underground UK rap?"

  const result = await executeNLQuery(query);

  return {
    query,
    answer: `Found ${result.total_results} entities matching your query.`,
    data: {
      nodes: result.nodes.map((n) => ({
        name: n.name,
        type: n.type,
        slug: n.slug,
        country: n.country,
      })),
      edges: result.edges.length,
    },
    visualization_hint: result.nodes.length > 10 ? 'graph' : 'list',
    suggested_followups: [
      'Show me the graph for these entities',
      'Which scenes are they part of?',
    ],
  };
}

async function executeAnalysisQuery(
  query: string,
  parsed: ConsoleQuery
): Promise<ConsoleResponse> {
  // Example: "How many hops from my artist to BBC Radio 1?"

  const [from, to] = parsed.entities;
  if (!from || !to) {
    return {
      query,
      answer: 'Please specify two entities to analyze the connection.',
      data: null,
    };
  }

  const degrees = await getDegreesOfSeparation(from, to);

  if (degrees === null) {
    return {
      query,
      answer: `No connection found between ${from} and ${to}.`,
      data: { degrees: null, connected: false },
    };
  }

  return {
    query,
    answer: `${from} is ${degrees} hop${degrees === 1 ? '' : 's'} away from ${to}.`,
    data: { degrees, connected: true },
    suggested_followups: [
      `Show me the path between ${from} and ${to}`,
      `Who connects them?`,
    ],
  };
}

// ============================================================================
// EXAMPLE QUERIES
// ============================================================================

export const EXAMPLE_QUERIES = [
  "What's the shortest path from my artist to NME journalists?",
  'Which scenes are closest to UK alt-R&B?',
  'Which journalists cover music similar to my last release?',
  'Which playlists are within 2 hops of my scene cluster?',
  'Recommend contacts similar to Pitchfork writers',
  'How many degrees of separation to BBC Radio 1?',
  'Find all journalists in London covering electronic music',
  'Show me the graph for Bristol bass scene',
  'Which microgenres are adjacent to UK garage?',
  'Analyze influence paths to major UK radio stations',
];
