import { Search, Filter, X } from 'lucide-react'

const SearchFilter = ({ searchQuery, setSearchQuery, filterType, setFilterType }) => {
  const filters = [
    { id: 'all', label: 'All Files' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'document', label: 'Documents' },
  ]

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ 
        position: 'relative', 
        marginBottom: '1rem',
        maxWidth: '100%'
      }}>
        <input
          type="text"
          placeholder="Search your files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <Search 
          size={20} 
          color="var(--text-secondary)" 
          style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }} 
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        overflowX: 'auto', 
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none'  // IE/Edge
      }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `1px solid ${filterType === filter.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
              background: filterType === filter.id ? 'var(--primary-color)' : 'transparent',
              color: filterType === filter.id ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchFilter
