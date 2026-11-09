import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

function ProtectedDashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading Sweety...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main style={{ padding: 40, fontFamily: 'inherit' }}>
      <h1>Welcome to Sweety, {user.name}!</h1>
      <p>Your personal blood glucose tracker.</p>
      <button onClick={logout}>Sign out</button>
    </main>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading Sweety...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route path="/" element={<ProtectedDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
