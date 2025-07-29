/**
 * ⚙️ workflowConfig
 *
 * Central configuration for the ERP React Flow diagram. Contains:
 * - `initialNodes`: default layout and settings for each process node
 * - `nodeMap`: quick lookup map of node IDs to config
 * - `getDynamicEdges()`: generates animated edges based on progress/completion state
 */

import { Edge, Node } from '@xyflow/react';

export const initialNodes: Node[] = [
  // Design flow
  {
    id: 'design',
    position: { x: 0, y: 100 },
    type: 'splitNode',
    data: {
      label: 'Design',
      hasRightHandle: true,
      hasBottomHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'project_mgmt',
    position: { x: 120, y: 100 },
    type: 'splitNode',
    data: {
      label: 'Project Management',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 130, height: 30 },
    draggable: false,
  },
  {
    id: 'product_design',
    position: { x: 280, y: 100 },
    type: 'splitNode',
    data: {
      label: 'Product Design',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 120, height: 30 },
    draggable: false,
  },
  {
    id: 'process_design',
    position: { x: 430, y: 100 },
    type: 'splitNode',
    data: {
      label: 'Process Design',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 120, height: 30 },
    draggable: false,
  },
  {
    id: 'transfer',
    position: { x: 580, y: 100 },
    type: 'splitNode',
    data: { label: 'Transfer', hasLeftHandle: true, disabled: true },
    style: { width: 90, height: 30 },
    draggable: false,
  },

  // Source flow
  {
    id: 'source',
    position: { x: 0, y: 200 },
    type: 'splitNode',
    data: {
      label: 'Source',
      hasTopHandle: true,
      hasRightHandle: true,
      hasBottomHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'supplier_setup',
    position: { x: 120, y: 200 },
    type: 'splitNode',
    data: {
      label: 'Supplier Setup',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 130, height: 30 },
    draggable: false,
  },
  {
    id: 'requisition',
    position: { x: 280, y: 200 },
    type: 'splitNode',
    data: {
      label: 'Requisition',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 110, height: 30 },
    draggable: false,
  },
  {
    id: 'po',
    position: { x: 420, y: 200 },
    type: 'splitNode',
    data: { label: 'Purchase Order', hasLeftHandle: true, disabled: true },
    style: { width: 130, height: 30 },
    draggable: false,
  },

  // Make flow
  {
    id: 'make',
    position: { x: 0, y: 300 },
    type: 'splitNode',
    data: {
      label: 'Make',
      hasTopHandle: true,
      hasRightHandle: true,
      hasBottomHandle: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'cpq',
    position: { x: 120, y: 300 },
    type: 'splitNode',
    data: {
      label: 'CPQ',
      hasLeftHandle: true,
      hasRightHandle: true,
      clickable: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'production',
    position: { x: 240, y: 300 },
    type: 'splitNode',
    data: {
      label: 'Production',
      hasLeftHandle: true,
      hasRightHandle: true,
      hasBottomHandle: true,
    },
    style: { width: 110, height: 30 },
    draggable: false,
  },
  {
    id: 'receive_po',
    position: { x: 370, y: 300 },
    type: 'splitNode',
    data: {
      label: 'Receive PO',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 100, height: 30 },
    draggable: false,
  },
  {
    id: 'initiate_wo',
    position: { x: 490, y: 300 },
    type: 'splitNode',
    data: {
      label: 'Initiate WO',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 110, height: 30 },
    draggable: false,
  },
  {
    id: 'batch',
    position: { x: 620, y: 300 },
    type: 'splitNode',
    data: {
      label: 'Batch Records',
      hasLeftHandle: true,
      hasRightHandle: true,
      clickable: true,
    },
    style: { width: 130, height: 30 },
    draggable: false,
  },
  {
    id: 'release',
    position: { x: 770, y: 300 },
    type: 'splitNode',
    data: {
      label: 'Production Release',
      hasLeftHandle: true,
      hasBottomHandle: true,
      disabled: true,
    },
    style: { width: 150, height: 30 },
    draggable: false,
  },
  {
    id: 'rework',
    position: { x: 480, y: 380 },
    type: 'splitNode',
    data: {
      label: 'Rework Orders',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 130, height: 30 },
    draggable: false,
  },

  // Delivery flow
  {
    id: 'delivery',
    position: { x: 0, y: 460 },
    type: 'splitNode',
    data: {
      label: 'Delivery',
      hasTopHandle: true,
      hasRightHandle: true,
      hasBottomHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'customer_setup',
    position: { x: 120, y: 460 },
    type: 'splitNode',
    data: {
      label: 'Customer Setup',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 130, height: 30 },
    draggable: false,
  },
  {
    id: 'sales_order',
    position: { x: 280, y: 460 },
    type: 'splitNode',
    data: {
      label: 'Sales Order',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 110, height: 30 },
    draggable: false,
  },
  {
    id: 'shipping',
    position: { x: 420, y: 460 },
    type: 'splitNode',
    data: {
      label: 'Shipping',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'invoice',
    position: { x: 540, y: 460 },
    type: 'splitNode',
    data: { label: 'Invoice', hasLeftHandle: true, disabled: true },
    style: { width: 90, height: 30 },
    draggable: false,
  },

  // Inventory flow
  {
    id: 'inventory',
    position: { x: 0, y: 560 },
    type: 'splitNode',
    data: {
      label: 'Inventory',
      hasTopHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'inventory_mgmt',
    position: { x: 120, y: 560 },
    type: 'splitNode',
    data: {
      label: 'Inventory Management',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 160, height: 30 },
    draggable: false,
  },
  {
    id: 'receiving',
    position: { x: 310, y: 560 },
    type: 'splitNode',
    data: {
      label: 'Receiving',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
    },
    style: { width: 90, height: 30 },
    draggable: false,
  },
  {
    id: 'return_supplier',
    position: { x: 430, y: 560 },
    type: 'splitNode',
    data: { label: 'Return to Supplier', hasLeftHandle: true, disabled: true },
    style: { width: 150, height: 30 },
    draggable: false,
  },
];

export const nodeMap = Object.fromEntries(
  initialNodes.map((node) => [node.id, node])
);

export const getDynamicEdges = (completion: Record<string, number>): Edge[] => {
  return [
    { source: 'design', target: 'project_mgmt', sourceHandle: 'right' },
    { source: 'project_mgmt', target: 'product_design' },
    { source: 'product_design', target: 'process_design' },
    { source: 'process_design', target: 'transfer' },

    { source: 'source', target: 'supplier_setup', sourceHandle: 'right' },
    { source: 'supplier_setup', target: 'requisition' },
    { source: 'requisition', target: 'po' },

    {
      source: 'make',
      target: 'cpq',
      sourceHandle: 'right',
      targetHandle: 'left',
    },
    {
      source: 'cpq',
      target: 'production',
      sourceHandle: 'right',
      targetHandle: 'left',
    },
    { source: 'production', target: 'receive_po', sourceHandle: 'right' },
    { source: 'receive_po', target: 'initiate_wo' },
    { source: 'initiate_wo', target: 'batch' },
    {
      source: 'batch',
      target: 'release',
      sourceHandle: 'right',
      targetHandle: 'left',
    },
    {
      source: 'release',
      target: 'rework',
      sourceHandle: 'bottom',
      targetHandle: 'right',
      type: 'smoothstep',
    },
    {
      source: 'rework',
      target: 'production',
      sourceHandle: 'left',
      targetHandle: 'bottom',
      type: 'smoothstep',
    },

    { source: 'delivery', target: 'customer_setup', sourceHandle: 'right' },
    { source: 'customer_setup', target: 'sales_order' },
    { source: 'sales_order', target: 'shipping' },
    { source: 'shipping', target: 'invoice' },

    { source: 'inventory', target: 'inventory_mgmt', sourceHandle: 'right' },
    { source: 'inventory_mgmt', target: 'receiving' },
    { source: 'receiving', target: 'return_supplier' },

    // 🆕 Vertical connections for primary flow columns
    { source: 'design', target: 'source', sourceHandle: 'bottom' },
    { source: 'source', target: 'make', sourceHandle: 'bottom' },
    { source: 'make', target: 'delivery', sourceHandle: 'bottom' },
    { source: 'delivery', target: 'inventory', sourceHandle: 'bottom' },
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
      type: edge.type || 'default',
      animated: shouldAnimate,
      style: {
        stroke: isDisabled ? '#d1d5db' : shouldAnimate ? '#78b3de' : '#1a192b',
        pointerEvents: 'none',
      },
    };
  });
};
