import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Info, Calendar, Award } from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { Accordion } from '../components/ui/Accordion';

const MOCK_SCHOLARSHIPS = [
  {
    id: 1,
    title: 'National Merit Scholarship',
    provider: 'Central Ministry of Education',
    amount: '₹50,000 / year',
    deadline: '2026-10-15',
    match: '98% Match',
    description: 'Provides financial aid to meritorious students from low-income families to support higher education.',
    criteria: 'Minimum 80% marks in Class 12, family income under ₹4.5 LPA.',
  },
  {
    id: 2,
    title: 'Tata Endowment for Higher Education',
    provider: 'Tata Trusts',
    amount: '₹2,00,000 / total',
    deadline: '2026-09-30',
    match: '95% Match',
    description: 'Supports Indian students pursuing postgraduate degrees abroad in diverse fields.',
    criteria: 'Bachelor degree holders, admission secured in a recognized international university.',
  },
  {
    id: 3,
    title: 'Reliance Foundation PG Research Grant',
    provider: 'Reliance Foundation',
    amount: '₹6,00,000 / total',
    deadline: '2026-11-01',
    match: '89% Match',
    description: 'Aims to support meritorious students carrying research in AI, Computer Science, and Engineering.',
    criteria: 'Postgraduate students enrolled in technology fields, academic record of 8.5+ CGPA.',
  },
  {
    id: 4,
    title: 'Post-Matric Scholarship Scheme',
    provider: 'State Government Department',
    amount: '₹25,000 / year',
    deadline: '2026-12-15',
    match: '85% Match',
    description: 'Financial aid for students belonging to marginalized social classes to pursue higher secondary diplomas.',
    criteria: 'OBC/SC/ST categories, family income under ₹2.5 LPA.',
  },
];

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [degree, setDegree] = useState('');
  const [amountRange, setAmountRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredScholarships = MOCK_SCHOLARSHIPS.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 select-none">
      <PageTitle
        title="Find Scholarships"
        description="Search, filter, and explore active scholarships from government departments, private trusts, and corporate sponsors."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (1 col) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 h-fit space-y-6 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-750">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-primary-600" />
              Filter Options
            </h3>
            <button
              onClick={() => {
                setDegree('');
                setAmountRange('');
              }}
              className="text-xs font-semibold text-primary-600 hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-4">
            <Select
              label="Education Level"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              options={[
                { label: 'All Levels', value: '' },
                { label: 'Undergraduate', value: 'ug' },
                { label: 'Postgraduate', value: 'pg' },
                { label: 'Research/Doctorate', value: 'phd' },
              ]}
            />

            <Select
              label="Funding Range"
              value={amountRange}
              onChange={(e) => setAmountRange(e.target.value)}
              options={[
                { label: 'Any Funding', value: '' },
                { label: 'Under ₹50,000', value: 'low' },
                { label: '₹50,000 - ₹2,00,000', value: 'mid' },
                { label: 'Above ₹2,00,000', value: 'high' },
              ]}
            />
          </div>
        </div>

        {/* Search Results (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search by scholarship title, provider name, category..."
          />

          <div className="space-y-4">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((s) => (
                <Card key={s.id} hoverable className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-905 dark:text-white">
                          {s.title}
                        </h3>
                        <Badge variant="primary">{s.match}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        Provider: <span className="text-slate-650 dark:text-slate-300">{s.provider}</span>
                      </p>
                      
                      <div className="flex gap-6 pt-3 flex-wrap">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Funding Size
                          </span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {s.amount}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Closing Date
                          </span>
                          <span className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {s.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end items-stretch gap-2.5 shrink-0 pt-2 sm:pt-0">
                      <Button variant="outline" className="!py-2 !text-xs">
                        Check Rules
                      </Button>
                      <Button variant="primary" className="!py-2 !text-xs">
                        Apply Now
                      </Button>
                    </div>
                  </div>

                  {/* Expansion description details inside card */}
                  <div className="mt-4 border-t border-slate-100 dark:border-slate-750/70 pt-2">
                    <Accordion
                      items={[
                        {
                          title: 'View Description & Criteria',
                          content: (
                            <div className="space-y-2 mt-1">
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {s.description}
                              </p>
                              <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-750">
                                <span className="text-[10px] font-bold uppercase text-slate-405 block mb-0.5">Eligibility criteria:</span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{s.criteria}</span>
                              </div>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">No scholarships found.</div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

      </div>
    </div>
  );
};

export default Scholarships;
