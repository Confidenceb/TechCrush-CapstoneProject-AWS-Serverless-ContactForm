import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      // First register
      await api.post('/auth/register', { name, email, password });
      
      // Then login
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const updateProfile = async (data) => {
    try {
      // If avatar is provided and it's a base64 string, upload it
      if (data.avatar && data.avatar.startsWith('data:image')) {
        // Convert base64 to blob
        const response = await fetch(data.avatar);
        const blob = await response.blob();
        
        // Create form data for avatar upload
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.jpg');
        
        // Upload avatar
        const avatarResponse = await api.post('/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update user with new avatar URL
        data.avatar = avatarResponse.data.avatar;
      }
      
      // Update name if changed
      if (data.name && data.name !== user.name) {
        await api.put('/profile', { name: data.name });
      }
      
      // Update local state
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
