import React from 'react';
import { X, Save } from 'lucide-react';
import { StrategyNode } from './StrategyBuilder';

interface ConfigPanelProps {
  selectedNode: StrategyNode | null;
  onNodeUpdate: (id: string, updates: Partial<StrategyNode>) => void;
  onClose: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClose,
}) => {
  if (!selectedNode) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configuration</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-gray-400 text-center py-8">
          Select a node to configure its parameters
        </div>
      </div>
    );
  }

  const renderConfig = () => {
    switch (selectedNode.name) {
      case 'EMA':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period
              </label>
              <input
                type="number"
                defaultValue={20}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                onChange={(e) => {
                  const config = { ...selectedNode.config, period: parseInt(e.target.value) };
                  onNodeUpdate(selectedNode.id, { config });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white">
                <option value="close">Close</option>
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        );
      
      case 'RSI':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period
              </label>
              <input
                type="number"
                defaultValue={14}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overbought Level
              </label>
              <input
                type="number"
                defaultValue={70}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Oversold Level
              </label>
              <input
                type="number"
                defaultValue={30}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        );

      case 'Buy Order':
      case 'Sell Order':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order Type
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white">
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop">Stop</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity (%)
              </label>
              <input
                type="number"
                defaultValue={100}
                max={100}
                min={1}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-400 text-center py-4">
            No configuration available for this component
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Configuration</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Selected Component</div>
        <div className="font-medium">{selectedNode.name}</div>
        <div className="text-sm text-gray-400 capitalize">{selectedNode.type}</div>
      </div>

      <div className="mb-6">
        {renderConfig()}
      </div>

      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
        <Save className="w-4 h-4" />
        <span>Save Configuration</span>
      </button>
    </div>
  );
};

export default ConfigPanel;