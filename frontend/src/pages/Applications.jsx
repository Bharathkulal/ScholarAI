import React from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Clock, FileEdit } from 'lucide-react';

const MOCK_APPLICATIONS = [
  {
    id: 'APP-1829',
    title: 'Global Tech Innovators Fellowship',
    status: 'review',
    progress: 75,
    lastUpdate: 'Yesterday, 4:30 PM',
    statusLabel: 'Under Audit',
    statusVariant: 'warning',
  },
  {
    id: 'APP-2947',
    title: 'NextGen Women in Engineering Grant',
    status: 'draft',
    progress: 30,
    lastUpdate: '3 days ago',
    statusLabel: 'Draft Pending',
    statusVariant: 'secondary',
  },
];

const Applications = () => {
  return (
    <div className="space-y-6 select-none">
      <PageTitle
        title="Application Tracker"
        description="Monitor submission statuses, document approval milestones, and deadline timelines for active grant files."
      />

      <div className="space-y-4">
        {MOCK_APPLICATIONS.map((app) => (
          <Card key={app.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-grow space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest font-heading text-[#888888] select-none">
                    FILE ID: {app.id}
                  </span>
                  <Badge variant={app.statusVariant}>{app.statusLabel}</Badge>
                </div>
                <h4 className="text-xl font-extrabold font-heading text-[#111111]">
                  {app.title}
                </h4>
                
                {/* Progress Indicators */}
                <div className="max-w-md space-y-1">
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider font-heading block">
                    Audit Progress
                  </span>
                  <ProgressBar value={app.progress} showValue />
                </div>
              </div>

              {/* Action columns */}
              <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-[#EEEEEE]">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-[#888888] block font-bold uppercase tracking-widest font-heading">Last Activity</span>
                  <span className="text-xs font-semibold text-[#111111]">{app.lastUpdate}</span>
                </div>
                
                {app.status === 'draft' ? (
                  <Button variant="primary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider">
                    <FileEdit className="w-3.5 h-3.5" />
                    Complete Draft
                  </Button>
                ) : (
                  <Button variant="secondary" className="!py-2 !px-4 text-xs uppercase font-heading tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    View Timeline
                  </Button>
                )}
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Applications;
