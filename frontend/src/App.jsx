import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Cloud, LogIn } from 'lucide-react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FilePreviewModal from './components/FilePreviewModal'
import './index.css'

const Layout = ({ children }) => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  if (isAuthPage) {
    return children
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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'var(--primary-color)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>CloudStore</h2>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={18} /> Sign In
            </Link>
          </div>
        </div>
      </header>
      <main className="container">
        {children}
      </main>
    </div>
  )
}

const Home = () => {
  const [files, setFiles] = useState([])
  const [previewFile, setPreviewFile] = useState(null)

  const handleFileUpload = (newFiles) => {
    const uploadedFiles = Array.from(newFiles).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      date: new Date().toLocaleDateString(),
      previewUrl: URL.createObjectURL(file), // Create object URL for preview
      originalFile: file
    }))
    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const handleDelete = (id) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id)
      // Cleanup object URL to avoid memory leaks
      const fileToDelete = prev.find(f => f.id === id)
      if (fileToDelete && fileToDelete.previewUrl) {
        URL.revokeObjectURL(fileToDelete.previewUrl)
      }
      return newFiles
    })
  }

  const handlePreview = (file) => {
    setPreviewFile(file)
  }

  return (
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
        <FileList files={files} onDelete={handleDelete} onPreview={handlePreview} />
      </div>

      {previewFile && (
        <FilePreviewModal 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
