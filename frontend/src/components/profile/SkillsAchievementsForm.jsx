import React, { useState } from 'react';
import { Code, Languages, Award, Briefcase, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const SkillsAchievementsForm = ({ skillsData = {}, onChange }) => {
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [achieveInput, setAchieveInput] = useState('');

  const programmingSkills = skillsData.programming_skills || [];
  const languages = skillsData.languages || [];
  const achievements = skillsData.achievements || [];

  const addTag = (field, value, setInput) => {
    if (!value.trim()) return;
    const current = skillsData[field] || [];
    if (!current.includes(value.trim())) {
      const updated = {
        ...skillsData,
        [field]: [...current, value.trim()],
      };
      onChange(updated);
    }
    setInput('');
  };

  const removeTag = (field, item) => {
    const current = skillsData[field] || [];
    const updated = {
      ...skillsData,
      [field]: current.filter((t) => t !== item),
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Programming Skills */}
      <div className="p-5 rounded-[20px] bg-white border border-[#DDDDDD] shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-[#CD0000]" />
          <h4 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
            Programming Languages & Tech Skills
          </h4>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Python, Java, React, SQL, C++"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('programming_skills', skillInput, setSkillInput))}
            className="flex-1 h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
          />
          <Button
            type="button"
            variant="secondary"
            className="!py-2 text-xs font-heading font-extrabold"
            onClick={() => addTag('programming_skills', skillInput, setSkillInput)}
          >
            Add Skill
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {programmingSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#F4F4F0] text-[#111111] border border-[#DDDDDD]"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeTag('programming_skills', skill)}
                className="hover:text-[#CD0000] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Spoken Languages */}
      <div className="p-5 rounded-[20px] bg-white border border-[#DDDDDD] shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#CD0000]" />
          <h4 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
            Languages Known
          </h4>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Kannada, English, Hindi"
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('languages', langInput, setLangInput))}
            className="flex-1 h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
          />
          <Button
            type="button"
            variant="secondary"
            className="!py-2 text-xs font-heading font-extrabold"
            onClick={() => addTag('languages', langInput, setLangInput)}
          >
            Add Language
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#F4F4F0] text-[#111111] border border-[#DDDDDD]"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeTag('languages', lang)}
                className="hover:text-[#CD0000] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Achievements & Awards */}
      <div className="p-5 rounded-[20px] bg-white border border-[#DDDDDD] shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#CD0000]" />
          <h4 className="text-sm font-extrabold font-heading text-[#111111] uppercase tracking-wide">
            Key Achievements & Awards
          </h4>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Smart India Hackathon Finalist 2024, State Science Exhibition Rank 1"
            value={achieveInput}
            onChange={(e) => setAchieveInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('achievements', achieveInput, setAchieveInput))}
            className="flex-1 h-10 px-3 rounded-xl border border-[#DDDDDD] bg-white text-xs text-[#111111]"
          />
          <Button
            type="button"
            variant="secondary"
            className="!py-2 text-xs font-heading font-extrabold"
            onClick={() => addTag('achievements', achieveInput, setAchieveInput)}
          >
            Add Achievement
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {achievements.map((ach) => (
            <span
              key={ach}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#F4F4F0] text-[#111111] border border-[#DDDDDD]"
            >
              {ach}
              <button
                type="button"
                onClick={() => removeTag('achievements', ach)}
                className="hover:text-[#CD0000] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
