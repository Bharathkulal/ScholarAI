import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  Upload,
  Bot,
  ArrowRight,
  Bookmark,
  TrendingUp,
  FileCheck2,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { getStudentProfileApi } from '../services/student';
import toast from 'react-hot-toast';

const QUICK_ACTIONS = [
  { id: 'wizard', title: 'Profile Wizard', subtitle: 'Complete 8-step student onboarding', icon: UserCheck, link: '/profile', color: 'bg-indigo-50 text-indigo-600' },
  { id: 'search', title: 'Search Scholarships', subtitle: 'Explore verified grants', icon: Search, link: '/scholarships', color: 'bg-blue-50 text-blue-600' },
  { id: 'upload', title: 'Upload Documents', subtitle: 'Add marks card & income certificates', icon: Upload, link: '/profile', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'audit', title: 'AI Eligibility Check', subtitle: 'Audit your academic criteria', icon: Bot, link: '/recommendations', color: 'bg-[#FFE5E5] text-[#CD0000]' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfileApi();
        if (res && res.profile) {
          setProfileData(res.profile);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const studentName = profileData?.personal?.full_name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'Student';
  const collegeName = profileData?.academic?.college_name || user?.college || 'BMS College of Engineering';
  const cgpaVal = profileData?.academic?.cgpa || profileData?.cgpa || '9.2';
  const stateVal = profileData?.personal?.address?.state || profileData?.state || 'Karnataka';

  const completion = profileData?.profile_completion || {
    personal: 80,
    academic: 75,
    family: 60,
    eligibility: 85,
    documents: 50,
    overall: 78,
  };

  const eligibilitySummary = profileData?.eligibility_summary || {
    status: 'Eligible',
    match_score: 88,
    matched_schemes: ['Karnataka State SSP Post-Matric Scholarship', 'Merit-cum-Means Financial Assistance Grant'],
    missing_fields: [],
    required_documents: ['Income Certificate', 'Aadhaar Identity Card'],
  };

  return (
    <div className="space-y-10 select-none pb-12 w-full">
      {/* HERO HEADER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Greeting & Eligibility Progress Ring */}
        <div className="lg:col-span-7 bg-white border border-[#DDDDDD] rounded-[24px] p-8 shadow-soft flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest font-heading text-[#CD0000] bg-[#FFE5E5] px-3 py-1 rounded-full border border-[#FFC9C9]">
                Active Student Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#111111] tracking-tight pt-1">
                👋 Welcome, {studentName}
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#555555]">
                {collegeName} • {profileData?.academic?.course || 'Undergraduate Engineering'}
              </p>
            </div>

            {/* Eligibility Score Badge */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center bg-[#EFEDE6] rounded-full border-2 border-[#DDDDDD] p-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#DDDDDD]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#CD0000]"
                  strokeDasharray={`${eligibilitySummary.match_score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold font-heading text-[#111111] leading-none">
                  {eligibilitySummary.match_score}%
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#666666] font-heading mt-0.5">
                  Eligibility
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#EEEEEE] flex items-center gap-6 flex-wrap text-xs text-[#555555]">
            <span className="flex items-center gap-1.5 font-bold font-heading text-[#111111]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> CGPA: {cgpaVal} / 10.0
            </span>
            <span className="flex items-center gap-1.5 font-bold font-heading text-[#111111]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Domicile: {stateVal}
            </span>
            <span className="flex items-center gap-1.5 font-bold font-heading text-[#CD0000]">
              <ShieldCheck className="w-4 h-4 text-[#CD0000]" /> Status: {eligibilitySummary.status}
            </span>
          </div>
        </div>

        {/* Right Side: ScholarAI Assistant Card */}
        <div className="lg:col-span-5 bg-[#111111] text-white border border-[#222222] rounded-[24px] p-8 shadow-lift flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#CD0000] text-white flex items-center justify-center font-bold shadow-[0_4px_12px_rgba(205,0,0,0.35)]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-sm font-extrabold font-heading text-white tracking-wide uppercase">
                  Eligibility Engine
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
            </div>

            <div className="p-4 rounded-[16px] bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-sans text-[#DDDDDD] leading-relaxed mb-6">
              {eligibilitySummary.matched_schemes?.length > 0 ? (
                <>
                  "Hello {studentName}! Based on your CGPA ({cgpaVal}) and domicile ({stateVal}), you qualify for{' '}
                  <strong className="text-white">{eligibilitySummary.matched_schemes[0]}</strong>."
                </>
              ) : (
                <>
                  "Hello {studentName}! Please complete your Profile Wizard to unlock personalized scholarship recommendations."
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => navigate('/profile')}
              variant="primary"
              className="w-full !py-3 text-xs uppercase font-heading tracking-wider min-h-[44px]"
            >
              Complete Profile Wizard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="p-6 border-l-4 border-l-[#CD0000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">
              Overall Completion
            </span>
            <Award className="w-4 h-4 text-[#CD0000]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">{completion.overall}%</span>
            <span className="text-[10px] font-bold font-heading text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
              Active Profile
            </span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#F59E0B] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">
              Matched Grants
            </span>
            <FileCheck2 className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">
              {eligibilitySummary.matched_schemes?.length || 2}
            </span>
            <span className="text-[10px] font-bold font-heading text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
              Pre-Qualified
            </span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#3B82F6] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">
              Uploaded Docs
            </span>
            <FileText className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">
              {profileData?.documents?.length || 4}
            </span>
            <span className="text-[10px] font-bold font-heading text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
              Verification Pending
            </span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#10B981] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">
              Academic Standing
            </span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">{cgpaVal}</span>
            <span className="text-[10px] font-bold font-heading text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              First Class Distinction
            </span>
          </div>
        </Card>

      </div>

      {/* SECTION BREAKDOWN & REQUIRED DOCUMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 cols: Profile Completion Breakdown */}
        <div className="lg:col-span-7 bg-white border border-[#DDDDDD] rounded-[24px] p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
              Profile Completion Breakdown
            </h3>
            <span className="text-xs font-bold text-[#CD0000]">{completion.overall}% Total Score</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Personal Information', score: completion.personal || 80 },
              { label: 'Academic Credentials', score: completion.academic || 75 },
              { label: 'Family & Income Status', score: completion.family || 60 },
              { label: 'Scholarship Eligibility Quotas', score: completion.eligibility || 85 },
              { label: 'Uploaded Verification Documents', score: completion.documents || 50 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-heading font-bold text-[#111111]">
                  <span>{item.label}</span>
                  <span>{item.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EEEEEE] overflow-hidden">
                  <div
                    className="h-full bg-[#CD0000] rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Required Documents & Recommended Actions */}
        <div className="lg:col-span-5 bg-white border border-[#DDDDDD] rounded-[24px] p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
              Required Documents Alert
            </h3>
            <AlertCircle className="w-4 h-4 text-[#CD0000]" />
          </div>

          {eligibilitySummary.required_documents?.length > 0 ? (
            <div className="space-y-2.5">
              {eligibilitySummary.required_documents.map((docName) => (
                <div
                  key={docName}
                  className="p-3 rounded-xl bg-[#FFF5F5] border border-[#FFE0E0] flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-[#CD0000] flex items-center gap-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    {docName}
                  </span>
                  <Link
                    to="/profile"
                    className="text-[10px] font-heading uppercase font-bold text-[#111111] hover:underline"
                  >
                    Upload Now →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 font-medium">
              All essential verification documents are uploaded and registered!
            </div>
          )}

          <div className="pt-3 border-t border-[#EEEEEE]">
            <Button
              onClick={() => navigate('/profile')}
              variant="secondary"
              className="w-full !py-2.5 text-xs font-heading font-extrabold uppercase"
            >
              Open Profile Wizard Hub
            </Button>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide mb-4">
          Quick Action Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.id}
                to={act.link}
                className="p-5 rounded-[20px] bg-white border border-[#DDDDDD] shadow-soft hover:shadow-lift transition-all duration-200 flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#888888] group-hover:text-[#111111] transition-colors" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold font-heading text-[#111111] uppercase group-hover:text-[#CD0000] transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-[#666666] mt-0.5">{act.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
