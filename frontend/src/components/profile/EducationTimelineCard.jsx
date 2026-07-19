import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, Award, Building } from 'lucide-react';
import { Button } from '../ui/Button';


export const EducationTimelineCard = ({ timelineItems = [], onChange }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    level: 'UG',
    institution: '',
    board_university: '',
    year_of_passing: '',
    percentage_cgpa: '',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.institution || !formData.percentage_cgpa) return;

    const newItem = {
      id: Date.now().toString(),
      ...formData,
    };

    const updated = [...timelineItems, newItem];
    onChange(updated);

    setFormData({
      level: 'UG',
      institution: '',
      board_university: '',
      year_of_passing: '',
      percentage_cgpa: '',
    });
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const updated = timelineItems.filter((item) => item.id !== id);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
            Education History Timeline
          </h4>
          <p className="text-xs text-[#666666]">
            Add academic qualification records from SSLC to present.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="!py-2 text-xs font-heading font-extrabold uppercase gap-1.5"
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus className="w-4 h-4 text-[#CD0000]" />
          Add Qualification
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-5 rounded-[20px] bg-[#F9F9F7] border border-[#DDDDDD] space-y-4">
          <h5 className="text-xs font-bold font-heading text-[#111111] uppercase">
            New Education Record
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-heading font-extrabold text-[#111111] uppercase mb-1">
                Level / Degree
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
              >
                <option value="SSLC">SSLC / Class 10th</option>
                <option value="PUC">PUC / Class 12th / Pre-University</option>
                <option value="Diploma">Polytechnic Diploma</option>
                <option value="UG">Undergraduate (UG / B.E / B.Tech / B.Sc)</option>
                <option value="PG">Postgraduate (PG / M.Tech / M.Sc / MBA)</option>
                <option value="Other">Other Certificate Course</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-extrabold text-[#111111] uppercase mb-1">
                Institution / School Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. National High School"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-extrabold text-[#111111] uppercase mb-1">
                Board / University
              </label>
              <input
                type="text"
                placeholder="e.g. KSEEB / VTU Belagavi"
                value={formData.board_university}
                onChange={(e) => setFormData({ ...formData, board_university: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-extrabold text-[#111111] uppercase mb-1">
                Year of Passing
              </label>
              <input
                type="text"
                placeholder="e.g. 2022"
                value={formData.year_of_passing}
                onChange={(e) => setFormData({ ...formData, year_of_passing: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-extrabold text-[#111111] uppercase mb-1">
                Score (Percentage / CGPA)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 91.5% or 9.2 CGPA"
                value={formData.percentage_cgpa}
                onChange={(e) => setFormData({ ...formData, percentage_cgpa: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Qualification
            </Button>
          </div>
        </form>
      )}

      {timelineItems.length === 0 ? (
        <div className="p-6 text-center rounded-[20px] bg-white border border-dashed border-[#DDDDDD] text-xs text-[#888888]">
          No education history entries added yet. Click "Add Qualification" to record your academic milestones.
        </div>
      ) : (
        <div className="space-y-3">
          {timelineItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-[16px] bg-white border border-[#DDDDDD] shadow-soft flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#CD0000]/10 text-[#CD0000] flex items-center justify-center font-heading font-extrabold text-sm shrink-0">
                  {item.level}
                </div>
                <div>
                  <h5 className="text-sm font-extrabold font-heading text-[#111111]">
                    {item.institution}
                  </h5>
                  <p className="text-xs text-[#666666] flex items-center gap-3 mt-0.5">
                    <span>{item.board_university}</span>
                    <span>• {item.year_of_passing}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-heading font-extrabold bg-[#F4F4F0] text-[#111111]">
                  {item.percentage_cgpa}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
