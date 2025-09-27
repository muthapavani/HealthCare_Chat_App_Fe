import React, { useState } from 'react';
import { useApp } from '/src/contexts/AppContext';
import { FiFile, FiTrash2, FiCheck, FiClock, FiAlertCircle, FiEye, FiX } from 'react-icons/fi';

const DocumentList = () => {
  const { documents, deleteDocument } = useApp();
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <FiCheck className="w-3 h-3 text-green-500" />;
      case 'processing':
        return <FiClock className="w-3 h-3 text-yellow-500" />;
      case 'error':
        return <FiAlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <FiClock className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
      case 'doc':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📎';
    }
  };

  const renderPreviewContent = () => {
    if (!previewDocument) return null;
    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{getFileIcon(previewDocument.name)}</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {previewDocument.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatFileSize(previewDocument.size)} • {formatDate(previewDocument.uploadDate)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
              <span className="ml-2 capitalize text-gray-900 dark:text-white">
                {previewDocument.status}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-300">Type:</span>
              <span className="ml-2 text-gray-900 dark:text-white uppercase">
                {previewDocument.name.split('.').pop()}
              </span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">Uploaded:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {formatDate(previewDocument.uploadDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {previewDocument.status === 'processed' 
              ? 'Document content would be displayed here. In a real application, this would show the actual document content based on file type.'
              : 'Document is still processing. Preview will be available once processing is complete.'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col">
        <h2 className="text-lg font-semibold p-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
          Documents ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
            <FiFile className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No documents uploaded</p>
            <p className="text-sm text-center">Upload PDF, DOCX, or TXT files to start chatting about your healthcare documents</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-2 space-y-2">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FiFile className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {document.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(document.size)}</span>
                        <span>•</span>
                        <span>{formatDate(document.uploadDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs">
                      {getStatusIcon(document.status)}
                      <span className="capitalize hidden sm:inline">{document.status}</span>
                    </div>
                    
                    <button
                      onClick={() => handlePreview(document)}
                      className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                      title="Preview document"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteDocument(document.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                      title="Delete document"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Document Preview
              </h3>
              <button
                onClick={closePreview}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              {renderPreviewContent()}
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={closePreview}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentList;