import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export const useApi = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSymbols = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/symbols`);
      if (response.ok) {
        const data = await response.json();
        setSymbols(data);
      } else {
        // Fallback to mock data if API is not available
        setSymbols(['BTC-USDT', 'ETH-USDT', 'ADA-USDT', 'DOT-USDT', 'SOL-USDT']);
      }
    } catch (err) {
      console.error('API Error:', err);
      // Fallback to mock data
      setSymbols(['BTC-USDT', 'ETH-USDT', 'ADA-USDT', 'DOT-USDT', 'SOL-USDT']);
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  };

  const runStrategy = async (config: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/run_strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to run strategy');
      }
    } catch (err) {
      console.error('Strategy execution error:', err);
      throw err;
    }
  };

  const fetchOHLCVData = async (symbol: string, timeframe: string = '1h') => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/okx/candles?inst_id=${symbol}&bar=${timeframe}&limit=100`
      );
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch OHLCV data');
      }
    } catch (err) {
      console.error('OHLCV fetch error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSymbols();
  }, []);

  return {
    symbols,
    loading,
    error,
    runStrategy,
    fetchOHLCVData,
    refetchSymbols: fetchSymbols,
  };
};