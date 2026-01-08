import { X } from 'lucide-react'

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null

  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  const isPDF = file.type === 'application/pdf'
  const isText = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.css') || file.name.endsWith('.html')

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }} onClick={onClose}>
      <div style={{
        position: 'relative',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: 'auto',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #333'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderBottom: '1px solid #333'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', maxWidth: '80%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {file.name}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#333'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#a1a1aa'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ 
          padding: '0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#000',
          minWidth: '300px',
          minHeight: '200px'
        }}>
          {isImage && (
            <img 
              src={file.previewUrl} 
              alt={file.name} 
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
            />
          )}
          
          {isVideo && (
            <video 
              controls 
              src={file.previewUrl} 
              style={{ maxWidth: '100%', maxHeight: '70vh' }} 
            />
          )}

          {isPDF && (
            <iframe 
              src={file.previewUrl} 
              style={{ width: '80vw', height: '70vh', border: 'none' }} 
              title={file.name}
            />
          )}

          {isText && (
             <div style={{ 
               padding: '1rem', 
               width: '80vw', 
               height: '70vh', 
               overflow: 'auto', 
               color: '#e5e5e5',
               fontFamily: 'monospace',
               fontSize: '0.9rem',
               whiteSpace: 'pre-wrap'
             }}>
               Preview not available for text files in this demo mode (requires reading file content).
               <br/><br/>
               (In a real app, we would fetch the content and display it here.)
             </div>
          )}

          {!isImage && !isVideo && !isPDF && !isText && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
              <p>Preview not available for this file type.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilePreviewModal
