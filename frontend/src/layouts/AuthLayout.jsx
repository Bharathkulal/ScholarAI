import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#EFEDE6] text-[#111111] overflow-hidden select-none">
      
      {/* Left Column: Editorial Brand Story (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-[#111111] text-white p-12 flex-col justify-between relative border-r border-[#222222]">
        
        {/* Top Logo */}
        <div className="z-10">
          <Logo link="/" isDark={true} />
        </div>

        {/* Center Editorial Graphics & Copy */}
        <div className="my-auto max-w-lg z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CD0000] text-white text-xs font-bold font-heading uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Scholarship Intelligence
          </div>

          <h1 className="text-5xl font-extrabold uppercase font-heading tracking-tight leading-none text-white mb-6">
            Unlock Millions in <span className="text-[#CD0000]">Verified</span> Academic Grants.
          </h1>

          <p className="text-sm font-sans text-[#AAAAAA] leading-relaxed mb-8">
            Access over 14,000+ verified corporate, university, and foundation scholarships with real-time AI eligibility audits.
          </p>

          <div className="space-y-4 text-xs font-heading uppercase tracking-wider text-[#CCCCCC]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#CD0000]" />
              <span>Real-time GPA & Eligibility Matching</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#CD0000]" />
              <span>Secure Document Vault Encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#CD0000]" />
              <span>1-Click Verified Portal Export</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-[#666666] font-heading font-bold uppercase tracking-widest flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} ScholarAI Platform</span>
          <Link to="/" className="text-[#CD0000] hover:underline">Back to Main Site &rarr;</Link>
        </div>
      </div>

      {/* Right Column: Form View Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo link="/" />
          </div>

          {/* Form Container Card */}
          <div className="w-full bg-white border border-[#DDDDDD] p-8 sm:p-10 rounded-[24px] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)]">
            <Outlet />
          </div>
        </div>
      </div>

    </div>
  );
};
export default AuthLayout;
