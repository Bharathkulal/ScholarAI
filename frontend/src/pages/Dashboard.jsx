import React from 'react';
import { LayoutDashboard, Sparkles, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
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
  const userName = user?.full_name || 'Student';

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Title */}
      <PageTitle
        title={`Welcome back, ${userName.split(' ')[0]}`}
        description="Here is your real-time scholarship discovery overview, AI matches, and active grant applications."
        action={
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-heading text-[#CD0000] bg-[#FFE5E5] border border-[#FFC9C9] px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            AI Audit Active
          </div>
        }
      />

      {/* Stats Section */}
      <Grid cols={1} sm={3} gap={6}>
        <Card className="border-l-4 border-l-[#CD0000]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading block">
            AI Match Recommendations
          </span>
          <span className="text-4xl font-extrabold font-heading text-[#111111] mt-2 block">
            12
          </span>
          <span className="text-xs text-[#CD0000] font-heading font-bold mt-2 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            3 new high-score matches today
          </span>
        </Card>

        <Card className="border-l-4 border-l-[#16A34A]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading block">
            Active Applications
          </span>
          <span className="text-4xl font-extrabold font-heading text-[#111111] mt-2 block">
            2
          </span>
          <span className="text-xs text-[#16A34A] font-heading font-bold mt-2 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            1 under review, 1 draft pending
          </span>
        </Card>

        <Card className="border-l-4 border-l-[#F59E0B]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading block">
            Verified Vault Documents
          </span>
          <span className="text-4xl font-extrabold font-heading text-[#111111] mt-2 block">
            5
          </span>
          <span className="text-xs text-[#666666] font-heading font-medium mt-2 block">
            All files encrypted & audited
          </span>
        </Card>
      </Grid>

      {/* Main Grid Split */}
      <Grid cols={1} lg={12} gap={8}>
        
        {/* Left Column (8 cols): Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          <SectionHeader
            title="Top AI Recommendations"
            subtitle="Calculated specifically against your GPA score, field of study, and verified profile credentials."
            action={
              <Link to="/recommendations">
                <Button variant="secondary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider">
                  All Matches &rarr;
                </Button>
              </Link>
            }
          />

          <div className="space-y-5">
            <Card hoverable>
              <CardHeader>
                <div>
                  <h3 className="font-extrabold text-[#111111] text-lg font-heading">National Merit Excellence Fellowship</h3>
                  <p className="text-xs text-[#666666] font-medium">National Science & Education Council</p>
                </div>
                <Badge variant="primary">98% Match</Badge>
              </CardHeader>
              <CardBody>
                <p className="text-[#444444] text-xs leading-relaxed font-sans">
                  Matches your 3.9 GPA score, undergraduate standing, and regional citizenship status.
                </p>
              </CardBody>
              <CardFooter className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block">Annual Award</span>
                  <span className="text-lg font-extrabold font-heading text-[#CD0000]">$25,000 / year</span>
                </div>
                <Link to="/applications">
                  <Button variant="primary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider">
                    Start Application &rarr;
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div>
                  <h3 className="font-extrabold text-[#111111] text-lg font-heading">Global Technology Enterprise Grant</h3>
                  <p className="text-xs text-[#666666] font-medium">Global Tech Foundation</p>
                </div>
                <Badge variant="primary">95% Match</Badge>
              </CardHeader>
              <CardBody>
                <p className="text-[#444444] text-xs leading-relaxed font-sans">
                  Matches your Computer Science / STEM stream and transcript verification credentials.
                </p>
              </CardBody>
              <CardFooter className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block">Total Grant</span>
                  <span className="text-lg font-extrabold font-heading text-[#CD0000]">$15,000 total</span>
                </div>
                <Link to="/applications">
                  <Button variant="primary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider">
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
              title="Alert Notifications"
              subtitle="Critical deadline updates"
            />
            <Card className="space-y-4">
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[16px] space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DC2626] font-heading block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Urgent Deadline
                </span>
                <p className="text-xs font-bold text-[#111111] leading-snug">
                  Global Technology Enterprise Grant closes in 3 days. Upload pending recommendation letter.
                </p>
              </div>

              <div className="p-4 bg-[#FFE5E5] border border-[#FFC9C9] rounded-[16px] space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CD0000] font-heading block">
                  New High-Match Grant
                </span>
                <p className="text-xs font-bold text-[#111111] leading-snug">
                  Newly verified STEM grant matches 92% of your student profile.
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
