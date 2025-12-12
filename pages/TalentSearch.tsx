import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Filter, X, Search, DollarSign, MapPin } from 'lucide-react';
import Layout from '../components/Layout';
import TalentCard from '../components/TalentCard';
import { getTalentPool } from '../services/mockBackend';
import { TalentProfile, AvailabilityType } from '../types';
import { SKILL_OPTIONS, NOTICE_PERIOD_OPTIONS } from '../constants';

const TalentSearch: React.FC = () => {
  const [talents] = useState<TalentProfile[]>(getTalentPool());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [minExp, setMinExp] = useState<number | ''>('');
  const [maxExp, setMaxExp] = useState<number | ''>('');
  const [availability, setAvailability] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [minBudget, setMinBudget] = useState<string>('');
  const [noticePeriod, setNoticePeriod] = useState<string>('ALL');

  const skillDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) setShowSkillDropdown(false);
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) setShowLocationDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProfile]);

  const filteredTalent = useMemo(() => {
    return talents.filter(t => {
      const matchRole = selectedRole ? t.role.toLowerCase().includes(selectedRole.toLowerCase()) : true;
      const matchSkills = selectedSkills.length === 0 || selectedSkills.every(s => t.skills.includes(s));
      const matchLocation = selectedLocations.length === 0 || selectedLocations.some(loc => t.location.toLowerCase().includes(loc.toLowerCase()));
      const matchExp = (minExp === '' || t.yearsExperience >= minExp) && (maxExp === '' || t.yearsExperience <= maxExp);

      let matchBudget = true;
      const maxBudgetValue = maxBudget === '' ? Infinity : parseInt(maxBudget);
      const minBudgetValue = minBudget === '' ? 0 : parseInt(minBudget);

      // Handle availability filtering
      if (availability === AvailabilityType.CONTRACT) {
        // Only Contract - filter by hourly rate
        if (!t.availabilityTypes.includes(AvailabilityType.CONTRACT)) return false;
        if (t.hourlyRate) matchBudget = t.hourlyRate <= maxBudgetValue && t.hourlyRate >= minBudgetValue;
      } else if (availability === AvailabilityType.FULL_TIME) {
        // Only Full-Time - filter by annual salary
        if (!t.availabilityTypes.includes(AvailabilityType.FULL_TIME)) return false;
        if (t.salaryExpectation) matchBudget = t.salaryExpectation <= maxBudgetValue && t.salaryExpectation >= minBudgetValue;
      } else {
        // 'ALL' (Any Type) - filter by annual salary
        if (t.salaryExpectation) matchBudget = t.salaryExpectation <= maxBudgetValue && t.salaryExpectation >= minBudgetValue;
      }

      const matchNotice = noticePeriod === 'ALL' || t.noticePeriod === noticePeriod;
      return matchRole && matchSkills && matchLocation && matchExp && matchBudget && matchNotice;
    });
  }, [talents, selectedRole, selectedSkills, selectedLocations, minExp, maxExp, maxBudget, minBudget, noticePeriod, availability]);

  const addSkill = (skill: string) => { setSelectedSkills([...selectedSkills, skill]); setSkillQuery(''); };
  const removeSkill = (skill: string) => { setSelectedSkills(selectedSkills.filter(s => s !== skill)); };
  const addLocation = (loc: string) => { setSelectedLocations([...selectedLocations, loc]); setLocationQuery(''); };
  const removeLocation = (loc: string) => { setSelectedLocations(selectedLocations.filter(l => l !== loc)); };

  const clearAllFilters = () => {
    setSelectedRole('');
    setSelectedSkills([]);
    setSkillQuery('');
    setSelectedLocations([]);
    setLocationQuery('');
    setMinExp('');
    setMaxExp('');
    setAvailability('ALL');
    setMaxBudget('');
    setMinBudget('');
    setNoticePeriod('ALL');
  };

  const hasActiveFilters = selectedRole || selectedSkills.length > 0 || selectedLocations.length > 0 || minExp !== '' || maxExp !== '' || availability !== 'ALL' || maxBudget !== '' || minBudget !== '' || noticePeriod !== 'ALL';

  const handleBookCall = (profile: TalentProfile) => {
    window.open('https://cal.com/meetsudip/video?user=meetsudip.&duration=30&date=2025-12-12', '_blank');
  };

  const budgetLabel = availability === AvailabilityType.CONTRACT ? 'Hourly Rate (USD)' : 'Annual Salary (USD)';

  return (
    <Layout>
      <div className="bg-indigo-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Discover Vetted Tech Talent</h1>
          <p className="text-indigo-200 text-sm mb-6">Curated network of high-performing engineers and PMs.</p>
          <div className="relative max-w-lg mx-auto">
            <input type="text" placeholder="Search by role..." className="w-full px-4 py-2.5 rounded-full text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-lg" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <div className={`md:w-60 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto space-y-4 custom-scrollbar">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide"><Filter className="w-3 h-3" /> Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                    Clear All
                  </button>
                )}
                <button onClick={() => setFiltersOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div ref={skillDropdownRef}>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skills</label>
              <div className="relative">
                <input type="text" className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-[13px] text-slate-900 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 transition-all" placeholder="Add skill..." value={skillQuery} onChange={(e) => { setSkillQuery(e.target.value); setShowSkillDropdown(true); }} onFocus={() => setShowSkillDropdown(true)} />
                {showSkillDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-white shadow-xl max-h-40 rounded py-1 overflow-auto text-[13px] border border-slate-200">
                    {SKILL_OPTIONS.filter(s => s.toLowerCase().includes(skillQuery.toLowerCase()) && !selectedSkills.includes(s)).map(s => (
                      <div key={s} onClick={() => addSkill(s)} className="cursor-pointer py-1.5 px-3 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors">{s}</div>
                    ))}
                  </div>
                )}
              </div>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSkills.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded border border-indigo-100 bg-indigo-50/50 text-indigo-600 text-[10px] font-semibold flex items-center gap-1">
                      {s} <X className="w-2.5 h-2.5 cursor-pointer hover:text-indigo-800" onClick={() => removeSkill(s)} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
              <input type="text" className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-[13px] text-slate-900 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 transition-all" placeholder="e.g. Remote" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLocation(locationQuery)} />
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedLocations.map(l => (
                    <span key={l} className="px-1.5 py-0.5 rounded border border-emerald-100 bg-emerald-50/50 text-emerald-600 text-[10px] font-semibold flex items-center gap-1">
                      {l} <X className="w-2.5 h-2.5 cursor-pointer hover:text-emerald-800" onClick={() => removeLocation(l)} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Experience (Years)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={minExp} onChange={(e) => setMinExp(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full border border-slate-300 px-2 py-1.5 rounded text-[13px] text-slate-900 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400" />
                <span className="text-slate-300 text-xs">-</span>
                <input type="number" placeholder="Max" value={maxExp} onChange={(e) => setMaxExp(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full border border-slate-300 px-2 py-1.5 rounded text-[13px] text-slate-900 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Availability</label>
              <div className="relative">
                <select className="w-full border border-slate-300 px-2 py-1.5 rounded text-[13px] bg-slate-50 focus:bg-white text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                  <option value="ALL">Any Type</option>
                  <option value={AvailabilityType.FULL_TIME}>Full-Time</option>
                  <option value={AvailabilityType.CONTRACT}>Contract</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{budgetLabel}</label>
              <div className="space-y-2">
                <input type="number" placeholder="Max Budget" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="w-full border border-slate-300 px-2 py-1.5 rounded text-[13px] text-slate-900 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400" />
                {maxBudget !== '' && (
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Minimum Floor</label>
                    <input type="number" placeholder="Min" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} className="w-full border border-slate-200 px-2 py-1 rounded text-[12px] bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Notice Period</label>
              <div className="relative">
                <select className="w-full border border-slate-300 px-2 py-1.5 rounded text-[13px] bg-slate-50 focus:bg-white text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)}>
                  <option value="ALL">Any</option>
                  {NOTICE_PERIOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">{filteredTalent.length} Candidates Found</h2>
            <button onClick={() => setFiltersOpen(true)} className="md:hidden bg-white border p-2 rounded-lg text-slate-600"><Filter className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTalent.map(t => <TalentCard key={t.id} profile={t} onBookCall={() => setSelectedProfile(t)} />)}
          </div>
        </div>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedProfile(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating close button overlay */}
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full transition-all shadow-lg border border-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              <TalentCard profile={selectedProfile} onBookCall={handleBookCall} fullDetails={true} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TalentSearch;
