import React from 'react';
import { LayoutDashboard, FileText, Bell, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Jane Student"}');

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {user.name}</h1>
          <p className="text-dark-500 text-sm mt-1">Here is a summary of your scholarship recommendations and applications.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-dark-900 border border-dark-800 rounded-xl text-xs font-semibold text-dark-300 flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-brand-400" />
            Student Portal
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-brand-500">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500 block">AI Match Recommendations</span>
          <span className="text-3xl font-black text-white mt-1 block">12</span>
          <span className="text-xs text-brand-400 mt-2 block flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            3 new matches today
          </span>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500 block">Active Applications</span>
          <span className="text-3xl font-black text-white mt-1 block">2</span>
          <span className="text-xs text-dark-500 mt-2 block">1 under review, 1 draft</span>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500 block">Documents Uploaded</span>
          <span className="text-3xl font-black text-white mt-1 block">5</span>
          <span className="text-xs text-dark-500 mt-2 block">All verified successfully</span>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols - Scholarship recommendation list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Recommended for You
            </h2>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6 space-y-4 hover:border-brand-500/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">National Merit Scholarship</h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full">98% Match</span>
              </div>
              <p className="text-xs text-dark-500">Matches your academic score (9.4 CGPA) and local state criteria.</p>
              <div className="flex items-center justify-between pt-2 border-t border-dark-850">
                <span className="text-xs font-semibold text-emerald-400">₹50,000 / year</span>
                <button className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors">Start Application &rarr;</button>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4 hover:border-brand-500/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Tata Endowment Grant</h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full">95% Match</span>
              </div>
              <p className="text-xs text-dark-500">Matches your field of study (Engineering) and college classification.</p>
              <div className="flex items-center justify-between pt-2 border-t border-dark-850">
                <span className="text-xs font-semibold text-emerald-400">₹2,00,000 / total</span>
                <button className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors">Start Application &rarr;</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 col - Alerts and files quick access */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-brand-400" />
              Recent Notifications
            </h2>
            <div className="glass-card p-4 space-y-4">
              <div className="p-3 bg-dark-950/60 rounded-xl border border-dark-850 space-y-1">
                <span className="text-[10px] font-semibold text-rose-400">Deadline Warning</span>
                <p className="text-xs text-dark-200">Tata Endowment Grant closes in 3 days.</p>
              </div>

              <div className="p-3 bg-dark-950/60 rounded-xl border border-dark-850 space-y-1">
                <span className="text-[10px] font-semibold text-brand-400">Match Alert</span>
                <p className="text-xs text-dark-200">New corporate scholarship matches 89% of your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
