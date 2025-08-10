/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 📋 qmsWorkflowConfig.ts
 *
 * Central configuration for the QMS React Flow diagram. Contains:
 * - `initialNodes`: layout and metadata for each quality system element
 * - `getDynamicEdges()`: dynamically connects nodes horizontally per row
 * - `edges`: array of animated edges connecting related nodes
 */

import { Edge, Node } from '@xyflow/react';

// -------------------------------------
// Initial Nodes for QMS Flow
// -------------------------------------

export const initialNodes: Node[] = [
  // Column 0 – Section Headers
  {
    id: 'quality-mgmt',
    type: 'splitNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'Quality Management System',
      hasRightHandle: true,
      hasBottomHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
    draggable: false,
  },
  {
    id: 'document-control',
    type: 'splitNode',
    position: { x: 0, y: 120 },
    data: {
      label: 'Document, Records, Data Control',
      hasRightHandle: true,
      hasBottomHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },
  {
    id: 'design-control',
    type: 'splitNode',
    position: { x: 0, y: 240 },
    data: {
      label: 'Design Control',
      hasRightHandle: true,
      hasBottomHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },
  {
    id: 'product-approval',
    type: 'splitNode',
    position: { x: 0, y: 360 },
    data: {
      label: 'Product Approval',
      hasRightHandle: true,
      hasBottomHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },
  {
    id: 'material-control',
    type: 'splitNode',
    position: { x: 0, y: 480 },
    data: {
      label: 'Material Control',
      hasRightHandle: true,
      hasBottomHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },
  {
    id: 'production-control',
    type: 'splitNode',
    position: { x: 0, y: 630 },
    data: {
      label: 'Production & Process Control',
      hasRightHandle: true,
      hasBottomHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },
  {
    id: 'post-market',
    type: 'splitNode',
    position: { x: 0, y: 780 },
    data: {
      label: 'Post Market Surveillance',
      hasRightHandle: true,
      hasBottomHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },
  {
    id: 'capa',
    type: 'splitNode',
    position: { x: 0, y: 900 },
    data: {
      label: 'CAPA',
      hasRightHandle: true,
      hasTopHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 150 },
  },

  // Quality Management System
  {
    id: 'management-control',
    type: 'splitNode',
    position: { x: 200, y: 0 },
    data: {
      label: 'Management Control',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'quality-planning',
    type: 'splitNode',
    position: { x: 400, y: 0 },
    data: {
      label: 'Quality Planning',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'training-hr',
    type: 'splitNode',
    position: { x: 600, y: 0 },
    data: {
      label: 'Training and HR',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'internal-audit',
    type: 'splitNode',
    position: { x: 800, y: 0 },
    data: {
      label: 'Internal Audit',
      hasLeftHandle: true,
      disabled: false,
      progress: 20,
      clickable: true,
    },
  },

  // Document Control
  {
    id: 'document-ctrl',
    type: 'splitNode',
    position: { x: 200, y: 120 },
    data: {
      label: 'Document Control',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'records-ctrl',
    type: 'splitNode',
    position: { x: 400, y: 120 },
    data: {
      label: 'Records Control',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'data-ctrl',
    type: 'splitNode',
    position: { x: 600, y: 120 },
    data: {
      label: 'Data Control',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },

  // Design Control
  {
    id: 'design-dev',
    type: 'splitNode',
    position: { x: 200, y: 240 },
    data: {
      label: 'Design & Development',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'risk-mgmt',
    type: 'splitNode',
    position: { x: 400, y: 240 },
    data: {
      label: 'Risk Management',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'labeling',
    type: 'splitNode',
    position: { x: 600, y: 240 },
    data: {
      label: 'Labeling',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'toxicology',
    type: 'splitNode',
    position: { x: 800, y: 240 },
    data: {
      label: 'Toxicology & Biocomp',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'software-validation',
    type: 'splitNode',
    position: { x: 1000, y: 240 },
    data: {
      label: 'Software Design & Validation',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },

  // Product Approval
  {
    id: 'regulatory-approval',
    type: 'splitNode',
    position: { x: 200, y: 360 },
    data: {
      label: 'Regulatory Approval',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'clinical-trial',
    type: 'splitNode',
    position: { x: 400, y: 360 },
    data: {
      label: 'Clinical Trial',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'product-advertising',
    type: 'splitNode',
    position: { x: 600, y: 360 },
    data: {
      label: 'Product & Advertising',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'regulatory-maintenance',
    type: 'splitNode',
    position: { x: 800, y: 360 },
    data: {
      label: 'Regulatory Approval Maintenance',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },

  // Material Control
  {
    id: 'supplier-selection',
    type: 'splitNode',
    position: { x: 200, y: 480 },
    data: {
      label: 'Supplier Selection',
      hasLeftHandle: true,
      hasRightHandle: true,
      hasBottomHandle: true,
      disabled: true,
      progress: 0,
    },
    style: { width: 90 },
  },
  {
    id: 'material-qualification',
    type: 'splitNode',
    position: { x: 400, y: 480 },
    data: {
      label: 'Material Qualification & Acceptance',
      disabled: true,
      hasLeftHandle: true,
      hasRightHandle: true,
      progress: 0,
    },
  },
  {
    id: 'procurement',
    type: 'splitNode',
    position: { x: 600, y: 480 },
    data: {
      label: 'Procurement',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'supplier-feedback',
    type: 'splitNode',
    position: { x: 800, y: 480 },
    data: {
      label: 'Supplier Feedback & Change Control',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'supplier-audit',
    type: 'splitNode',
    position: { x: 200, y: 540 },
    data: {
      label: 'Supplier Audit',
      hasTopHandle: true,
      disabled: false,
      progress: 70,
      clickable: true,
    },
  },

  // Production Control – Top Branch
  {
    id: 'work-env',
    type: 'splitNode',
    position: { x: 200, y: 600 },
    data: {
      label: 'Work Environment',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'process-acceptance',
    type: 'splitNode',
    position: { x: 400, y: 600 },
    data: {
      label: 'Process Acceptance',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'process-validation',
    type: 'splitNode',
    position: { x: 600, y: 600 },
    data: {
      label: 'Process Validation',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'software-equip',
    type: 'splitNode',
    position: { x: 800, y: 600 },
    data: {
      label: 'Non-device Software & Equipment Control',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'sterilization',
    type: 'splitNode',
    position: { x: 1000, y: 600 },
    data: {
      label: 'Sterilization',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },

  // Production Control – Bottom Branch
  {
    id: 'finished-good',
    type: 'splitNode',
    position: { x: 200, y: 660 },
    data: {
      label: 'Finished Good Acceptance',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'handling-dist',
    type: 'splitNode',
    position: { x: 400, y: 660 },
    data: {
      label: 'Handling & Distribution Control',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'installation-service',
    type: 'splitNode',
    position: { x: 600, y: 660 },
    data: {
      label: 'Installation & Service',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'customer-service',
    type: 'splitNode',
    position: { x: 800, y: 660 },
    data: {
      label: 'Customer Service',
      hasLeftHandle: true,
      hasBottomHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'customer-audit',
    type: 'splitNode',
    position: { x: 800, y: 720 },
    data: {
      label: 'Customer Audit',
      hasTopHandle: true,
      disabled: false,
      progress: 50,
      clickable: true,
    },
  },

  // Post Market Surveillance
  {
    id: 'complaints',
    type: 'splitNode',
    position: { x: 200, y: 780 },
    data: {
      label: 'Complaint Management',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'vigilance',
    type: 'splitNode',
    position: { x: 400, y: 780 },
    data: {
      label: 'Vigilance Reporting',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'pms',
    type: 'splitNode',
    position: { x: 600, y: 780 },
    data: {
      label: 'Post Market Surveillance',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'device-tracking',
    type: 'splitNode',
    position: { x: 800, y: 780 },
    data: {
      label: 'Device Tracking',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },

  // CAPA
  {
    id: 'nonconforming-material',
    type: 'splitNode',
    position: { x: 200, y: 900 },
    data: {
      label: 'Nonconforming Material',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'nonconforming-events',
    type: 'splitNode',
    position: { x: 400, y: 900 },
    data: {
      label: 'Nonconforming Events',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'capa-action',
    type: 'splitNode',
    position: { x: 600, y: 900 },
    data: {
      label: 'CAPA',
      hasLeftHandle: true,
      hasRightHandle: true,
      disabled: true,
      progress: 0,
    },
  },
  {
    id: 'field-actions',
    type: 'splitNode',
    position: { x: 800, y: 900 },
    data: {
      label: 'Field Actions and Notifications',
      hasLeftHandle: true,
      disabled: true,
      progress: 0,
    },
  },
];

// Apply shared styles to each node
export const styledNodes = initialNodes.map((node: any) => ({
  ...node,
  style: {
    ...(node.style || {}),
    minWidth: 120,
  },
}));

export const nodeMap = Object.fromEntries(
  styledNodes.map((node: any) => [node.id, node])
);

// -------------------------------------
// Dynamic Edges Generator
// -------------------------------------

export const getDynamicEdges = (completion: Record<string, number>): Edge[] => {
  const edges: Partial<Edge>[] = [
    // Vertical connections for master nodes
    {
      source: 'quality-mgmt',
      target: 'document-control',
      sourceHandle: 'bottom',
    },
    {
      source: 'document-control',
      target: 'design-control',
      sourceHandle: 'bottom',
    },
    {
      source: 'design-control',
      target: 'product-approval',
      sourceHandle: 'bottom',
    },
    {
      source: 'product-approval',
      target: 'material-control',
      sourceHandle: 'bottom',
    },
    {
      source: 'material-control',
      target: 'production-control',
      sourceHandle: 'bottom',
    },
    {
      source: 'production-control',
      target: 'post-market',
      sourceHandle: 'bottom',
    },
    {
      source: 'post-market',
      target: 'capa',
      sourceHandle: 'bottom',
    },

    // 🟦 Quality Management System group
    {
      source: 'quality-mgmt',
      target: 'management-control',
      sourceHandle: 'right',
    },
    { source: 'management-control', target: 'quality-planning' },
    { source: 'quality-planning', target: 'training-hr' },
    { source: 'training-hr', target: 'internal-audit' },

    // 📄 Document / Data Control group
    {
      source: 'document-control',
      target: 'document-ctrl',
      sourceHandle: 'right',
    },
    { source: 'document-ctrl', target: 'records-ctrl' },
    { source: 'records-ctrl', target: 'data-ctrl' },

    // 🧪 Design Control group
    { source: 'design-control', sourceHandle: 'right', target: 'design-dev' },
    { source: 'design-dev', target: 'risk-mgmt' },
    { source: 'risk-mgmt', target: 'labeling' },
    { source: 'labeling', target: 'toxicology' },
    { source: 'toxicology', target: 'software-validation' },

    // ✅ Product Approval group
    {
      source: 'product-approval',
      sourceHandle: 'right',
      target: 'regulatory-approval',
    },
    { source: 'regulatory-approval', target: 'clinical-trial' },
    { source: 'clinical-trial', target: 'product-advertising' },
    { source: 'product-advertising', target: 'regulatory-maintenance' },

    // 🏭 Material Control
    {
      source: 'material-control',
      sourceHandle: 'right',
      target: 'supplier-selection',
      targetHandle: 'left',
    },
    {
      source: 'supplier-selection',
      sourceHandle: 'right',
      target: 'material-qualification',
    },
    { source: 'material-qualification', target: 'procurement' },
    { source: 'procurement', target: 'supplier-feedback' },
    { source: 'supplier-selection', target: 'supplier-audit' },

    // 🛠️ Production & Process Control – Top
    {
      source: 'production-control',
      sourceHandle: 'right',
      target: 'work-env',
    },
    { source: 'work-env', target: 'process-acceptance', sourceHandle: 'right' },
    { source: 'process-acceptance', target: 'process-validation' },
    { source: 'process-validation', target: 'software-equip' },
    { source: 'software-equip', target: 'sterilization' },

    // 🛠️ Production & Process Control – Bottom
    {
      source: 'production-control',
      sourceHandle: 'right',
      target: 'finished-good',
    },
    { source: 'finished-good', target: 'handling-dist', sourceHandle: 'right' },
    { source: 'handling-dist', target: 'installation-service' },
    {
      source: 'installation-service',
      sourceHandle: 'right',
      target: 'customer-service',
      targetHandle: 'left',
    },
    { source: 'customer-service', target: 'customer-audit' },

    // 🔁 Post Market Surveillance
    { source: 'post-market', sourceHandle: 'right', target: 'complaints' },
    { source: 'complaints', target: 'vigilance' },
    { source: 'vigilance', target: 'pms' },
    { source: 'pms', target: 'device-tracking' },

    // 🚨 CAPA
    { source: 'capa', sourceHandle: 'right', target: 'nonconforming-material' },
    { source: 'nonconforming-material', target: 'nonconforming-events' },
    { source: 'nonconforming-events', target: 'capa-action' },
    { source: 'capa-action', target: 'field-actions' },
  ];

  return edges.map((edge) => {
    const sourceNode = nodeMap[edge.source!];
    const targetNode = nodeMap[edge.target!];

    const sourceDisabled = sourceNode?.data?.disabled;
    const targetDisabled = targetNode?.data?.disabled;
    const sourceProgress = completion[edge.source!] ?? 0;

    const isDisabled = sourceDisabled || targetDisabled;
    const shouldAnimate = !isDisabled && sourceProgress < 100;

    return {
      id: `e-${edge.source}-${edge.target}`,
      ...edge,
      type: edge.type || 'default',
      animated: shouldAnimate,
      style: {
        stroke: isDisabled ? '#d1d5db' : shouldAnimate ? '#78b3de' : '#1a192b',
        pointerEvents: 'none',
      },
    } as Edge;
  });
};
