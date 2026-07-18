import React from 'react';
import { LayoutDashboard, FileText, Bell, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Grid } from '../components/common/Grid';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.full_name || 'Jane Student';

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Title */}
      <PageTitle
        title={`Welcome, ${userName}`}
        description="Here is a summary of your scholarship recommendations, document vaults, and active applications."
        action={
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <LayoutDashboard className="w-4 h-4 text-primary-600" />
            Student Portal Console
          </div>
        }
      />

      {/* Stats Section */}
      <Grid cols={1} sm={3} gap={6}>
        <Card className="border-l-4 border-l-primary-500">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">AI Match Recommendations</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">12</span>
          <span className="text-xs text-primary-650 dark:text-primary-400 mt-2 block flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            3 new matches today
          </span>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Active Applications</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">2</span>
          <span className="text-xs text-slate-500 dark:text-slate-450 mt-2 block font-semibold">
            1 under review, 1 draft pending
          </span>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Documents Uploaded</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">5</span>
          <span className="text-xs text-slate-500 dark:text-slate-450 mt-2 block font-semibold">
            All files verified securely
          </span>
        </Card>
      </Grid>

      {/* Main Grid Split */}
      <Grid cols={1} lg={12} gap={8}>
        
        {/* Left Column (8 cols): Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          <SectionHeader
            title="Recommended for You"
            subtitle="Based on your GPA, household income, and regional attributes."
            action={
              <Link to="/recommendations">
                <Button variant="link" className="text-xs font-bold">
                  View All Matches
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            }
          />

          <div className="space-y-4">
            <Card hoverable>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">National Merit Scholarship</h3>
                <Badge variant="primary">98% Match</Badge>
              </CardHeader>
              <CardBody>
                <p className="text-slate-500 dark:text-slate-405 leading-relaxed text-xs">
                  Matches your academic score (9.2 GPA score) and residency validation profiles.
                </p>
              </CardBody>
              <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-750">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹50,000 / year</span>
                <Link to="/applications">
                  <Button variant="ghost" className="!py-1.5 !px-3 text-xs font-bold">
                    Start Application &rarr;
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Tata Endowment Grant</h3>
                <Badge variant="primary">95% Match</Badge>
              </CardHeader>
              <CardBody>
                <p className="text-slate-500 dark:text-slate-405 leading-relaxed text-xs">
                  Matches your field of study (Engineering streams) and income class requirements.
                </p>
              </CardBody>
              <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-750">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹2,00,000 / total</span>
                <Link to="/applications">
                  <Button variant="ghost" className="!py-1.5 !px-3 text-xs font-bold">
                    Start Application &rarr;
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Right Column (4 cols): Alerts / Notifications */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <SectionHeader
              title="Recent Alerts"
              subtitle="Critical deadlines and updates"
            />
            <Card className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-105 dark:border-red-900/30 rounded-xl space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-red-600 dark:text-red-400 block">
                  Deadline Warning
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  Tata Endowment Grant closes in 3 days. Complete document upload.
                </p>
              </div>

              <div className="p-3 bg-primary-50 dark:bg-primary-950/20 border border-primary-105 dark:border-primary-900/30 rounded-xl space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-primary-600 dark:text-primary-400 block">
                  Match Alert
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  New corporate scholarship matches 89% of your academic profile.
                </p>
              </div>
            </Card>
          </div>
        </div>

      </Grid>
    </div>
  );
};

export default Dashboard;
