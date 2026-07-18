import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Info } from 'lucide-react';

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockScholarships = [
    { id: 1, title: 'National Merit Scholarship', provider: 'Central Government', amount: '₹50,000 / year', deadline: '2026-10-15', match: '98% Match' },
    { id: 2, title: 'Tata Endowment for Higher Education', provider: 'Tata Trusts', amount: '₹2,00,000 / one-time', deadline: '2026-09-30', match: '95% Match' },
    { id: 3, title: 'Reliance Foundation Post-Graduate Grant', provider: 'Reliance Foundation', amount: '₹6,00,000 / total', deadline: '2026-11-01', match: '89% Match' },
  ];

  return (
    <div className="space-y-8 select-none">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Find Scholarships</h1>
        <p className="text-dark-500 text-sm mt-1">Search and filter active opportunities from government, trusts, and corporate sponsors.</p>
      </div>

      {/* Search and Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-dark-900/30 border border-dark-800/80 rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-dark-800/80">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-400" />
              Filters
            </h2>
            <button className="text-xs text-brand-400 hover:underline">Reset All</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-2">Degree level</label>
              <select className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-xs focus:outline-none focus:border-brand-500">
                <option>All Degrees</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
                <option>Doctorate</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-2">Funding Amount</label>
              <select className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-xs focus:outline-none focus:border-brand-500">
                <option>Any Amount</option>
                <option>Under ₹50,000</option>
                <option>₹50,000 - ₹2,00,000</option>
                <option>Above ₹2,00,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results view */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search by title, provider, field of study..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-900/50 border border-dark-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-4">
            {mockScholarships.map((s) => (
              <div key={s.id} className="glass-card glass-card-hover p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full">
                      {s.match}
                    </span>
                  </div>
                  <p className="text-xs text-dark-500">Provided by <span className="text-dark-300">{s.provider}</span></p>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-dark-500 block">Funding</span>
                      <span className="text-xs font-semibold text-emerald-400">{s.amount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-dark-500 block">Deadline</span>
                      <span className="text-xs font-semibold text-rose-400">{s.deadline}</span>
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white rounded-lg transition-colors shrink-0">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
