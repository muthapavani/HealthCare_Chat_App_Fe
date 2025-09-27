
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

export const uploadDocument = async (file) => {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
        }
      });
    }, 1000);
  });
};

export const getDocuments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: []
      });
    }, 500);
  });
};

export const deleteDocument = async (documentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { success: true } });
    }, 500);
  });
};

export const sendMessage = async (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: Date.now().toString(),
          type: 'system',
          content: 'This is a mock response from the healthcare AI assistant.',
          timestamp: new Date().toISOString(),
        }
      });
    }, 1500);
  });
};

export const getChatHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [] });
    }, 500);
  });
};

export default api;