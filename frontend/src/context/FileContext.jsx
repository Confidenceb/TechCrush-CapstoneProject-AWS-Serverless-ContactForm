import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../utils/api';

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  // Normalize file data to have consistent field names
  const normalizeFile = (file) => ({
    ...file,
    // Ensure both old and new field names work
    name: file.fileName || file.name || 'Unnamed',
    fileName: file.fileName || file.name || 'Unnamed',
    type: file.fileType || file.type || 'application/octet-stream',
    fileType: file.fileType || file.type || 'application/octet-stream',
    size: file.fileSize || file.size || 0,
    fileSize: file.fileSize || file.size || 0,
  });

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/protected');
      console.log('Loaded files:', response.data.files);
      
      // Normalize all files
      const normalizedFiles = (response.data.files || []).map(normalizeFile);
      setFiles(normalizedFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const addFiles = async (newFiles) => {
    setUploading(true);
    
    for (const file of newFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        console.log('File uploaded:', response.data.file);
        
        // Normalize and add the new file
        const normalizedFile = normalizeFile(response.data.file);
        setFiles(prev => [...prev, normalizedFile]);
        
      } catch (error) {
        console.error('Upload failed:', error);
        alert(`Failed to upload ${file.name}: ${error.response?.data?.error || error.message}`);
      }
    }
    
    setUploading(false);
  };

  const removeFile = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    
    if (gb >= 1) return gb.toFixed(2) + ' GB';
    if (mb >= 1) return mb.toFixed(2) + ' MB';
    return kb.toFixed(2) + ' KB';
  };

  const fileStats = useMemo(() => {
    if (!files || files.length === 0) {
      return {
        totalFiles: 0,
        totalSize: '0 KB',
        largestFile: null
      };
    }

    const totalFiles = files.length;
    const totalSizeBytes = files.reduce((acc, file) => {
      return acc + (file.fileSize || 0);
    }, 0);

    const largestFile = files.reduce((max, file) => {
      if (!max) return file;
      return (file.fileSize || 0) > (max.fileSize || 0) ? file : max;
    }, null);

    return {
      totalFiles,
      totalSize: formatBytes(totalSizeBytes),
      largestFile: largestFile ? {
        ...largestFile,
        formattedSize: formatBytes(largestFile.fileSize)
      } : null
    };
  }, [files]);

  const value = {
    files,
    addFiles,
    removeFile,
    fileStats,
    loading,
    uploading,
    refreshFiles: loadFiles
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};