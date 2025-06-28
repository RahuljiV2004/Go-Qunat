import React from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface Symbol {
  symbol: string;
  price: number;
  change: number;
}

interface SidebarProps {
  symbols: string[];
  selectedSymbols: string[];
  onSymbolSelect: (symbols: string[]) => void;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  symbols, 
  selectedSymbols, 
  onSymbolSelect, 
  loading 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Mock data for demonstration
  const mockData: Symbol[] = [
    { symbol: 'BTC-USDT', price: 61594.98, change: 1.05 },
    { symbol: 'ETH-USDT', price: 3421.67, change: -0.24 },
    { symbol: 'ADA-USDT', price: 0.4523, change: 6.11 },
    { symbol: 'DOT-USDT', price: 7.89, change: -2.34 },
    { symbol: 'SOL-USDT', price: 156.78, change: 4.56 },
    { symbol: 'MATIC-USDT', price: 1.23, change: -1.87 },
    { symbol: 'LINK-USDT', price: 18.45, change: 3.21 },
    { symbol: 'UNI-USDT', price: 9.87, change: -0.98 },
  ];

  const filteredSymbols = mockData.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSymbolClick = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      onSymbolSelect(selectedSymbols.filter(s => s !== symbol));
    } else {
      onSymbolSelect([...selectedSymbols, symbol]);
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Markets
          </h3>
          
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 h-12 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSymbols.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handleSymbolClick(item.symbol)}
                  className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-gray-800 ${
                    selectedSymbols.includes(item.symbol)
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white text-sm">
                        {item.symbol.replace('-USDT', '')}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          item.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;