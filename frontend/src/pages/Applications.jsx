import React from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Clock, CheckCircle2, FileEdit } from 'lucide-react';

const MOCK_APPLICATIONS = [
  {
    id: 'APP-1829',
    title: 'National Merit Scholarship',
    status: 'review',
    progress: 75,
    lastUpdate: 'Yesterday, 4:30 PM',
    statusLabel: 'Under Review',
    statusVariant: 'warning',
  },
  {
    id: 'APP-2947',
    title: 'Tata Endowment Grant',
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
        description="Monitor status updates, document approvals, and review milestones for all submitted funds."
      />

      <div className="space-y-4">
        {MOCK_APPLICATIONS.map((app) => (
          <Card key={app.id}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-grow space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 select-none uppercase tracking-wide">
                    ID: {app.id}
                  </span>
                  <Badge variant={app.statusVariant}>{app.statusLabel}</Badge>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {app.title}
                </h4>
                
                {/* Progress Indicators */}
                <div className="max-w-md space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Submission Progress
                  </span>
                  <ProgressBar value={app.progress} showValue />
                </div>
              </div>

              {/* Action columns */}
              <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Last Updated</span>
                  <span className="text-xs font-semibold text-slate-650 dark:text-slate-350">{app.lastUpdate}</span>
                </div>
                
                {app.status === 'draft' ? (
                  <Button variant="primary" className="!py-1.5 !text-xs">
                    <FileEdit className="w-3.5 h-3.5" />
                    Complete Draft
                  </Button>
                ) : (
                  <Button variant="secondary" className="!py-1.5 !text-xs">
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
