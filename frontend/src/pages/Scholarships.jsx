import React, { useState } from 'react';
import { Filter, Calendar, Award } from 'lucide-react';
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
    title: 'Global Tech Innovators Fellowship',
    provider: 'Tech For Tomorrow Foundation',
    amount: '$25,000 / year',
    deadline: '2026-08-15',
    match: '98% Match',
    description: 'Provides full tuition and stipend support to meritorious STEM students from low-income families.',
    criteria: 'Minimum 3.8 GPA score, enrolled in accredited engineering/CS bachelor program.',
  },
  {
    id: 2,
    title: 'NextGen Women in Engineering Grant',
    provider: 'Apex Enterprise Institute',
    amount: '$15,000 total',
    deadline: '2026-09-01',
    match: '95% Match',
    description: 'Supports female students pursuing undergraduate degrees in engineering and robotics fields.',
    criteria: 'Enrolled in STEM major, minimum 3.5 GPA, leadership essay submission.',
  },
  {
    id: 3,
    title: 'Future Leaders Academic Excellence Award',
    provider: 'Global Education Council',
    amount: '$10,000 / year',
    deadline: '2026-10-10',
    match: '89% Match',
    description: 'Supports outstanding academic talent across all undergraduate fields of study.',
    criteria: 'High academic standing (3.7+ GPA), community service documentation.',
  },
  {
    id: 4,
    title: 'Clean Energy & Sustainability Grant',
    provider: 'Green World Trust',
    amount: '$20,000 total',
    deadline: '2026-11-15',
    match: '85% Match',
    description: 'Research grant for students carrying out projects in renewable energy, climate science, or ESG.',
    criteria: 'Postgraduate standing, research proposal approved by faculty advisor.',
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
        title="Scholarship Discovery Feed"
        description="Browse, audit eligibility, and apply directly for verified corporate, foundation, and government grants."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (1 col) */}
        <div className="lg:col-span-1 bg-white border border-[#DDDDDD] rounded-[24px] p-6 h-fit space-y-6 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE]">
            <h3 className="font-extrabold text-[#111111] font-heading flex items-center gap-2 text-sm uppercase tracking-wider">
              <Filter className="w-4 h-4 text-[#CD0000]" />
              Filter Grants
            </h3>
            <button
              onClick={() => {
                setDegree('');
                setAmountRange('');
              }}
              className="text-xs font-bold font-heading uppercase text-[#CD0000] hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <Select
              label="Education Level"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              options={[
                { label: 'All Degrees', value: '' },
                { label: 'Undergraduate', value: 'ug' },
                { label: 'Postgraduate', value: 'pg' },
                { label: 'Doctorate / Research', value: 'phd' },
              ]}
            />

            <Select
              label="Funding Range"
              value={amountRange}
              onChange={(e) => setAmountRange(e.target.value)}
              options={[
                { label: 'Any Amount', value: '' },
                { label: 'Under $10,000', value: 'low' },
                { label: '$10,000 - $25,000', value: 'mid' },
                { label: 'Above $25,000', value: 'high' },
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

          <div className="space-y-6">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((s) => (
                <Card key={s.id} hoverable className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-extrabold font-heading text-[#111111]">
                          {s.title}
                        </h3>
                        <Badge variant="primary">{s.match}</Badge>
                      </div>
                      <p className="text-xs text-[#666666] font-medium">
                        Provider: <span className="text-[#111111] font-bold font-heading">{s.provider}</span>
                      </p>
                      
                      <div className="flex gap-8 pt-4 flex-wrap">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block tracking-wider">
                            Funding Value
                          </span>
                          <span className="text-lg font-extrabold font-heading text-[#CD0000] flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {s.amount}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block tracking-wider">
                            Deadline
                          </span>
                          <span className="text-sm font-bold text-[#DC2626] font-heading flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {s.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end items-stretch gap-3 shrink-0 pt-2 sm:pt-0">
                      <Button variant="primary" className="!py-2.5 !px-5 text-xs uppercase font-heading tracking-wider">
                        Apply Now
                      </Button>
                      <Button variant="secondary" className="!py-2.5 !px-5 text-xs uppercase font-heading tracking-wider">
                        Save Rules
                      </Button>
                    </div>
                  </div>

                  {/* Expansion description details inside card */}
                  <div className="mt-6 border-t border-[#EEEEEE] pt-3">
                    <Accordion
                      items={[
                        {
                          title: 'View Full Description & Audit Criteria',
                          content: (
                            <div className="space-y-3 mt-2">
                              <p className="text-xs text-[#444444] font-sans leading-relaxed">
                                {s.description}
                              </p>
                              <div className="p-4 bg-[#EFEDE6] rounded-[16px] border border-[#DDDDDD]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] font-heading block mb-1">
                                  Official Eligibility Rules:
                                </span>
                                <span className="text-xs font-semibold text-[#444444]">{s.criteria}</span>
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
              <div className="text-center py-16 text-[#666666] font-heading font-bold uppercase tracking-wider">
                No matching scholarships found.
              </div>
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
