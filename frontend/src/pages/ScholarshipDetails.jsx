import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  Calendar,
  Clock,
  ExternalLink,
  Share2,
  Bookmark,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Building,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Accordion } from '../components/ui/Accordion';
import { getScholarshipBySlugApi } from '../services/scholarships';
import toast from 'react-hot-toast';

export const ScholarshipDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getScholarshipBySlugApi(slug);
        if (res && res.scholarship) {
          setScholarship(res.scholarship);
        }
      } catch (err) {
        toast.error('Could not load scholarship details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#CD0000]" />
        <span className="text-xs font-heading font-extrabold uppercase text-[#666666]">
          Loading Scholarship Details...
        </span>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-xl font-heading font-extrabold text-[#111111] uppercase">Scholarship Not Found</h3>
        <p className="text-xs text-[#666666]">The scholarship scheme you are looking for does not exist or has expired.</p>
        <Button onClick={() => navigate('/scholarships')} variant="primary" className="text-xs uppercase font-heading">
          Back to Scholarships Explorer
        </Button>
      </div>
    );
  }

  const handleBookmark = () => {
    setSaved(!saved);
    if (!saved) {
      toast.success(`"${scholarship.title}" saved to your bookmarks!`);
    } else {
      toast.success('Removed from bookmarks.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scholarship.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Scholarship link copied to clipboard!');
    }
  };

  const amount = scholarship.amount_info?.amount || '₹50,000 / year';
  const deadline = scholarship.application_info?.end_date || '2026-08-31';
  const applyUrl = scholarship.official_apply_url || scholarship.application_info?.official_apply_url || 'https://ssp.postmatric.karnataka.gov.in';

  // Calculate days left
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-8 select-none max-w-5xl mx-auto pb-16">
      {/* Back Button */}
      <button
        onClick={() => navigate('/scholarships')}
        className="inline-flex items-center gap-2 text-xs font-heading font-extrabold uppercase text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Scholarships Explorer
      </button>

      {/* Hero Banner Card */}
      <Card className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-[20px] bg-[#CD0000]/10 border border-[#CD0000]/20 flex items-center justify-center text-2xl font-bold shrink-0">
              {scholarship.logo || '🎓'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase bg-[#FFE5E5] text-[#CD0000] border border-[#FFC9C9]">
                  {scholarship.government_level || 'State'} Level
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase bg-[#F4F4F0] text-[#111111] border border-[#DDDDDD]">
                  {scholarship.category}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-[#111111]">{scholarship.title}</h1>
              <p className="text-xs text-[#666666] font-medium mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#888888]" />
                Provided by: <strong className="text-[#111111]">{scholarship.provider}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleBookmark}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                saved
                  ? 'bg-[#CD0000] text-white border-[#CD0000]'
                  : 'bg-white text-[#111111] border-[#DDDDDD] hover:bg-[#F4F4F0]'
              }`}
              title="Bookmark Scheme"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-white text-[#111111] border border-[#DDDDDD] hover:bg-[#F4F4F0] transition-all cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#EEEEEE]">
          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE]">
            <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">Grant Value</span>
            <span className="text-base font-extrabold font-heading text-[#CD0000]">{amount}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE]">
            <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">Deadline</span>
            <span className="text-base font-extrabold font-heading text-[#111111] flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-600" />
              {daysLeft > 0 ? `${daysLeft} Days Left` : 'Expired'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE]">
            <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">Application Mode</span>
            <span className="text-base font-extrabold font-heading text-[#111111]">
              {scholarship.application_info?.mode || 'Online'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE]">
            <span className="text-[10px] font-heading font-extrabold text-[#888888] uppercase block">Renewability</span>
            <span className="text-base font-extrabold font-heading text-[#111111]">
              {scholarship.amount_info?.renewable ? 'Yes (Annual)' : 'One-Time'}
            </span>
          </div>
        </div>
      </Card>

      {/* Two Column Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Main Information */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Overview Section */}
          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide border-b border-[#EEEEEE] pb-3">
              Scholarship Description & Overview
            </h3>
            <p className="text-xs font-sans text-[#444444] leading-relaxed whitespace-pre-line">
              {scholarship.description}
            </p>
          </Card>

          {/* Eligibility Criteria */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide border-b border-[#EEEEEE] pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#CD0000]" />
              Eligibility Criteria Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD]">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>State Domicile: <strong>{scholarship.eligibility_criteria?.state || 'Karnataka'}</strong></span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD]">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Eligible Category: <strong>{scholarship.eligibility_criteria?.category || 'All Categories'}</strong></span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD]">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Academic Score: <strong>Min {scholarship.eligibility_criteria?.min_cgpa || 6.0} CGPA / {scholarship.eligibility_criteria?.min_percentage || 60}%</strong></span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD]">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Family Income: <strong>Max ₹{scholarship.eligibility_criteria?.max_income?.toLocaleString() || '8,00,000'} / year</strong></span>
              </div>
            </div>
          </Card>

          {/* Required Documents */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide border-b border-[#EEEEEE] pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#CD0000]" />
              Required Verification Documents
            </h3>

            <ul className="space-y-2">
              {(scholarship.required_documents || []).map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-[#333333]">
                  <span className="w-2 h-2 rounded-full bg-[#CD0000]" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Application Steps */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide border-b border-[#EEEEEE] pb-3">
              Application Steps & Guidelines
            </h3>

            <ol className="space-y-3">
              {(scholarship.application_info?.steps || []).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-[#333333]">
                  <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Right Column (4 cols): Call to Action & Provider Details */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4 sticky top-6">
            <h4 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide border-b border-[#EEEEEE] pb-3">
              Official Portal Application
            </h4>

            <p className="text-xs text-[#666666]">
              Apply directly through the verified provider portal before the deadline (<strong>{deadline}</strong>).
            </p>

            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-[16px] bg-[#CD0000] hover:bg-[#B30000] text-white font-heading font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lift"
            >
              Apply on Official Portal
              <ExternalLink className="w-4 h-4" />
            </a>

            {scholarship.official_website && (
              <a
                href={scholarship.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-xl bg-[#F4F4F0] hover:bg-[#EEEEEE] text-[#111111] font-heading font-extrabold text-xs uppercase flex items-center justify-center gap-2 transition-colors border border-[#DDDDDD]"
              >
                <Globe className="w-4 h-4 text-[#666666]" />
                Official Organization Website
              </a>
            )}

            <div className="pt-4 border-t border-[#EEEEEE] space-y-2 text-xs text-[#666666]">
              {scholarship.contact_email && (
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-[#888888] shrink-0" />
                  <span className="truncate">{scholarship.contact_email}</span>
                </p>
              )}
              {scholarship.contact_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#888888] shrink-0" />
                  <span>{scholarship.contact_phone}</span>
                </p>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ScholarshipDetails;
