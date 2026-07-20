import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Routes & Pages
import ProtectedRouter from './routes/ProtectedRouter';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Scholarships from './pages/Scholarships';
import ScholarshipDetails from './pages/ScholarshipDetails';
import Recommendations from './pages/Recommendations';
import Applications from './pages/Applications';
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  // Public general pages
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  
  // Authentication centered card pages
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  
  // Student Portal protected pages
  {
    path: '/',
    element: (
      <ProtectedRouter allowedRoles={['student', 'admin', 'super_admin']}>
        <StudentLayout />
      </ProtectedRouter>
    ),
    children: [
      { path: 'student/dashboard', element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'scholarships', element: <Scholarships /> },
      { path: 'scholarships/:slug', element: <ScholarshipDetails /> },
      { path: 'recommendations', element: <Recommendations /> },
      { path: 'applications', element: <Applications /> },
      { path: 'documents', element: <Documents /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // Admin Portal console pages
  {
    path: '/',
    element: (
      <ProtectedRouter allowedRoles={['admin', 'super_admin']}>
        <AdminLayout />
      </ProtectedRouter>
    ),
    children: [
      { path: 'admin/dashboard', element: <AdminDashboard /> },
      { path: 'admin', element: <AdminDashboard /> },
    ],
  },

  // Super Admin Portal console pages
  {
    path: '/',
    element: (
      <ProtectedRouter allowedRoles={['super_admin']}>
        <SuperAdminLayout />
      </ProtectedRouter>
    ),
    children: [
      { path: 'super-admin/dashboard', element: <SuperAdminDashboard /> },
      { path: 'super-admin', element: <SuperAdminDashboard /> },
    ],
  },

  // Catch-all 404 handler
  {
    path: '*',
    element: <NotFound />,
  }
]);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#334155',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '12px',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
