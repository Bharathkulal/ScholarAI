import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/forms/FormInput';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User } from 'lucide-react';
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

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: customResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      toast.success('Registration successful!');
      const profile = await login(data.email, data.password);
      toast.success(`Welcome to ScholarAI, ${profile.full_name}!`);
      navigate('/dashboard');
    } catch (e) {
      toast.error('Registration failed.');
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
          Create Account
        </h2>
        <p className="text-xs font-sans text-[#666666] mt-1">
          Join 120,000+ students finding verified grants
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="fullName"
            label="Full Name"
            placeholder="Jane Doe"
            icon={User}
            required
          />

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

          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Button
            type="submit"
            className="w-full h-12 text-xs uppercase font-heading tracking-wider mt-2"
            isLoading={methods.formState.isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-xs text-[#666666] mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-[#CD0000] font-heading uppercase font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
