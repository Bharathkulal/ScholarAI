import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Filter,
  Calendar,
  Award,
  Search,
  Grid,
  List,
  Clock,
  ArrowRight,
  Bookmark,
  Building,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { getScholarshipsApi, getScholarshipCategoriesApi } from '../services/scholarships';
import toast from 'react-hot-toast';

const Scholarships = () => {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [governmentLevel, setGovernmentLevel] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // "grid" | "list"

  const fetchScholarshipsData = async () => {
    setLoading(true);
    try {
      const res = await getScholarshipsApi({
        query: searchTerm || undefined,
        category: category !== 'All' ? category : undefined,
        government_level: governmentLevel !== 'All' ? governmentLevel : undefined,
        state: stateFilter !== 'All' ? stateFilter : undefined,
        sort_by: sortBy,
        page,
        limit: 9,
      });

      if (res && res.data) {
        setScholarships(res.data.items || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      toast.error('Failed to load scholarships database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarshipsData();
  }, [searchTerm, category, governmentLevel, stateFilter, sortBy, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getScholarshipCategoriesApi();
        if (res && res.data) {
          setCategories(['All', ...res.data]);
        }
      } catch (e) {
        setCategories(['All', 'Karnataka State', 'Women in STEM', 'Merit-Cum-Means', 'Minority Welfare']);
      }
    };
    fetchCategories();
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setGovernmentLevel('All');
    setStateFilter('All');
    setSortBy('newest');
    setPage(1);
  };

  const handleBookmark = (title) => {
    toast.success(`"${title}" saved to your bookmarks!`);
  };

  return (
    <div className="space-y-8 select-none w-full pb-16">
      <PageTitle
        title="Find Indian & Karnataka Scholarships"
        description="Search, filter, and discover State Scholarship Portal (SSP Karnataka), NSP, and corporate grants."
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
              onClick={handleResetFilters}
              className="text-xs font-bold font-heading uppercase text-[#CD0000] hover:underline cursor-pointer min-h-[44px] flex items-center px-1"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <Select
              label="Scholarship Category"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              options={categories.map((cat) => ({ label: cat, value: cat }))}
            />

            <Select
              label="Government & Provider Level"
              value={governmentLevel}
              onChange={(e) => { setGovernmentLevel(e.target.value); setPage(1); }}
              options={[
                { label: 'All Levels', value: 'All' },
                { label: 'State Level (e.g. Karnataka SSP)', value: 'State' },
                { label: 'Central Level (e.g. NSP)', value: 'Central' },
                { label: 'Private / Corporate (e.g. Infosys, Tata)', value: 'Private' },
                { label: 'NGO / Trust Grants', value: 'NGO' },
              ]}
            />

            <Select
              label="State of Domicile"
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All States', value: 'All' },
                { label: 'Karnataka', value: 'Karnataka' },
                { label: 'Maharashtra', value: 'Maharashtra' },
                { label: 'Tamil Nadu', value: 'Tamil Nadu' },
                { label: 'Delhi NCR', value: 'Delhi' },
              ]}
            />

            <Select
              label="Sort Results By"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              options={[
                { label: 'Newest First', value: 'newest' },
                { label: 'Closing Soonest', value: 'deadline' },
                { label: 'Highest Amount', value: 'highest_amount' },
                { label: 'Most Popular', value: 'popularity' },
                { label: 'Alphabetical', value: 'alphabetical' },
              ]}
            />
          </div>
        </div>

        {/* Main Search & Results List (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Bar: Search Input & View Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-96">
              <SearchBar
                value={searchTerm}
                onChange={(val) => { setSearchTerm(val); setPage(1); }}
                placeholder="Search by title, provider, keyword..."
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-bold font-heading text-[#666666] uppercase">
                Showing {scholarships.length} of {total} Schemes
              </span>

              <div className="flex items-center p-1 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-soft text-[#111111]' : 'text-[#888888]'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white shadow-soft text-[#111111]' : 'text-[#888888]'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid / List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#CD0000]" />
              <span className="text-xs font-heading font-extrabold uppercase text-[#666666]">
                Searching Scholarships Database...
              </span>
            </div>
          ) : scholarships.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <h4 className="text-lg font-heading font-extrabold text-[#111111] uppercase">No Scholarships Match Your Query</h4>
              <p className="text-xs text-[#666666]">Try adjusting search keywords or clearing active filters.</p>
              <Button onClick={handleResetFilters} variant="secondary" className="text-xs uppercase font-heading">
                Reset All Filters
              </Button>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((s) => (
                <Card
                  key={s._id || s.slug}
                  className="p-6 flex flex-col justify-between gap-5 hover:shadow-lift transition-all duration-200 border border-[#DDDDDD]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#CD0000]/10 border border-[#CD0000]/20 flex items-center justify-center text-xl font-bold shrink-0">
                        {s.logo || '🎓'}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase bg-[#FFE5E5] text-[#CD0000] border border-[#FFC9C9]">
                        {s.government_level || 'State'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold font-heading text-[#111111] line-clamp-2 hover:text-[#CD0000] transition-colors">
                        <Link to={`/scholarships/${s.slug}`}>{s.title}</Link>
                      </h4>
                      <p className="text-[11px] text-[#666666] font-medium mt-1 truncate">
                        {s.provider}
                      </p>
                    </div>

                    <p className="text-xs text-[#555555] line-clamp-2 font-sans">
                      {s.short_description || s.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#EEEEEE]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold font-heading text-[#CD0000]">
                        {s.amount_info?.amount || '₹50,000 / year'}
                      </span>
                      <span className="text-[#666666] flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {s.application_info?.end_date || '2026-08-31'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/scholarships/${s.slug}`}
                        className="flex-1 h-10 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-heading font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        View Scheme
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleBookmark(s.title)}
                        className="p-2.5 rounded-xl bg-[#F4F4F0] hover:bg-[#EEEEEE] text-[#111111] border border-[#DDDDDD] transition-colors cursor-pointer"
                        title="Bookmark Scheme"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {scholarships.map((s) => (
                <Card key={s._id || s.slug} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lift transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#CD0000]/10 border border-[#CD0000]/20 flex items-center justify-center text-xl font-bold shrink-0">
                      {s.logo || '🎓'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-extrabold uppercase bg-[#FFE5E5] text-[#CD0000]">
                          {s.government_level || 'State'}
                        </span>
                        <span className="text-xs font-bold text-[#666666]">{s.category}</span>
                      </div>
                      <h4 className="text-base font-extrabold font-heading text-[#111111]">
                        <Link to={`/scholarships/${s.slug}`} className="hover:text-[#CD0000]">
                          {s.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#666666] mt-0.5">{s.provider}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#EEEEEE]">
                    <div className="text-right">
                      <span className="text-sm font-extrabold font-heading text-[#CD0000] block">
                        {s.amount_info?.amount || '₹50,000 / year'}
                      </span>
                      <span className="text-[11px] text-[#666666]">
                        Deadline: {s.application_info?.end_date || '2026-08-31'}
                      </span>
                    </div>

                    <Link
                      to={`/scholarships/${s.slug}`}
                      className="h-10 px-5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-heading font-extrabold text-xs uppercase flex items-center gap-1.5 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={pages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
