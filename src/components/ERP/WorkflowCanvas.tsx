/**
 * 🧭 WorkflowCanvas
 *
 * Main canvas rendering the ERP process map using React Flow. Includes static nodes
 * for onboarding, design, procurement, etc., and dynamic branching to CPQ and
 * batch record subflows. Handles progress computation and click navigation for each node.
 */

'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  Node,
  ConnectionLineType,
} from '@xyflow/react';

import SplitNode from './SplitNode';
import { initialNodes, getDynamicEdges } from './workflowConfig';

// 🧠 Track child relationships for progress
const childMap: Record<string, string[]> = {
  make: ['cpq', 'product'],
  product: ['batch'],
};

type WorkflowCanvasProps = {
  setSelectedNode: (node: string | null) => void;
  progressByNodeId: Record<string, number>;
};

export default function WorkflowCanvas({
  setSelectedNode,
  progressByNodeId,
}: WorkflowCanvasProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  const computeProgress = useCallback(
    (id: string): number => {
      const children = childMap[id];
      if (!children || children.length === 0) return progressByNodeId[id] ?? 0;

      const total = children.length;
      const completed = children.filter(
        (childId) => computeProgress(childId) === 100
      ).length;
      return Math.round((completed / total) * 100);
    },
    [progressByNodeId]
  );

  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        progress: computeProgress(node.id),
      },
    }));
  }, [nodes, computeProgress]);

  const enrichedEdges = useMemo(() => {
    return getDynamicEdges(
      enrichedNodes.reduce((acc, node) => {
        acc[node.id] = node.data.progress;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [enrichedNodes]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!node.data?.disabled && node.data?.clickable) {
        setSelectedNode(node.data.label as string);
      }
    },
    [setSelectedNode]
  );

  return (
    <ReactFlow
      nodes={enrichedNodes}
      edges={enrichedEdges}
      nodeTypes={{ splitNode: SplitNode }}
      onNodesChange={onNodesChange}
      fitView
      panOnDrag
      zoomOnScroll
      nodesDraggable={false}
      connectionLineType={ConnectionLineType.Straight}
      onNodeClick={handleNodeClick}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={1}
        color='#cbd5e1'
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
