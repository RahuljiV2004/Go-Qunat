// frontend/src/components/DataVisualization.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, ComposedChart, Bar
} from 'recharts';
import { Calendar, TrendingUp, Volume2, Settings, Download } from 'lucide-react';

interface DataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  EMA_12?: number;
  RSI?: number;
}

interface DataVisualizationProps {
  selectedSymbols: string[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ selectedSymbols }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState('1m');
  const [showVolume, setShowVolume] = useState(true);
  const [indicators, setIndicators] = useState<string[]>(['EMA_12', 'RSI']);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symbol = selectedSymbols[0] || 'BTC-USDT';
      const res = await axios.get(`http://localhost:8000/okx/candles?inst_id=${symbol}&bar=${timeframe}`);
      const formatted = res.data.map((d: any) => ({
        timestamp: d.timestamp,
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
        volume: +d.volume
      }));
      setData(formatted);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedSymbols, timeframe]);

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Data</h1>
          <p className="text-gray-400 mt-1">
            Real-time charts for {selectedSymbols.join(', ') || 'BTC-USDT'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {selectedSymbols[0] || 'BTC-USDT'} - {timeframe.toUpperCase()}
          </h3>
          <div className="flex space-x-1">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm ${timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis yAxisId="price" orientation="right" stroke="#9CA3AF" />
            {showVolume && <YAxis yAxisId="volume" orientation="left" stroke="#9CA3AF" />}
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              formatter={(value: any, name: string) => name === 'volume' ? [value.toLocaleString(), 'Volume'] : [`$${value}`, name]}
            />
            <Line yAxisId="price" type="monotone" dataKey="close" stroke="#3B82F6" dot={false} strokeWidth={2} />
            {indicators.includes('EMA_12') && (
              <Line yAxisId="price" type="monotone" dataKey="EMA_12" stroke="#10B981" strokeDasharray="5 5" dot={false} />
            )}
            {showVolume && <Bar yAxisId="volume" dataKey="volume" fill="#6B7280" opacity={0.3} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataVisualization;