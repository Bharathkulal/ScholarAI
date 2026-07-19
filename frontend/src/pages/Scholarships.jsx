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
    title: 'Karnataka Post-Matric State Scholarship (SSP)',
    provider: 'Department of Higher Education, Govt of Karnataka',
    amount: '₹50,000 / year',
    deadline: '2026-08-15',
    match: '98% Match',
    description: 'Provides financial aid to meritorious Karnataka students pursuing diploma, degree, and postgraduate courses.',
    criteria: 'Karnataka domicile required. Minimum 75% SSLC/PUC marks, family income under ₹2.5 LPA.',
  },
  {
    id: 2,
    title: 'Infosys Foundation Women in STEM Grant',
    provider: 'Infosys Foundation, Bengaluru',
    amount: '₹1,50,000 / year',
    deadline: '2026-09-01',
    match: '95% Match',
    description: 'Supports meritorious female engineering students enrolled in accredited Karnataka and Indian institutes.',
    criteria: 'Enrolled in BE/BTech in CS, IT, or Electronics. Minimum 8.5 CGPA, family income under ₹5.0 LPA.',
  },
  {
    id: 3,
    title: 'Tata Endowment for Higher Education',
    provider: 'Tata Trusts, Mumbai',
    amount: '₹2,00,000 total',
    deadline: '2026-10-10',
    match: '89% Match',
    description: 'Loan scholarship for outstanding Indian graduates pursuing postgraduate studies in top global or Indian universities.',
    criteria: 'Undergraduate degree with first class marks from a recognized Indian university.',
  },
  {
    id: 4,
    title: 'Karnataka ePASS Pre-Matric & Post-Matric Aid',
    provider: 'Backward Classes Welfare Dept, Govt of Karnataka',
    amount: '₹25,000 / year',
    deadline: '2026-11-15',
    match: '85% Match',
    description: 'Reimbursement of tuition fees and maintenance allowance for students belonging to Category-1, 2A, 2B, 3A, 3B.',
    criteria: 'Karnataka resident belonging to eligible OBC categories. Valid income and caste certificate required.',
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
    <div className="space-y-8 select-none w-full">
      <PageTitle
        title="Find Indian & Karnataka Scholarships"
        description="Search, filter, and audit eligibility for State Scholarship Portal (SSP Karnataka), NSP, and corporate grants."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (1 col) */}
        <div className="lg:col-span-1 bg-white border border-[#DDDDDD] rounded-[24px] p-6 h-fit space-y-6 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE]">
            <h3 className="font-extrabold text-[#111111] font-heading flex items-center gap-2 text-sm uppercase tracking-wider">
              <Filter className="w-4 h-4 text-[#CD0000]" />
              Filter Schemes
            </h3>
            <button
              onClick={() => {
                setDegree('');
                setAmountRange('');
              }}
              className="text-xs font-bold font-heading uppercase text-[#CD0000] hover:underline cursor-pointer min-h-[44px] flex items-center px-1"
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
                { label: 'All Levels', value: '' },
                { label: 'PUC / Diploma', value: 'diploma' },
                { label: 'Undergraduate (BE/BSc/BCom)', value: 'ug' },
                { label: 'Postgraduate (ME/MTech/MBA)', value: 'pg' },
                { label: 'Doctorate / Research', value: 'phd' },
              ]}
            />

            <Select
              label="Funding Range (₹)"
              value={amountRange}
              onChange={(e) => setAmountRange(e.target.value)}
              options={[
                { label: 'Any Amount', value: '' },
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
            placeholder="Search by SSP scheme name, provider, Karnataka category..."
          />

          <div className="space-y-6">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((s) => (
                <Card key={s.id} hoverable className="p-6 sm:p-8 flex flex-col justify-between h-full">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
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
                            Award Amount
                          </span>
                          <span className="text-lg font-extrabold font-heading text-[#CD0000] flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {s.amount}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#888888] font-heading block tracking-wider">
                            Closing Date
                          </span>
                          <span className="text-sm font-bold text-[#DC2626] font-heading flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {s.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col justify-end items-stretch gap-3 shrink-0 pt-2 md:pt-0 w-full sm:w-auto">
                      <Button variant="primary" className="!py-2.5 !px-5 text-xs uppercase font-heading tracking-wider min-h-[44px] w-full sm:w-auto">
                        Apply Now
                      </Button>
                      <Button variant="secondary" className="!py-2.5 !px-5 text-xs uppercase font-heading tracking-wider min-h-[44px] w-full sm:w-auto">
                        Save Rules
                      </Button>
                    </div>
                  </div>

                  {/* Expansion description details inside card */}
                  <div className="mt-6 border-t border-[#EEEEEE] pt-3">
                    <Accordion
                      items={[
                        {
                          title: 'View Full Description & Karnataka SSP Eligibility Rules',
                          content: (
                            <div className="space-y-3 mt-2">
                              <p className="text-xs text-[#444444] font-sans leading-relaxed">
                                {s.description}
                              </p>
                              <div className="p-4 bg-[#EFEDE6] rounded-[16px] border border-[#DDDDDD]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] font-heading block mb-1">
                                  Official Karnataka / NSP Criteria:
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
                No matching Karnataka or Indian scholarships found.
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
