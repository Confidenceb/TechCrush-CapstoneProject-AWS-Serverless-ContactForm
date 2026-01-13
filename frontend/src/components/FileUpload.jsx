import { useState, useRef } from 'react'
import { Upload, File, FileText, Image, Film, Music } from 'lucide-react'

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'audio/mpeg', 'audio/wav',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/json', 'text/javascript', 'text/css'
];

const FileUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 50MB limit: ${file.name}`;
    }
    // Optional: Strict type checking, but for now we'll be lenient as per requirements
    // if (!ALLOWED_TYPES.includes(file.type)) {
    //   return `File type not supported: ${file.name}`;
    // }
    return null;
  }

  const simulateUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    let validationError = null;

    for (const file of fileArray) {
      const err = validateFile(file);
      if (err) {
        validationError = err;
        break;
      }
      validFiles.push(file);
    }

    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (validFiles.length > 0) {
      // Simulate upload progress
      setCurrentFile(validFiles[0].name + (validFiles.length > 1 ? ` + ${validFiles.length - 1} others` : ''));
      setUploadProgress(0);
      setError(null);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUpload(validFiles);
            setUploadProgress(0);
            setCurrentFile(null);
          }, 500);
        }
      }, 100);
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files)
    }
  }

  return (
    <div
      className="card upload-card"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
      style={{
        border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--border-color)'}`,
        backgroundColor: isDragging ? 'rgba(100, 108, 255, 0.05)' : 'var(--surface-color)',
        textAlign: 'center',
        padding: '4rem 2rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        multiple
      />
      
      <div style={{ 
        width: '80px', 
        height: '80px', 
        backgroundColor: isDragging ? 'rgba(100, 108, 255, 0.1)' : '#2a2a2a',
        borderRadius: '50%',
        margin: '0 auto 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        transform: isDragging ? 'scale(1.1)' : 'scale(1)'
      }}>
        <Upload 
          size={40} 
          color={isDragging ? 'var(--primary-color)' : 'var(--text-secondary)'} 
          style={{ transition: 'color 0.3s ease' }}
        />
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
        {isDragging ? 'Drop files to upload' : 'Click or drag files to upload'}
      </h3>

      {error && (
        <div style={{
          color: '#ef4444',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '300px',
          margin: '0 auto 1rem'
        }}>
          {error}
        </div>
      )}

      {uploadProgress > 0 && (
        <div style={{ maxWidth: '300px', margin: '0 auto 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Uploading {currentFile}...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{ height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: 'var(--primary-color)', 
              width: `${uploadProgress}%`,
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>
      )}
      <p style={{ color: 'var(--text-secondary)', margin: 0, maxWidth: '300px', marginInline: 'auto' }}>
        Support for documents, images, videos, and audio files.
      </p>
    </div>
  )
}

export default FileUpload
