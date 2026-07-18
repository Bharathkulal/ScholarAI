import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto px-4 select-none">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
        <Cpu className="w-3.5 h-3.5" />
        AI-Powered Discovery Engine
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Discover. Qualify. <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-purple-400 bg-clip-text text-transparent">Apply.</span>
      </h1>
      
      <p className="text-dark-300 text-lg sm:text-xl mb-8 max-w-2xl leading-relaxed">
        ScholarAI combines modern AI matching algorithms with a comprehensive scholarship index, helping you verify eligibility and access educational opportunities instantly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
        <Link to="/scholarships" className="btn-primary">
          Explore Scholarships
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/login" className="btn-secondary">
          Student Portal
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full text-left">
        <div className="glass-card p-6">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">AI Matcher</h3>
          <p className="text-xs text-dark-500 leading-relaxed">Get scholarship matches tailored specifically to your academic credentials, location, and demographic profile.</p>
        </div>

        <div className="glass-card p-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Eligibility Audit</h3>
          <p className="text-xs text-dark-500 leading-relaxed">Instantly verify if you meet the requirements of corporate, government, or institutional scholarships.</p>
        </div>

        <div className="glass-card p-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Document Hub</h3>
          <p className="text-xs text-dark-500 leading-relaxed">Keep your certificates, transcripts, and application materials organized and ready in a secure vault.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
