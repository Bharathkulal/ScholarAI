import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session_expired');

  const handleMockLogin = (role) => {
    localStorage.setItem('token', 'mock-jwt-token-value');
    localStorage.setItem('user', JSON.stringify({
      id: 'mock-user-id',
      email: role === 'admin' ? 'admin@scholarai.com' : 'student@scholarai.com',
      role: role,
      name: role === 'admin' ? 'System Administrator' : 'Jane Student'
    }));
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 select-none">
      <div className="max-w-md w-full glass-card p-8">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-dark-500 text-sm mt-1">Access your ScholarAI account</p>
        </div>

        {sessionExpired && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Your session has expired. Please sign in again.
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleMockLogin('student')}
            className="w-full btn-primary"
          >
            Sign In as Student (Mock)
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleMockLogin('admin')}
            className="w-full btn-secondary"
          >
            Sign In as Administrator (Mock)
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-dark-500 leading-relaxed">
          These buttons simulate a successful JWT authentication flow and populate credentials in local storage to demonstrate Route Protection.
        </p>
      </div>
    </div>
  );
};

export default Login;
