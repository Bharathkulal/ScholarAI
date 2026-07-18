import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PageTitle } from '../components/common/PageTitle';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Grid } from '../components/common/Grid';
import toast from 'react-hot-toast';

const MOCK_RECOMMENDATIONS = [
  { id: 1, title: 'National Merit Scholarship', match: '98% Match', reason: 'High alignment with your 9.2 GPA and residency settings.', amount: '₹50,000 / year' },
  { id: 2, title: 'Tata Endowment Grant', match: '95% Match', reason: 'Matches postgraduate Engineering stream and income limits.', amount: '₹2,00,000 / total' },
  { id: 3, title: 'Reliance Foundation PG Research Grant', match: '89% Match', reason: 'Matches technology research requirements.', amount: '₹6,00,000 / total' },
];

const Recommendations = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRecalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('AI recommendation profiles refreshed successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6 select-none">
      <PageTitle
        title="AI Matches"
        description="Our machine learning engine matches your academic credentials, social groups, and financial statements to discover the best funds."
        action={
          <Button onClick={handleRecalculate} variant="outline" className="!py-2 !text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate Matches
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <SectionHeader title="Analyzing opportunities..." subtitle="Vector matching database schemas" />
          <Grid cols={1} md={3} gap={6}>
            <Skeleton variant="rect" height="150px" />
            <Skeleton variant="rect" height="150px" />
            <Skeleton variant="rect" height="150px" />
          </Grid>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-2xl flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-primary-600 dark:text-primary-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">AI Engine Status: Active</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Matched 3 primary high-similarity scholarships from 142 total database catalog records.
              </p>
            </div>
          </div>

          <SectionHeader title="Your Top Matches" subtitle="Similarity index sorted by descending order" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_RECOMMENDATIONS.map((r) => (
              <Card key={r.id} className="flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400">INDEX #{r.id}</span>
                    <Badge variant="primary">{r.match}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-805 dark:text-white mb-2 leading-snug">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-4">
                    {r.reason}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-750">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{r.amount}</span>
                  <Button variant="ghost" className="!py-1 !px-2 text-xs font-bold">Apply &rarr;</Button>
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
