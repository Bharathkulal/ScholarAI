import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { profileSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/forms/FormInput';
import { FormSelect } from '../components/forms/FormSelect';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { UserCheck, Award, CreditCard, MapPin } from 'lucide-react';
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

const Profile = () => {
  const { user } = useAuth();

  const methods = useForm({
    resolver: customResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || 'Amit Kumar',
      gpa: user?.gpa || '9.2',
      income: user?.income || '240,000 INR',
      category: user?.category || 'OBC',
      state: user?.state || 'Maharashtra',
    },
  });

  const onSubmit = (data) => {
    toast.success('Profile settings updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto select-none">
      <PageTitle
        title="Student Profile"
        description="Verify and update your academic scores, categories, and financial indicators to fetch matched scholarships."
      />

      <Card>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
              />
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">{user?.full_name || 'Amit Kumar'}</h4>
                <p className="text-xs text-slate-400">Unique Student ID: #SCH-29472</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                name="fullName"
                label="Full Name"
                icon={UserCheck}
                required
              />

              <FormInput
                name="gpa"
                label="Academic GPA / CGPA"
                icon={Award}
                required
              />

              <FormInput
                name="income"
                label="Annual Family Income"
                icon={CreditCard}
                required
              />

              <FormSelect
                name="category"
                label="Category / Social Status"
                required
                options={[
                  { label: 'General', value: 'General' },
                  { label: 'OBC (Other Backward Classes)', value: 'OBC' },
                  { label: 'SC (Scheduled Caste)', value: 'SC' },
                  { label: 'ST (Scheduled Tribe)', value: 'ST' },
                ]}
              />

              <FormInput
                name="state"
                label="State of Residency"
                icon={MapPin}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={() => methods.reset()}>
                Discard Changes
              </Button>
              <Button type="submit" variant="primary">
                Save Preferences
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default Profile;
