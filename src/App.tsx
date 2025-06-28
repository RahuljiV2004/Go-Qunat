import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StrategyBuilder from './components/StrategyBuilder';
import PerformanceDashboard from './components/PerformanceDashboard';
import DataVisualization from './components/DataVisualization';
import { useWebSocket } from './hooks/useWebSocket';
import { useApi } from './hooks/useApi';

export type ViewMode = 'strategy' | 'performance' | 'charts';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('strategy');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['BTC-USDT']);
  const [isConnected, setIsConnected] = useState(false);
  
  const { symbols, loading } = useApi();
  const { connectionStatus, lastMessage } = useWebSocket();

  useEffect(() => {
    setIsConnected(connectionStatus === 'connected');
  }, [connectionStatus]);

  const renderMainContent = () => {
    switch (currentView) {
      case 'strategy':
        return <StrategyBuilder selectedSymbols={selectedSymbols} />;
      case 'performance':
        return <PerformanceDashboard selectedSymbols={selectedSymbols} />;
      case 'charts':
        return <DataVisualization selectedSymbols={selectedSymbols} />;
      default:
        return <StrategyBuilder selectedSymbols={selectedSymbols} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isConnected={isConnected}
        />
        
        <div className="flex h-screen pt-16">
          <Sidebar 
            symbols={symbols}
            selectedSymbols={selectedSymbols}
            onSymbolSelect={setSelectedSymbols}
            loading={loading}
          />
          
          <main className="flex-1 bg-gray-800 overflow-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;