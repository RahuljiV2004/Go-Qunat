import { useState, useEffect, useRef } from 'react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export const useWebSocket = (sessionId?: string) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (sessionId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    try {
      const wsUrl = `ws://localhost:8000/ws/${sessionId}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnectionStatus('connected');
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      wsRef.current.onclose = (event) => {
        setConnectionStatus('disconnected');
        console.log('WebSocket disconnected:', event.code, event.reason);
      };

      wsRef.current.onerror = (event) => {
        setConnectionStatus('error');
        setError('WebSocket connection error');
        console.error('WebSocket error:', event);
      };
    } catch (err) {
      setConnectionStatus('error');
      setError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', err);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
  };

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    // Auto-connect with a default session ID for demo purposes
    const defaultSessionId = 'demo-session-' + Date.now();
    
    // Simulate connection (comment out for real WebSocket)
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);

    return () => {
      disconnect();
    };
  }, []);

  return {
    connectionStatus,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
  };
};