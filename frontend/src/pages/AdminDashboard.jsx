import React, { useState } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Grid } from '../components/common/Grid';
import { Users, Database, FileSpreadsheet, Plus, Terminal, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  
  const handlePublish = (e) => {
    e.preventDefault();
    if (!announcementTitle || !announcementBody) {
      toast.error('Title and message body are required.');
      return;
    }
    toast.success(`Announcement "${announcementTitle}" broadcasted to all active students!`);
    setIsModalOpen(false);
    setAnnouncementTitle('');
    setAnnouncementBody('');
  };

  return (
    <div className="space-y-8 select-none">
      <PageTitle
        title="Admin Control Center"
        description="Monitor system metrics, run bulk imports, manage verification queues, and audit live student applications."
        action={
          <Button onClick={() => setIsModalOpen(true)} variant="primary" className="!py-2.5 !px-5 text-xs font-heading uppercase tracking-wider">
            <Plus className="w-4 h-4" />
            Publish System Broadcast
          </Button>
        }
      />

      {/* Stats Indicators */}
      <Grid cols={1} sm={2} lg={4} gap={6}>
        <Card className="border-l-4 border-l-[#CD0000]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Total Students</span>
            <Users className="w-4 h-4 text-[#CD0000]" />
          </div>
          <span className="text-4xl font-extrabold font-heading text-[#111111] block">1,248</span>
          <span className="text-xs text-[#CD0000] font-heading font-bold mt-2 block">+48 registered this week</span>
        </Card>

        <Card className="border-l-4 border-l-[#CD0000]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Active Grants</span>
            <Database className="w-4 h-4 text-[#CD0000]" />
          </div>
          <span className="text-4xl font-extrabold font-heading text-[#111111] block">142</span>
          <span className="text-xs text-[#16A34A] font-heading font-bold mt-2 block">12 new corporate programs</span>
        </Card>

        <Card className="border-l-4 border-l-[#16A34A]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Applications Audited</span>
            <FileSpreadsheet className="w-4 h-4 text-[#16A34A]" />
          </div>
          <span className="text-4xl font-extrabold font-heading text-[#111111] block">3,892</span>
          <span className="text-xs text-[#666666] font-heading font-medium mt-2 block">92 pending manual verification</span>
        </Card>

        <Card className="border-l-4 border-l-[#16A34A]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Disbursed Capital</span>
            <Award className="w-4 h-4 text-[#16A34A]" />
          </div>
          <span className="text-4xl font-extrabold font-heading text-[#16A34A] block">$8.4M</span>
          <span className="text-xs text-[#666666] font-heading font-medium mt-2 block">94.2% payout target hit</span>
        </Card>
      </Grid>

      {/* Detail widgets */}
      <Grid cols={1} lg={12} gap={8}>
        
        {/* Left Widget: Bulk Import (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="space-y-4 h-full">
            <h3 className="font-extrabold text-[#111111] text-base font-heading flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#CD0000]" />
              Bulk Data Ingestion
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed font-sans">
              Upload scholarship datasets directly. The automated parser audits required criteria, categories, and funding fields instantly.
            </p>
            <div className="border-2 border-dashed border-[#DDDDDD] hover:border-[#CD0000] transition-colors rounded-[16px] p-8 text-center cursor-pointer bg-[#EFEDE6]">
              <span className="text-xs font-bold font-heading text-[#111111] block mb-1 uppercase tracking-wider">Upload CSV / Excel</span>
              <span className="text-[10px] text-[#666666]">Supports .csv, .xls, .xlsx catalogs</span>
            </div>
          </Card>
        </div>

        {/* Right Widget: Platform Logs (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="space-y-4">
            <h3 className="font-extrabold text-[#111111] text-base font-heading flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#CD0000]" />
              Real-Time Server Console Logs
            </h3>
            <div className="space-y-2 font-mono text-[11px] leading-relaxed max-h-[220px] overflow-y-auto bg-[#111111] text-[#CCCCCC] border border-[#222222] rounded-[16px] p-5">
              <p><span className="text-[#FF8080]">[INFO 10:24:12]</span> MongoDB Motor client ping response verified (12ms latency).</p>
              <p><span className="text-[#FF8080]">[INFO 10:25:04]</span> AI Recommendation Engine pre-warmed for 120,000 active profiles.</p>
              <p><span className="text-[#16A34A]">[POST 10:27:30]</span> Bulk import initialized. 142 schemes active.</p>
              <p><span className="text-[#DC2626]">[WARN 10:28:15]</span> Access token refresh requested for active admin session.</p>
            </div>
          </Card>
        </div>

      </Grid>

      {/* Broadcast Creator Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Broadcast Announcement">
        <form onSubmit={handlePublish} className="space-y-4">
          <Input
            label="Announcement Title"
            placeholder="e.g. System Maintenance Window"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            required
          />

          <Textarea
            label="Announcement Message Body"
            placeholder="Write the message text here..."
            value={announcementBody}
            onChange={(e) => setAnnouncementBody(e.target.value)}
            required
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EEEEEE]">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Broadcast Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
