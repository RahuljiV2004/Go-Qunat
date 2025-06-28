// PerformanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertTriangle, BarChart3 } from 'lucide-react';

interface PerformanceDashboardProps {
  selectedSymbols: string[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ selectedSymbols }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pnlData, setPnlData] = useState<any[]>([]);
  const [drawdownData, setDrawdownData] = useState<any[]>([]);
  const [tradeStats, setTradeStats] = useState<{ winRate: number, lossRate: number }>({ winRate: 0, lossRate: 0 });

  const fetchStrategyData = async () => {
    setLoading(true);
    console.log("Fetching strategy data...");
    try {
      await axios.post(`http://localhost:8000/fetch_ohlcv/${selectedSymbols[0]}`);
      const response = await axios.post("http://localhost:8000/run_strategy", {
        symbols: selectedSymbols,
        market_type: "spot",
        exchange: "okx",
        indicators: ["EMA", "RSI", "MACD"],
        logic: "crossover",
        order_type: "market",
        slippage: 0.1,
        fees: 0.1,
        risk: { stop_loss: 0.05, take_profit: 0.1 },
        portfolio_allocation: 0.5,
      });
      console.log("Received response:", response.data);
      const results = response.data.results;
      if (!results || results.length === 0) {
        console.warn("No results returned from backend.");
        return;
      }
      setMetrics(results);

      const pnl = results.map((r: any, i: number) => ({
        date: `2024-0${i + 1}`,
        pnl: r["PnL $"] || 0,
        cumulative: r["PnL $"] * (i + 1),
      }));
      setPnlData(pnl);

      const dd = results.map((r: any, i: number) => ({
        date: `2024-0${i + 1}`,
        drawdown: r["Max Drawdown %"] || 0,
      }));
      setDrawdownData(dd);

      const winRate = results[0]?.["Win Rate %"] || 0;
      setTradeStats({ winRate, lossRate: 100 - winRate });

    } catch (error: any) {
      console.error("Failed to fetch:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSymbols.length > 0) {
      fetchStrategyData();
    }
  }, [selectedSymbols]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, change, icon, color = 'text-blue-400' }) => (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`${color}`}>{icon}</div>
      </div>
    </div>
  );

  const getMetric = (name: string) => metrics[0]?.[name] ?? "--";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
          <p className="text-gray-400 mt-1">Analyzing strategy for {selectedSymbols.join(', ')}</p>
        </div>
        <button
          onClick={fetchStrategyData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {metrics.length === 0 && !loading && (
        <div className="text-gray-400">No performance data available. Try refreshing.</div>
      )}

      {metrics.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Return"
              value={`${getMetric("PnL %")}%`}
              change={5.2}
              icon={<TrendingUp className="w-8 h-8" />} color="text-green-400" />
            <MetricCard
              title="Sharpe Ratio"
              value={getMetric("Sharpe")}
              change={2.1}
              icon={<BarChart3 className="w-8 h-8" />} />
            <MetricCard
              title="Max Drawdown"
              value={`${getMetric("Max Drawdown %")}%`}
              icon={<AlertTriangle className="w-8 h-8" />} color="text-red-400" />
            <MetricCard
              title="Win Rate"
              value={`${getMetric("Win Rate %")}%`}
              change={1.8}
              icon={<Target className="w-8 h-8" />} color="text-purple-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">P&L Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFFFFF' }} />
                  <Line type="monotone" dataKey="cumulative" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Drawdown Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={drawdownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFFFFF' }} />
                  <Bar dataKey="drawdown" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Trade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie dataKey="value" data={[
                    { name: 'Winning Trades', value: tradeStats.winRate, color: '#10B981' },
                    { name: 'Losing Trades', value: tradeStats.lossRate, color: '#EF4444' },
                  ]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} stroke="none">
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFFFFF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceDashboard;