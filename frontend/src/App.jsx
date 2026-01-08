import { useState } from 'react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import './index.css'

function App() {
  const [files, setFiles] = useState([])

  const handleFileUpload = (newFiles) => {
    // Placeholder for actual upload logic
    const uploadedFiles = Array.from(newFiles).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      date: new Date().toLocaleDateString()
    }))
    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const handleDelete = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="app-layout">
      <header style={{ 
        borderBottom: '1px solid var(--border-color)', 
        padding: '1rem 0',
        marginBottom: '2rem',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(45deg, var(--primary-color), #a855f7)',
              borderRadius: '8px'
            }}></div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>CloudStore</h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn">Sign In</button>
          </div>
        </div>
      </header>

      <main className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1>Secure Cloud Storage</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              Upload, store, and share your files with enterprise-grade security.
            </p>
          </div>

          <FileUpload onUpload={handleFileUpload} />
          
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Files</h3>
            <FileList files={files} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
