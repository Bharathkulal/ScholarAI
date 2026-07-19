import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  BookOpen,
  Users,
  ShieldCheck,
  FileCheck,
  GraduationCap,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { DocumentUploadCard } from './DocumentUploadCard';
import { EducationTimelineCard } from './EducationTimelineCard';
import { SkillsAchievementsForm } from './SkillsAchievementsForm';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Personal', icon: User, desc: 'Identity & Address' },
  { id: 2, label: 'Academic', icon: BookOpen, desc: 'College & CGPA' },
  { id: 3, label: 'Family', icon: Users, desc: 'Parents & Income' },
  { id: 4, label: 'Eligibility', icon: ShieldCheck, desc: 'Quota & Category' },
  { id: 5, label: 'Documents', icon: FileCheck, desc: 'Certificates & ID' },
  { id: 6, label: 'Timeline', icon: GraduationCap, desc: 'Education History' },
  { id: 7, label: 'Skills', icon: Sparkles, desc: 'Tech & Achievements' },
  { id: 8, label: 'Review', icon: CheckCircle, desc: 'Final Verification' },
];

export const ProfileWizard = ({
  initialProfile = {},
  onSaveProfile,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    personal: {
      full_name: initialProfile?.personal?.full_name || initialProfile?.full_name || '',
      email: initialProfile?.personal?.email || initialProfile?.email || '',
      phone: initialProfile?.personal?.phone || initialProfile?.phone || '',
      gender: initialProfile?.personal?.gender || initialProfile?.gender || 'Female',
      dob: initialProfile?.personal?.dob || initialProfile?.dob || '2002-05-14',
      avatar: initialProfile?.personal?.avatar || initialProfile?.avatar || '',
      address: {
        state: initialProfile?.personal?.address?.state || initialProfile?.state || 'Karnataka',
        district: initialProfile?.personal?.address?.district || initialProfile?.district || 'Bengaluru',
        taluk: initialProfile?.personal?.address?.taluk || 'Bengaluru South',
        village_city: initialProfile?.personal?.address?.village_city || 'Bengaluru',
        pin_code: initialProfile?.personal?.address?.pin_code || '560004',
      },
    },
    academic: {
      college_name: initialProfile?.academic?.college_name || initialProfile?.college || 'BMS College of Engineering',
      university: initialProfile?.academic?.university || 'Visvesvaraya Technological University (VTU)',
      course: initialProfile?.academic?.course || initialProfile?.course || 'B.E. Computer Science',
      branch: initialProfile?.academic?.branch || 'Computer Science & Engineering',
      semester: initialProfile?.academic?.semester || initialProfile?.semester || '6th Semester',
      current_year: initialProfile?.academic?.current_year || '3rd Year',
      roll_number: initialProfile?.academic?.roll_number || '1BM21CS042',
      registration_number: initialProfile?.academic?.registration_number || 'SSP-KAR-2024-9482',
      cgpa: initialProfile?.academic?.cgpa || initialProfile?.cgpa || initialProfile?.gpa || '9.2',
      percentage: initialProfile?.academic?.percentage || '92%',
      sslc_percentage: initialProfile?.academic?.sslc_percentage || '94.5%',
      puc_percentage: initialProfile?.academic?.puc_percentage || '91.0%',
      backlogs: initialProfile?.academic?.backlogs || 0,
      expected_graduation: initialProfile?.academic?.expected_graduation || '2025',
    },
    family: {
      father_name: initialProfile?.family?.father_name || 'Suresh Gowda',
      mother_name: initialProfile?.family?.mother_name || 'Sunitha Gowda',
      guardian: initialProfile?.family?.guardian || '',
      occupation: initialProfile?.family?.occupation || 'Agriculture & Small Business',
      annual_income: initialProfile?.family?.annual_income || initialProfile?.income || '₹2,40,000 / year',
      bpl_status: initialProfile?.family?.bpl_status || 'Yes',
      ration_card_type: initialProfile?.family?.ration_card_type || 'BPL',
    },
    eligibility: {
      category: initialProfile?.eligibility?.category || initialProfile?.category || 'OBC (Cat-3A)',
      religion: initialProfile?.eligibility?.religion || 'Hinduism',
      nationality: initialProfile?.eligibility?.nationality || 'Indian',
      state: initialProfile?.eligibility?.state || initialProfile?.state || 'Karnataka',
      domicile: initialProfile?.eligibility?.domicile || initialProfile?.state || 'Karnataka',
      disability: initialProfile?.eligibility?.disability || 'No',
      ncc: initialProfile?.eligibility?.ncc || 'No',
      sports_quota: initialProfile?.eligibility?.sports_quota || 'No',
      farmer_family: initialProfile?.eligibility?.farmer_family || 'Yes',
      single_girl_child: initialProfile?.eligibility?.single_girl_child || 'No',
      orphan: initialProfile?.eligibility?.orphan || 'No',
      ex_serviceman: initialProfile?.eligibility?.ex_serviceman || 'No',
      hosteller_day_scholar: initialProfile?.eligibility?.hosteller_day_scholar || 'Hosteller',
    },
    documents: initialProfile?.documents || [],
    timeline: initialProfile?.timeline || [
      {
        id: '1',
        level: 'SSLC',
        institution: 'St. Joseph High School',
        board_university: 'KSEEB State Board',
        year_of_passing: '2019',
        percentage_cgpa: '94.5%',
      },
      {
        id: '2',
        level: 'PUC',
        institution: 'National Pre-University College',
        board_university: 'Karnataka Department of Pre-University',
        year_of_passing: '2021',
        percentage_cgpa: '91.0%',
      },
    ],
    skills: initialProfile?.skills || {
      programming_skills: ['Python', 'Java', 'React', 'SQL', 'Git'],
      languages: ['Kannada', 'English', 'Hindi'],
      achievements: ['Smart India Hackathon Finalist 2024', 'State Merit Scholarship Recipient'],
    },
  });

  const completionOverall = initialProfile?.profile_completion?.overall || 85;

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = async (showToast = true) => {
    setSaving(true);
    try {
      await onSaveProfile(formData);
      if (showToast) {
        toast.success('Profile draft saved successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save profile draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitFinal = async () => {
    setSaving(true);
    try {
      await onSaveProfile(formData);
      toast.success('🎉 Student Profile submitted successfully for AI eligibility audits!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit profile.');
    } finally {
      setSaving(false);
    }
  };

  const documentsMap = {};
  (formData.documents || []).forEach((doc) => {
    documentsMap[doc.type] = doc;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none pb-12">
      {/* Wizard Header & Progress */}
      <div className="p-6 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EEEEEE] pb-5 mb-5">
          <div>
            <span className="text-[10px] font-heading font-extrabold text-[#CD0000] uppercase tracking-widest">
              ScholarAI Smart Onboarding
            </span>
            <h3 className="text-xl font-extrabold font-heading text-[#111111] uppercase tracking-tight">
              Student Profile & Eligibility Wizard
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-heading font-bold text-[#666666] uppercase block">
                Completion Score
              </span>
              <span className="text-lg font-heading font-extrabold text-[#CD0000]">
                {completionOverall}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#CD0000]/20 border-t-[#CD0000] flex items-center justify-center font-heading font-bold text-xs">
              {currentStep}/8
            </div>
          </div>
        </div>

        {/* Step Indicator Circles */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStep(s.id)}
                className={`p-2.5 rounded-[16px] text-center transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                  isActive
                    ? 'bg-[#111111] text-white border-[#111111] shadow-lift'
                    : isCompleted
                    ? 'bg-[#F4F4F0] text-[#111111] border-[#DDDDDD]'
                    : 'bg-white text-[#888888] border-[#EEEEEE] hover:bg-[#F9F9F7]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-[#CD0000] text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-[#EEEEEE]'
                  }`}
                >
                  {isCompleted ? '✓' : s.id}
                </div>
                <span className="text-[10px] font-heading font-extrabold uppercase truncate max-w-full">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft"
        >
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#EEEEEE] pb-4">
                <h4 className="text-lg font-extrabold font-heading text-[#111111] uppercase">
                  Step 1: Personal & Residence Details
                </h4>
                <p className="text-xs text-[#666666]">Verify name, contact metrics, and official domicile address.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.personal.full_name}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, full_name: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Email Address (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={formData.personal.email}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] bg-[#F4F4F0] text-xs font-medium text-[#666666] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.personal.phone}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Gender</label>
                  <select
                    value={formData.personal.gender}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, gender: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other / Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.personal.dob}
                    onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, dob: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">State of Domicile</label>
                  <input
                    type="text"
                    value={formData.personal.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          address: { ...formData.personal.address, state: e.target.value },
                        },
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">District</label>
                  <input
                    type="text"
                    value={formData.personal.address.district}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          address: { ...formData.personal.address, district: e.target.value },
                        },
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Taluk / Sub-District</label>
                  <input
                    type="text"
                    value={formData.personal.address.taluk}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          address: { ...formData.personal.address, taluk: e.target.value },
                        },
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#EEEEEE] pb-4">
                <h4 className="text-lg font-extrabold font-heading text-[#111111] uppercase">
                  Step 2: Academic Credentials
                </h4>
                <p className="text-xs text-[#666666]">Enter active institution, course, semester, and CGPA scores.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">College / Institute Name</label>
                  <input
                    type="text"
                    value={formData.academic.college_name}
                    onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, college_name: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Affiliated University</label>
                  <input
                    type="text"
                    value={formData.academic.university}
                    onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, university: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Degree / Course Name</label>
                  <input
                    type="text"
                    value={formData.academic.course}
                    onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, course: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Active Semester</label>
                  <select
                    value={formData.academic.semester}
                    onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, semester: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Current Academic CGPA</label>
                  <input
                    type="text"
                    placeholder="9.2"
                    value={formData.academic.cgpa}
                    onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, cgpa: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">SSLC / 10th Percentage</label>
                  <input
                    type="text"
                    value={formData.academic.sslc_percentage}
                    onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, sslc_percentage: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Family Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#EEEEEE] pb-4">
                <h4 className="text-lg font-extrabold font-heading text-[#111111] uppercase">
                  Step 3: Family Income & Financial Status
                </h4>
                <p className="text-xs text-[#666666]">Income certification determines scholarship threshold eligibility.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Father Name</label>
                  <input
                    type="text"
                    value={formData.family.father_name}
                    onChange={(e) => setFormData({ ...formData, family: { ...formData.family, father_name: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Mother Name</label>
                  <input
                    type="text"
                    value={formData.family.mother_name}
                    onChange={(e) => setFormData({ ...formData, family: { ...formData.family, mother_name: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Annual Family Income (₹)</label>
                  <input
                    type="text"
                    placeholder="₹2,40,000 / year"
                    value={formData.family.annual_income}
                    onChange={(e) => setFormData({ ...formData, family: { ...formData.family, annual_income: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Below Poverty Line (BPL) Status</label>
                  <select
                    value={formData.family.bpl_status}
                    onChange={(e) => setFormData({ ...formData, family: { ...formData.family, bpl_status: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="Yes">Yes (BPL Card Holder)</option>
                    <option value="No">No (APL / General)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Scholarship Eligibility */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-[#EEEEEE] pb-4">
                <h4 className="text-lg font-extrabold font-heading text-[#111111] uppercase">
                  Step 4: Category & Reservation Quotas
                </h4>
                <p className="text-xs text-[#666666]">Specific quotas unlock targeted government and private grants.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Category / Caste Classification</label>
                  <select
                    value={formData.eligibility.category}
                    onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, category: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="General">General / Unreserved</option>
                    <option value="OBC (Cat-3A)">OBC (Cat-1 / 2A / 2B / 3A / 3B)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority Communities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Hosteller or Day Scholar</label>
                  <select
                    value={formData.eligibility.hosteller_day_scholar}
                    onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, hosteller_day_scholar: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="Hosteller">College Hosteller</option>
                    <option value="Day Scholar">Day Scholar / Commuter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Farmer / Agricultural Family</label>
                  <select
                    value={formData.eligibility.farmer_family}
                    onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, farmer_family: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Single Girl Child Quota</label>
                  <select
                    value={formData.eligibility.single_girl_child}
                    onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, single_girl_child: e.target.value } })}
                    className="w-full h-11 px-4 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Document Uploads */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-[#EEEEEE] pb-4">
                <h4 className="text-lg font-extrabold font-heading text-[#111111] uppercase">
                  Step 5: Verification Documents
                </h4>
                <p className="text-xs text-[#666666]">Upload official PDF/Image certificates for automated verification.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentUploadCard
                  typeKey="aadhaar"
                  label="Aadhaar Card"
                  description="Official UIDAI identity proof card."
                  required
                  documentData={documentsMap['aadhaar']}
                  onUpload={onUploadDocument}
                  onDelete={onDeleteDocument}
                />

                <DocumentUploadCard
                  typeKey="income"
                  label="Income Certificate"
                  description="Issued by Revenue Dept (Tahasildar)."
                  required
                  documentData={documentsMap['income']}
                  onUpload={onUploadDocument}
                  onDelete={onDeleteDocument}
                />

                <DocumentUploadCard
                  typeKey="caste"
                  label="Caste & Category Certificate"
                  description="Required for OBC / SC / ST / EWS quotas."
                  required
                  documentData={documentsMap['caste']}
                  onUpload={onUploadDocument}
                  onDelete={onDeleteDocument}
                />

                <DocumentUploadCard
                  typeKey="marks_card"
                  label="Marks Card (Previous Semester)"
                  description="Latest academic semester grade sheet."
                  required
                  documentData={documentsMap['marks_card']}
                  onUpload={onUploadDocument}
                  onDelete={onDeleteDocument}
                />
              </div>
            </div>
          )}

          {/* STEP 6: Education Timeline */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <EducationTimelineCard
                timelineItems={formData.timeline}
                onChange={(updated) => setFormData({ ...formData, timeline: updated })}
              />
            </div>
          )}

          {/* STEP 7: Skills & Achievements */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <SkillsAchievementsForm
                skillsData={formData.skills}
                onChange={(updated) => setFormData({ ...formData, skills: updated })}
              />
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="border-b border-[#EEEEEE] pb-4">
                <h4 className="text-lg font-extrabold font-heading text-[#111111] uppercase">
                  Step 8: Review & Complete Onboarding
                </h4>
                <p className="text-xs text-[#666666]">Review your student credentials before submitting for AI eligibility matching.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[16px] bg-[#F4F4F0] border border-[#DDDDDD] space-y-1 text-xs">
                  <span className="font-heading font-extrabold text-[#CD0000] uppercase block">Personal</span>
                  <p className="font-bold text-[#111111]">{formData.personal.full_name}</p>
                  <p className="text-[#666666]">{formData.personal.email} • {formData.personal.phone}</p>
                  <p className="text-[#666666]">{formData.personal.address.district}, {formData.personal.address.state}</p>
                </div>

                <div className="p-4 rounded-[16px] bg-[#F4F4F0] border border-[#DDDDDD] space-y-1 text-xs">
                  <span className="font-heading font-extrabold text-[#CD0000] uppercase block">Academic</span>
                  <p className="font-bold text-[#111111]">{formData.academic.college_name}</p>
                  <p className="text-[#666666]">{formData.academic.course} ({formData.academic.semester})</p>
                  <p className="text-[#666666]">CGPA Score: <strong>{formData.academic.cgpa}</strong></p>
                </div>

                <div className="p-4 rounded-[16px] bg-[#F4F4F0] border border-[#DDDDDD] space-y-1 text-xs">
                  <span className="font-heading font-extrabold text-[#CD0000] uppercase block">Eligibility & Income</span>
                  <p className="font-bold text-[#111111]">Category: {formData.eligibility.category}</p>
                  <p className="text-[#666666]">Annual Income: {formData.family.annual_income}</p>
                  <p className="text-[#666666]">BPL Status: {formData.family.bpl_status}</p>
                </div>

                <div className="p-4 rounded-[16px] bg-[#F4F4F0] border border-[#DDDDDD] space-y-1 text-xs">
                  <span className="font-heading font-extrabold text-[#CD0000] uppercase block">Uploaded Verification Docs</span>
                  <p className="font-bold text-[#111111]">{formData.documents.length} Files Uploaded</p>
                  <p className="text-[#666666]">Aadhaar, Income, Caste & Marks Certificates registered.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Control Bar */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-[#EEEEEE]">
            <Button
              type="button"
              variant="secondary"
              disabled={currentStep === 1 || saving}
              onClick={handlePrev}
              className="gap-2 font-heading uppercase text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={() => handleSave(true)}
                className="gap-2 font-heading uppercase text-xs"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#CD0000]" />}
                Save Draft
              </Button>

              {currentStep < 8 ? (
                <Button type="button" variant="primary" onClick={handleNext} className="gap-2 font-heading uppercase text-xs">
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  isLoading={saving}
                  onClick={handleSubmitFinal}
                  className="gap-2 font-heading uppercase text-xs !bg-green-700 hover:!bg-green-800"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Profile
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
