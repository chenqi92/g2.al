import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata: {
    user_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Use localStorage for simple state persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const signInWithGithub = async () => {
    // In a real implementation, you would integrate with GitHub OAuth
    // For now, simulate a sign-in with mock data
    const mockUser: User = {
      id: 'github-' + Math.random().toString(36).substring(2, 9),
      email: 'github-user@example.com',
      user_metadata: {
        user_name: 'GitHub User'
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signInWithGoogle = async () => {
    // In a real implementation, you would integrate with Google OAuth
    // For now, simulate a sign-in with mock data
    const mockUser: User = {
      id: 'google-' + Math.random().toString(36).substring(2, 9),
      email: 'google-user@example.com',
      user_metadata: {
        user_name: 'Google User'
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGithub, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};