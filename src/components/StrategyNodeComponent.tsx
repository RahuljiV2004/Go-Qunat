import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { TrendingUp, BarChart3, Activity, X, Settings } from 'lucide-react';
import { StrategyNode } from './StrategyBuilder';

interface StrategyNodeComponentProps {
  node: StrategyNode;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
}

const getNodeIcon = (name: string) => {
  switch (name) {
    case 'EMA':
    case 'Price Above':
    case 'Buy Order':
    case 'Sell Order':
      return TrendingUp;
    case 'RSI':
    case 'RSI Overbought':
      return BarChart3;
    case 'MACD':
    case 'Cross Over':
      return Activity;
    default:
      return TrendingUp;
  }
};

const getNodeColor = (type: string, name: string) => {
  if (type === 'indicator') return 'bg-blue-600 border-blue-500';
  if (type === 'condition') return 'bg-orange-600 border-orange-500';
  if (type === 'action') {
    return name.includes('Buy') ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500';
  }
  return 'bg-gray-600 border-gray-500';
};

const StrategyNodeComponent: React.FC<StrategyNodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onMove,
  onDelete,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const [{ }, drag] = useDrag(() => ({
    type: 'node',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = getNodeIcon(node.name);
  const colorClass = getNodeColor(node.type, node.name);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX - node.position.x;
    const startY = e.clientY - node.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      onMove(node.id, {
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    setIsDragging(true);
  };

  return (
    <div
      ref={drag}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      className={`absolute cursor-move select-none ${isDragging ? 'z-50' : 'z-10'}`}
      onClick={onSelect}
    >
      <div
        className={`relative p-4 rounded-lg border-2 transition-all ${colorClass} ${
          isSelected ? 'ring-2 ring-blue-400' : ''
        } ${isDragging ? 'opacity-75 scale-105' : 'hover:scale-105'}`}
        onMouseDown={handleMouseDown}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{node.name}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Open config modal
              }}
              className="p-1 rounded hover:bg-black/20 transition-colors"
            >
              <Settings className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded hover:bg-black/20 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Node Type Badge */}
        <div className="text-xs text-white/70 capitalize">
          {node.type}
        </div>

        {/* Connection Points */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-600"></div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-600"></div>
      </div>
    </div>
  );
};

export default StrategyNodeComponent;