import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { generateJobDescription } from '../services/openaiService';
import { saveJob } from '../services/mockBackend';
import { AvailabilityType } from '../types';
import { SKILL_OPTIONS, NOTICE_PERIOD_OPTIONS } from '../constants';
import { Wand2, Loader2, CheckCircle, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobPost: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Skills search state
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    skills: [] as string[],
    expMin: 2,
    expMax: 5,
    location: '',
    availability: AvailabilityType.FULL_TIME,
    maxBudget: 0,
    noticePeriod: '',
    description: ''
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter skills based on search
  const filteredSkills = SKILL_OPTIONS.filter(
    skill => 
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (formData.skills.length < 6 && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Add custom skill if not in list but typed
      if (skillSearch.trim() && formData.skills.length < 6) {
        const existingSkill = SKILL_OPTIONS.find(s => s.toLowerCase() === skillSearch.toLowerCase());
        addSkill(existingSkill || skillSearch.trim());
      }
    }
    if (e.key === 'Backspace' && !skillSearch && formData.skills.length > 0) {
      removeSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  const handleGenerateJD = async () => {
    if (!formData.title || !formData.skills.length) {
      alert("Please enter a job title and select at least one skill first.");
      return;
    }
    setLoading(true);
    try {
      const expRange = `${formData.expMin}-${formData.expMax} years`;
      const desc = await generateJobDescription(formData.title, formData.skills, expRange, formData.location || "Remote");
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error: any) {
      console.error("OpenAI JD generation failed", error);
      alert(error?.message || "Failed to generate JD. Please add it manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.noticePeriod) {
      alert("Please select a notice period preference.");
      return;
    }
    const newJob = {
      id: `job-${Date.now()}`,
      title: formData.title,
      companyName: formData.companyName,
      description: formData.description,
      skillsRequired: formData.skills,
      yearsExperienceMin: formData.expMin,
      yearsExperienceMax: formData.expMax,
      location: formData.location,
      availabilityType: formData.availability,
      maxBudget: formData.maxBudget,
      noticePeriod: formData.noticePeriod,
      status: 'OPEN' as const,
      createdAt: new Date().toISOString()
    };
    saveJob(newJob);
    navigate('/dashboard');
  };

  const formatBudget = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Post a Job Opening</h1>
          <p className="text-slate-500 mt-2">Find the perfect talent. Use AI to draft your job description instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Basics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">Job Title *</label>
                  <input required type="text" className="w-full border rounded-lg p-2.5 text-[13px] border-slate-300 focus:ring-2 focus:ring-indigo-500" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior React Engineer" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">Company Name *</label>
                  <input required type="text" className="w-full border rounded-lg p-2.5 text-[13px] border-slate-300 focus:ring-2 focus:ring-indigo-500" 
                    value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Acme Inc" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">Location *</label>
                  <input required type="text" className="w-full border rounded-lg p-2.5 text-[13px] border-slate-300 focus:ring-2 focus:ring-indigo-500" 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, NYC" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">Type *</label>
                  <select className="w-full border rounded-lg p-2.5 text-[13px] border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value as AvailabilityType})}>
                    <option value={AvailabilityType.FULL_TIME}>Full-Time</option>
                    <option value={AvailabilityType.CONTRACT}>Contract</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Requirements</h3>
              
              {/* Searchable Skills Input */}
              <div ref={dropdownRef}>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Required Skills * <span className="text-slate-400 font-normal">(Max 6, type to search)</span>
                </label>
                <div className="relative">
                  <div 
                    className={`w-full border rounded-lg p-2 border-slate-300 focus-within:ring-2 focus-within:ring-indigo-500 flex flex-wrap gap-2 min-h-[42px] cursor-text ${formData.skills.length >= 6 ? 'bg-slate-50' : ''}`}
                    onClick={() => skillInputRef.current?.focus()}
                  >
                    {formData.skills.map(skill => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-[13px] font-medium"
                      >
                        {skill}
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                          className="hover:bg-indigo-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {formData.skills.length < 6 && (
                      <input
                        ref={skillInputRef}
                        type="text"
                        className="flex-1 min-w-[120px] outline-none text-[13px] text-slate-900 bg-transparent placeholder:text-slate-400"
                        placeholder={formData.skills.length === 0 ? "Type to search skills..." : ""}
                        value={skillSearch}
                        onChange={e => {
                          setSkillSearch(e.target.value);
                          setShowSkillDropdown(true);
                        }}
                        onFocus={() => setShowSkillDropdown(true)}
                        onKeyDown={handleSkillInputKeyDown}
                      />
                    )}
                  </div>
                  
                  {/* Skills Dropdown */}
                  {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkills.slice(0, 10).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          className="w-full text-left px-3 py-2 text-[13px] hover:bg-indigo-50 text-slate-700 hover:text-indigo-700"
                          onClick={() => addSkill(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                      {skillSearch && !SKILL_OPTIONS.some(s => s.toLowerCase() === skillSearch.toLowerCase()) && (
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-[13px] hover:bg-indigo-50 text-indigo-600 border-t border-slate-100"
                          onClick={() => addSkill(skillSearch.trim())}
                        >
                          + Add "{skillSearch.trim()}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">Experience Range (Years)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" className="w-16 border rounded-lg p-2 text-[13px] border-slate-300" value={formData.expMin} onChange={e => setFormData({...formData, expMin: parseInt(e.target.value) || 0})} />
                    <span className="text-slate-400 text-[13px]">to</span>
                    <input type="number" min="0" className="w-16 border rounded-lg p-2 text-[13px] border-slate-300" value={formData.expMax} onChange={e => setFormData({...formData, expMax: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">
                    Max Budget (USD) {formData.maxBudget > 0 && <span className="text-indigo-600">{formatBudget(formData.maxBudget)}{formData.availability === AvailabilityType.CONTRACT ? '/hr' : '/yr'}</span>}
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full border rounded-lg p-2.5 text-[13px] border-slate-300 focus:ring-2 focus:ring-indigo-500" 
                    value={formData.maxBudget || ''} 
                    placeholder={formData.availability === AvailabilityType.CONTRACT ? "e.g. 100" : "e.g. 150000"}
                    onChange={e => setFormData({...formData, maxBudget: e.target.value === '' ? 0 : parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">Notice Period Preference *</label>
                  <select 
                    required
                    className="w-full border rounded-lg p-2.5 text-[13px] border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={formData.noticePeriod} 
                    onChange={e => setFormData({...formData, noticePeriod: e.target.value})}
                  >
                    <option value="">Select preference</option>
                    {NOTICE_PERIOD_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description & AI */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-slate-800">Job Description</h3>
                <button 
                  type="button" 
                  onClick={handleGenerateJD}
                  disabled={loading}
                  className="flex items-center gap-2 text-[13px] text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Generate with AI
                </button>
              </div>
              
              <textarea
                required
                className="w-full h-64 border rounded-lg p-4 border-slate-300 font-mono text-[13px] focus:ring-2 focus:ring-indigo-500"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Click 'Generate with AI' to draft a description automatically, or type here..."
              ></textarea>
            </div>

          </div>

          <div className="bg-slate-50 p-6 flex justify-end gap-4 border-t border-slate-100">
             <button type="button" onClick={() => navigate('/')} className="px-6 py-2 text-[13px] text-slate-600 hover:text-slate-800 font-medium">Cancel</button>
             <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-medium hover:bg-indigo-700 flex items-center gap-2">
               <CheckCircle className="w-4 h-4" /> Publish Job
             </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default JobPost;
