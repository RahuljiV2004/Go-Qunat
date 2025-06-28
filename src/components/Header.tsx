import React from 'react';
import { Activity, BarChart3, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { ViewMode } from '../App';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, isConnected }) => {
  const navItems = [
    { id: 'strategy' as ViewMode, label: 'Strategy Builder', icon: Activity },
    { id: 'performance' as ViewMode, label: 'Performance', icon: BarChart3 },
    { id: 'charts' as ViewMode, label: 'Charts', icon: TrendingUp },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Go Quant</span>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="text-sm text-gray-400">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;