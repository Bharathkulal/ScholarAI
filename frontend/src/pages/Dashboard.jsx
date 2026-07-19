import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  Upload,
  Bot,
  ArrowRight,
  Bookmark,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getStudentDashboardApi } from '../services/applications';
import toast from 'react-hot-toast';

const QUICK_ACTIONS = [
  { id: 'wizard', title: 'Profile Wizard', subtitle: 'Complete 8-step student onboarding', icon: UserCheck, link: '/profile', color: 'bg-indigo-50 text-indigo-600' },
  { id: 'search', title: 'Search Scholarships', subtitle: 'Explore verified grants', icon: Search, link: '/scholarships', color: 'bg-blue-50 text-blue-600' },
  { id: 'upload', title: 'Upload Documents', subtitle: 'Add marks card & income certificates', icon: Upload, link: '/profile', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'track', title: 'Track Applications', subtitle: 'Monitor audit status milestones', icon: Layers, link: '/applications', color: 'bg-[#FFE5E5] text-[#CD0000]' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getStudentDashboardApi();
        if (res && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#CD0000]" />
        <span className="text-xs font-heading font-extrabold uppercase text-[#666666]">
          Loading Student Portal Dashboard...
        </span>
      </div>
    );
  }

  const completion = dashboardData?.profile_completion?.overall || 85;
  const eligibility = dashboardData?.eligibility_summary || { status: 'Eligible', match_score: 90 };
  const stats = dashboardData?.statistics || { active_applications: 0, saved_scholarships: 0 };
  const recentApps = dashboardData?.recent_applications || [];
  const savedItems = dashboardData?.saved_scholarships || [];
  const recommendations = dashboardData?.recommended_scholarships || [];

  return (
    <div className="space-y-8 select-none w-full pb-16">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] p-8 text-white shadow-soft">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CD0000] text-white text-[10px] font-heading font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> ScholarAI Engine Active
          </span>
          <h1 className="text-3xl font-extrabold font-heading">
            Welcome back, {user?.full_name || 'Student User'}!
          </h1>
          <p className="text-xs font-sans text-gray-300 leading-relaxed">
            Your smart profile is <strong>{completion}% complete</strong> and evaluated as <strong>{eligibility.status}</strong> for top Karnataka SSP and NSP scholarship programs.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-[#CD0000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Profile Completion</span>
            <UserCheck className="w-4 h-4 text-[#CD0000]" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-[#111111]">{completion}%</span>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Eligibility Score</span>
            <ShieldCheck className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-green-700">{eligibility.match_score || 90}%</span>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Active Applications</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-[#111111]">{stats.active_applications}</span>
        </Card>

        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Saved Bookmarks</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-[#111111]">{stats.saved_scholarships}</span>
        </Card>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
          Quick Actions & Onboarding Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => navigate(action.link)}
                className="p-5 rounded-[20px] bg-white border border-[#DDDDDD] hover:border-[#CD0000] hover:shadow-lift transition-all cursor-pointer space-y-3 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold font-heading text-[#111111] group-hover:text-[#CD0000] transition-colors flex items-center justify-between">
                    {action.title}
                    <ChevronRight className="w-4 h-4 text-[#888888] group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-[#666666] mt-0.5 font-medium">{action.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Applications & Saved Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Applications Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
              Active Application Tracking
            </h3>
            <Link to="/applications" className="text-xs font-bold font-heading uppercase text-[#CD0000] hover:underline">
              View All Applications →
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <p className="text-xs text-[#666666]">You have not submitted any scholarship applications yet.</p>
              <Button onClick={() => navigate('/scholarships')} variant="primary" className="text-xs uppercase font-heading">
                Explore Scholarships catalog
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <Card key={app._id} className="p-5 flex items-center justify-between gap-4 border border-[#DDDDDD]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#888888]">ID: {app.application_number}</span>
                    <h4 className="text-sm font-extrabold font-heading text-[#111111]">{app.scholarship_title}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-extrabold uppercase bg-green-100 text-green-800">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <Button onClick={() => navigate('/applications')} variant="secondary" className="!py-2 text-xs font-heading uppercase">
                    Track Status
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Scholarships catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
              Recommended for You
            </h3>
            <Link to="/scholarships" className="text-xs font-bold font-heading uppercase text-[#CD0000] hover:underline">
              Explore All →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((sch) => (
              <Card key={sch._id || sch.slug} className="p-4 flex items-center justify-between gap-3 border border-[#DDDDDD]">
                <div>
                  <h4 className="text-xs font-extrabold font-heading text-[#111111] line-clamp-1">{sch.title}</h4>
                  <span className="text-[11px] font-bold text-[#CD0000] block mt-0.5">
                    {sch.amount_info?.amount || '₹50,000 / year'}
                  </span>
                </div>

                <Link
                  to={`/scholarships/${sch.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-heading font-extrabold text-[11px] uppercase shrink-0"
                >
                  View
                </Link>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
