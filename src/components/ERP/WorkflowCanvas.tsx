/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import { CheckCircledIcon } from '@radix-ui/react-icons';

import '@xyflow/react/dist/style.css';

// Reusable split node content
const SplitNode: React.FC<NodeProps> = ({ data }) => {
  const label = data.label as string;
  const hasTopHandle = data.hasTopHandle as boolean;
  const hasBottomHandle = data.hasBottomHandle as boolean;
  const disabled = data.disabled as boolean;
  const hasLeftHandle = data.hasLeftHandle as boolean;
  const hasRightHandle = data.hasRightHandle as boolean;

  return (
    <div className='w-full h-full flex flex-col text-[8px] relative'>
      {/* Conditional Handles */}
      {hasTopHandle && (
        <Handle
          type='target'
          position={Position.Top}
          style={{
            background: '#fff',
            borderColor: '#1a192b',
            height: 7,
            width: 7,
          }}
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
          }}
        />
      )}

      {hasLeftHandle && (
        <Handle
          type='target'
          position={Position.Left}
          style={{
            height: 7,
            width: 7,
          }}
        />
      )}

      {hasRightHandle && (
        <Handle
          type='source'
          id='right'
          position={Position.Right}
          style={{
            background: '#1a192b',
            height: 7,
            width: 7,
          }}
        />
      )}

      {/* Header */}
      <div
        className={`px-2 py-[2px] text-center font-medium rounded-t-sm ${
          disabled ? 'bg-gray-300 text-gray-500' : 'bg-gray-800 text-white'
        }`}
      >
        {label}
      </div>
      {/* Body */}
      <div
        className={`flex-1  rounded-b-sm flex items-center justify-between px-2 py-1 ${
          disabled
            ? 'bg-gray-100 border border-gray-300'
            : 'bg-white border border-gray-800'
        }`}
      >
        <div
          className={`w-3/4 h-1 ${
            disabled ? 'bg-gray-300' : 'bg-green-500'
          } rounded`}
        />
        <CheckCircledIcon
          className={`w-3 h-3 ${disabled ? 'text-gray-300' : 'text-green-500'}`}
        />
      </div>
    </div>
  );
};

// Initial vertical workflow nodes
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
      hasRightHandle: true, // enable chaining
      disabled: false,
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
      hasBottomHandle: true, // edge to Batch
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
      hasTopHandle: true, // connects from Product
      disabled: false,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'onboarding',
    target: 'design',
    type: 'default',
    animated: false,
  },
  {
    id: 'e2',
    source: 'design',
    target: 'procurement',
    type: 'default',
    animated: false,
  },
  {
    id: 'e3',
    source: 'procurement',
    target: 'make',
    type: 'default',
    animated: false,
  },
  {
    id: 'e4',
    source: 'make',
    target: 'delivery',
    sourceHandle: 'bottom',
    type: 'default',
    animated: false,
  },
  {
    id: 'e5',
    source: 'make',
    target: 'cpq',
    sourceHandle: 'right',
    type: 'default',
  },
  {
    id: 'e6',
    source: 'cpq',
    target: 'product',
    type: 'default',
  },
  {
    id: 'e7',
    source: 'product',
    target: 'batch',
    type: 'default',
  },
];

export default function WorkflowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | any) => addEdge(params, edges),
    [edges]
  );

  const nodeTypes = {
    splitNode: SplitNode,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      panOnDrag
      zoomOnScroll
      nodesDraggable={false}
      connectionLineType={ConnectionLineType.Straight}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={18}
        size={1}
        color='#cbd5e1'
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
