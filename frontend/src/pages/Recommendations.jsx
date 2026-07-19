import React, { useState, useEffect } from 'react';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Grid } from '../components/common/Grid';
import toast from 'react-hot-toast';

const MOCK_RECOMMENDATIONS = [
  { id: 1, title: 'Karnataka Post-Matric State Scholarship (SSP)', match: '98% Match', reason: 'High alignment with your 9.2 CGPA score and Karnataka domicile status.', amount: '₹50,000 / year' },
  { id: 2, title: 'Infosys Foundation Women in STEM Grant', match: '95% Match', reason: 'Matches female engineering student profile and annual family income criteria.', amount: '₹1,50,000 / year' },
  { id: 3, title: 'Sir M. Visvesvaraya Merit Scholarship', match: '89% Match', reason: 'Matches Karnataka BE/BTech engineering college enrollment records.', amount: '₹1,00,000 total' },
];

const Recommendations = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRecalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('AI recommendation profiles refreshed for SSP & Karnataka schemes!');
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none">
      <PageTitle
        title="AI Match Engine (Karnataka & India)"
        description="Our machine learning engine matches your academic CGPA, Karnataka domicile status, category, and income certificate to discover the best schemes."
        action={
          <Button onClick={handleRecalculate} variant="secondary" className="!py-2 !px-4 text-xs font-heading uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate AI Audit
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <SectionHeader title="Analyzing opportunities..." subtitle="Vector matching SSP & NSP database schemas" />
          <Grid cols={1} md={3} gap={6}>
            <Skeleton variant="rect" height="180px" />
            <Skeleton variant="rect" height="180px" />
            <Skeleton variant="rect" height="180px" />
          </Grid>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-[#FFE5E5] border border-[#FFC9C9] rounded-[24px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#CD0000] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(205,0,0,0.25)]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold font-heading text-[#111111]">AI Neural Engine Status: Active Audit</h4>
              <p className="text-xs text-[#555555] font-sans leading-relaxed">
                Matched 3 primary high-score Indian & Karnataka state scholarships from 14,500+ verified catalog records.
              </p>
            </div>
          </div>

          <SectionHeader title="Your Top Matches" subtitle="Similarity index sorted by descending order" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_RECOMMENDATIONS.map((r) => (
              <Card key={r.id} className="flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold font-heading uppercase tracking-widest text-[#888888]">INDEX #{r.id}</span>
                    <Badge variant="primary">{r.match}</Badge>
                  </div>
                  <h4 className="text-base font-extrabold font-heading text-[#111111] mb-2 leading-snug">
                    {r.title}
                  </h4>
                  <p className="text-xs text-[#555555] font-sans leading-relaxed mb-4">
                    {r.reason}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#EEEEEE]">
                  <span className="text-sm font-extrabold font-heading text-[#CD0000]">{r.amount}</span>
                  <Button variant="primary" className="!py-1.5 !px-3 text-xs uppercase font-heading tracking-wider">Apply &rarr;</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
