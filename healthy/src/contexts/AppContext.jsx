import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const uploadDocumentHandler = useCallback(async (file) => {
    try {

      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      };

      setDocuments(prev => [...prev, newDocument]);

      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDocument.id 
              ? { ...doc, status: 'processed' }
              : doc
          )
        );
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === file.id 
            ? { ...doc, status: 'error' }
            : doc
        )
      );
    }
  }, []);

  const sendMessageHandler = useCallback(async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const systemMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `I've analyzed your question about "${content}". Based on the uploaded documents, I found relevant information in the healthcare records.`,
        timestamp: new Date().toISOString(),
        sources: documents.length > 0 ? 
          documents.map(doc => `${doc.name} - Page ${Math.floor(Math.random() * 5) + 1}`) : 
          ['No documents available']
      };

      setMessages(prev => [...prev, systemMessage]);
      setIsTyping(false);
    }, 2000);
  }, [documents]);

  const deleteDocumentHandler = useCallback(async (documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  }, []);

  const searchMessages = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const value = {
    documents,
    messages: searchQuery ? filteredMessages : messages,
    isTyping,
    uploadDocument: uploadDocumentHandler,
    sendMessage: sendMessageHandler,
    deleteDocument: deleteDocumentHandler,
    searchMessages,
    searchQuery
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};