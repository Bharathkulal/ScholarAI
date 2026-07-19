import React from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Bell, ShieldAlert, Cpu } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Global Tech Innovators Fellowship Closes Soon',
    category: 'Deadline Warning',
    message: 'You have an incomplete application draft for Global Tech Innovators Fellowship. Submit within 3 days to avoid disqualification.',
    time: '2 hours ago',
    icon: ShieldAlert,
    color: 'bg-[#FEF2F2] text-[#DC2626]',
  },
  {
    id: 2,
    title: 'New High-Score AI Match Available',
    category: 'AI Recommendation',
    message: 'Based on your recent GPA score update, you are eligible for the NextGen Women in Engineering Grant. Match confidence: 95%.',
    time: '1 day ago',
    icon: Cpu,
    color: 'bg-[#FFE5E5] text-[#CD0000]',
  },
  {
    id: 3,
    title: 'Document Verified Successfully',
    category: 'Verification Status',
    message: 'Your Official Transcript 2026.pdf has been audited and approved in your document vault.',
    time: '3 days ago',
    icon: Bell,
    color: 'bg-[#F0FDF4] text-[#16A34A]',
  },
];

const Notifications = () => {
  return (
    <div className="space-y-6 select-none max-w-3xl mx-auto">
      <PageTitle
        title="Alert Notifications"
        description="Stay updated with system announcements, deadline warnings, and AI matching recommendations."
      />

      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((n) => {
          const Icon = n.icon;
          return (
            <Card key={n.id} className="p-6 flex gap-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.color} shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest font-heading text-[#888888]">
                    {n.category}
                  </span>
                  <span className="text-xs text-[#666666] font-medium">{n.time}</span>
                </div>
                <h5 className="text-base font-extrabold font-heading text-[#111111] leading-snug">
                  {n.title}
                </h5>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
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
