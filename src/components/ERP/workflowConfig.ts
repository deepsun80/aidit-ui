/**
 * ⚙️ workflowConfig
 *
 * Central configuration for the ERP React Flow diagram. Contains:
 * - `initialNodes`: default layout and settings for each process node
 * - `nodeMap`: quick lookup map of node IDs to config
 * - `getDynamicEdges()`: generates animated edges based on progress/completion state
 * - `childMap`: defines dependency relationships for cascading progress updates
 */

import { Edge, Node } from '@xyflow/react';

export const initialNodes: Node[] = [
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

export const nodeMap = Object.fromEntries(
  initialNodes.map((node) => [node.id, node])
);

export const getDynamicEdges = (completion: Record<string, number>): Edge[] => {
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
