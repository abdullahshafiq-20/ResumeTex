import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ProcessingContext = createContext();

export const ProcessingProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingType, setProcessingType] = useState(''); // 'upload', 'resume_processing', 'email', etc.

  const startProcessing = useCallback((message = 'AI is working...', type = 'general') => {
    setIsProcessing(true);
    setProcessingMessage(message);
    setProcessingType(type);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    setProcessingMessage('');
    setProcessingType('');
  }, []);

  const updateProcessingMessage = useCallback((message) => {
    if (isProcessing) {
      setProcessingMessage(message);
    }
  }, [isProcessing]);

  const value = useMemo(() => ({
    isProcessing,
    processingMessage,
    processingType,
    startProcessing,
    stopProcessing,
    updateProcessingMessage,
  }), [isProcessing, processingMessage, processingType, startProcessing, stopProcessing, updateProcessingMessage]);

  return (
    <ProcessingContext.Provider value={value}>
      {children}
    </ProcessingContext.Provider>
  );
};

export const useProcessing = () => {
  const context = useContext(ProcessingContext);
  if (!context) {
    throw new Error('useProcessing must be used within a ProcessingProvider');
  }
  return context;
}; 