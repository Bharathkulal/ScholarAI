import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import ProtectedRouter from './routes/ProtectedRouter';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Scholarships from './pages/Scholarships';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'scholarships', element: <Scholarships /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRouter allowedRoles={['student', 'admin']}>
            <Dashboard />
          </ProtectedRouter>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRouter allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRouter>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
