import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context';
import Layout from './components/Layout';
import Toast from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Book from './pages/Book';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import AdminSchedule from './pages/AdminSchedule';

function Protected({ children, role }) {
  const { user, ready } = useApp();
  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          color: '#F5E642',
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        Loading DockBook…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <Layout>{children}</Layout>;
}

function PublicOnly({ children }) {
  const { user, ready } = useApp();
  if (!ready) return null;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Protected role="user">
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/book"
        element={
          <Protected role="user">
            <Book />
          </Protected>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <Protected role="user">
            <MyBookings />
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected role="admin">
            <Admin />
          </Protected>
        }
      />
      <Route
        path="/admin/schedule"
        element={
          <Protected role="admin">
            <AdminSchedule />
          </Protected>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toast />
        <Analytics />
      </AppProvider>
    </BrowserRouter>
  );
}
