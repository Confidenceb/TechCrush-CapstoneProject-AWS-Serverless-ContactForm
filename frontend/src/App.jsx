import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Cloud, LogIn } from 'lucide-react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import FilePreviewModal from './components/FilePreviewModal'
import SearchFilter from './components/SearchFilter'
import './index.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import { FileProvider, useFile } from './context/FileContext'
import ProtectedRoute from './components/ProtectedRoute'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link to="/profile" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.1)'
                  }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span style={{ fontWeight: '500' }}>{user.name}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="btn" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: 'transparent',
                    border: '1px solid var(--border-color)'
                  }}
                >
                   Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogIn size={18} /> Sign In
              </Link>
            )}
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
  const { files, addFiles, removeFile, loading } = useFile()
  const [previewFile, setPreviewFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const handlePreview = async (file) => {
    try {
      // Get signed URL from backend if file doesn't have previewUrl
      if (!file.previewUrl) {
        const { getFileUrl } = await import('./utils/api');
        const downloadUrl = await getFileUrl(file.id);
        setPreviewFile({ 
          ...file, 
          previewUrl: downloadUrl 
        });
      } else {
        setPreviewFile(file);
      }
    } catch (error) {
      console.error('Failed to get preview URL:', error);
      alert('Failed to preview file: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredFiles = files.filter(file => {
    // Add null checks for all fields
    const fileName = file.fileName || file.name || '';
    const fileType = file.fileType || file.type || '';
    
    const matchesSearch = fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    
    if (filterType === 'image') return matchesSearch && fileType.startsWith('image/');
    if (filterType === 'video') return matchesSearch && fileType.startsWith('video/');
    if (filterType === 'audio') return matchesSearch && fileType.startsWith('audio/');
    
    if (filterType === 'document') {
      const ext = fileName.split('.').pop().toLowerCase();
      return matchesSearch && ['pdf', 'doc', 'docx', 'txt'].includes(ext);
    }
    
    return matchesSearch;
  });
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading your files...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Secure Cloud Storage</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Upload, store, and share your files with enterprise-grade security.
        </p>
      </div>

      <FileUpload onUpload={addFiles} />
      
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Your Files</h3>
        <SearchFilter 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          filterType={filterType} 
          setFilterType={setFilterType} 
        />
        <FileList files={filteredFiles} onDelete={removeFile} onPreview={handlePreview} />
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
    <AuthProvider>
      <FileProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </FileProvider>
    </AuthProvider>
  )
}

export default App;