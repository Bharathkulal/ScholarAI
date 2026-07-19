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
import { loadGoogleScript, fetchGoogleUserInfo } from '../utils/googleAuth';

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

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

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '950177095291-rcv6k6u1fiammaqpi9iolv01628j6gao.apps.googleusercontent.com';

  const handleGoogleSignInClick = () => {
    loadGoogleScript().then((google) => {
      if (!google || !google.accounts?.oauth2) {
        toast.error('Google Sign-In SDK is loading. Please try again.');
        return;
      }

      const client = google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            toast.loading('Verifying Google Account credentials...', { id: 'google-login' });
            const googleUserInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
            if (googleUserInfo && googleUserInfo.email) {
              const googleProfile = {
                email: googleUserInfo.email,
                full_name: googleUserInfo.name || googleUserInfo.given_name || 'Google User',
                avatar: googleUserInfo.picture,
              };
              await login(googleUserInfo.email, 'google_oauth', googleProfile);
              toast.success(`Welcome, ${googleProfile.full_name}! Signed in via Google.`, { id: 'google-login' });
              navigate('/dashboard');
            } else {
              toast.error('Could not retrieve Google profile details.', { id: 'google-login' });
            }
          } else if (tokenResponse.error) {
            toast.error(`Google Sign-In Error: ${tokenResponse.error}`);
          }
        },
        error_callback: (err) => {
          console.error('Google OAuth Popup Error:', err);
        }
      });

      client.requestAccessToken();
    });
  };

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

      {/* Continue with Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignInClick}
        className="w-full min-h-[44px] py-3 px-4 rounded-[16px] bg-white border border-[#DDDDDD] hover:bg-[#EFEDE6] text-[#111111] font-heading font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-soft hover:shadow-lift cursor-pointer"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DDDDDD]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-heading font-bold">
          <span className="bg-white px-3 text-[#888888]">or sign in with email</span>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full h-12 text-xs uppercase font-heading tracking-wider min-h-[44px]"
            isLoading={methods.formState.isSubmitting}
          >
            Sign In to Portal
          </Button>
        </form>
      </FormProvider>

      <div className="relative my-1">
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
          className="text-xs font-heading uppercase tracking-wider !py-2.5 min-h-[44px]"
          onClick={() => handleQuickPrefill('student')}
        >
          Prefill Student
        </Button>
        <Button
          variant="secondary"
          className="text-xs font-heading uppercase tracking-wider !py-2.5 min-h-[44px]"
          onClick={() => handleQuickPrefill('admin')}
        >
          Prefill Admin
        </Button>
      </div>

      <p className="text-center text-xs text-[#666666] mt-1">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#CD0000] font-heading uppercase font-bold hover:underline">
          Register here
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
