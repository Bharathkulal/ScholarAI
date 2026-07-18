import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { loginSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/forms/FormInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

// Custom lightweight zod resolver to avoid external dependency issues if resolvers are not fully resolved
const customResolver = (schema) => async (values) => {
  try {
    const data = schema.parse(values);
    return { values: data, errors: {} };
  } catch (err) {
    const errors = {};
    if (err.errors) {
      err.errors.forEach((e) => {
        const path = e.path.join('.');
        errors[path] = { message: e.message };
      });
    }
    return { values: {}, errors };
  }
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session_expired');

  const methods = useForm({
    resolver: customResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const profile = await login(data.email, data.password);
      toast.success(`Welcome back, ${profile.full_name}!`);
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      toast.error('Login failed. Please check credentials.');
    }
  };

  const handleQuickPrefill = (role) => {
    if (role === 'admin') {
      methods.setValue('email', 'admin@scholarai.com');
      methods.setValue('password', 'admin123');
    } else {
      methods.setValue('email', 'student@scholarai.com');
      methods.setValue('password', 'student123');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to manage your scholarships</p>
      </div>

      {sessionExpired && (
        <Alert variant="danger" title="Session Expired">
          Your session has expired. Please sign in again.
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="email"
            label="Email Address"
            placeholder="name@example.com"
            icon={Mail}
            required
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Button
            type="submit"
            className="w-full h-11"
            isLoading={methods.formState.isSubmitting}
          >
            Sign In
          </Button>
        </form>
      </FormProvider>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-800 px-2 text-slate-400 font-semibold">Demo Prefills</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="text-xs !py-2"
          onClick={() => handleQuickPrefill('student')}
        >
          Prefill Student
        </Button>
        <Button
          variant="secondary"
          className="text-xs !py-2"
          onClick={() => handleQuickPrefill('admin')}
        >
          Prefill Admin
        </Button>
      </div>

      <p className="text-center text-xs text-slate-500 mt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:underline font-bold">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
