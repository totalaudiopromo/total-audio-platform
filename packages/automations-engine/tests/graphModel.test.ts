/**
 * Graph Model Tests
 */

import { validateGraph, detectCycles, topologicalSort } from '../src/graphModel';
import type { WorkflowGraph, AutomationNode } from '../src/types';

describe('Graph Model', () => {
  describe('validateGraph', () => {
    it('should require exactly one trigger node', () => {
      const graph: WorkflowGraph = {
        nodes: new Map([
          [
            '1',
            {
              id: '1',
              flowId: 'flow1',
              type: 'action',
              subtype: 'send_email_campaign',
              config: {},
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        ]),
        edges: [],
      };

      const result = validateGraph(graph);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Flow must have exactly one trigger node');
    });

    it('should pass validation for valid graph', () => {
      const triggerNode: AutomationNode = {
        id: '1',
        flowId: 'flow1',
        type: 'trigger',
        subtype: 'email_open',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const graph: WorkflowGraph = {
        nodes: new Map([['1', triggerNode]]),
        edges: [],
        triggerNode,
      };

      const result = validateGraph(graph);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('detectCycles', () => {
    it('should detect simple cycles', () => {
      const node1: AutomationNode = {
        id: '1',
        flowId: 'flow1',
        type: 'trigger',
        subtype: 'email_open',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const node2: AutomationNode = {
        id: '2',
        flowId: 'flow1',
        type: 'action',
        subtype: 'send_email_campaign',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const graph: WorkflowGraph = {
        nodes: new Map([
          ['1', node1],
          ['2', node2],
        ]),
        edges: [
          {
            id: 'e1',
            flowId: 'flow1',
            sourceNodeId: '1',
            targetNodeId: '2',
            createdAt: new Date(),
          },
          {
            id: 'e2',
            flowId: 'flow1',
            sourceNodeId: '2',
            targetNodeId: '1',
            createdAt: new Date(),
          },
        ],
        triggerNode: node1,
      };

      const cycles = detectCycles(graph);
      expect(cycles.length).toBeGreaterThan(0);
    });
  });

  describe('topologicalSort', () => {
    it('should return null for graphs with cycles', () => {
      const node1: AutomationNode = {
        id: '1',
        flowId: 'flow1',
        type: 'trigger',
        subtype: 'email_open',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const node2: AutomationNode = {
        id: '2',
        flowId: 'flow1',
        type: 'action',
        subtype: 'send_email_campaign',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const graph: WorkflowGraph = {
        nodes: new Map([
          ['1', node1],
          ['2', node2],
        ]),
        edges: [
          {
            id: 'e1',
            flowId: 'flow1',
            sourceNodeId: '1',
            targetNodeId: '2',
            createdAt: new Date(),
          },
          {
            id: 'e2',
            flowId: 'flow1',
            sourceNodeId: '2',
            targetNodeId: '1',
            createdAt: new Date(),
          },
        ],
        triggerNode: node1,
      };

      const result = topologicalSort(graph);
      expect(result).toBeNull();
    });

    it('should return sorted nodes for acyclic graph', () => {
      const node1: AutomationNode = {
        id: '1',
        flowId: 'flow1',
        type: 'trigger',
        subtype: 'email_open',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const node2: AutomationNode = {
        id: '2',
        flowId: 'flow1',
        type: 'action',
        subtype: 'send_email_campaign',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const graph: WorkflowGraph = {
        nodes: new Map([
          ['1', node1],
          ['2', node2],
        ]),
        edges: [
          {
            id: 'e1',
            flowId: 'flow1',
            sourceNodeId: '1',
            targetNodeId: '2',
            createdAt: new Date(),
          },
        ],
        triggerNode: node1,
      };

      const result = topologicalSort(graph);
      expect(result).toEqual(['1', '2']);
    });
  });
});
