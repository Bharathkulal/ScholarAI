import React, { useState } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Grid } from '../components/common/Grid';
import { SectionHeader } from '../components/common/SectionHeader';
import { Users, Database, FileSpreadsheet, Plus, Megaphone, Terminal, Award } from 'lucide-react';
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
    toast.success(`Announcement "${announcementTitle}" broadcasted to all students!`);
    setIsModalOpen(false);
    setAnnouncementTitle('');
    setAnnouncementBody('');
  };

  return (
    <div className="space-y-8 select-none">
      <PageTitle
        title="Admin Control Center"
        description="Monitor system activities, audit active applications, publish announcements, and review analytics."
        action={
          <Button onClick={() => setIsModalOpen(true)} variant="primary" className="!py-2 !text-xs">
            <Plus className="w-4 h-4" />
            Publish Broadcast
          </Button>
        }
      />

      {/* Stats Indicators */}
      <Grid cols={1} sm={2} lg={4} gap={6}>
        <Card className="border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Students</span>
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white block">1,248</span>
          <span className="text-xs text-primary-650 dark:text-primary-400 mt-2 block font-semibold">+48 new registrations this week</span>
        </Card>

        <Card className="border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Schemes</span>
            <Database className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white block">142</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">12 new corporate programs</span>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Applications Audited</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white block">3,892</span>
          <span className="text-xs text-slate-500 dark:text-slate-450 mt-2 block font-semibold">92 pending manual verification</span>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Disbursed Capital</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block">₹4.2 Cr</span>
          <span className="text-xs text-slate-500 dark:text-slate-455 mt-2 block font-semibold">94.2% payout target hit</span>
        </Card>
      </Grid>

      {/* Detail widgets */}
      <Grid cols={1} lg={12} gap={8}>
        
        {/* Left Widget: Bulk Import (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="space-y-4 h-full">
            <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary-600" />
              Spreadsheet Ingestion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload large scholarship catalogs directly. The database parser audits required fields (amounts, indices, category constraints) instantly.
            </p>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors rounded-xl p-8 text-center cursor-pointer bg-slate-50 dark:bg-slate-850">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Upload CSV / Excel</span>
              <span className="text-[10px] text-slate-400">Supports .csv, .xls, .xlsx files</span>
            </div>
          </Card>
        </div>

        {/* Right Widget: Platform Logs (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary-600" />
              Console Logs
            </h3>
            <div className="space-y-2 font-mono text-[11px] leading-relaxed max-h-[220px] overflow-y-auto bg-slate-900 text-slate-350 border border-slate-950 rounded-xl p-4">
              <p><span className="text-primary-400">[INFO 17:09:12]</span> Database client successfully established ping connection to local Cluster.</p>
              <p><span className="text-primary-400">[INFO 17:10:04]</span> Loaded Sentence-Transformers embedding mapping all-MiniLM-L6-v2.</p>
              <p><span className="text-emerald-450">[POST 17:12:30]</span> Bulk import initialized. 12 schemes successfully processed.</p>
              <p><span className="text-red-400">[WARN 17:14:15]</span> CORS rejected request from unauthorized origin: 'hack.domain'.</p>
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
            label="Announcement Message"
            placeholder="Write the message text here..."
            value={announcementBody}
            onChange={(e) => setAnnouncementBody(e.target.value)}
            required
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-750">
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
