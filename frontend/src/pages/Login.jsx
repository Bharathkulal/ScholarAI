import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { loginSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/forms/FormInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-extrabold uppercase font-heading text-[#111111] tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs font-sans text-[#666666] mt-1">
          Access your AI scholarship matching portal
        </p>
      </div>

      {sessionExpired && (
        <Alert variant="danger" title="Session Expired">
          Your session has expired. Please sign in again.
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            name="email"
            label="Email Address"
            placeholder="student@scholarai.com"
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
            className="w-full h-12 text-xs uppercase font-heading tracking-wider"
            isLoading={methods.formState.isSubmitting}
          >
            Sign In to Portal
          </Button>
        </form>
      </FormProvider>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-[#DDDDDD]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-heading font-bold">
          <span className="bg-white px-3 text-[#888888]">Quick Demo Login</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="text-xs font-heading uppercase tracking-wider !py-2.5"
          onClick={() => handleQuickPrefill('student')}
        >
          Prefill Student
        </Button>
        <Button
          variant="secondary"
          className="text-xs font-heading uppercase tracking-wider !py-2.5"
          onClick={() => handleQuickPrefill('admin')}
        >
          Prefill Admin
        </Button>
      </div>

      <p className="text-center text-xs text-[#666666] mt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#CD0000] font-heading uppercase font-bold hover:underline">
          Register here
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
