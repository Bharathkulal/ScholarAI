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
      fullName: user?.full_name || 'Jane Doe',
      gpa: user?.gpa || '3.9',
      income: user?.income || '$45,000 USD',
      category: user?.category || 'General',
      state: user?.state || 'California',
    },
  });

  const onSubmit = () => {
    toast.success('Profile credentials updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none">
      <PageTitle
        title="Student Academic Profile"
        description="Verify and update your GPA scores, category descriptors, and income criteria for AI matching audits."
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
                <h4 className="text-xl font-extrabold font-heading text-[#111111]">{user?.full_name || 'Jane Doe'}</h4>
                <p className="text-xs text-[#666666] font-medium font-heading">Verified Student ID: #SCH-29472</p>
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
                label="Academic GPA Score"
                icon={Award}
                required
              />

              <FormInput
                name="income"
                label="Annual Household Income"
                icon={CreditCard}
                required
              />

              <FormSelect
                name="category"
                label="Demographic Category"
                required
                options={[
                  { label: 'General / Unreserved', value: 'General' },
                  { label: 'Minority Scholarship', value: 'Minority' },
                  { label: 'First-Generation College', value: 'FirstGen' },
                  { label: 'Women in STEM', value: 'WomenInSTEM' },
                ]}
              />

              <FormInput
                name="state"
                label="State / Region of Residency"
                icon={MapPin}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-[#EEEEEE]">
              <Button type="button" variant="secondary" onClick={() => methods.reset()}>
                Reset Fields
              </Button>
              <Button type="submit" variant="primary">
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
