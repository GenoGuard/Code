import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout-with-router';
import { HomePage } from './components/HomePage';
import { SequenceManager } from './components/SequenceManager';
import Analysis from './components/Analysis-with-modal';
import { Results } from './components/Results';
import GeneLibrary from './components/GeneLibrary';
import { Account } from './components/Account';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import AuthScreen from "./components/Login";
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { supabase } from './supabaseClient';
import { supabaseService } from './services/SupabaseService';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Check Supabase auth session on load
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email ?? '');
        setIsDemoMode(false);
      } else {
        const demo = localStorage.getItem('genoguard-demo');
        if (demo === 'true') {
          setIsAuthenticated(true);
          setIsDemoMode(true);
          setUserEmail('demo@genoguard.com');
        }
      }

      setLoading(false);
    };

    initAuth();

    // 🔄 Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email ?? '');
          setIsDemoMode(false);
        } else {
          setIsAuthenticated(false);
          setUserEmail('');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔑 Login with Supabase
  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
  };

  // 📝 Sign up with Supabase
  const handleSignup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      'Account created! Please check your email to verify your account before logging in.'
    );
  };

  // 🎮 Demo mode
  const handleDemoMode = () => {
    localStorage.setItem('genoguard-demo', 'true');
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setUserEmail('demo@genoguard.com');
  };

  // 🚪 Logout
  const handleLogout = async () => {
    localStorage.removeItem('genoguard-demo');
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsDemoMode(false);
    setUserEmail('');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading GenoGuard...</p>
        </div>
      </div>
    );
  }

  // Public routes (accessible without login)
  const PublicRoutes = () => (
    <Routes>
      <Route path="/privacy" element={<PrivacyPolicy onBack={() => navigate('/')} />} />
      <Route path="/terms" element={<TermsOfService onBack={() => navigate('/')} />} />
      <Route path="*" element={
        <AuthScreen
          onLogin={handleLogin}
          onSignup={handleSignup}
          onDemoMode={handleDemoMode}
        />
      } />
    </Routes>
  );

  // Protected routes (requires authentication)
  const ProtectedRoutes = () => (
    <Layout
      userEmail={userEmail}
      isDemoMode={isDemoMode}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<HomePage onNavigate={(page) => navigate(`/${page.toLowerCase().replace(/ /g, '-')}`)} />} />
        <Route path="/sequence-manager" element={<SequenceManager />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/results" element={<Results />} />
        <Route path="/gene-library" element={<GeneLibrary />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/account" element={
          <Account
            userEmail={userEmail}
            isDemoMode={isDemoMode}
            onLogout={handleLogout}
            onBack={() => navigate('/')}
          />
        } />
        <Route path="/privacy" element={<PrivacyPolicy onBack={() => navigate('/')} />} />
        <Route path="/terms" element={<TermsOfService onBack={() => navigate('/')} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );

  return isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;