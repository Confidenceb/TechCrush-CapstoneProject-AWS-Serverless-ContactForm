import { File, FileText, Image, Film, Music, Download, Trash2, FileCode, Eye } from 'lucide-react'
import { getFileUrl } from '../utils/api'

const getFileIcon = (fileName, type) => {
  const extension = fileName.split('.').pop().toLowerCase()
  const size = 24
  const color = "var(--text-secondary)"

  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
    return <Image size={size} color="#a855f7" />
  }
  if (type.startsWith('video/') || ['mp4', 'mov', 'avi'].includes(extension)) {
    return <Film size={size} color="#ef4444" />
  }
  if (type.startsWith('audio/') || ['mp3', 'wav'].includes(extension)) {
    return <Music size={size} color="#eab308" />
  }
  if (['pdf'].includes(extension)) {
    return <FileText size={size} color="#ef4444" />
  }
  if (['doc', 'docx', 'txt'].includes(extension)) {
    return <FileText size={size} color="#3b82f6" />
  }
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json'].includes(extension)) {
    return <FileCode size={size} color="#22c55e" />
  }
  return <File size={size} color={color} />
}

const handleDownload = async (file) => {
  try {
    // Get signed URL
    const downloadUrl = await getFileUrl(file.id);
    
    // Download file
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download file: ' + (error.response?.data?.message || error.message));
  }
};

const FileList = ({ files, onDelete, onPreview }) => {
  if (!files || files.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem', 
        color: 'var(--text-secondary)',
        border: '1px dashed var(--border-color)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)'
      }}>
        <File size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
        <p>No files uploaded yet</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} role="list">
      {files.map((file) => (
        <div 
          key={file.id} 
          className="card file-card"
          onClick={() => onPreview(file)}
          role="listitem"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onPreview(file)
            }
          }}
          style={{ 
            padding: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            transition: 'transform 0.2s, border-color 0.2s',
            cursor: 'pointer',
            outline: 'none'
          }}
          aria-label={`Preview ${file.name}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#2a2a2a', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} aria-hidden="true">
              {getFileIcon(file.name, file.type)}
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: '1rem' }}>{file.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {file.size} • {file.date}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn-icon"
              title="Preview"
              aria-label={`Preview ${file.name}`}
              onClick={() => onPreview(file)}
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a'
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <Eye size={20} aria-hidden="true" />
            </button>
            <button 
              className="btn-icon"
              title="Download"
              aria-label={`Download ${file.name}`}
              onClick={() => handleDownload(file)}
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a'
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <Download size={20} aria-hidden="true" />
            </button>
            <button 
              className="btn-icon"
              title="Delete"
              aria-label={`Delete ${file.name}`}
              onClick={() => onDelete(file.id)}
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                e.currentTarget.style.color = '#ef4444'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <Trash2 size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FileList;