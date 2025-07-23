'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  useNodesState,
  ConnectionLineType,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

import '@xyflow/react/dist/style.css';

// 🧠 Child relationships for progress tracking
const childMap: Record<string, string[]> = {
  make: ['cpq', 'product'],
  product: ['batch'],
};

const SplitNode: React.FC<NodeProps> = ({ data }) => {
  const label = data.label as string;
  const hasTopHandle = data.hasTopHandle as boolean;
  const hasBottomHandle = data.hasBottomHandle as boolean;
  const hasLeftHandle = data.hasLeftHandle as boolean;
  const hasRightHandle = data.hasRightHandle as boolean;
  const disabled = data.disabled as boolean;
  const clickable = data.clickable as boolean;
  const progress = data.progress as number;

  const isComplete = progress === 100;
  const borderDefault = '#1a192b';

  const groupClass = `w-full h-full flex flex-col text-[8px] relative transition-all duration-150 ${
    disabled
      ? 'cursor-not-allowed'
      : clickable
      ? 'cursor-pointer group transition-shadow duration-150 hover:shadow-[0_10px_6px_rgba(0,0,0,0.2)]'
      : 'cursor-auto'
  }`;

  return (
    <div className={groupClass}>
      {/* Handles */}
      {hasTopHandle && (
        <Handle
          type='target'
          position={Position.Top}
          style={{
            background: '#fff',
            borderColor: disabled ? '#d1d5dc' : borderDefault,
            height: 7,
            width: 7,
            pointerEvents: 'none',
          }}
          className={clickable ? 'group-hover:border-[#374151]' : ''}
        />
      )}
      {hasBottomHandle && (
        <Handle
          type='source'
          id='bottom'
          position={Position.Bottom}
          style={{
            top: '30px',
            height: 7,
            width: 7,
            background: disabled ? '#d1d5dc' : borderDefault,
            pointerEvents: 'none',
          }}
          className={clickable ? 'group-hover:!bg-[#374151]' : ''}
        />
      )}
      {hasLeftHandle && (
        <Handle
          type='target'
          position={Position.Left}
          style={{
            height: 7,
            width: 7,
            background: disabled ? '#d1d5dc' : borderDefault,
            pointerEvents: 'none',
          }}
          className={clickable ? 'group-hover:!bg-[#374151]' : ''}
        />
      )}
      {hasRightHandle && (
        <Handle
          type='source'
          id='right'
          position={Position.Right}
          style={{
            height: 7,
            width: 7,
            background: disabled ? '#d1d5dc' : borderDefault,
            pointerEvents: 'none',
          }}
          className={clickable ? 'group-hover:!bg-[#374151]' : ''}
        />
      )}

      {/* Header */}
      <div
        className={`px-2 py-[2px] text-center font-medium rounded-t-sm transition-colors duration-150 ${
          disabled
            ? 'bg-gray-300 text-gray-500'
            : `bg-cyan-900 text-white ${
                clickable ? 'group-hover:bg-cyan-800' : ''
              }`
        }`}
      >
        {label}
      </div>

      {/* Body */}
      <div
        className={`flex-1 rounded-b-sm flex items-center justify-between px-2 py-1 transition-colors duration-150 ${
          disabled
            ? 'bg-gray-100 border border-gray-300'
            : `bg-white border border-cyan-900 ${
                clickable ? 'group-hover:border-cyan-800' : ''
              }`
        }`}
      >
        <div className='relative w-3/4 h-1 bg-gray-200 rounded overflow-hidden'>
          <div
            className={`absolute h-1 top-0 left-0 rounded transition-all duration-150 ${
              disabled
                ? 'bg-gray-300'
                : isComplete
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${progress}%`, zIndex: 10 }}
          />
        </div>
        {isComplete ? (
          <CheckCircledIcon
            className={`w-3 h-3 ${
              disabled ? 'text-gray-300' : 'text-green-500'
            }`}
          />
        ) : (
          <CrossCircledIcon
            className={`w-3 h-3 ${disabled ? 'text-gray-300' : 'text-red-500'}`}
          />
        )}
      </div>
    </div>
  );
};

const initialNodes: Node[] = [
  {
    id: 'onboarding',
    position: { x: 0, y: 50 },
    type: 'splitNode',
    data: { label: 'Onboarding', hasBottomHandle: true, disabled: true },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'design',
    position: { x: 0, y: 140 },
    type: 'splitNode',
    data: {
      label: 'Design',
      hasTopHandle: true,
      hasBottomHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'procurement',
    position: { x: 0, y: 230 },
    type: 'splitNode',
    data: {
      label: 'Procurement',
      hasTopHandle: true,
      hasBottomHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'make',
    position: { x: 0, y: 320 },
    type: 'splitNode',
    data: {
      label: 'Make',
      hasTopHandle: true,
      hasBottomHandle: true,
      hasRightHandle: true,
      disabled: false,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'delivery',
    position: { x: 0, y: 410 },
    type: 'splitNode',
    data: { label: 'Delivery', hasTopHandle: true, disabled: true },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'cpq',
    position: { x: 150, y: 320 },
    type: 'splitNode',
    data: {
      label: 'CPQ',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: false,
      clickable: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'product',
    position: { x: 300, y: 320 },
    type: 'splitNode',
    data: {
      label: 'Product Creation',
      hasLeftHandle: true,
      hasBottomHandle: true,
      disabled: false,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'batch',
    position: { x: 300, y: 410 },
    type: 'splitNode',
    data: {
      label: 'Batch Records',
      hasTopHandle: true,
      disabled: false,
      clickable: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
];

const nodeMap = Object.fromEntries(initialNodes.map((node) => [node.id, node]));

const getDynamicEdges = (completion: Record<string, number>): Edge[] => {
  return [
    { source: 'onboarding', target: 'design' },
    { source: 'design', target: 'procurement' },
    { source: 'procurement', target: 'make' },
    { source: 'make', target: 'delivery', sourceHandle: 'bottom' },
    { source: 'make', target: 'cpq', sourceHandle: 'right' },
    { source: 'cpq', target: 'product' },
    { source: 'product', target: 'batch' },
  ].map((edge, index) => {
    const sourceNode = nodeMap[edge.source];
    const targetNode = nodeMap[edge.target];

    const sourceDisabled = sourceNode?.data?.disabled;
    const targetDisabled = targetNode?.data?.disabled;
    const sourceProgress = completion[edge.source] ?? 0;

    const isDisabled = sourceDisabled || targetDisabled;
    const shouldAnimate = !isDisabled && sourceProgress < 100;

    return {
      id: `e${index + 1}`,
      ...edge,
      type: 'default',
      animated: shouldAnimate,
      style: {
        stroke: isDisabled ? '#d1d5db' : shouldAnimate ? '#78b3de' : '#1a192b',
        pointerEvents: 'none',
      },
    };
  });
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

  // Recursive progress computation
  const computeProgress = useCallback(
    (id: string): number => {
      const children = childMap[id];
      if (!children || children.length === 0) {
        return progressByNodeId[id] ?? 0;
      }
      const total = children.length;
      const completed = children.filter(
        (childId) => computeProgress(childId) === 100
      ).length;
      return Math.round((completed / total) * 100);
    },
    [progressByNodeId]
  );

  // Enrich node data with computed progress
  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => {
      const progress = computeProgress(node.id);
      return {
        ...node,
        data: {
          ...node.data,
          progress,
        },
      };
    });
  }, [nodes, computeProgress]);

  const enrichedEdges = useMemo(() => {
    return getDynamicEdges(
      enrichedNodes.reduce((acc, node) => {
        acc[node.id] = node.data.progress;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [enrichedNodes]);

  const nodeTypes = {
    splitNode: SplitNode,
  };

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
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      fitView
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
