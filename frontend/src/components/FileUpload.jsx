import { useState, useRef } from 'react'
import { Upload, File, FileText, Image, Film, Music } from 'lucide-react'

const FileUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files)
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
      <p style={{ color: 'var(--text-secondary)', margin: 0, maxWidth: '300px', marginInline: 'auto' }}>
        Support for documents, images, videos, and audio files.
      </p>
    </div>
  )
}

export default FileUpload
