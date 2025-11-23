/**
 * Flow Store - Database operations for automation flows, nodes, and edges
 * All database access for MAL goes through this module
 */

import type {
  AutomationFlow,
  AutomationNode,
  AutomationEdge,
  AutomationExecution,
  AutomationExecutionStep,
  CreateFlowData,
  UpdateFlowData,
  CreateNodeData,
  CreateEdgeData,
} from './types';
import { AutomationError } from './utils/errors';
import { logger } from './utils/logger';

// Note: This will use @total-audio/db's Supabase client when integrated
// For now, we define the interface
interface SupabaseClient {
  from(table: string): any;
}

let supabaseClient: SupabaseClient | null = null;

export function initFlowStore(client: SupabaseClient) {
  supabaseClient = client;
}

function getClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new AutomationError('FlowStore not initialized. Call initFlowStore() first.');
  }
  return supabaseClient;
}

// ============================================================================
// FLOWS
// ============================================================================

export async function getFlow(flowId: string): Promise<AutomationFlow | null> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_flows')
    .select('*')
    .eq('id', flowId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new AutomationError(`Failed to get flow: ${error.message}`, 'DB_ERROR', error);
  }

  return mapFlowFromDB(data);
}

export async function listFlowsForUser(userId: string): Promise<AutomationFlow[]> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_flows')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AutomationError(`Failed to list flows: ${error.message}`, 'DB_ERROR', error);
  }

  return (data || []).map(mapFlowFromDB);
}

export async function createFlow(flowData: CreateFlowData): Promise<AutomationFlow> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_flows')
    .insert({
      user_id: flowData.userId,
      workspace_id: flowData.workspaceId || null,
      name: flowData.name,
      description: flowData.description || null,
      trigger_type: flowData.triggerType,
      is_active: false,
    })
    .select()
    .single();

  if (error) {
    throw new AutomationError(`Failed to create flow: ${error.message}`, 'DB_ERROR', error);
  }

  logger.info(`Created flow: ${data.id}`);
  return mapFlowFromDB(data);
}

export async function updateFlow(
  flowId: string,
  updates: UpdateFlowData
): Promise<AutomationFlow> {
  const client = getClient();
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

  const { data, error } = await client
    .from('automation_flows')
    .update(updateData)
    .eq('id', flowId)
    .select()
    .single();

  if (error) {
    throw new AutomationError(`Failed to update flow: ${error.message}`, 'DB_ERROR', error);
  }

  logger.info(`Updated flow: ${flowId}`);
  return mapFlowFromDB(data);
}

export async function deleteFlow(flowId: string): Promise<void> {
  const client = getClient();
  const { error } = await client.from('automation_flows').delete().eq('id', flowId);

  if (error) {
    throw new AutomationError(`Failed to delete flow: ${error.message}`, 'DB_ERROR', error);
  }

  logger.info(`Deleted flow: ${flowId}`);
}

// ============================================================================
// NODES
// ============================================================================

export async function getNodesForFlow(flowId: string): Promise<AutomationNode[]> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_nodes')
    .select('*')
    .eq('flow_id', flowId);

  if (error) {
    throw new AutomationError(
      `Failed to get nodes for flow: ${error.message}`,
      'DB_ERROR',
      error
    );
  }

  return (data || []).map(mapNodeFromDB);
}

export async function getNode(nodeId: string): Promise<AutomationNode | null> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_nodes')
    .select('*')
    .eq('id', nodeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new AutomationError(`Failed to get node: ${error.message}`, 'DB_ERROR', error);
  }

  return mapNodeFromDB(data);
}

export async function saveNode(nodeData: CreateNodeData): Promise<AutomationNode> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_nodes')
    .insert({
      flow_id: nodeData.flowId,
      type: nodeData.type,
      subtype: nodeData.subtype,
      config: nodeData.config,
      position: nodeData.position || null,
    })
    .select()
    .single();

  if (error) {
    throw new AutomationError(`Failed to save node: ${error.message}`, 'DB_ERROR', error);
  }

  return mapNodeFromDB(data);
}

export async function updateNode(
  nodeId: string,
  updates: Partial<CreateNodeData>
): Promise<AutomationNode> {
  const client = getClient();
  const updateData: any = {};

  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.subtype !== undefined) updateData.subtype = updates.subtype;
  if (updates.config !== undefined) updateData.config = updates.config;
  if (updates.position !== undefined) updateData.position = updates.position;

  const { data, error } = await client
    .from('automation_nodes')
    .update(updateData)
    .eq('id', nodeId)
    .select()
    .single();

  if (error) {
    throw new AutomationError(`Failed to update node: ${error.message}`, 'DB_ERROR', error);
  }

  return mapNodeFromDB(data);
}

export async function deleteNode(nodeId: string): Promise<void> {
  const client = getClient();
  const { error } = await client.from('automation_nodes').delete().eq('id', nodeId);

  if (error) {
    throw new AutomationError(`Failed to delete node: ${error.message}`, 'DB_ERROR', error);
  }
}

// ============================================================================
// EDGES
// ============================================================================

export async function getEdgesForFlow(flowId: string): Promise<AutomationEdge[]> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_edges')
    .select('*')
    .eq('flow_id', flowId);

  if (error) {
    throw new AutomationError(
      `Failed to get edges for flow: ${error.message}`,
      'DB_ERROR',
      error
    );
  }

  return (data || []).map(mapEdgeFromDB);
}

export async function saveEdge(edgeData: CreateEdgeData): Promise<AutomationEdge> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_edges')
    .insert({
      flow_id: edgeData.flowId,
      source_node_id: edgeData.sourceNodeId,
      target_node_id: edgeData.targetNodeId,
      condition_label: edgeData.conditionLabel || null,
    })
    .select()
    .single();

  if (error) {
    throw new AutomationError(`Failed to save edge: ${error.message}`, 'DB_ERROR', error);
  }

  return mapEdgeFromDB(data);
}

export async function deleteEdge(edgeId: string): Promise<void> {
  const client = getClient();
  const { error } = await client.from('automation_edges').delete().eq('id', edgeId);

  if (error) {
    throw new AutomationError(`Failed to delete edge: ${error.message}`, 'DB_ERROR', error);
  }
}

// ============================================================================
// EXECUTIONS
// ============================================================================

export async function createExecution(
  flowId: string,
  triggerContext: any
): Promise<AutomationExecution> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_executions')
    .insert({
      flow_id: flowId,
      trigger_context: triggerContext,
      status: 'running',
    })
    .select()
    .single();

  if (error) {
    throw new AutomationError(`Failed to create execution: ${error.message}`, 'DB_ERROR', error);
  }

  return mapExecutionFromDB(data);
}

export async function updateExecutionStatus(
  executionId: string,
  status: 'running' | 'succeeded' | 'failed' | 'partial',
  errorMessage?: string
): Promise<void> {
  const client = getClient();
  const updateData: any = {
    status,
    finished_at: new Date().toISOString(),
  };

  if (errorMessage) {
    updateData.error = errorMessage;
  }

  const { error } = await client
    .from('automation_executions')
    .update(updateData)
    .eq('id', executionId);

  if (error) {
    throw new AutomationError(
      `Failed to update execution status: ${error.message}`,
      'DB_ERROR',
      error
    );
  }
}

export async function getExecution(executionId: string): Promise<AutomationExecution | null> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_executions')
    .select('*')
    .eq('id', executionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new AutomationError(`Failed to get execution: ${error.message}`, 'DB_ERROR', error);
  }

  return mapExecutionFromDB(data);
}

export async function listExecutionsForFlow(
  flowId: string,
  limit: number = 50
): Promise<AutomationExecution[]> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_executions')
    .select('*')
    .eq('flow_id', flowId)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new AutomationError(
      `Failed to list executions: ${error.message}`,
      'DB_ERROR',
      error
    );
  }

  return (data || []).map(mapExecutionFromDB);
}

// ============================================================================
// EXECUTION STEPS
// ============================================================================

export async function createExecutionStep(
  executionId: string,
  nodeId: string
): Promise<AutomationExecutionStep> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_execution_steps')
    .insert({
      execution_id: executionId,
      node_id: nodeId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw new AutomationError(
      `Failed to create execution step: ${error.message}`,
      'DB_ERROR',
      error
    );
  }

  return mapExecutionStepFromDB(data);
}

export async function updateExecutionStep(
  stepId: string,
  updates: {
    status?: 'pending' | 'running' | 'succeeded' | 'failed' | 'skipped';
    input?: any;
    output?: any;
    error?: string;
    startedAt?: Date;
    finishedAt?: Date;
  }
): Promise<void> {
  const client = getClient();
  const updateData: any = {};

  if (updates.status) updateData.status = updates.status;
  if (updates.input) updateData.input = updates.input;
  if (updates.output) updateData.output = updates.output;
  if (updates.error) updateData.error = updates.error;
  if (updates.startedAt) updateData.started_at = updates.startedAt.toISOString();
  if (updates.finishedAt) updateData.finished_at = updates.finishedAt.toISOString();

  const { error } = await client
    .from('automation_execution_steps')
    .update(updateData)
    .eq('id', stepId);

  if (error) {
    throw new AutomationError(
      `Failed to update execution step: ${error.message}`,
      'DB_ERROR',
      error
    );
  }
}

export async function getStepsForExecution(
  executionId: string
): Promise<AutomationExecutionStep[]> {
  const client = getClient();
  const { data, error } = await client
    .from('automation_execution_steps')
    .select('*')
    .eq('execution_id', executionId)
    .order('started_at', { ascending: true });

  if (error) {
    throw new AutomationError(`Failed to get execution steps: ${error.message}`, 'DB_ERROR', error);
  }

  return (data || []).map(mapExecutionStepFromDB);
}

// ============================================================================
// MAPPERS (DB snake_case to TypeScript camelCase)
// ============================================================================

function mapFlowFromDB(data: any): AutomationFlow {
  return {
    id: data.id,
    userId: data.user_id,
    workspaceId: data.workspace_id,
    name: data.name,
    description: data.description,
    isActive: data.is_active,
    triggerType: data.trigger_type,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function mapNodeFromDB(data: any): AutomationNode {
  return {
    id: data.id,
    flowId: data.flow_id,
    type: data.type,
    subtype: data.subtype,
    config: data.config,
    position: data.position,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function mapEdgeFromDB(data: any): AutomationEdge {
  return {
    id: data.id,
    flowId: data.flow_id,
    sourceNodeId: data.source_node_id,
    targetNodeId: data.target_node_id,
    conditionLabel: data.condition_label,
    createdAt: new Date(data.created_at),
  };
}

function mapExecutionFromDB(data: any): AutomationExecution {
  return {
    id: data.id,
    flowId: data.flow_id,
    triggerContext: data.trigger_context,
    status: data.status,
    startedAt: new Date(data.started_at),
    finishedAt: data.finished_at ? new Date(data.finished_at) : null,
    error: data.error,
  };
}

function mapExecutionStepFromDB(data: any): AutomationExecutionStep {
  return {
    id: data.id,
    executionId: data.execution_id,
    nodeId: data.node_id,
    status: data.status,
    input: data.input,
    output: data.output,
    error: data.error,
    startedAt: data.started_at ? new Date(data.started_at) : null,
    finishedAt: data.finished_at ? new Date(data.finished_at) : null,
  };
}
