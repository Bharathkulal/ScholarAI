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
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('scholarships');
  const [scholarships, setScholarships] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
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

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await getAdminScholarshipsApi({
        query: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50,
      });
      if (res && res.data) {
        setScholarships(res.data.items || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load scholarships database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [searchTerm, statusFilter]);

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

  const handleCsvExport = async () => {
    try {
      const res = await exportScholarshipsCsvApi();
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scholarships_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Scholarships exported to CSV!');
    } catch (err) {
      toast.error('CSV export failed.');
    }
  };

  return (
    <div className="space-y-8 select-none w-full pb-16">
      <PageTitle
        title="Scholarship Management Center"
        description="Create, edit, publish, bulk import, and manage scholarship schemes in real-time."
        action={
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsImportModalOpen(true)} variant="secondary" className="!py-2.5 text-xs font-heading uppercase">
              <Upload className="w-4 h-4 text-[#CD0000]" />
              Bulk Import CSV
            </Button>

            <Button onClick={handleOpenCreateModal} variant="primary" className="!py-2.5 text-xs font-heading uppercase">
              <Plus className="w-4 h-4" />
              Add New Scholarship
            </Button>
          </div>
        }
      />

      {/* Metric Cards */}
      <Grid cols={1} sm={2} lg={4} gap={6}>
        <Card className="border-l-4 border-l-[#CD0000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Total Schemes</span>
            <Database className="w-4 h-4 text-[#CD0000]" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-[#111111]">{total}</span>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Live Published</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-[#111111]">
            {scholarships.filter((s) => s.status === 'published').length}
          </span>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Draft Schemes</span>
            <Edit className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-extrabold font-heading text-[#111111]">
            {scholarships.filter((s) => s.status === 'draft').length}
          </span>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] font-heading">Bulk Export</span>
            <Download className="w-4 h-4 text-blue-600" />
          </div>
          <button
            onClick={handleCsvExport}
            className="text-xs font-heading font-extrabold uppercase text-[#CD0000] hover:underline cursor-pointer pt-2 block text-left"
          >
            Download CSV Catalog →
          </button>
        </Card>
      </Grid>

      {/* Main Table View */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EEEEEE] pb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        {/* Data Table */}
        {loading ? (
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
                    <td className="py-3.5 px-2 font-bold text-[#111111]">
                      {sch.title}
                      <span className="block text-[10px] font-normal text-[#888888] font-mono">{sch.slug}</span>
                    </td>
                    <td className="py-3.5 px-2 text-[#555555] font-medium">{sch.provider}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-[#F4F4F0] text-[#111111]">
                        {sch.government_level || 'State'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-bold text-[#CD0000]">
                      {sch.amount_info?.amount || '₹50,000'}
                    </td>
                    <td className="py-3.5 px-2 text-[#555555]">
                      {sch.application_info?.end_date || '2026-08-31'}
                    </td>
                    <td className="py-3.5 px-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(sch)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-extrabold cursor-pointer border ${
                          sch.status === 'published'
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                            : sch.status === 'draft'
                            ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {sch.status === 'published' ? 'Published' : sch.status === 'draft' ? 'Draft' : 'Archived'}
                      </button>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(sch)}
                          className="p-1.5 rounded-lg bg-[#F4F4F0] hover:bg-[#EEEEEE] text-[#111111] transition-colors"
                          title="Edit Scholarship"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleArchive(sch)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Archive Scholarship"
                        >
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingId ? 'Edit Scholarship Entry' : 'Create New Scholarship Scheme'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <Input
            label="Scholarship Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Karnataka Post-Matric State Scholarship (SSP)"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Provider Organization"
              required
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder="e.g. Govt of Karnataka"
            />

            <div>
              <label className="block text-xs font-heading font-extrabold text-[#111111] uppercase mb-1">Government Level</label>
              <select
                value={formData.government_level}
                onChange={(e) => setFormData({ ...formData, government_level: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-[#DDDDDD] text-xs font-medium text-[#111111]"
              >
                <option value="State">State Level</option>
                <option value="Central">Central Level</option>
                <option value="Private">Private / Corporate</option>
                <option value="NGO">NGO / Trust</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Grant Value / Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. ₹50,000 / year"
            />

            <Input
              label="Application Deadline Date"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <Input
            label="Official Apply Website URL"
            value={formData.official_apply_url}
            onChange={(e) => setFormData({ ...formData, official_apply_url: e.target.value })}
            placeholder="https://ssp.postmatric.karnataka.gov.in"
          />

          <Textarea
            label="Description Overview"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed scholarship criteria, benefits, and guidelines..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EEEEEE]">
            <Button type="button" variant="secondary" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingId ? 'Save Changes' : 'Publish Scholarship'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CSV Bulk Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Bulk Import Scholarships from CSV"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[#666666]">
            Select a <strong>.csv</strong> file containing scholarship titles, providers, grant amounts, deadlines, and descriptions.
          </p>

          <label className="w-full h-24 border-2 border-dashed border-[#DDDDDD] hover:border-[#CD0000] rounded-[16px] flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#F9F9F7] transition-all">
            <Upload className="w-6 h-6 text-[#CD0000]" />
            <span className="text-xs font-heading font-extrabold uppercase text-[#111111]">
              Click to Choose CSV File
            </span>
            <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
