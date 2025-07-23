/**
 * 🔀 SplitNode
 *
 * Custom React Flow node used in the ERP workflow visualization. Renders a stylized
 * box with optional handles on all sides and a progress bar to indicate completion.
 * Supports interaction (clickable) and visual feedback for disabled/incomplete states.
 */

'use client';

import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';

export default function SplitNode({ data }: NodeProps) {
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
      ? 'cursor-pointer group hover:shadow-[0_10px_6px_rgba(0,0,0,0.2)]'
      : 'cursor-auto'
  }`;

  return (
    <div className={groupClass}>
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

      <div
        className={`px-2 py-[2px] text-center font-medium rounded-t-sm transition-colors ${
          disabled
            ? 'bg-gray-300 text-gray-500'
            : `bg-cyan-900 text-white ${
                clickable ? 'group-hover:bg-cyan-800' : ''
              }`
        }`}
      >
        {label}
      </div>

      <div
        className={`flex-1 rounded-b-sm flex items-center justify-between px-2 py-1 border transition-colors ${
          disabled
            ? 'bg-gray-100 border-gray-300'
            : `bg-white border-cyan-900 ${
                clickable ? 'group-hover:border-cyan-800' : ''
              }`
        }`}
      >
        <div className='relative w-3/4 h-1 bg-gray-200 rounded overflow-hidden'>
          <div
            className={`absolute h-1 top-0 left-0 rounded transition-all ${
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
}
