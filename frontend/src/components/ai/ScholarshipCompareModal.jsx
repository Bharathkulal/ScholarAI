import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Loader2,
  Award,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { compareScholarshipsApi } from '../../services/ai';
import toast from 'react-hot-toast';

export const ScholarshipCompareModal = ({ isOpen, onClose, scholarshipIds = [] }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && scholarshipIds.length >= 2) {
      fetchComparison();
    }
  }, [isOpen, scholarshipIds]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await compareScholarshipsApi(scholarshipIds);
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load scholarship comparison.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Side-by-Side Scholarship Comparison">
      <div className="space-y-6 pt-1 select-none max-w-4xl">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#CD0000]" />
            <span className="text-xs font-heading font-bold text-[#666666]">Comparing Schemes Criteria...</span>
          </div>
        ) : !data || (data.compared_scholarships || []).length === 0 ? (
          <div className="text-center py-8 text-xs text-[#666666]">
            Select at least 2 scholarships to compare side-by-side.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top AI Verdict Box */}
            {data.ai_verdict?.top_recommendation && (
              <div className="p-4 rounded-xl bg-[#FFE5E5] border border-[#FFC9C9] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#CD0000] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold font-heading text-[#111111]">
                    AI Top Recommendation: {data.ai_verdict.top_recommendation}
                  </h4>
                  <p className="text-[11px] text-[#555555] font-sans">{data.ai_verdict.reason}</p>
                </div>
              </div>
            )}

            {/* Comparison Grid Table */}
            <div className="overflow-x-auto">
              <div className={`grid grid-cols-${(data.compared_scholarships || []).length} gap-4 min-w-[600px]`}>
                {data.compared_scholarships.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#DDDDDD] space-y-4 shadow-soft">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-extrabold uppercase bg-[#FFE5E5] text-[#CD0000]">
                        {item.government_level}
                      </span>
                      <h4 className="text-sm font-extrabold font-heading text-[#111111] line-clamp-2">{item.title}</h4>
                      <p className="text-[11px] text-[#666666]">{item.provider}</p>
                    </div>

                    {/* AI Score Badge */}
                    <div className="p-3 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD] text-center space-y-0.5">
                      <span className="text-[10px] font-heading font-bold text-[#666666] uppercase block">AI Match Index</span>
                      <span className="text-xl font-extrabold font-heading text-[#CD0000]">{item.match_score}%</span>
                      <span className="text-[10px] font-heading font-extrabold text-[#111111] uppercase block">
                        {item.recommendation_level}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs border-t border-[#EEEEEE] pt-3">
                      <div>
                        <span className="text-[10px] text-[#888888] uppercase font-heading font-bold block">Grant Value</span>
                        <strong className="text-[#CD0000]">{item.amount}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#888888] uppercase font-heading font-bold block">Deadline</span>
                        <span>{item.deadline}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#888888] uppercase font-heading font-bold block">Success Chance</span>
                        <span className="text-green-700 font-bold">{item.expected_success_chance}%</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#888888] uppercase font-heading font-bold block">Effort Level</span>
                        <span>{item.estimated_effort}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[#EEEEEE]">
          <Button onClick={onClose} variant="secondary" className="text-xs uppercase font-heading">
            Close Comparison
          </Button>
        </div>

      </div>
    </Modal>
  );
};
