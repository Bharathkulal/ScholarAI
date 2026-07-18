import React from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Bell, MailOpen, Calendar, ShieldAlert, Cpu } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Tata Endowment Grant Closes Soon',
    category: 'Deadline Warning',
    message: 'You have an incomplete application draft for Tata Endowment Grant. Submit within 3 days to avoid disqualification.',
    time: '2 hours ago',
    icon: ShieldAlert,
    color: 'bg-red-50 dark:bg-red-955/20 text-red-500',
  },
  {
    id: 2,
    title: 'New AI Match: corporate CSR Grant',
    category: 'AI Recommendation',
    message: 'Based on your recent profile update, you are eligible for the Infosys CSR Graduate Program. Match confidence: 89%.',
    time: '1 day ago',
    icon: Cpu,
    color: 'bg-primary-50 dark:bg-primary-955/20 text-primary-500',
  },
  {
    id: 3,
    title: 'Document Verified Successfully',
    category: 'Verification Status',
    message: 'Your Income Certificate 2026.pdf has been audited and approved by the system administration team.',
    time: '3 days ago',
    icon: Bell,
    color: 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-500',
  },
];

const Notifications = () => {
  return (
    <div className="space-y-6 select-none max-w-3xl mx-auto">
      <PageTitle
        title="Notifications"
        description="Stay updated with system announcements, deadline warnings, and AI matching recommendations."
      />

      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((n) => {
          const Icon = n.icon;
          return (
            <Card key={n.id} className="p-5 flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase font-bold tracking-wide text-slate-400">
                    {n.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{n.time}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                  {n.title}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
