import React from 'react';
import { useDrag } from 'react-dnd';
import { TrendingUp, BarChart3, Activity, Zap, Target, DollarSign } from 'lucide-react';

interface IndicatorPaletteProps {
  onAddNode: (type: string, name: string) => void;
}

const indicators = [
  { name: 'EMA', type: 'indicator', icon: TrendingUp, color: 'bg-blue-600' },
  { name: 'RSI', type: 'indicator', icon: BarChart3, color: 'bg-purple-600' },
  { name: 'MACD', type: 'indicator', icon: Activity, color: 'bg-green-600' },
  { name: 'Bollinger Bands', type: 'indicator', icon: Zap, color: 'bg-yellow-600' },
];

const conditions = [
  { name: 'Price Above', type: 'condition', icon: TrendingUp, color: 'bg-orange-600' },
  { name: 'Cross Over', type: 'condition', icon: Target, color: 'bg-red-600' },
  { name: 'RSI Overbought', type: 'condition', icon: BarChart3, color: 'bg-pink-600' },
];

const actions = [
  { name: 'Buy Order', type: 'action', icon: DollarSign, color: 'bg-green-600' },
  { name: 'Sell Order', type: 'action', icon: DollarSign, color: 'bg-red-600' },
  { name: 'Stop Loss', type: 'action', icon: Target, color: 'bg-yellow-600' },
];

const DraggableItem: React.FC<{
  item: any;
  onAdd: (type: string, name: string) => void;
}> = ({ item, onAdd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'indicator',
    item: { type: item.type, name: item.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = item.icon;

  return (
    <div
      ref={drag}
      onClick={() => onAdd(item.type, item.name)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className={`p-2 rounded-lg ${item.color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium">{item.name}</span>
    </div>
  );
};

const IndicatorPalette: React.FC<IndicatorPaletteProps> = ({ onAddNode }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Technical Indicators
        </h3>
        <div className="space-y-1">
          {indicators.map((item) => (
            <DraggableItem key={item.name} item={item} onAdd={onAddNode} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Conditions
        </h3>
        <div className="space-y-1">
          {conditions.map((item) => (
            <DraggableItem key={item.name} item={item} onAdd={onAddNode} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Actions
        </h3>
        <div className="space-y-1">
          {actions.map((item) => (
            <DraggableItem key={item.name} item={item} onAdd={onAddNode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndicatorPalette;