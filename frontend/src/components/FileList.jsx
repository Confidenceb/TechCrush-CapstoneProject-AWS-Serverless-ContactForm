const FileList = ({ files, onDelete }) => {
  if (!files || files.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        borderStyle: 'dashed'
      }}>
        No files uploaded yet
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {files.map((file) => (
        <div 
          key={file.id} 
          className="card"
          style={{ 
            padding: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#2a2a2a', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              📄
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{file.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {file.size} • {file.date}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
              title="Download"
            >
              ⬇️
            </button>
            <button 
              className="btn" 
              style={{ 
                padding: '0.4rem 0.8rem', 
                fontSize: '0.9rem',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.2)'
              }}
              onClick={() => onDelete(file.id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FileList
