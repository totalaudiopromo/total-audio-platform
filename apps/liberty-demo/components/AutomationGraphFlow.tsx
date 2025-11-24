'use client'

import React, { useCallback, useMemo, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  NodeProps,
  ReactFlowProvider,
  useReactFlow,
  Connection,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AutomationWorkflow, AutomationNode } from '@/lib/types';
import { Zap, Filter, Play, MoreHorizontal, Activity, Save, History, PlayCircle, Plus } from 'lucide-react';
import AutomationNodeDrawer from './AutomationNodeDrawer';
import { getNodeLane, getLaneConfig, AUTOMATION_LANES, type AutomationLaneType } from '@/lib/automationLanes';

interface AutomationGraphFlowProps {
  workflow: AutomationWorkflow;
}

interface CustomNodeData {
  label: string;
  description: string;
  type: 'trigger' | 'filter' | 'action';
  kind: string;
  status?: 'active' | 'idle' | 'error' | 'success';
  stats?: { executions: number; successRate: number };
  laneType?: AutomationLaneType;
}

// Custom node component with Cinematic styling
const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-tap-accent" />;
      case 'filter':
        return <Filter className="w-4 h-4 text-amber-600" />;
      case 'action':
        return <Play className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'active': return 'bg-tap-accent';
      case 'success': return 'bg-tap-good';
      case 'error': return 'bg-red-500';
      default: return 'bg-tap-muted';
    }
  };

  const getBorderColor = () => {
    if (selected) return 'border-tap-accent ring-1 ring-tap-accent';
    
    // Use lane color if available, otherwise fall back to type-based colors
    if (data.laneType) {
      const laneConfig = getLaneConfig(data.laneType);
      return `hover:border-[${laneConfig.color}]`;
    }
    
    switch (data.type) {
      case 'trigger': return 'border-tap-accent/60 hover:border-tap-accent';
      case 'filter': return 'border-amber-500/60 hover:border-amber-500';
      case 'action': return 'border-slate-400/60 hover:border-slate-500';
      default: return 'border-tap-line';
    }
  };

  return (
    <div
      className={`
        relative group
        rounded-md bg-white p-5 shadow-sm
        transition-all duration-300 ease-out
        min-w-[240px] max-w-[280px]
        border-2
        ${getBorderColor()}
        ${selected ? 'shadow-md scale-[1.02]' : 'hover:shadow-md hover:scale-[1.01]'}
      `}
    >
      {/* Status Indicator */}
      {data.status === 'active' && (
        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tap-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-tap-accent"></span>
        </span>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md bg-tap-bg border border-tap-line/50`}>
            {getIcon()}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-tap-muted">
            {data.type}
          </div>
        </div>
        {data.stats && (
          <div className="flex items-center gap-1.5 text-[10px] text-tap-muted font-mono bg-tap-bg px-1.5 py-0.5 rounded-full border border-tap-line/50">
            <Activity className="w-3 h-3" />
            {data.stats.successRate}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="font-heading font-medium text-lg text-tap-text leading-tight">{data.label}</div>
        <div className="font-sans text-xs text-tap-muted leading-relaxed line-clamp-2">
          {data.description}
        </div>
      </div>

      {/* Handles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-tap-line rounded-full hover:border-tap-accent transition-colors" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-tap-line rounded-full hover:border-tap-accent transition-colors" />

      {/* Hover Action Hint */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <MoreHorizontal className="w-4 h-4 text-tap-muted" />
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const Flow: React.FC<AutomationGraphFlowProps> = ({ workflow }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<AutomationNode | null>(null);
  const { project } = useReactFlow();

  // Group nodes by lane and calculate positions
  const { nodesByLane, laneOrder } = useMemo(() => {
    const grouped: Record<AutomationLaneType, AutomationNode[]> = {
      radio: [],
      press: [],
      editorial: [],
      spotify: [],
      general: []
    };

    workflow.nodes.forEach(node => {
      const lane = getNodeLane(node.kind);
      grouped[lane].push(node);
    });

    // Determine lane order (only show lanes with nodes)
    const order: AutomationLaneType[] = AUTOMATION_LANES
      .map(lane => lane.type)
      .filter(laneType => grouped[laneType].length > 0);

    return { nodesByLane: grouped, laneOrder: order };
  }, [workflow.nodes]);

  // Transform workflow nodes into React Flow nodes with lane-based positioning
  const initialNodes: Node<CustomNodeData>[] = useMemo(() => {
    const nodes: Node<CustomNodeData>[] = [];
    const LANE_WIDTH = 280;
    const LANE_HEIGHT = 200;
    const LANE_HEADER_HEIGHT = 50;
    const LANE_SPACING = 40;
    const NODE_SPACING = 60;

    let yOffset = 80; // Start below top panel

    laneOrder.forEach((laneType, laneIndex) => {
      const laneNodes = nodesByLane[laneType];
      const laneConfig = getLaneConfig(laneType);
      
      // Position nodes horizontally within the lane
      laneNodes.forEach((node, nodeIndex) => {
        const xOffset = 180 + (nodeIndex * (LANE_WIDTH + NODE_SPACING));
        
        nodes.push({
          id: node.id,
          type: 'custom',
          position: {
            x: xOffset,
            y: yOffset + LANE_HEADER_HEIGHT
          },
          data: {
            label: node.label,
            description: node.description || '',
            type: node.type,
            kind: node.kind,
            status: node.status,
            stats: node.stats,
            laneType: laneType, // Add lane info for styling
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
      });

      // Move to next lane (only if there are nodes in this lane)
      if (laneNodes.length > 0) {
        yOffset += LANE_HEIGHT + LANE_SPACING;
      }
    });

    return nodes;
  }, [workflow.nodes, nodesByLane, laneOrder]);

  // Transform workflow edges into React Flow edges with animations
  const initialEdges: Edge[] = useMemo(() => {
    return workflow.edges.map((edge) => ({
      id: `e-${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      label: edge.conditionLabel,
      labelStyle: {
        fontSize: '11px',
        fontWeight: 500,
        fill: '#64748b', // Slate-500
        fontFamily: 'Inter, sans-serif',
        ...edge.labelStyle,
      },
      labelBgStyle: {
        fill: '#F8FAFC', // Slate-50
        fillOpacity: 1,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      animated: edge.animated,
      style: {
        stroke: '#94a3b8', // Slate-400
        strokeWidth: 2.5,
        strokeOpacity: 0.8,
        strokeDasharray: edge.conditionLabel ? '5,5' : undefined,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#94a3b8', // Slate-400
      },
    }));
  }, [workflow.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2.5 }
    }, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const typeData = event.dataTransfer.getData('application/reactflow');

      if (typeof typeData === 'undefined' || !typeData || !reactFlowBounds) {
        return;
      }

      const data = JSON.parse(typeData);
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${data.type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: data.label,
          description: data.description,
          type: data.type,
          kind: data.kind
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Find the original node data from the workflow to pass to the drawer
    // Or construct it from the React Flow node data
    const nodeData: AutomationNode = {
      id: node.id,
      label: node.data.label,
      description: node.data.description,
      type: node.data.type,
      kind: node.data.kind,
      status: node.data.status,
      stats: node.data.stats
    };
    setSelectedNode(nodeData);
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-tap-line/30 bg-[#F5F4EF] shadow-inner" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Background grid pattern */}
        <Background
          color="#E7E4DB"
          gap={24}
          size={1}
        />

        {/* Lane Headers */}
        <Panel position="top-left" className="w-[160px]">
          <div className="space-y-[40px] mt-20">
            {laneOrder.map((laneType) => {
              const laneConfig = getLaneConfig(laneType);
              const nodeCount = nodesByLane[laneType].length;
              return (
                <div
                  key={laneType}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: laneConfig.bgColor,
                    borderColor: laneConfig.borderColor,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: laneConfig.color }}
                  />
                  <div className="flex-1">
                    <div className="font-heading font-semibold text-sm text-[#111]" style={{ color: laneConfig.color }}>
                      {laneConfig.label}
                    </div>
                    <div className="liberty-metadata text-[10px]">
                      {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Toolbar Panel */}
        <Panel position="top-right" className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-tap-line rounded-md shadow-sm text-xs font-medium text-tap-text hover:bg-tap-bg transition-colors">
            <History className="w-3.5 h-3.5 text-tap-muted" />
            History
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-tap-line rounded-md shadow-sm text-xs font-medium text-tap-text hover:bg-tap-bg transition-colors">
            <Save className="w-3.5 h-3.5 text-tap-muted" />
            Save
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-tap-accent text-white rounded-md shadow-sm text-xs font-medium hover:bg-tap-accent/90 transition-colors">
            <PlayCircle className="w-3.5 h-3.5" />
            Test Run
          </button>
        </Panel>

        {/* Zoom and fit controls */}
        <Controls
          className="bg-white border border-tap-line rounded-lg shadow-sm !left-4 !bottom-4"
          showInteractive={false}
          position="bottom-left"
        />

        {/* Mini-map */}
        <MiniMap
          nodeColor={(node) => {
            const n = node as Node<CustomNodeData>;
            switch (n.data.type) {
              case 'trigger': return '#3AA9BE';
              case 'filter': return '#EAB308';
              case 'action': return '#0E7C45';
              default: return '#6B6964';
            }
          }}
          className="!bg-white/50 !border !border-tap-line !rounded-lg !shadow-sm !right-4 !bottom-4"
          maskColor="rgba(245, 244, 239, 0.6)"
        />
      </ReactFlow>

      {/* Detail Drawer */}
      {selectedNode && (
        <AutomationNodeDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};

const AutomationGraphFlow: React.FC<AutomationGraphFlowProps> = (props) => (
  <ReactFlowProvider>
    <Flow {...props} />
  </ReactFlowProvider>
);

export default AutomationGraphFlow;
