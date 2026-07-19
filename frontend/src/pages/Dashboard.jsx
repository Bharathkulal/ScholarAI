import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';

// Mock Recommendations Data
const TOP_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Karnataka Post-Matric State Scholarship (SSP)',
    provider: 'Department of Higher Education, Govt of Karnataka',
    amount: '₹50,000 / year',
    matchScore: 98,
    deadline: 'Aug 15, 2026',
    timeLeft: '3 Days Left',
    difficulty: 'Low Competition',
    competition: 'Moderate',
    requiredDocs: ['SSLC / PUC Marks Card', 'Income & Caste Certificate'],
    category: 'Karnataka State',
    logo: '🎓',
  },
  {
    id: 2,
    title: 'Infosys Foundation Women in STEM Grant',
    provider: 'Infosys Foundation, Bengaluru',
    amount: '₹1,50,000 / year',
    matchScore: 95,
    deadline: 'Sep 01, 2026',
    timeLeft: '14 Days Left',
    difficulty: 'Low Competition',
    competition: 'High',
    requiredDocs: ['BE / BTech Enrollment', 'Income Certificate'],
    category: 'Women in STEM',
    logo: '💻',
  },
];

const QUICK_ACTIONS = [
  { id: 'search', title: 'Search Scholarships', subtitle: 'Explore 14,000+ verified grants', icon: Search, link: '/scholarships', color: 'bg-blue-50 text-blue-600' },
  { id: 'upload', title: 'Upload Documents', subtitle: 'Add marks card & income certificates', icon: Upload, link: '/documents', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'audit', title: 'AI Eligibility Check', subtitle: 'Audit your academic criteria', icon: Bot, link: '/recommendations', color: 'bg-[#FFE5E5] text-[#CD0000]' },
  { id: 'continue', title: 'Continue Application', subtitle: 'Draft pending for Karnataka SSP', icon: FileCheck2, link: '/applications', color: 'bg-amber-50 text-amber-600' },
  { id: 'saved', title: 'Saved Scholarships', subtitle: 'View 5 bookmarked schemes', icon: Bookmark, link: '/scholarships', color: 'bg-purple-50 text-purple-600' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentName = user?.full_name?.split(' ')[0] || 'Bharath';

  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleSaveScholarship = (title) => {
    toast.success(`"${title}" saved to your bookmarks!`);
  };

  return (
    <div className="space-y-10 select-none pb-12 w-full">

      {/* 1. HERO HEADER SECTION (Apple / Vercel layout: Left Greeting + Eligibility Score Ring, Right AI Assistant Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side (7 cols): Greeting & Overall Eligibility Ring */}
        <div className="lg:col-span-7 bg-white border border-[#DDDDDD] rounded-[24px] p-8 shadow-soft flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest font-heading text-[#CD0000] bg-[#FFE5E5] px-3 py-1 rounded-full border border-[#FFC9C9]">
                Active Student Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#111111] tracking-tight pt-1">
                👋 Good Morning, {studentName}
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#555555]">
                Continue your scholarship journey. You have 3 high-probability grant matches today.
              </p>
            </div>

            {/* Circular Eligibility Progress Score */}
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
                  strokeDasharray="94, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold font-heading text-[#111111] leading-none">94%</span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#666666] font-heading mt-0.5">Eligibility</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#EEEEEE] flex items-center gap-6 flex-wrap text-xs text-[#555555]">
            <span className="flex items-center gap-1.5 font-bold font-heading text-[#111111]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> CGPA Verified: 9.2 / 10.0
            </span>
            <span className="flex items-center gap-1.5 font-bold font-heading text-[#111111]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Karnataka Domicile: Active
            </span>
          </div>
        </div>

        {/* Right Side (5 cols): Hero AI Assistant Card */}
        <div className="lg:col-span-5 bg-[#111111] text-white border border-[#222222] rounded-[24px] p-8 shadow-lift flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#CD0000] text-white flex items-center justify-center font-bold shadow-[0_4px_12px_rgba(205,0,0,0.35)]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-sm font-extrabold font-heading text-white tracking-wide uppercase">
                  ScholarAI Assistant
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>

            <div className="p-4 rounded-[16px] bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-sans text-[#DDDDDD] leading-relaxed mb-6">
              "Hi {studentName} 👋 I found 4 scholarships matching your profile. One application closes in 2 days. Shall we review?"
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => setIsAiModalOpen(true)}
              variant="primary"
              className="w-full !py-3 text-xs uppercase font-heading tracking-wider min-h-[44px]"
            >
              Review AI Matches
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* 2. COMPACT KPI METRIC CARDS (Icons + Small Trend Badges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: AI Matches */}
        <Card className="p-6 border-l-4 border-l-[#CD0000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">AI Matches</span>
            <Bot className="w-4 h-4 text-[#CD0000]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">12</span>
            <span className="text-[10px] font-bold font-heading text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0] flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> ↑ +3 Today
            </span>
          </div>
        </Card>

        {/* KPI 2: Applications */}
        <Card className="p-6 border-l-4 border-l-[#F59E0B] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">Applications</span>
            <FileCheck2 className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">2</span>
            <span className="text-[10px] font-bold font-heading text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
              Under Review
            </span>
          </div>
        </Card>

        {/* KPI 3: Documents */}
        <Card className="p-6 border-l-4 border-l-[#16A34A] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">Documents</span>
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">5</span>
            <span className="text-[10px] font-bold font-heading text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
              Verified 100%
            </span>
          </div>
        </Card>

        {/* KPI 4: Success Score */}
        <Card className="p-6 border-l-4 border-l-[#CD0000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#666666] font-heading">Success Score</span>
            <Award className="w-4 h-4 text-[#CD0000]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-heading text-[#111111]">98%</span>
            <span className="text-[10px] font-bold font-heading text-[#CD0000] bg-[#FFE5E5] px-2 py-0.5 rounded-full border border-[#FFC9C9]">
              Excellent
            </span>
          </div>
        </Card>

      </div>

      {/* 3. QUICK ACTIONS BAR (Horizontal Cards with Hover Animation) */}
      <div className="space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest font-heading text-[#666666]">
          Quick Actions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(action.link)}
                className="bg-white border border-[#DDDDDD] rounded-[20px] p-5 cursor-pointer shadow-soft hover:shadow-lift transition-all duration-200 flex flex-col justify-between min-h-[110px]"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mb-3 ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold font-heading text-[#111111] tracking-tight">{action.title}</h4>
                  <p className="text-[10px] text-[#666666] mt-0.5 line-clamp-1">{action.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. AI RECOMMENDATIONS HIGHLIGHT SECTION (Editorial Layout) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest font-heading text-[#CD0000]">
              AI Top Recommendations
            </span>
            <h2 className="text-2xl font-extrabold font-heading text-[#111111] mt-1">
              Matched For Your Profile
            </h2>
          </div>
          <Link to="/recommendations">
            <Button variant="secondary" className="!py-2 !px-4 text-xs font-heading uppercase tracking-wider min-h-[44px]">
              View All 12 Matches &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {TOP_RECOMMENDATIONS.map((scholarship) => (
            <Card key={scholarship.id} hoverable className="p-8 flex flex-col justify-between h-full border-2 border-[#DDDDDD] hover:border-[#CD0000]">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFEDE6] text-2xl flex items-center justify-center border border-[#DDDDDD] shrink-0">
                      {scholarship.logo}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CD0000] font-heading block">
                        {scholarship.category}
                      </span>
                      <h3 className="text-lg font-extrabold font-heading text-[#111111] leading-snug">
                        {scholarship.title}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="primary">{scholarship.matchScore}% AI Match</Badge>
                </div>

                <p className="text-xs text-[#666666] font-medium">
                  Provider: <span className="text-[#111111] font-bold font-heading">{scholarship.provider}</span>
                </p>

                {/* Metadata Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-[#EFEDE6] rounded-[16px] border border-[#DDDDDD]">
                    <span className="text-[9px] uppercase font-bold text-[#888888] font-heading block">Difficulty</span>
                    <span className="text-xs font-bold text-[#16A34A] font-heading">{scholarship.difficulty}</span>
                  </div>

                  <div className="p-3 bg-[#EFEDE6] rounded-[16px] border border-[#DDDDDD]">
                    <span className="text-[9px] uppercase font-bold text-[#888888] font-heading block">Competition</span>
                    <span className="text-xs font-bold text-[#D97706] font-heading">{scholarship.competition}</span>
                  </div>

                  <div className="p-3 bg-[#FFE5E5] rounded-[16px] border border-[#FFC9C9]">
                    <span className="text-[9px] uppercase font-bold text-[#CD0000] font-heading block">Time Left</span>
                    <span className="text-xs font-extrabold text-[#CD0000] font-heading flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {scholarship.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] font-heading block mb-1.5">
                    Required Documents:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {scholarship.requiredDocs.map((doc, idx) => (
                      <span key={idx} className="text-[11px] font-semibold text-[#444444] bg-[#F8F8F8] px-2.5 py-1 rounded-full border border-[#DDDDDD]">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-6 mt-6 border-t border-[#EEEEEE] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block">Annual Award</span>
                  <span className="text-2xl font-extrabold font-heading text-[#CD0000]">{scholarship.amount}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => handleSaveScholarship(scholarship.title)}
                    variant="secondary"
                    className="!p-2.5 text-xs font-heading min-h-[44px]"
                    title="Save Scholarship"
                  >
                    <Bookmark className="w-4 h-4 text-[#111111]" />
                  </Button>

                  <Button
                    onClick={() => setSelectedDetails(scholarship)}
                    variant="secondary"
                    className="!py-2.5 !px-4 text-xs font-heading uppercase tracking-wider min-h-[44px]"
                  >
                    View Details
                  </Button>

                  <Link to="/applications" className="flex-1 sm:flex-initial">
                    <Button variant="primary" className="!py-2.5 !px-5 text-xs font-heading uppercase tracking-wider min-h-[44px] w-full">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. PROGRESS & TIMELINE GRID SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (6 cols): Profile Progress Bars */}
        <div className="lg:col-span-6">
          <Card className="p-8 space-y-6 h-full">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest font-heading text-[#CD0000]">
                Completion Status
              </span>
              <h3 className="text-xl font-extrabold font-heading text-[#111111] mt-1">
                Profile Verification Meters
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold font-heading mb-1.5">
                  <span className="text-[#111111]">Academic Profile Completion</span>
                  <span className="text-[#CD0000]">75%</span>
                </div>
                <div className="w-full h-3 bg-[#EFEDE6] rounded-full overflow-hidden border border-[#DDDDDD]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1 }} className="h-full bg-[#CD0000] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-heading mb-1.5">
                  <span className="text-[#111111]">Document Vault Status</span>
                  <span className="text-[#16A34A]">100%</span>
                </div>
                <div className="w-full h-3 bg-[#EFEDE6] rounded-full overflow-hidden border border-[#DDDDDD]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-full bg-[#16A34A] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-heading mb-1.5">
                  <span className="text-[#111111]">Active Applications Audit</span>
                  <span className="text-[#F59E0B]">40%</span>
                </div>
                <div className="w-full h-3 bg-[#EFEDE6] rounded-full overflow-hidden border border-[#DDDDDD]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1 }} className="h-full bg-[#F59E0B] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-heading mb-1.5">
                  <span className="text-[#111111]">AI Eligibility Index</span>
                  <span className="text-[#CD0000]">92%</span>
                </div>
                <div className="w-full h-3 bg-[#EFEDE6] rounded-full overflow-hidden border border-[#DDDDDD]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1 }} className="h-full bg-[#CD0000] rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side (6 cols): Upcoming Deadlines & Recent Activity Timeline */}
        <div className="lg:col-span-6">
          <Card className="p-8 space-y-6 h-full">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest font-heading text-[#CD0000]">
                Timeline Alerts
              </span>
              <h3 className="text-xl font-extrabold font-heading text-[#111111] mt-1">
                Upcoming Deadlines
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[16px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DC2626] font-heading block">Tomorrow</span>
                    <h5 className="text-xs font-extrabold font-heading text-[#111111]">Income & Caste Certificate Attestation</h5>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#DC2626] font-heading">Action Needed</span>
              </div>

              <div className="p-4 bg-[#FFE5E5] border border-[#FFC9C9] rounded-[16px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#CD0000] text-white flex items-center justify-center font-bold shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CD0000] font-heading block">In 2 Days</span>
                    <h5 className="text-xs font-extrabold font-heading text-[#111111]">Karnataka SSP State Grant Closes</h5>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#CD0000] font-heading">Apply Now</span>
              </div>

              <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[16px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#16A34A] font-heading block">In 7 Days</span>
                    <h5 className="text-xs font-extrabold font-heading text-[#111111]">Infosys Foundation Review Phase Complete</h5>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#16A34A] font-heading">On Track</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* AI Assistant Modal */}
      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="ScholarAI Assistant Review">
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-[#EFEDE6] border border-[#DDDDDD] rounded-[16px] flex items-center gap-3">
            <Bot className="w-6 h-6 text-[#CD0000] shrink-0" />
            <p className="text-xs text-[#111111] font-sans leading-relaxed">
              Based on your 9.2 CGPA and Karnataka domicile, you have a <strong>98% match</strong> for Karnataka SSP Post-Matric and a <strong>95% match</strong> for Infosys Foundation STEM Grant.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#EEEEEE]">
            <Button variant="secondary" onClick={() => setIsAiModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { setIsAiModalOpen(false); navigate('/recommendations'); }}>
              Explore All Matches
            </Button>
          </div>
        </div>
      </Modal>

      {/* Scholarship Details Modal */}
      {selectedDetails && (
        <Modal isOpen={!!selectedDetails} onClose={() => setSelectedDetails(null)} title={selectedDetails.title}>
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#EFEDE6] border border-[#DDDDDD] rounded-[16px]">
              <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block">Provider</span>
              <h5 className="text-sm font-extrabold text-[#111111] font-heading">{selectedDetails.provider}</h5>
              <span className="text-xl font-extrabold text-[#CD0000] font-heading block mt-2">{selectedDetails.amount}</span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase font-heading text-[#111111]">Required Documents</span>
              <ul className="text-xs text-[#555555] space-y-1 list-disc pl-4">
                {selectedDetails.requiredDocs.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#EEEEEE]">
              <Button variant="secondary" onClick={() => setSelectedDetails(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => { setSelectedDetails(null); navigate('/applications'); }}>
                Start Application Now
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Dashboard;
