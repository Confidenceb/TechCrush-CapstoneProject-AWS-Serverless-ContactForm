import { useState, useRef } from 'react'

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
      className="card"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--border-color)'}`,
        backgroundColor: isDragging ? 'rgba(100, 108, 255, 0.05)' : 'var(--surface-color)',
        textAlign: 'center',
        padding: '3rem 2rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        multiple
      />
      <div style={{ 
        fontSize: '3rem', 
        marginBottom: '1rem',
        color: isDragging ? 'var(--primary-color)' : 'var(--text-secondary)'
      }}>
        ☁️
      </div>
      <h3 style={{ marginBottom: '0.5rem' }}>
        {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
      </h3>
      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
        Support for documents, images, and videos
      </p>
    </div>
  )
}

export default FileUpload
