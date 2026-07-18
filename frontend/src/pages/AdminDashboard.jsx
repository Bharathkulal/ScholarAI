import React from 'react';
import { Settings, Users, Database, FileSpreadsheet, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Administrator"}');

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Command Center</h1>
          <p className="text-dark-500 text-sm mt-1">Monitor scholarship listings, audit student data, and perform bulk uploads.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-brand-600/20 active:scale-95 transition-all flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add Scholarship
          </button>
        </div>
      </div>

      {/* Stats indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500">Total Students</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-3xl font-black text-white block">1,248</span>
          <span className="text-xs text-brand-400 mt-2 block">+48 new signups this week</span>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500">Active Scholarships</span>
            <Database className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-3xl font-black text-white block">142</span>
          <span className="text-xs text-emerald-450 mt-2 block">12 schemes added recently</span>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500">Applications</span>
            <FileSpreadsheet className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-3xl font-black text-white block">3,892</span>
          <span className="text-xs text-dark-500 mt-2 block">92 pending review actions</span>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-dark-500">Disbursed Funds</span>
            <Settings className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 block">₹4.2 Cr</span>
          <span className="text-xs text-dark-500 mt-2 block">94.2% payout target met</span>
        </div>
      </div>

      {/* Admin Actions panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bulk import tool widget */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-400" />
            Bulk Import Scheme
          </h3>
          <p className="text-xs text-dark-500 leading-relaxed">
            Upload large lists of scholarships using Excel or CSV file formats. The parser validates fields (dates, amounts, conditions) dynamically.
          </p>
          <div className="border border-dashed border-dark-850 hover:border-brand-500/30 transition-all rounded-xl p-8 text-center cursor-pointer bg-dark-950/40">
            <span className="text-xs font-semibold text-dark-300 block mb-1">Click to upload spreadsheet</span>
            <span className="text-[10px] text-dark-500">Supports .csv, .xls, .xlsx</span>
          </div>
        </div>

        {/* System Activity logs */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <h3 className="font-bold text-white text-lg">Platform Logs</h3>
          <div className="space-y-3 font-mono text-[11px] leading-relaxed max-h-[220px] overflow-y-auto bg-dark-950/60 border border-dark-850 rounded-xl p-4 text-dark-300">
            <p><span className="text-brand-400">[INFO 17:09:12]</span> Database client successfully established ping connection.</p>
            <p><span className="text-brand-400">[INFO 17:10:04]</span> Loaded Sentence-Transformers embedding mapping all-MiniLM-L6-v2.</p>
            <p><span className="text-emerald-400">[POST 17:12:30]</span> Bulk import initialized. 12 records processed.</p>
            <p><span className="text-rose-400">[WARN 17:14:15]</span> CORS rejected request from unauthorized domain 'hacker.com'.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
