
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';

function ProtectedDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading Sweety...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardPage />;
}

function ProtectedReports() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading Sweety...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <ReportsPage />;
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
      <Route path="/reports" element={<ProtectedReports />} />
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
