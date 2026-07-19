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
  const { user, updateUserProfile } = useAuth();

  const methods = useForm({
    resolver: customResolver(profileSchema),
    values: {
      fullName: user?.full_name || '',
      gpa: user?.cgpa || user?.gpa || '9.2 CGPA',
      income: user?.income || '₹2,40,000 / year',
      category: user?.category || 'OBC (Cat-3A)',
      state: user?.state || 'Karnataka',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateUserProfile({
        full_name: data.fullName,
        cgpa: data.gpa,
        income: data.income,
        category: data.category,
        state: data.state,
      });
      toast.success('Profile credentials updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none">
      <PageTitle
        title="Student Academic Profile (Karnataka & India)"
        description="Verify and update your CGPA scores, Karnataka category descriptors, and income criteria for AI matching audits."
      />

      <Card className="p-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-[#EEEEEE] pb-6 mb-6">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#CD0000]"
              />
              <div className="text-center sm:text-left">
                <h4 className="text-xl font-extrabold font-heading text-[#111111]">{user?.full_name || 'Student User'}</h4>
                <p className="text-xs text-[#666666] font-medium font-heading">
                  SSP Student ID: #{user?._id?.slice(-8) || user?.id?.slice(-8) || 'KAR-29472'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                name="fullName"
                label="Full Name"
                icon={UserCheck}
                required
              />

              <FormInput
                name="gpa"
                label="Academic CGPA Score"
                icon={Award}
                required
              />

              <FormInput
                name="income"
                label="Annual Family Income (₹)"
                icon={CreditCard}
                required
              />

              <FormSelect
                name="category"
                label="Category / Caste Classification"
                required
                options={[
                  { label: 'General / Unreserved', value: 'General' },
                  { label: 'OBC (Cat-1 / 2A / 2B / 3A / 3B)', value: 'OBC (Cat-3A)' },
                  { label: 'SC (Scheduled Caste)', value: 'SC' },
                  { label: 'ST (Scheduled Tribe)', value: 'ST' },
                  { label: 'Minority Scholarship', value: 'Minority' },
                ]}
              />

              <FormInput
                name="state"
                label="State of Domicile"
                icon={MapPin}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-[#EEEEEE]">
              <Button type="button" variant="secondary" onClick={() => methods.reset()}>
                Reset Fields
              </Button>
              <Button type="submit" variant="primary" isLoading={methods.formState.isSubmitting}>
                Save Profile Preferences
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default Profile;
