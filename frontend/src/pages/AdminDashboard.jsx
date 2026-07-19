import React, { useState, useEffect } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Grid } from '../components/common/Grid';
import {
  Users,
  Database,
  FileSpreadsheet,
  Plus,
  Award,
  Search,
  Upload,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Loader2,
  Download,
  Layers,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  BarChart3,
  PieChart,
  Megaphone,
  History,
  Settings,
  Bell,
} from 'lucide-react';
import {
  getAdminScholarshipsApi,
  createScholarshipApi,
  updateScholarshipApi,
  archiveScholarshipApi,
  publishScholarshipApi,
  importScholarshipsCsvApi,
  exportScholarshipsCsvApi,
} from '../services/scholarships';
import {
  getAdminApplicationsApi,
  reviewApplicationStatusApi,
} from '../services/applications';
import {
  getAdminDashboardTelemetryApi,
  getAdminAnalyticsChartsApi,
  downloadAdminReportApi,
  getAuditLogsApi,
  publishAnnouncementApi,
  getAnnouncementsApi,
} from '../services/admin';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Telemetry & Analytics state
  const [telemetry, setTelemetry] = useState(null);
  const [charts, setCharts] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);

  // Scholarships state
  const [scholarships, setScholarships] = useState([]);
  const [totalSch, setTotalSch] = useState(0);
  const [loadingSch, setLoadingSch] = useState(true);
  const [schSearch, setSchSearch] = useState('');
  const [schStatusFilter, setSchStatusFilter] = useState('all');

  // Applications state
  const [applications, setApplications] = useState([]);
  const [totalApps, setTotalApps] = useState(0);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annPriority, setAnnPriority] = useState('Normal');

  // Settings State
  const [activeAiProvider, setActiveAiProvider] = useState('gemini');

  // Scholarship Form State
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    government_level: 'State',
    category: 'Karnataka State',
    amount: '₹50,000 / year',
    deadline: '2026-08-31',
    official_apply_url: 'https://ssp.postmatric.karnataka.gov.in',
    description: '',
    status: 'published',
  });

  const fetchDashboardTelemetry = async () => {
    setLoadingTelemetry(true);
    try {
      const [telRes, chartRes, logRes, annRes] = await Promise.all([
        getAdminDashboardTelemetryApi(),
        getAdminAnalyticsChartsApi(),
        getAuditLogsApi({ limit: 10 }),
        getAnnouncementsApi(),
      ]);

      if (telRes && telRes.data) setTelemetry(telRes.data.statistics);
      if (chartRes && chartRes.data) setCharts(chartRes.data);
      if (logRes && logRes.data) setAuditLogs(logRes.data.items || []);
      if (annRes && annRes.data) setAnnouncements(annRes.data.announcements || []);
    } catch (err) {
      toast.error('Failed to load dashboard telemetry.');
    } finally {
      setLoadingTelemetry(false);
    }
  };

  const fetchScholarships = async () => {
    setLoadingSch(true);
    try {
      const res = await getAdminScholarshipsApi({
        query: schSearch || undefined,
        status: schStatusFilter !== 'all' ? schStatusFilter : undefined,
        limit: 50,
      });
      if (res && res.data) {
        setScholarships(res.data.items || []);
        setTotalSch(res.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load scholarships database.');
    } finally {
      setLoadingSch(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await getAdminApplicationsApi({
        query: appSearch || undefined,
        status: appStatusFilter !== 'all' ? appStatusFilter : undefined,
        limit: 50,
      });
      if (res && res.data) {
        setApplications(res.data.items || []);
        setTotalApps(res.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load applications list.');
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchDashboardTelemetry();
  }, []);

  useEffect(() => {
    if (activeTab === 'scholarships') fetchScholarships();
    else if (activeTab === 'applications') fetchApplications();
  }, [activeTab, schSearch, schStatusFilter, appSearch, appStatusFilter]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      provider: '',
      government_level: 'State',
      category: 'Karnataka State',
      amount: '₹50,000 / year',
      deadline: '2026-08-31',
      official_apply_url: 'https://ssp.postmatric.karnataka.gov.in',
      description: '',
      status: 'published',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sch) => {
    setEditingId(sch._id);
    setFormData({
      title: sch.title || '',
      provider: sch.provider || '',
      government_level: sch.government_level || 'State',
      category: sch.category || 'Karnataka State',
      amount: sch.amount_info?.amount || '₹50,000 / year',
      deadline: sch.application_info?.end_date || '2026-08-31',
      official_apply_url: sch.official_apply_url || sch.application_info?.official_apply_url || '',
      description: sch.description || '',
      status: sch.status || 'published',
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.provider) {
      toast.error('Title and Provider are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        provider: formData.provider,
        government_level: formData.government_level,
        category: formData.category,
        description: formData.description || `Scholarship provided by ${formData.provider}.`,
        official_apply_url: formData.official_apply_url,
        amount_info: {
          amount: formData.amount,
          currency: 'INR',
          frequency: 'Yearly',
          renewable: true,
        },
        application_info: {
          end_date: formData.deadline,
          official_apply_url: formData.official_apply_url,
          mode: 'Online',
          steps: ['Apply online on official portal'],
        },
        status: formData.status,
      };

      if (editingId) {
        await updateScholarshipApi(editingId, payload);
        toast.success('Scholarship updated successfully!');
      } else {
        await createScholarshipApi(payload);
        toast.success('New scholarship scheme published successfully!');
      }

      setIsFormModalOpen(false);
      fetchScholarships();
    } catch (err) {
      toast.error(err.message || 'Failed to save scholarship.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (sch) => {
    const nextStatus = sch.status === 'published' ? false : true;
    try {
      await publishScholarshipApi(sch._id, nextStatus);
      toast.success(nextStatus ? `"${sch.title}" published!` : `"${sch.title}" set to draft.`);
      fetchScholarships();
    } catch (err) {
      toast.error('Failed to change publication status.');
    }
  };

  const handleArchive = async (sch) => {
    if (window.confirm(`Are you sure you want to archive "${sch.title}"?`)) {
      try {
        await archiveScholarshipApi(sch._id);
        toast.success(`"${sch.title}" archived.`);
        fetchScholarships();
      } catch (err) {
        toast.error('Failed to archive scholarship.');
      }
    }
  };

  const handleCsvImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingId = toast.loading('Processing bulk CSV import...');
    try {
      const res = await importScholarshipsCsvApi(file);
      const summary = res.data?.summary;
      toast.success(`Bulk import complete! ${summary?.imported_count || 0} imported, ${summary?.skipped_count || 0} skipped.`, { id: loadingId });
      setIsImportModalOpen(false);
      fetchScholarships();
    } catch (err) {
      toast.error(err.message || 'CSV import failed.', { id: loadingId });
    }
  };

  const handleReviewStatus = async (newStatus) => {
    if (!selectedApp) return;
    try {
      await reviewApplicationStatusApi(selectedApp._id, {
        status: newStatus,
        verification_status: newStatus === 'approved' ? 'verified' : 'action_required',
        remarks: reviewRemarks || `Application status set to ${newStatus} by admin.`,
      });
      toast.success(`Application ${selectedApp.application_number} set to ${newStatus}.`);
      setIsReviewModalOpen(false);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update application status.');
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annMessage) {
      toast.error('Title and message are required.');
      return;
    }
    try {
      await publishAnnouncementApi({
        title: annTitle,
        message: annMessage,
        priority: annPriority,
        target_audience: { course: 'All', district: 'All', category: 'All' },
      });
      toast.success(`Broadcast "${annTitle}" published!`);
      setIsAnnounceModalOpen(false);
      setAnnTitle('');
      setAnnMessage('');
      fetchDashboardTelemetry();
    } catch (err) {
      toast.error('Failed to broadcast announcement.');
    }
  };

  const handleReportDownload = async (type, fmt = 'csv') => {
    try {
      const res = await downloadAdminReportApi(type, fmt);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.${fmt}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Downloaded ${type} report as ${fmt.toUpperCase()}!`);
    } catch (err) {
      toast.error('Report export failed.');
    }
  };

  return (
    <div className="space-y-8 select-none w-full pb-16">
      <PageTitle
        title="Enterprise Admin Control Center"
        description="Monitor real-time MongoDB telemetry, audit student application files, broadcast announcements, and inspect analytics."
        action={
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsAnnounceModalOpen(true)} variant="secondary" className="!py-2.5 text-xs font-heading uppercase">
              <Megaphone className="w-4 h-4 text-[#CD0000]" />
              System Broadcast
            </Button>

            <Button onClick={handleOpenCreateModal} variant="primary" className="!py-2.5 text-xs font-heading uppercase">
              <Plus className="w-4 h-4" />
              Add Scholarship
            </Button>
          </div>
        }
      />

      {/* 8-Tab Enterprise Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EEEEEE]">
        {[
          { id: 'dashboard', label: 'Overview Telemetry', icon: BarChart3 },
          { id: 'scholarships', label: `Scholarships (${totalSch})`, icon: Database },
          { id: 'applications', label: `Applications (${totalApps})`, icon: Layers },
          { id: 'analytics', label: 'MongoDB Analytics', icon: PieChart },
          { id: 'announcements', label: `Broadcasts (${announcements.length})`, icon: Megaphone },
          { id: 'audit_logs', label: `Audit Feed (${auditLogs.length})`, icon: History },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-heading font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#111111] text-white shadow-soft'
                  : 'bg-[#F4F4F0] text-[#666666] hover:bg-[#EEEEEE]'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW TELEMETRY */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <Grid cols={1} sm={2} lg={4} gap={6}>
            <Card className="p-6 border-l-4 border-l-[#CD0000]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Total Students</span>
                <Users className="w-4 h-4 text-[#CD0000]" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-[#111111]">
                {telemetry?.total_students || 0}
              </span>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Published Grants</span>
                <Database className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-[#111111]">
                {telemetry?.published_scholarships || 0}
              </span>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Total Applications</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-[#111111]">
                {telemetry?.total_applications || 0}
              </span>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Approval Rate</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-[#111111]">
                {telemetry?.approval_rate || 85.0}%
              </span>
            </Card>
          </Grid>

          {/* Quick Export Reports */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
              Quick Export Enterprise Reports
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleReportDownload('students', 'csv')} variant="secondary" className="text-xs uppercase font-heading">
                <Download className="w-3.5 h-3.5" /> Students CSV Report
              </Button>
              <Button onClick={() => handleReportDownload('scholarships', 'csv')} variant="secondary" className="text-xs uppercase font-heading">
                <Download className="w-3.5 h-3.5" /> Scholarships CSV Catalog
              </Button>
              <Button onClick={() => handleReportDownload('applications', 'csv')} variant="secondary" className="text-xs uppercase font-heading">
                <Download className="w-3.5 h-3.5" /> Applications CSV Audit Log
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SCHOLARSHIPS CATALOG */}
      {activeTab === 'scholarships' && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EEEEEE] pb-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter scholarships..."
                  value={schSearch}
                  onChange={(e) => setSchSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                />
              </div>

              <select
                value={schStatusFilter}
                onChange={(e) => setSchStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <span className="text-xs font-bold text-[#666666] font-heading">
              Showing {scholarships.length} Entries
            </span>
          </div>

          {loadingSch ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#CD0000]" />
              <span className="text-xs font-heading font-bold text-[#666666]">Loading Catalog...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EEEEEE] font-heading uppercase text-[#888888]">
                    <th className="py-3 px-2 font-extrabold">Scheme Title</th>
                    <th className="py-3 px-2 font-extrabold">Provider</th>
                    <th className="py-3 px-2 font-extrabold">Level</th>
                    <th className="py-3 px-2 font-extrabold">Grant Value</th>
                    <th className="py-3 px-2 font-extrabold">Deadline</th>
                    <th className="py-3 px-2 font-extrabold">Status</th>
                    <th className="py-3 px-2 font-extrabold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEE]">
                  {scholarships.map((sch) => (
                    <tr key={sch._id} className="hover:bg-[#F9F9F7] transition-colors">
                      <td className="py-3.5 px-2 font-bold text-[#111111]">{sch.title}</td>
                      <td className="py-3.5 px-2 text-[#555555]">{sch.provider}</td>
                      <td className="py-3.5 px-2 font-bold">{sch.government_level || 'State'}</td>
                      <td className="py-3.5 px-2 font-bold text-[#CD0000]">{sch.amount_info?.amount || '₹50,000'}</td>
                      <td className="py-3.5 px-2 text-[#555555]">{sch.application_info?.end_date || '2026-08-31'}</td>
                      <td className="py-3.5 px-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(sch)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-extrabold cursor-pointer border ${
                            sch.status === 'published'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {sch.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => handleOpenEditModal(sch)} className="p-1.5 rounded-lg bg-[#F4F4F0] hover:bg-[#EEEEEE] text-[#111111]">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleArchive(sch)} className="p-1.5 rounded-lg bg-red-50 text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: APPLICATIONS AUDIT */}
      {activeTab === 'applications' && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EEEEEE] pb-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search application # or title..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
                />
              </div>
            </div>
          </div>

          {loadingApps ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#CD0000]" />
              <span className="text-xs font-heading font-bold text-[#666666]">Loading Applications...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EEEEEE] font-heading uppercase text-[#888888]">
                    <th className="py-3 px-2 font-extrabold">Application File ID</th>
                    <th className="py-3 px-2 font-extrabold">Scheme Title</th>
                    <th className="py-3 px-2 font-extrabold">Submission Date</th>
                    <th className="py-3 px-2 font-extrabold">Status</th>
                    <th className="py-3 px-2 font-extrabold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEE]">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-[#F9F9F7] transition-colors">
                      <td className="py-3.5 px-2 font-bold font-mono text-[#CD0000]">{app.application_number}</td>
                      <td className="py-3.5 px-2 font-bold text-[#111111]">{app.scholarship_title}</td>
                      <td className="py-3.5 px-2 text-[#555555]">{new Date(app.created_at).toLocaleDateString()}</td>
                      <td className="py-3.5 px-2 uppercase font-bold">{app.status}</td>
                      <td className="py-3.5 px-2 text-right">
                        <Button variant="secondary" onClick={() => { setSelectedApp(app); setIsReviewModalOpen(true); }} className="!py-1.5 !px-3 text-xs uppercase font-heading">
                          Inspect File
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 4: MONGODB ANALYTICS CHARTS */}
      {activeTab === 'analytics' && charts && (
        <div className="space-y-6">
          <Grid cols={1} md={2} gap={6}>
            <Card className="p-6 space-y-4">
              <h4 className="text-xs font-extrabold font-heading text-[#111111] uppercase border-b border-[#EEEEEE] pb-2">
                Category Distribution (MongoDB Aggregation)
              </h4>
              <div className="space-y-2 text-xs">
                {(charts.category_distribution || []).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F4F4F0]">
                    <span>{cat.label}</span>
                    <strong className="text-[#CD0000]">{cat.count} Students</strong>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h4 className="text-xs font-extrabold font-heading text-[#111111] uppercase border-b border-[#EEEEEE] pb-2">
                Domicile State Distribution
              </h4>
              <div className="space-y-2 text-xs">
                {(charts.state_distribution || []).map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F4F4F0]">
                    <span>{st.label}</span>
                    <strong className="text-[#CD0000]">{st.count} Students</strong>
                  </div>
                ))}
              </div>
            </Card>
          </Grid>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS FEED */}
      {activeTab === 'audit_logs' && (
        <Card className="p-6 space-y-4">
          <h4 className="text-xs font-extrabold font-heading text-[#111111] uppercase border-b border-[#EEEEEE] pb-2">
            Operational System Audit Logs
          </h4>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log._id} className="p-3 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE] flex items-center justify-between">
                <div>
                  <span className="font-extrabold font-mono text-[#CD0000] block">{log.action}</span>
                  <span className="text-[#666666]">Actor: {log.actor_email}</span>
                </div>
                <span className="text-[11px] text-[#888888] font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Broadcast Modal */}
      <Modal isOpen={isAnnounceModalOpen} onClose={() => setIsAnnounceModalOpen(false)} title="Broadcast System Announcement">
        <form onSubmit={handlePublishAnnouncement} className="space-y-4 pt-2">
          <Input label="Announcement Title" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="e.g. Karnataka SSP Application Deadline Extended" />
          <Textarea label="Message Body" required value={annMessage} onChange={(e) => setAnnMessage(e.target.value)} placeholder="Enter details..." />
          <div className="flex justify-end gap-3 pt-3 border-t border-[#EEEEEE]">
            <Button type="button" variant="secondary" onClick={() => setIsAnnounceModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Broadcast Notification</Button>
          </div>
        </form>
      </Modal>

      {/* Application Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title={`Review File — ${selectedApp?.application_number}`}>
        {selectedApp && (
          <div className="space-y-4 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD]">
              <p className="font-bold">{selectedApp.scholarship_title}</p>
              <p className="text-[#666666]">Status: {selectedApp.status}</p>
            </div>
            <Textarea label="Officer Remarks" value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)} />
            <div className="flex justify-end gap-3 pt-3 border-t border-[#EEEEEE]">
              <Button type="button" variant="secondary" onClick={() => handleReviewStatus('rejected')}>Reject</Button>
              <Button type="button" variant="primary" onClick={() => handleReviewStatus('approved')}>Approve</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminDashboard;
