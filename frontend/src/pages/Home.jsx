import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Mock Data localized for India & Karnataka
const MOCK_STATS = [
  { label: 'Verified Indian Grants', value: '14,500+' },
  { label: 'Active Funding Disbursed', value: '₹850 Cr+' },
  { label: 'Students Matched', value: '1,20,000+' },
  { label: 'Audit Accuracy', value: '99.4%' },
];

const FEATURED_SCHOLARSHIPS = [
  {
    id: '1',
    title: 'Karnataka Post-Matric State Scholarship (SSP)',
    provider: 'Department of Higher Education, Govt of Karnataka',
    amount: '₹50,000 / yr',
    deadline: 'Aug 15, 2026',
    matchScore: 98,
    category: 'Karnataka State',
  },
  {
    id: '2',
    title: 'Infosys Foundation STEM Excellence Grant',
    provider: 'Infosys Foundation, Bengaluru',
    amount: '₹1,50,000 / yr',
    deadline: 'Sep 01, 2026',
    matchScore: 95,
    category: 'Women in STEM',
  },
  {
    id: '3',
    title: 'National Merit Scholarship Scheme India',
    provider: 'Ministry of Education, Govt of India',
    amount: '₹2,00,000 total',
    deadline: 'Oct 10, 2026',
    matchScore: 92,
    category: 'National Merit',
  },
];

const AI_FEATURES = [
  {
    icon: Cpu,
    title: 'AI Recommendation Engine',
    description: 'Neural matching algorithms map your academic CGPA, Karnataka domicile, and family income statements to eligible state and central schemes instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'SSP & ePASS Audit System',
    description: 'Automated document verification checks your PUC/SSLC marks, income & caste certificates against official government portal bylaws.',
  },
  {
    icon: Sparkles,
    title: 'Semantic Smart Search',
    description: 'Natural language search lets you query "Karnataka engineering post-matric grants for OBC students" and get contextual matches.',
  },
  {
    icon: BookOpen,
    title: 'Automated Document Vault',
    description: 'Store marks cards, income certificates, and Aadhaar-linked records securely with instant verification parsing.',
  },
];

const FAQS = [
  {
    question: 'Does ScholarAI cover Karnataka State Scholarships (SSP & ePASS)?',
    answer: 'Yes! ScholarAI indexes State Scholarship Portal (SSP Karnataka), ePASS, Social Welfare Department schemes, and private corporate grants across Karnataka and India.',
  },
  {
    question: 'Is ScholarAI free for Indian students?',
    answer: 'Yes! Core scholarship discovery, eligibility audits, and document vault storage are 100% free for all registered students.',
  },
  {
    question: 'How does the AI match score work for Indian criteria?',
    answer: 'Our AI engine compares your profile (CGPA, state domicile, caste category, household annual income) with official government and trust eligibility rules to calculate a compatibility score.',
  },
  {
    question: 'Can I track application deadlines for State & National portals?',
    answer: 'Absolutely. Your student portal dashboard gives you a unified timeline with calendar reminders for SSP, NSP, and corporate grant deadlines.',
  },
];

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-[#EFEDE6] text-[#111111] overflow-x-hidden select-none">
      
      {/* 1. HERO SECTION: 100vh Vertically Centered Grid (55% Left, 45% Right) */}
      <section className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
        <div className="app-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side (55% -> lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE5E5] border border-[#FFC9C9] text-[#CD0000] text-xs font-bold font-heading uppercase tracking-widest mb-6 w-fit"
              >
                <Zap className="w-3.5 h-3.5" />
                India & Karnataka Scholarship Intelligence
              </motion.div>

              {/* Vertically Aligned Oversized Typography */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hero-title-scaling mb-6"
              >
                DISCOVER.<br />
                <span className="text-[#CD0000]">QUALIFY.</span><br />
                APPLY.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-[#444444] font-sans font-normal max-w-xl mb-8 leading-relaxed"
              >
                The intelligent platform matching ambitious students across India and Karnataka with verified state, central, and corporate scholarships.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link to="/scholarships" className="w-full sm:w-auto">
                  <Button variant="primary" className="h-14 px-8 text-sm uppercase font-heading tracking-wider w-full sm:w-auto min-h-[44px]">
                    Find Scholarships Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" className="h-14 px-8 text-sm uppercase font-heading tracking-wider w-full sm:w-auto min-h-[44px]">
                    Student Portal Access
                  </Button>
                </Link>
              </motion.div>

              {/* Integrated Hero Statistics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#DDDDDD]">
                {MOCK_STATS.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-extrabold font-heading text-[#111111] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider font-heading text-[#666666] mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Side (45% -> lg:col-span-5): Aligned Vertically with Left Text */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full bg-white border border-[#DDDDDD] rounded-[24px] p-6 sm:p-8 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#CD0000] text-white flex items-center justify-center font-bold shrink-0 shadow-[0_4px_12px_rgba(205,0,0,0.25)]">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-[#111111] text-base">Karnataka SSP Eligibility</h4>
                      <p className="text-xs text-[#666666]">Real-time profile audit</p>
                    </div>
                  </div>
                  <Badge variant="cherry">98% Match</Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-[16px] bg-[#EFEDE6] border border-[#DDDDDD] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                      <span className="text-xs font-bold font-heading text-[#111111]">Academic Score (CGPA)</span>
                    </div>
                    <span className="text-xs font-semibold text-[#16A34A] font-heading">Verified 9.2/10.0</span>
                  </div>

                  <div className="p-4 rounded-[16px] bg-[#EFEDE6] border border-[#DDDDDD] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                      <span className="text-xs font-bold font-heading text-[#111111]">Karnataka Domicile</span>
                    </div>
                    <span className="text-xs font-semibold text-[#16A34A] font-heading">Qualified</span>
                  </div>

                  <div className="p-4 rounded-[16px] bg-[#EFEDE6] border border-[#DDDDDD] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                      <span className="text-xs font-bold font-heading text-[#111111]">Income & Caste Certificate</span>
                    </div>
                    <span className="text-xs font-semibold text-[#16A34A] font-heading">3/3 Audited</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#EEEEEE] flex items-center justify-between text-xs text-[#555555]">
                  <span>Annual Funding: <strong className="text-[#111111] font-heading font-extrabold">₹50,000/yr</strong></span>
                  <Link to="/scholarships" className="text-[#CD0000] font-bold font-heading uppercase hover:underline">
                    Direct Apply &rarr;
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED SCHOLARSHIPS SECTION */}
      <section className="section-spacing bg-[#EFEDE6] border-t border-[#DDDDDD]">
        <div className="app-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
                Verified Opportunities
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] mt-2">
                Featured Indian Scholarships
              </h2>
            </div>
            <Link to="/scholarships">
              <Button variant="secondary" className="!py-2.5 !px-5 text-xs uppercase font-heading tracking-wider min-h-[44px]">
                Browse All Grants &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-layout-32">
            {FEATURED_SCHOLARSHIPS.map((scholarship) => (
              <Card key={scholarship.id} className="flex flex-col justify-between h-full p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary">{scholarship.category}</Badge>
                    <span className="text-xs font-bold font-heading text-[#16A34A] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                      {scholarship.matchScore}% AI Match
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold font-heading text-[#111111] mb-2 leading-snug">
                    {scholarship.title}
                  </h3>
                  <p className="text-xs text-[#555555] font-medium mb-6">
                    {scholarship.provider}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EEEEEE] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider font-heading text-[#888888] block">
                      Award Value
                    </span>
                    <span className="text-xl font-extrabold font-heading text-[#CD0000]">
                      {scholarship.amount}
                    </span>
                  </div>
                  <Link to="/scholarships">
                    <Button variant="primary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider min-h-[44px]">
                      Apply
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI FEATURES SHOWCASE */}
      <section id="ai-features" className="section-spacing bg-white border-y border-[#DDDDDD]">
        <div className="app-container">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
              Intelligence Built-In
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] mt-2">
              Next-Generation AI Tools for Students
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-layout-32">
            {AI_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-8 rounded-[24px] bg-[#EFEDE6] border border-[#DDDDDD] flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#CD0000] text-white flex items-center justify-center mb-6 shadow-[0_4px_14px_rgba(205,0,0,0.25)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-[#111111] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#555555] leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="section-spacing bg-[#EFEDE6]">
        <div className="app-container">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
              Simple 3-Step Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] mt-2">
              How ScholarAI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-layout-32">
            <div className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft flex flex-col justify-between h-full">
              <div>
                <span className="text-4xl font-extrabold font-heading text-[#CD0000] block mb-4">01</span>
                <h3 className="text-xl font-bold font-heading text-[#111111] mb-2">Build Your Academic Profile</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Add your SSLC/PUC marks, Karnataka domicile status, family income certificate, and caste category.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft flex flex-col justify-between h-full">
              <div>
                <span className="text-4xl font-extrabold font-heading text-[#CD0000] block mb-4">02</span>
                <h3 className="text-xl font-bold font-heading text-[#111111] mb-2">Run AI Eligibility Audit</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Our neural matching engine verifies your qualifications against thousands of verified SSP, NSP, and corporate grant rules.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft flex flex-col justify-between h-full">
              <div>
                <span className="text-4xl font-extrabold font-heading text-[#CD0000] block mb-4">03</span>
                <h3 className="text-xl font-bold font-heading text-[#111111] mb-2">Apply Directly to Portals</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Submit your verified documents directly through SSP Karnataka, NSP, or official trust portals with 1-click export.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section id="faq" className="section-spacing bg-white border-t border-[#DDDDDD]">
        <div className="app-container max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#111111] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#DDDDDD] rounded-[20px] bg-[#EFEDE6] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer min-h-[44px]"
                >
                  <span className="text-base font-bold font-heading text-[#111111]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#CD0000] transition-transform duration-200 shrink-0 ${
                      openFaqIndex === idx ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-6 text-xs text-[#444444] font-sans leading-relaxed border-t border-[#DDDDDD] pt-4 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
