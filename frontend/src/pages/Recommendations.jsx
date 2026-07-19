import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  FileText,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ScholarshipCompareModal } from '../components/ai/ScholarshipCompareModal';
import { getAIRecommendationsApi, getAIProfileAnalysisApi } from '../services/ai';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  // Compare selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const fetchRecommendationsData = async () => {
    setLoading(true);
    try {
      const [recRes, anaRes] = await Promise.all([
        getAIRecommendationsApi(20),
        getAIProfileAnalysisApi(),
      ]);

      if (recRes && recRes.data) {
        setRecommendations(recRes.data.recommendations || []);
      }

      if (anaRes && anaRes.data) {
        setAnalysis(anaRes.data);
      }
    } catch (err) {
      toast.error('Failed to load AI recommendation analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendationsData();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    const loadingId = toast.loading('Recalculating AI Neural Criteria...');
    await fetchRecommendationsData();
    setRecalculating(false);
    toast.success('AI Recommendation Audit refreshed!', { id: loadingId });
  };

  const handleToggleSelectCompare = (schId) => {
    if (selectedIds.includes(schId)) {
      setSelectedIds(selectedIds.filter((id) => id !== schId));
    } else {
      if (selectedIds.length >= 5) {
        toast.error('You can compare a maximum of 5 scholarships at once.');
        return;
      }
      setSelectedIds([...selectedIds, schId]);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Perfect Match':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Highly Recommended':
        return 'bg-[#FFE5E5] text-[#CD0000] border-[#FFC9C9]';
      case 'Good Match':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Possible Match':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 select-none w-full max-w-5xl mx-auto pb-16">
      <PageTitle
        title="AI Recommendation Engine & Smart Intelligence"
        description="Multi-criteria machine learning engine auditing CGPA, income, category, and domicile against Karnataka SSP and NSP scholarship databases."
        action={
          <div className="flex items-center gap-3">
            {selectedIds.length >= 2 && (
              <Button
                onClick={() => setIsCompareOpen(true)}
                variant="primary"
                className="!py-2 text-xs font-heading uppercase gap-1.5"
              >
                <Layers className="w-4 h-4" /> Compare {selectedIds.length} Schemes
              </Button>
            )}

            <Button
              onClick={handleRecalculate}
              variant="secondary"
              isLoading={recalculating}
              className="!py-2 text-xs font-heading uppercase gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-[#CD0000]" />
              Recalculate AI Audit
            </Button>
          </div>
        }
      />

      {/* Banner Indicator */}
      <div className="p-6 bg-[#FFE5E5] border border-[#FFC9C9] rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#CD0000] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(205,0,0,0.25)]">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-extrabold font-heading text-[#111111]">
              AI Neural Matching Tier: Active
            </h4>
            <p className="text-xs text-[#555555] font-sans leading-relaxed">
              Analyzed {recommendations.length} published scholarship programs with real-time explainability breakdown.
            </p>
          </div>
        </div>

        {analysis && (
          <div className="px-4 py-2 rounded-xl bg-white border border-[#DDDDDD] text-xs font-heading font-extrabold text-[#111111] shrink-0">
            Profile Strength: <span className="text-[#CD0000]">{analysis.overall_score}%</span> ({analysis.strength_tier})
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#CD0000]" />
          <span className="text-xs font-heading font-extrabold uppercase text-[#666666]">
            Evaluating AI Recommendation Scores...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
              Ranked AI Scholarship Matches ({recommendations.length})
            </h3>
            <span className="text-xs text-[#666666]">
              Select checkboxes to compare side-by-side
            </span>
          </div>

          <div className="space-y-4">
            {recommendations.map((sch) => {
              const isSelected = selectedIds.includes(sch.scholarship_id || sch.scholarship_slug);
              return (
                <Card
                  key={sch.scholarship_id || sch.scholarship_slug}
                  className={`p-6 border transition-all ${
                    isSelected ? 'border-[#CD0000] bg-[#FFF5F5] shadow-lift' : 'border-[#DDDDDD] hover:border-[#999999]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* Left: Info & Checkbox */}
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectCompare(sch.scholarship_id || sch.scholarship_slug)}
                        className="w-5 h-5 mt-1 rounded accent-[#CD0000] cursor-pointer shrink-0"
                      />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase border ${getTierColor(sch.recommendation_level)}`}>
                            {sch.recommendation_level}
                          </span>
                          <span className="text-xs font-bold text-[#666666]">{sch.government_level} Level</span>
                        </div>

                        <h4 className="text-lg font-extrabold font-heading text-[#111111]">
                          <Link to={`/scholarships/${sch.scholarship_slug}`} className="hover:text-[#CD0000]">
                            {sch.title}
                          </Link>
                        </h4>

                        <p className="text-xs text-[#666666]">
                          Provider: <strong>{sch.provider}</strong> • Grant Value: <strong className="text-[#CD0000]">{sch.amount}</strong>
                        </p>

                        {/* Explainability bullet points */}
                        <div className="pt-2 space-y-1">
                          {(sch.why_recommended || []).map((reason, idx) => (
                            <p key={idx} className="text-xs text-green-700 flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{reason}</span>
                            </p>
                          ))}

                          {(sch.missing_requirements || []).map((missing, idx) => (
                            <p key={idx} className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{missing}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Match Ring Gauge & Action */}
                    <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#EEEEEE]">
                      <div className="text-center p-3 rounded-2xl bg-[#F4F4F0] border border-[#DDDDDD] min-w-[110px]">
                        <span className="text-[10px] font-heading font-bold text-[#666666] uppercase block">
                          Match Index
                        </span>
                        <span className="text-2xl font-extrabold font-heading text-[#CD0000]">
                          {sch.match_score}%
                        </span>
                      </div>

                      <Link
                        to={`/scholarships/${sch.scholarship_slug}`}
                        className="h-10 px-5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-heading font-extrabold text-xs uppercase flex items-center gap-1.5 transition-colors"
                      >
                        View & Apply
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      <ScholarshipCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        scholarshipIds={selectedIds}
      />
    </div>
  );
};

export default Recommendations;
