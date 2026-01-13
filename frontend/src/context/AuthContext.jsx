import { createContext, useContext, useState, useEffect } from 'react';

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
    // Mock login logic
    // In real app: const response = await api.post('/login', { email, password });
    
    console.log('[MOCK] Logging in:', email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 'mock-user-123',
      email: email,
      name: email.split('@')[0],
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    
    return mockUser;
  };

  const signup = async (name, email, password) => {
    // Mock signup logic
    console.log('[MOCK] Signing up:', { name, email });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 'mock-user-' + Date.now(),
      email: email,
      name: name,
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    
    return mockUser;
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
