import React, { useState, useEffect } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Clock,
  FileEdit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { getStudentApplicationsApi, withdrawApplicationApi } from '../services/applications';
import toast from 'react-hot-toast';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal for Timeline
  const [selectedApp, setSelectedApp] = useState(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getStudentApplicationsApi(statusFilter !== 'all' ? statusFilter : undefined);
      if (res && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      toast.error('Failed to load applications list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleWithdraw = async (app) => {
    if (window.confirm(`Are you sure you want to withdraw application ${app.application_number}?`)) {
      try {
        await withdrawApplicationApi(app._id);
        toast.success(`Application ${app.application_number} withdrawn.`);
        fetchApplications();
      } catch (err) {
        toast.error(err.message || 'Failed to withdraw application.');
      }
    }
  };

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'approved':
        return 'success';
      case 'under_review':
        return 'warning';
      case 'submitted':
        return 'primary';
      case 'rejected':
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getAuditProgress = (st) => {
    switch (st) {
      case 'draft':
        return 25;
      case 'submitted':
        return 50;
      case 'under_review':
        return 75;
      case 'approved':
        return 100;
      case 'rejected':
      case 'cancelled':
        return 100;
      default:
        return 50;
    }
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto pb-16">
      <PageTitle
        title="Scholarship Application Tracker"
        description="Monitor live submission audit statuses, document verification milestones, and decision timelines."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EEEEEE]">
        {['all', 'submitted', 'under_review', 'approved', 'rejected', 'draft', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === tab
                ? 'bg-[#111111] text-white shadow-soft'
                : 'bg-[#F4F4F0] text-[#666666] hover:bg-[#EEEEEE]'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#CD0000]" />
          <span className="text-xs font-heading font-extrabold uppercase text-[#666666]">
            Fetching Application Tracker Data...
          </span>
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <h4 className="text-lg font-heading font-extrabold text-[#111111] uppercase">No Applications Found</h4>
          <p className="text-xs text-[#666666]">You have not submitted any applications matching this filter status yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-6 border border-[#DDDDDD] hover:shadow-lift transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#888888]">
                      FILE ID: {app.application_number}
                    </span>
                    <Badge variant={getStatusBadgeVariant(app.status)}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xl font-extrabold font-heading text-[#111111]">
                      {app.scholarship_title}
                    </h4>
                    <p className="text-xs text-[#666666] font-medium">
                      Provider: <strong>{app.scholarship_provider}</strong>
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="max-w-md space-y-1">
                    <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider font-heading block">
                      Verification Audit Milestone
                    </span>
                    <ProgressBar value={getAuditProgress(app.status)} showValue />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-[#EEEEEE]">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-[#888888] block font-bold uppercase tracking-widest font-heading">
                      Last Updated
                    </span>
                    <span className="text-xs font-semibold text-[#111111]">
                      {new Date(app.updated_at || app.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => { setSelectedApp(app); setIsTimelineModalOpen(true); }}
                      className="!py-2 !px-3 text-xs uppercase font-heading"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      View Timeline
                    </Button>

                    {app.status === 'submitted' || app.status === 'draft' ? (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Withdraw Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline Modal */}
      <Modal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        title={`Audit History — ${selectedApp?.application_number}`}
      >
        {selectedApp && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD] space-y-1">
              <p className="font-bold text-[#111111]">{selectedApp.scholarship_title}</p>
              <p className="text-[#666666]">Verification Status: <strong>{selectedApp.verification_status}</strong></p>
              {selectedApp.remarks && (
                <p className="text-red-700 bg-red-50 p-2 rounded-lg border border-red-200 mt-2">
                  Officer Remarks: {selectedApp.remarks}
                </p>
              )}
            </div>

            <h5 className="font-heading font-extrabold uppercase text-[#111111]">Activity Timeline</h5>
            
            <div className="space-y-3 pl-2 border-l-2 border-[#CD0000]">
              {(selectedApp.application_history || []).map((event, idx) => (
                <div key={idx} className="relative pl-4 space-y-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CD0000] absolute -left-[18px] top-1" />
                  <span className="font-extrabold font-heading text-[#111111] block">{event.step}</span>
                  <span className="text-[11px] text-[#666666] block">
                    {new Date(event.timestamp).toLocaleString()} • By {event.by}
                  </span>
                  {event.remarks && <span className="text-[11px] text-[#444444] italic block">{event.remarks}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Applications;
