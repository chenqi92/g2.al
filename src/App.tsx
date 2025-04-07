import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import URLShortener from './pages/URLShortener';
import TempMail from './pages/TempMail';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden flex flex-col">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-mesh-pattern opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-radial from-secondary-500/10 via-transparent to-transparent transform translate-x-full"></div>
          <motion.div
            className="absolute -inset-[100%] opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, transparent 0%, #1ec2ff 50%, transparent 100%)",
                "radial-gradient(circle at 100% 100%, transparent 0%, #6259ff 50%, transparent 100%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/url-shortener" element={<URLShortener />} />
              <Route path="/temp-mail" element={<TempMail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#34d399',
                secondary: '#1f2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#1f2937',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;