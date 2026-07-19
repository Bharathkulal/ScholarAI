import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProfileWizard } from '../components/profile/ProfileWizard';
import {
  getStudentProfileApi,
  updateStudentProfileApi,
  uploadAvatarApi,
  uploadDocumentApi,
  deleteDocumentApi,
} from '../services/student';
import { UserCheck, Award, CreditCard, MapPin, FileCheck, Sparkles, ShieldCheck, Edit3, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWizardMode, setIsWizardMode] = useState(false);

  const fetchProfileData = async () => {
    try {
      const res = await getStudentProfileApi();
      if (res && res.profile) {
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (formData) => {
    const res = await updateStudentProfileApi(formData);
    if (res && res.profile) {
      setProfile(res.profile);
    }
    return res;
  };

  const handleUploadDocument = async (file, type, title) => {
    const res = await uploadDocumentApi(file, type, title);
    await fetchProfileData();
    return res;
  };

  const handleDeleteDocument = async (docId) => {
    await deleteDocumentApi(docId);
    await fetchProfileData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#CD0000]" />
        <span className="text-xs font-heading font-extrabold uppercase text-[#666666]">
          Loading Student Profile...
        </span>
      </div>
    );
  }

  const completion = profile?.profile_completion || { overall: 85 };
  const eligibility = profile?.eligibility_summary || { status: 'Eligible', match_score: 90 };
  const fullName = profile?.personal?.full_name || profile?.full_name || user?.full_name || 'Student User';
  const avatarUrl = profile?.personal?.avatar || profile?.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop';
  const college = profile?.academic?.college_name || profile?.college || 'BMS College of Engineering';
  const course = profile?.academic?.course || profile?.course || 'B.E. Computer Science';

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageTitle
          title="Smart Student Profile & Onboarding Hub"
          description="Complete your 8-step academic profile, upload certificates, and audit scholarship eligibility."
        />

        <Button
          type="button"
          variant={isWizardMode ? 'secondary' : 'primary'}
          onClick={() => setIsWizardMode(!isWizardMode)}
          className="gap-2 text-xs font-heading font-extrabold uppercase shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          {isWizardMode ? 'Exit Profile Wizard' : 'Launch 8-Step Profile Wizard'}
        </Button>
      </div>

      {isWizardMode ? (
        <ProfileWizard
          initialProfile={profile}
          onSaveProfile={handleSaveProfile}
          onUploadDocument={handleUploadDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      ) : (
        <div className="space-y-6">
          {/* Header Overview Card */}
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#EEEEEE] pb-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <img
                  src={avatarUrl}
                  alt="Student Avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#CD0000] shadow-soft"
                />
                <div>
                  <h3 className="text-2xl font-extrabold font-heading text-[#111111]">{fullName}</h3>
                  <p className="text-xs text-[#666666] font-medium font-heading">
                    {college} • {course}
                  </p>
                  <p className="text-[11px] text-[#888888] mt-1 font-mono">
                    SSP Student ID: #{profile?._id?.slice(-8) || profile?.id?.slice(-8) || 'KAR-29472'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center p-3 rounded-2xl bg-[#F4F4F0] border border-[#DDDDDD]">
                  <span className="text-[10px] font-heading font-bold text-[#666666] uppercase block">
                    Completion
                  </span>
                  <span className="text-xl font-extrabold font-heading text-[#CD0000]">
                    {completion.overall}%
                  </span>
                </div>

                <div className="text-center p-3 rounded-2xl bg-green-50 border border-green-200">
                  <span className="text-[10px] font-heading font-bold text-green-700 uppercase block">
                    Eligibility Score
                  </span>
                  <span className="text-xl font-extrabold font-heading text-green-700">
                    {eligibility.match_score}%
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Grid Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE] space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">
                  Category Classification
                </span>
                <span className="text-sm font-extrabold font-heading text-[#111111]">
                  {profile?.eligibility?.category || profile?.category || 'OBC (Cat-3A)'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE] space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">
                  Annual Family Income
                </span>
                <span className="text-sm font-extrabold font-heading text-[#111111]">
                  {profile?.family?.annual_income || profile?.income || '₹2,40,000 / year'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE] space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">
                  Academic CGPA Score
                </span>
                <span className="text-sm font-extrabold font-heading text-[#111111]">
                  {profile?.academic?.cgpa || profile?.cgpa || '9.2 CGPA'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE] space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">
                  State of Domicile
                </span>
                <span className="text-sm font-extrabold font-heading text-[#111111]">
                  {profile?.personal?.address?.state || profile?.state || 'Karnataka'}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                variant="primary"
                onClick={() => setIsWizardMode(true)}
                className="gap-2 text-xs font-heading font-extrabold uppercase"
              >
                <Sparkles className="w-4 h-4 text-white" />
                Edit Full Profile in Wizard Mode
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
