import { createContext, useContext, useState, useMemo } from 'react';

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  const addFiles = (newFiles) => {
    const uploadedFiles = Array.from(newFiles).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      date: new Date().toLocaleDateString(),
      previewUrl: URL.createObjectURL(file), // Create object URL for preview
      originalFile: file
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      // Cleanup object URL to avoid memory leaks
      const fileToDelete = prev.find(f => f.id === id);
      if (fileToDelete && fileToDelete.previewUrl) {
        URL.revokeObjectURL(fileToDelete.previewUrl);
      }
      return newFiles;
    });
  };

  const fileStats = useMemo(() => {
    const totalFiles = files.length;
    
    // Calculate total size using originalFile.size (bytes)
    const totalSizeBytes = files.reduce((acc, file) => {
      return acc + (file.originalFile ? file.originalFile.size : 0);
    }, 0);

    // Format total size
    let formattedTotalSize = '0 KB';
    if (totalSizeBytes > 1024 * 1024) {
      formattedTotalSize = (totalSizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      formattedTotalSize = (totalSizeBytes / 1024).toFixed(2) + ' KB';
    }

    // Find largest file
    const largestFile = files.reduce((max, file) => {
      const currentSize = file.originalFile ? file.originalFile.size : 0;
      const maxSize = max.originalFile ? max.originalFile.size : 0;
      return currentSize > maxSize ? file : max;
    }, files[0] || null);

    return {
      totalFiles,
      totalSize: formattedTotalSize,
      largestFile
    };
  }, [files]);

  const value = {
    files,
    addFiles,
    removeFile,
    fileStats
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
