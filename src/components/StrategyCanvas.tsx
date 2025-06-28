import React from 'react';
import { useDrop } from 'react-dnd';
import { StrategyNode } from './StrategyBuilder';
import StrategyNodeComponent from './StrategyNodeComponent';

interface StrategyCanvasProps {
  nodes: StrategyNode[];
  selectedNode: StrategyNode | null;
  onNodeSelect: (node: StrategyNode) => void;
  onNodeUpdate: (id: string, updates: Partial<StrategyNode>) => void;
  onNodeDelete: (id: string) => void;
}

const StrategyCanvas: React.FC<StrategyCanvasProps> = ({
  nodes,
  selectedNode,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'indicator',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvasRect = document.getElementById('strategy-canvas')?.getBoundingClientRect();
        if (canvasRect) {
          const newNode: StrategyNode = {
            id: `${item.type}-${Date.now()}`,
            type: item.type,
            name: item.name,
            config: {},
            position: {
              x: offset.x - canvasRect.left,
              y: offset.y - canvasRect.top,
            },
          };
          onNodeUpdate(newNode.id, newNode);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleNodeMove = (id: string, position: { x: number; y: number }) => {
    onNodeUpdate(id, { position });
  };

  return (
    <div
      ref={drop}
      id="strategy-canvas"
      className={`w-full h-full relative bg-gray-800 ${
        isOver ? 'bg-gray-700' : ''
      } transition-colors`}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Drop Zone Indicator */}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-blue-400 text-lg font-medium">
            Drop component here
          </div>
        </div>
      )}

      {/* Strategy Nodes */}
      {nodes.map((node) => (
        <StrategyNodeComponent
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onSelect={() => onNodeSelect(node)}
          onMove={handleNodeMove}
          onDelete={() => onNodeDelete(node.id)}
        />
      ))}

      {/* Instructions */}
      {nodes.length === 0 && !isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-xl mb-2">Build Your Strategy</div>
            <div className="text-sm">
              Drag components from the left panel to create your trading strategy
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyCanvas;