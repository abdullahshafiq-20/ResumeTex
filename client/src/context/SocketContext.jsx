// client/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isInitializedRef = useRef(false);

  // Get token from localStorage or wherever you store it
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }, []);

  // Disconnect socket - remove socket dependency to prevent loops
  const disconnectSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setSocket(prevSocket => {
      if (prevSocket) {
        prevSocket.disconnect();
      }
      return null;
    });
    
    setIsConnected(false);
    setConnectionError(null);
    reconnectAttemptsRef.current = 0;
  }, []); // Remove socket dependency

  // Initialize socket connection with retry logic
  const connectSocket = useCallback(() => {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No authentication token found');
      setConnectionError('Authentication required');
      return;
    }

    // Clear existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Disconnect existing socket first
    setSocket(prevSocket => {
      if (prevSocket) {
        prevSocket.disconnect();
      }
      return null;
    });

    try {
      const newSocket = io('http://localhost:3000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        
        // Only attempt reconnection for certain disconnect reasons
        if (reason === 'io server disconnect') {
          return;
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setConnectionError(error.message);
        setIsConnected(false);
        
        // Implement exponential backoff for reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`Retrying connection in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectSocket();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
          setConnectionError('Connection failed after multiple attempts');
        }
      });

      setSocket(newSocket);
      
    } catch (error) {
      console.error('Error creating socket:', error);
      setConnectionError(error.message);
    }
  }, [getAuthToken]); // Only depend on getAuthToken

  // Generic emit function
  const emitEvent = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      console.log(`Emitted ${event}:`, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }, [socket, isConnected]);

  // Generic listener function
  const onEvent = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      console.log(`Listening for ${event} events`);
      
      // Return cleanup function
      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket]);

  // Remove event listener
  const offEvent = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  // Join room
  const joinRoom = useCallback((roomName) => {
    emitEvent('join_room', roomName);
  }, [emitEvent]);

  // Leave room
  const leaveRoom = useCallback((roomName) => {
    emitEvent('leave_room', roomName);
  }, [emitEvent]);

  // Initialize socket on mount - run only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      connectSocket();
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []); // Empty dependency array - run only once

  // Monitor token changes - simplified to avoid loops
  useEffect(() => {
    const token = getAuthToken();
    
    if (!token && socket) {
      // User logged out, disconnect
      disconnectSocket();
    } else if (token && !socket && isInitializedRef.current) {
      // User logged in or token available, connect
      connectSocket();
    }
  }, [socket]); // Only depend on socket state

  // Add notification listener after socket connection
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('Setting up global socket listeners...');

    // Listen for notifications
    const handleNotification = (data) => {
      console.log('Received notification:', data);
      setNotifications(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 notifications
      
      // You can add toast notification here
      // toast.success(data.data.message || 'Notification received');
    };

    socket.on('notification', handleNotification);

    // Cleanup function
    return () => {
      console.log('Cleaning up global socket listeners...');
      socket.off('notification', handleNotification);
    };
  }, [socket, isConnected]);

  // Clear notifications function
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    socket,
    isConnected,
    connectionError,
    connectSocket,
    disconnectSocket,
    emitEvent,
    onEvent,
    offEvent,
    joinRoom,
    leaveRoom,
    notifications,
    clearNotifications,
    reconnectAttempts: reconnectAttemptsRef.current,
    maxReconnectAttempts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};