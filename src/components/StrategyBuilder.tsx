import React, { useState } from 'react';
import { Plus, Settings, Play, Save, Trash2, UploadCloud } from 'lucide-react';
import IndicatorPalette from './IndicatorPalette';
import StrategyCanvas from './StrategyCanvas';
import ConfigPanel from './ConfigPanel';

interface StrategyBuilderProps {
  selectedSymbols: string[];
}

export interface StrategyNode {
  id: string;
  type: 'indicator' | 'condition' | 'action';
  name: string;
  config: any;
  position: { x: number; y: number };
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ selectedSymbols }) => {
  const [nodes, setNodes] = useState<StrategyNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<StrategyNode | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [strategyResult, setStrategyResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addNode = (nodeType: string, name: string) => {
    const newNode: StrategyNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType as any,
      name,
      config: {},
      position: { x: Math.random() * 400, y: Math.random() * 300 }
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id: string, updates: Partial<StrategyNode>) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  };

  const uploadOHLCV = async () => {
    setIsUploading(true);
    try {
      const symbol = selectedSymbols[0] || 'BTC-USDT';
      const response = await fetch(`http://localhost:8000/fetch_ohlcv/${symbol}`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log('Upload result:', data);
      alert('OHLCV data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading OHLCV data:', error);
      alert('Failed to upload OHLCV data.');
    } finally {
      setIsUploading(false);
    }
  };

  const runStrategy = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('http://localhost:8000/run_strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbols: selectedSymbols,
          market_type: 'spot',
          exchange: 'okx',
          indicators: nodes.filter(n => n.type === 'indicator').map(n => n.name),
          logic: 'buy_and_hold',
          order_type: 'market',
          slippage: 0.001,
          fees: 0.001,
          risk: { max_drawdown: 0.2 },
          portfolio_allocation: 1.0
        })
      });
      const result = await response.json();
      setStrategyResult(result);
      console.log('Strategy results:', result);
    } catch (error) {
      console.error('Error running strategy:', error);
      setStrategyResult({ error: 'Failed to run strategy' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-80 bg-gray-900 border-r border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Strategy Components</h2>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <IndicatorPalette onAddNode={addNode} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              Selected: {selectedSymbols.join(', ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={uploadOHLCV}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload OHLCV'}</span>
            </button>

            <button
              onClick={runStrategy}
              disabled={isRunning || nodes.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run Strategy'}</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-800">
          <StrategyCanvas
            nodes={nodes}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
            onNodeUpdate={updateNode}
            onNodeDelete={deleteNode}
          />

          {strategyResult && (
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Strategy Results</h3>
              {strategyResult.error ? (
                <div className="text-red-400">{strategyResult.error}</div>
              ) : (
                <table className="min-w-full text-sm text-left text-gray-400">
                  <thead>
                    <tr>
                      {strategyResult.results && strategyResult.results[0] && Object.keys(strategyResult.results[0]).map((key) => (
                        <th key={key} className="px-2 py-1 border-b border-gray-700">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {strategyResult.results && strategyResult.results.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-800">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-2 py-1 border-b border-gray-800">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {showConfig && (
        <div className="w-80 bg-gray-900 border-l border-gray-700">
          <ConfigPanel
            selectedNode={selectedNode}
            onNodeUpdate={updateNode}
            onClose={() => setShowConfig(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StrategyBuilder;
