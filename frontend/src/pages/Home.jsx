import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto px-4 select-none pt-10">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold mb-6">
        <Cpu className="w-3.5 h-3.5" />
        AI-Powered Discovery Engine
      </div>
      
      <h1 className="text-hero text-slate-900 dark:text-white mb-6">
        Discover. Qualify. <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Apply.</span>
      </h1>
      
      <p className="text-body-text mb-8 max-w-2xl">
        ScholarAI combines modern AI matching algorithms with a comprehensive scholarship index, helping you verify eligibility and access educational opportunities instantly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
        <Link to="/scholarships">
          <Button variant="primary" className="w-full sm:w-auto h-12 px-6">
            Explore Scholarships
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="w-full sm:w-auto h-12 px-6">
            Student Portal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full text-left">
        <div className="premium-card p-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-card-title mb-2">AI Matcher</h3>
          <p className="text-body-text text-xs text-slate-500 dark:text-slate-400">Get scholarship matches tailored specifically to your academic credentials, location, and demographic profile.</p>
        </div>

        <div className="premium-card p-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-card-title mb-2">Eligibility Audit</h3>
          <p className="text-body-text text-xs text-slate-500 dark:text-slate-400">Instantly verify if you meet the requirements of corporate, government, or institutional scholarships.</p>
        </div>

        <div className="premium-card p-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-105 dark:border-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-card-title mb-2">Document Hub</h3>
          <p className="text-body-text text-xs text-slate-500 dark:text-slate-400">Keep your certificates, transcripts, and application materials organized and ready in a secure vault.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
