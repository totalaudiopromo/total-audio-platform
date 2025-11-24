/**
 * Graph Model - Workflow graph representation and validation
 * Handles graph traversal and cycle detection
 */

import type {
  AutomationNode,
  AutomationEdge,
  WorkflowGraph,
  GraphValidationResult,
} from './types';
import { getNodesForFlow, getEdgesForFlow } from './flowStore';
import { FlowValidationError } from './utils/errors';
import { logger } from './utils/logger';

/**
 * Build a workflow graph from database
 */
export async function buildGraph(flowId: string): Promise<WorkflowGraph> {
  const nodes = await getNodesForFlow(flowId);
  const edges = await getEdgesForFlow(flowId);

  const nodeMap = new Map<string, AutomationNode>();
  let triggerNode: AutomationNode | undefined;

  for (const node of nodes) {
    nodeMap.set(node.id, node);
    if (node.type === 'trigger') {
      triggerNode = node;
    }
  }

  return {
    nodes: nodeMap,
    edges,
    triggerNode,
  };
}

/**
 * Validate workflow graph structure
 */
export function validateGraph(graph: WorkflowGraph): GraphValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Must have exactly one trigger node
  const triggerNodes = Array.from(graph.nodes.values()).filter((n) => n.type === 'trigger');
  if (triggerNodes.length === 0) {
    errors.push('Flow must have exactly one trigger node');
  } else if (triggerNodes.length > 1) {
    errors.push(`Flow has ${triggerNodes.length} trigger nodes, but must have exactly one`);
  }

  // Check for unreachable nodes
  if (graph.triggerNode) {
    const reachable = getReachableNodes(graph.triggerNode.id, graph);
    const allNodeIds = Array.from(graph.nodes.keys());
    const unreachable = allNodeIds.filter((id) => !reachable.has(id));

    if (unreachable.length > 0) {
      warnings.push(`${unreachable.length} node(s) are unreachable from trigger`);
    }
  }

  // Check for cycles (warn, but don't error - cycles may be intentional with guards)
  const cycles = detectCycles(graph);
  if (cycles.length > 0) {
    warnings.push(`Detected ${cycles.length} cycle(s) in workflow - ensure proper guards exist`);
  }

  // Check for dead-end action nodes (no outgoing edges, which is often fine)
  const nodesWithNoOutgoing = Array.from(graph.nodes.values()).filter((node) => {
    return !graph.edges.some((edge) => edge.sourceNodeId === node.id);
  });

  if (nodesWithNoOutgoing.length > 0 && nodesWithNoOutgoing.length !== 1) {
    warnings.push(
      `${nodesWithNoOutgoing.length} nodes have no outgoing edges (may be intentional)`
    );
  }

  // Validate all edges connect valid nodes
  for (const edge of graph.edges) {
    if (!graph.nodes.has(edge.sourceNodeId)) {
      errors.push(`Edge ${edge.id} references non-existent source node ${edge.sourceNodeId}`);
    }
    if (!graph.nodes.has(edge.targetNodeId)) {
      errors.push(`Edge ${edge.id} references non-existent target node ${edge.targetNodeId}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get nodes reachable from a starting node
 */
export function getReachableNodes(
  startNodeId: string,
  graph: WorkflowGraph
): Set<string> {
  const visited = new Set<string>();
  const queue = [startNodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;

    visited.add(currentId);

    // Find all outgoing edges
    const outgoingEdges = graph.edges.filter((e) => e.sourceNodeId === currentId);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.targetNodeId)) {
        queue.push(edge.targetNodeId);
      }
    }
  }

  return visited;
}

/**
 * Get next nodes to execute based on current node and evaluation context
 */
export function getNextNodes(
  nodeId: string,
  evaluationContext: { outcome?: string; conditionResult?: 'true' | 'false' | 'skip' },
  graph: WorkflowGraph
): AutomationNode[] {
  const currentNode = graph.nodes.get(nodeId);
  if (!currentNode) {
    logger.warn(`getNextNodes: Node ${nodeId} not found in graph`);
    return [];
  }

  const outgoingEdges = graph.edges.filter((e) => e.sourceNodeId === nodeId);

  // If current node is a condition, filter by outcome
  if (currentNode.type === 'condition' && evaluationContext.conditionResult) {
    const outcome = evaluationContext.conditionResult;
    const matchingEdges = outgoingEdges.filter(
      (e) => e.conditionLabel === outcome || e.conditionLabel === null
    );

    // Prefer edges with explicit labels
    const labeledEdges = matchingEdges.filter((e) => e.conditionLabel !== null);
    const edgesToFollow = labeledEdges.length > 0 ? labeledEdges : matchingEdges;

    return edgesToFollow
      .map((e) => graph.nodes.get(e.targetNodeId))
      .filter((n): n is AutomationNode => n !== undefined);
  }

  // For triggers and actions, follow all outgoing edges
  return outgoingEdges
    .map((e) => graph.nodes.get(e.targetNodeId))
    .filter((n): n is AutomationNode => n !== undefined);
}

/**
 * Detect cycles in the graph using DFS
 * Returns array of cycle descriptions
 */
export function detectCycles(graph: WorkflowGraph): string[][] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(nodeId: string, path: string[]): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const outgoingEdges = graph.edges.filter((e) => e.sourceNodeId === nodeId);

    for (const edge of outgoingEdges) {
      const targetId = edge.targetNodeId;

      if (!visited.has(targetId)) {
        dfs(targetId, [...path]);
      } else if (recursionStack.has(targetId)) {
        // Found a cycle
        const cycleStart = path.indexOf(targetId);
        const cycle = path.slice(cycleStart);
        cycle.push(targetId); // Complete the cycle
        cycles.push(cycle);
      }
    }

    recursionStack.delete(nodeId);
  }

  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return cycles;
}

/**
 * Get topologically sorted nodes (for execution order planning)
 * Returns null if graph has cycles
 */
export function topologicalSort(graph: WorkflowGraph): string[] | null {
  const inDegree = new Map<string, number>();
  const sorted: string[] = [];

  // Initialize in-degrees
  for (const nodeId of graph.nodes.keys()) {
    inDegree.set(nodeId, 0);
  }

  // Calculate in-degrees
  for (const edge of graph.edges) {
    inDegree.set(edge.targetNodeId, (inDegree.get(edge.targetNodeId) || 0) + 1);
  }

  // Queue nodes with in-degree 0
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // Process queue
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    sorted.push(nodeId);

    // Reduce in-degree of neighbors
    const outgoingEdges = graph.edges.filter((e) => e.sourceNodeId === nodeId);
    for (const edge of outgoingEdges) {
      const targetId = edge.targetNodeId;
      const newDegree = (inDegree.get(targetId) || 0) - 1;
      inDegree.set(targetId, newDegree);

      if (newDegree === 0) {
        queue.push(targetId);
      }
    }
  }

  // If not all nodes are sorted, there's a cycle
  if (sorted.length !== graph.nodes.size) {
    return null;
  }

  return sorted;
}

/**
 * Get all paths from trigger to a target node
 */
export function findPathsToNode(
  targetNodeId: string,
  graph: WorkflowGraph
): string[][] {
  if (!graph.triggerNode) {
    return [];
  }

  const paths: string[][] = [];

  function dfs(currentId: string, path: string[], visited: Set<string>): void {
    if (currentId === targetNodeId) {
      paths.push([...path, currentId]);
      return;
    }

    if (visited.has(currentId)) {
      return; // Avoid infinite loops
    }

    visited.add(currentId);
    path.push(currentId);

    const outgoingEdges = graph.edges.filter((e) => e.sourceNodeId === currentId);
    for (const edge of outgoingEdges) {
      dfs(edge.targetNodeId, [...path], new Set(visited));
    }
  }

  dfs(graph.triggerNode.id, [], new Set());
  return paths;
}

/**
 * Validate and return graph, throwing if invalid
 */
export async function validateAndBuildGraph(flowId: string): Promise<WorkflowGraph> {
  const graph = await buildGraph(flowId);
  const validation = validateGraph(graph);

  if (!validation.isValid) {
    throw new FlowValidationError(
      `Flow ${flowId} validation failed: ${validation.errors.join(', ')}`,
      { errors: validation.errors, warnings: validation.warnings }
    );
  }

  if (validation.warnings.length > 0) {
    logger.warn(`Flow ${flowId} validation warnings:`, validation.warnings);
  }

  return graph;
}
