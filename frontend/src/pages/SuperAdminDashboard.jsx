import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Key,
  Trash2,
  Lock,
  Unlock,
  Settings as SettingsIcon,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  listAdminsApi,
  createAdminApi,
  toggleAdminStatusApi,
  deleteAdminApi,
  resetAdminPasswordApi,
  getSystemSettingsApi,
  updateSystemSettingsApi,
  getAuditLogsApi,
} from '../services/superAdmin';

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('admins'); // 'admins' | 'settings' | 'audit'
  const [admins, setAdmins] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    ai_matching_engine: 'enabled',
    ai_recommendation_threshold: 75,
    max_applications_per_student: 10,
    allow_student_registration: true,
    system_announcement: 'Welcome to ScholarAI Enterprise Platform',
  });

  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [newAdminForm, setNewAdminForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminRes, settingsRes, auditRes] = await Promise.allSettled([
        listAdminsApi(),
        getSystemSettingsApi(),
        getAuditLogsApi(),
      ]);

      if (adminRes.status === 'fulfilled' && adminRes.value?.admins) {
        setAdmins(adminRes.value.admins);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.settings) {
        setSettings(settingsRes.value.settings);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value?.logs) {
        setAuditLogs(auditRes.value.logs);
      }
    } catch (err) {
      toast.error('Failed to load Super Admin control panel data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await createAdminApi(newAdminForm);
      toast.success(`Admin account '${newAdminForm.email}' created successfully.`);
      setShowCreateModal(false);
      setNewAdminForm({ full_name: '', email: '', password: '', phone: '', role: 'admin' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to create Admin account.');
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      const newStatus = !admin.is_active;
      await toggleAdminStatusApi(admin._id, newStatus);
      toast.success(`Admin '${admin.email}' has been ${newStatus ? 'activated' : 'deactivated'}.`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Action failed.');
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Are you sure you want to permanently delete Admin account '${admin.email}'?`)) return;
    try {
      await deleteAdminApi(admin._id);
      toast.success(`Admin '${admin.email}' deleted.`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete Admin account.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    try {
      await resetAdminPasswordApi(selectedAdmin._id, newPassword);
      toast.success(`Password for '${selectedAdmin.email}' reset successfully.`);
      setShowResetModal(false);
      setSelectedAdmin(null);
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSystemSettingsApi(settings);
      toast.success('System settings updated successfully.');
    } catch (err) {
      toast.error('Failed to save system settings.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#DDDDDD] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#FFE5E5] text-[#CD0000] border border-[#FFC9C9]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold uppercase font-heading text-[#111111] tracking-tight">
              Super Admin Console
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              Role-based user management, system controls, & security audit telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs uppercase font-heading tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Admin</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-[#DDDDDD] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] font-heading">Total Admins</p>
            <p className="text-2xl font-extrabold text-[#111111] font-heading mt-1">{admins.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F8F8] border border-[#DDDDDD] text-[#111111]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#DDDDDD] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] font-heading">System Mode</p>
            <p className="text-sm font-extrabold font-heading mt-1 flex items-center gap-1.5 text-[#166534]">
              <CheckCircle2 className="w-4 h-4" />
              {settings.maintenance_mode ? 'Maintenance Active' : 'Operational (Live)'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F8F8] border border-[#DDDDDD] text-[#111111]">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#DDDDDD] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] font-heading">Security Audits</p>
            <p className="text-2xl font-extrabold text-[#111111] font-heading mt-1">{auditLogs.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F8F8] border border-[#DDDDDD] text-[#111111]">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#DDDDDD] gap-6 text-sm font-heading uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('admins')}
          className={`pb-3 font-extrabold cursor-pointer border-b-2 transition-colors ${
            activeTab === 'admins'
              ? 'border-[#CD0000] text-[#CD0000]'
              : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Admin User Accounts ({admins.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 font-extrabold cursor-pointer border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-[#CD0000] text-[#CD0000]'
              : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          System & AI Controls
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 font-extrabold cursor-pointer border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-[#CD0000] text-[#CD0000]'
              : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Audit Logs Feed
        </button>
      </div>

      {/* TAB 1: Admin Management */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-[24px] border border-[#DDDDDD] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#DDDDDD] flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase font-heading text-[#111111]">
              System Administrators & Super Admins
            </h3>
            <span className="text-xs text-[#666666]">Only Super Admin can manage admin accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F8] text-[#666666] uppercase font-heading tracking-wider font-bold border-b border-[#DDDDDD]">
                <tr>
                  <th className="py-3.5 px-5">Name & Email</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Phone</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDDDD]">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-[#FDFDFD] transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-extrabold text-[#111111] font-heading">{admin.full_name}</p>
                      <p className="text-[#666666] text-[11px]">{admin.email}</p>
                    </td>
                    <td className="py-4 px-5 font-heading">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          admin.role === 'super_admin' || admin.role === 'superadmin'
                            ? 'bg-[#FFE5E5] text-[#CD0000] border border-[#FFC9C9]'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {admin.role === 'super_admin' || admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          admin.is_active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {admin.is_active !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#666666] font-mono">{admin.phone || 'N/A'}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          title={admin.is_active !== false ? 'Deactivate Admin' : 'Activate Admin'}
                          className="p-2 rounded-xl border border-[#DDDDDD] hover:bg-[#EFEDE6] text-[#111111] cursor-pointer"
                        >
                          {admin.is_active !== false ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowResetModal(true);
                          }}
                          title="Reset Admin Password"
                          className="p-2 rounded-xl border border-[#DDDDDD] hover:bg-[#EFEDE6] text-[#111111] cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          title="Delete Admin Account"
                          className="p-2 rounded-xl border border-[#FFC9C9] bg-[#FFE5E5] hover:bg-[#FFD6D6] text-[#CD0000] cursor-pointer"
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
        </div>
      )}

      {/* TAB 2: System Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-[24px] border border-[#DDDDDD] shadow-sm space-y-6 max-w-2xl">
          <h3 className="text-base font-extrabold uppercase font-heading text-[#111111]">
            Global Platform & AI Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#DDDDDD] bg-[#F8F8F8]">
              <div>
                <p className="text-xs font-bold font-heading uppercase text-[#111111]">Maintenance Mode</p>
                <p className="text-[11px] text-[#666666]">Temporarily block non-admin logins for system maintenance</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="w-5 h-5 accent-[#CD0000] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-[#DDDDDD] bg-[#F8F8F8]">
              <div>
                <p className="text-xs font-bold font-heading uppercase text-[#111111]">Allow Student Registration</p>
                <p className="text-[11px] text-[#666666]">Enable or disable new student signups</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_student_registration}
                onChange={(e) => setSettings({ ...settings, allow_student_registration: e.target.checked })}
                className="w-5 h-5 accent-[#CD0000] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase font-heading text-[#111111] mb-1">
                AI Matching Engine Minimum Eligibility Score (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={settings.ai_recommendation_threshold}
                onChange={(e) => setSettings({ ...settings, ai_recommendation_threshold: parseInt(e.target.value) || 75 })}
                className="w-full bg-white border border-[#DDDDDD] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#CD0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase font-heading text-[#111111] mb-1">
                Max Applications Per Student
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.max_applications_per_student}
                onChange={(e) => setSettings({ ...settings, max_applications_per_student: parseInt(e.target.value) || 10 })}
                className="w-full bg-white border border-[#DDDDDD] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#CD0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase font-heading text-[#111111] mb-1">
                Global Announcement Banner Text
              </label>
              <textarea
                value={settings.system_announcement}
                onChange={(e) => setSettings({ ...settings, system_announcement: e.target.value })}
                rows={3}
                className="w-full bg-white border border-[#DDDDDD] rounded-xl p-3 text-xs text-[#111111] focus:outline-none focus:border-[#CD0000]"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary text-xs uppercase font-heading tracking-wider py-3 px-6 cursor-pointer">
            Save System Configurations
          </button>
        </form>
      )}

      {/* TAB 3: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-[24px] border border-[#DDDDDD] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#DDDDDD]">
            <h3 className="text-sm font-extrabold uppercase font-heading text-[#111111]">
              System Audit Telemetry Log
            </h3>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {auditLogs.length === 0 ? (
              <p className="p-5 text-xs text-[#666666]">No security audit events logged yet.</p>
            ) : (
              auditLogs.map((log, idx) => (
                <div key={idx} className="p-4 flex items-start justify-between hover:bg-[#FDFDFD] transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase font-heading px-2 py-0.5 rounded bg-[#EFEDE6] border border-[#DDDDDD] text-[#CD0000] mr-2">
                      {log.action || 'EVENT'}
                    </span>
                    <span className="text-xs font-bold font-heading text-[#111111]">{log.actor_email}</span>
                    <p className="text-[11px] text-[#666666] mt-1 font-mono">{JSON.stringify(log.details || {})}</p>
                  </div>
                  <span className="text-[10px] text-[#888888] font-mono">{new Date(log.timestamp || Date.now()).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-md border border-[#DDDDDD] shadow-lift space-y-4">
            <h3 className="text-base font-extrabold uppercase font-heading text-[#111111]">
              Create System Admin Account
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase font-heading text-[#111111]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdminForm.full_name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, full_name: e.target.value })}
                  placeholder="Admin Full Name"
                  className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#CD0000]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase font-heading text-[#111111]">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="admin@scholarai.com"
                  className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#CD0000]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase font-heading text-[#111111]">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#CD0000]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase font-heading text-[#111111]">Phone Number</label>
                <input
                  type="text"
                  value={newAdminForm.phone}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                  placeholder="+1234567890"
                  className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#CD0000]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase font-heading text-[#111111]">Assign Role</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                  className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#CD0000]"
                >
                  <option value="admin">Standard Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs uppercase font-heading py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs uppercase font-heading py-2 px-4 cursor-pointer">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-md border border-[#DDDDDD] shadow-lift space-y-4">
            <h3 className="text-base font-extrabold uppercase font-heading text-[#111111]">
              Reset Password for {selectedAdmin.email}
            </h3>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase font-heading text-[#111111]">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#CD0000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="btn-secondary text-xs uppercase font-heading py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs uppercase font-heading py-2 px-4 cursor-pointer">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
