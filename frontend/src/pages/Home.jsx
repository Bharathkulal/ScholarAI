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
  Award,
  BookOpen,
  UserCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Mock Data for Landing Page Sections
const MOCK_STATS = [
  { label: 'Total Verified Scholarships', value: '14,500+' },
  { label: 'Active Funding Available', value: '$85.4M' },
  { label: 'Students Matched', value: '120,000+' },
  { label: 'Eligibility Check Accuracy', value: '99.4%' },
];

const FEATURED_SCHOLARSHIPS = [
  {
    id: '1',
    title: 'Global Tech Innovators Fellowship',
    provider: 'Tech For Tomorrow Foundation',
    amount: '$25,000',
    deadline: 'Aug 15, 2026',
    matchScore: 98,
    category: 'STEM & Tech',
  },
  {
    id: '2',
    title: 'NextGen Women in Engineering Grant',
    provider: 'Apex Enterprise Institute',
    amount: '$15,000',
    deadline: 'Sep 01, 2026',
    matchScore: 95,
    category: 'Women in STEM',
  },
  {
    id: '3',
    title: 'Future Leaders Academic Excellence Award',
    provider: 'Global Education Council',
    amount: '$10,000',
    deadline: 'Oct 10, 2026',
    matchScore: 92,
    category: 'Undergraduate',
  },
];

const AI_FEATURES = [
  {
    icon: Cpu,
    title: 'AI Recommendation Engine',
    description: 'Neural matching algorithms map your academic credentials, location, and achievements to eligible global funds instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Eligibility Audit System',
    description: 'Automated 12-point document verification checks your GPA, criteria, and citizenship status against scholarship bylaws.',
  },
  {
    icon: Sparkles,
    title: 'Semantic Smart Search',
    description: 'Natural language search lets you query "renewable energy grants for master students" and get contextual matches.',
  },
  {
    icon: BookOpen,
    title: 'Automated Document Vault',
    description: 'Store transcripts, recommendation letters, and certificates securely with instant verification parsing.',
  },
];

const FAQS = [
  {
    question: 'How does ScholarAI verify scholarship authenticity?',
    answer: 'Every scholarship in our index undergoes direct verification through partner university portals, official corporate sponsors, and government databases before publication.',
  },
  {
    question: 'Is ScholarAI free for students?',
    answer: 'Yes! Core scholarship discovery, eligibility audits, and document vault storage are 100% free for all registered students.',
  },
  {
    question: 'How does the AI match score work?',
    answer: 'Our AI engine compares your student profile (GPA, field of study, income bracket, demographics) with official eligibility rules to calculate a real-time compatibility score.',
  },
  {
    question: 'Can I track application deadlines on ScholarAI?',
    answer: 'Absolutely. Your student portal dashboard gives you a unified timeline with calendar reminders for upcoming deadlines and document submission requirements.',
  },
];

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#EFEDE6] text-[#111111] overflow-hidden select-none">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          {/* Oversized Editorial Heading */}
          <div className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE5E5] border border-[#FFC9C9] text-[#CD0000] text-xs font-bold font-heading uppercase tracking-widest mb-8"
            >
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Scholarship Discovery Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-hero text-6xl sm:text-8xl md:text-9xl text-[#111111] uppercase tracking-tighter font-heading font-extrabold leading-[0.88] mb-8"
            >
              DISCOVER.<br />
              <span className="text-[#CD0000]">QUALIFY.</span><br />
              APPLY.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#444444] font-sans font-normal max-w-xl mb-10 leading-relaxed"
            >
              The intelligent platform matching ambitious students with verified global scholarships, instant eligibility audits, and automated application tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/scholarships">
                <Button variant="primary" className="h-14 px-8 text-base uppercase font-heading tracking-wider w-full sm:w-auto">
                  Find Scholarships Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="h-14 px-8 text-base uppercase font-heading tracking-wider w-full sm:w-auto">
                  Student Portal Access
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Abstract Editorial Graphic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-[460px] bg-white border border-[#DDDDDD] rounded-[24px] p-8 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] relative"
          >
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#CD0000] text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[#111111]">AI Eligibility Match</h4>
                  <p className="text-xs text-[#666666]">Real-time profile audit</p>
                </div>
              </div>
              <Badge variant="cherry">98% Match</Badge>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-[16px] bg-[#EFEDE6] border border-[#DDDDDD] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <span className="text-xs font-bold font-heading text-[#111111]">Academic GPA Check</span>
                </div>
                <span className="text-xs font-semibold text-[#16A34A]">Verified 3.9/4.0</span>
              </div>

              <div className="p-4 rounded-[16px] bg-[#EFEDE6] border border-[#DDDDDD] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <span className="text-xs font-bold font-heading text-[#111111]">Citizenship Requirements</span>
                </div>
                <span className="text-xs font-semibold text-[#16A34A]">Qualified</span>
              </div>

              <div className="p-4 rounded-[16px] bg-[#EFEDE6] border border-[#DDDDDD] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <span className="text-xs font-bold font-heading text-[#111111]">Document Audit</span>
                </div>
                <span className="text-xs font-semibold text-[#16A34A]">3/3 Ready</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#EEEEEE] flex items-center justify-between text-xs text-[#555555]">
              <span>Annual Funding: <strong className="text-[#111111] font-heading font-bold">$25,000/yr</strong></span>
              <span className="text-[#CD0000] font-bold font-heading uppercase">Direct Apply &rarr;</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SCHOLAR STATISTICS SECTION */}
      <section className="bg-white border-y border-[#DDDDDD] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider font-heading text-[#666666] mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SCHOLARSHIPS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
              Verified Opportunities
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] mt-2">
              Featured Scholarships
            </h2>
          </div>
          <Link to="/scholarships">
            <Button variant="secondary" className="!py-2.5 !px-5 text-xs uppercase font-heading tracking-wider">
              Browse All Grants &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_SCHOLARSHIPS.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="primary">{scholarship.category}</Badge>
                  <span className="text-xs font-bold font-heading text-[#16A34A] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                    {scholarship.matchScore}% AI Match
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-[#111111] mb-2 leading-snug">
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
                  <Button variant="primary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider">
                    Apply
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. AI FEATURES SHOWCASE */}
      <section className="bg-white border-y border-[#DDDDDD] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
              Intelligence Built-In
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] mt-2">
              Next-Generation AI Tools for Students
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {AI_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-8 rounded-[24px] bg-[#EFEDE6] border border-[#DDDDDD] flex flex-col justify-between">
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

      {/* 5. HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest font-heading text-[#CD0000]">
            Simple 3-Step Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#111111] mt-2">
            How ScholarAI Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft">
            <span className="text-4xl font-extrabold font-heading text-[#CD0000] block mb-4">01</span>
            <h3 className="text-xl font-bold font-heading text-[#111111] mb-2">Build Your Academic Profile</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Add your GPA, field of study, desired degree level, and document certificates to your profile vault.
            </p>
          </div>

          <div className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft">
            <span className="text-4xl font-extrabold font-heading text-[#CD0000] block mb-4">02</span>
            <h3 className="text-xl font-bold font-heading text-[#111111] mb-2">Run AI Eligibility Audit</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Our neural matching engine verifies your qualifications against thousands of verified scholarship rules.
            </p>
          </div>

          <div className="p-8 rounded-[24px] bg-white border border-[#DDDDDD] shadow-soft">
            <span className="text-4xl font-extrabold font-heading text-[#CD0000] block mb-4">03</span>
            <h3 className="text-xl font-bold font-heading text-[#111111] mb-2">Apply Directly to Grants</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Submit your verified documents directly through official university or foundation portals with 1-click export.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="bg-white border-t border-[#DDDDDD] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-base font-bold font-heading text-[#111111]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#CD0000] transition-transform duration-200 ${
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
