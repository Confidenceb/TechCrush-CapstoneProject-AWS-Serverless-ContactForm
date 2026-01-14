import { useState, useRef } from 'react';
import { User, Mail, Save, Edit2, Camera, Database, FileText, HardDrive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFile } from '../context/FileContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { fileStats } = useFile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || null
  });

  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || null);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || null
    });
    setPreviewAvatar(user?.avatar || null);
  };

  if (!user) return null;

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '0 1rem',
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'relative',
        background: 'rgba(20, 20, 20, 0.6)', 
        borderRadius: '24px', 
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%'
      }}>
        <div style={{
          height: '130px',
          background: 'linear-gradient(90deg, var(--primary-color) 0%, #a855f7 100%)',
          opacity: 0.15,
          flexShrink: 0
        }}></div>

        <div style={{ 
          padding: '0 2.5rem 2.5rem 2.5rem', 
          marginTop: '-65px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div style={{ 
              position: 'relative',
              width: '130px',
              height: '130px',
              flexShrink: 0
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '6px solid #1a1a1a',
                background: '#2a2a2a',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}>
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}>
                    {getInitials(formData.name)}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    border: '3px solid #1a1a1a',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Change Avatar"
                >
                  <Camera size={16} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>

            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn"
                style={{ 
                  borderRadius: '50px',
                  padding: '0.6rem 1.25rem',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.9rem'
                }}
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>

          <div>
            {!isEditing ? (
              <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{user.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                  <Mail size={16} /> {user.email}
                </p>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>User ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.id.substring(0, 8)}...</div>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Member Since</div>
                    <div style={{ fontSize: '1rem' }}>{new Date().toLocaleDateString()}</div>
                  </div>
                  
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       <FileText size={14} /> Total Files
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{fileStats.totalFiles}</div>
                  </div>
                  
                   <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       <Database size={14} /> Used Storage
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{fileStats.totalSize}</div>
                  </div>

                   <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       <HardDrive size={14} /> Heaviest File
                    </div>
                    <div style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fileStats.largestFile ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span title={fileStats.largestFile.name} style={{overflow:'hidden', textOverflow:'ellipsis'}}>{fileStats.largestFile.name}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1rem', flexShrink: 0 }}>
                            {fileStats.largestFile.size}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No files uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                 <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="Your full name"
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem 0.75rem 0.75rem 3rem',
                          fontSize: '1rem',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="input"
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem 0.75rem 0.75rem 3rem', 
                          fontSize: '1rem',
                          opacity: 0.6, 
                          cursor: 'not-allowed',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid transparent',
                          borderRadius: '12px',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.6rem',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: 'var(--text-secondary)'
                      }}>
                        Read-only
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn"
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid transparent',
                      padding: '0.6rem 2rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      borderRadius: '50px',
                      padding: '0.6rem 2rem',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;