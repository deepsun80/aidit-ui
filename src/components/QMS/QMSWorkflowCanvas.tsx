/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
  Node,
} from '@xyflow/react';

import { styledNodes, getDynamicEdges } from './workflowConfig';
import SplitNode from '@/components/common/SplitNode';

const allowedPages = [
  'customer-audit',
  'supplier-audit',
  'internal-audit',
  'erp',
  'qms',
] as const;

type PageType = (typeof allowedPages)[number];

type QMSWorkflowCanvasProps = {
  onNodeClick: React.Dispatch<
    React.SetStateAction<
      'customer-audit' | 'supplier-audit' | 'internal-audit' | 'erp' | 'qms'
    >
  >;
};

export default function QMSWorkflowCanvas({
  onNodeClick,
}: QMSWorkflowCanvasProps) {
  const [nodes, , onNodesChange] = useNodesState(styledNodes);

  // ✅ Explicitly type edges to resolve TS error
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 🧠 Build progress map for dynamic edge logic
  const completion = useMemo<Record<string, number>>(() => {
    return Object.fromEntries(
      nodes.map((n) => [
        n.id,
        typeof n.data?.progress === 'number' ? n.data.progress : 0,
      ])
    );
  }, [nodes]);

  // 🔁 Update edges when node progress updates
  useEffect(() => {
    const newEdges = getDynamicEdges(completion);
    setEdges(newEdges);
  }, [completion, setEdges]);

  const handleNodeClick = useCallback(
    (_: any, node: Node) => {
      if (allowedPages.includes(node.id as PageType)) {
        onNodeClick(node.id as PageType);
      }
    },
    [onNodeClick]
  );

  const nodeTypes = useMemo(
    () => ({
      splitNode: SplitNode,
    }),
    []
  );

  return (
    <div className='w-full h-[80vh] text-gray-800 bg-gray-50 rounded-sm border border-gray-300 overflow-hidden shadow-md'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        // fitView
        // fitViewOptions={{ padding: 0, maxZoom: 1 }}
        defaultViewport={{ x: 200, y: 10, zoom: 1 }}
        panOnDrag
        zoomOnScroll
        nodesDraggable={false}
        connectionLineType={ConnectionLineType.Straight}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={0.95}
          color='LightSlateGrey'
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
