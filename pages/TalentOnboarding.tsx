

import React, { useState } from 'react';
import Layout from '../components/Layout';
import { parseResumeWithOpenAI } from '../services/openaiService';
import { saveTalentProfile } from '../services/mockBackend';
import { AvailabilityType, TalentProfile } from '../types';
import { NOTICE_PERIOD_OPTIONS } from '../constants';
import { Upload, FileText, Loader2, CheckCircle, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TalentOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const [profile, setProfile] = useState<Partial<TalentProfile>>({
    fullName: '',
    role: '',
    skills: [],
    yearsExperience: 0,
    location: '',
    summary: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    availabilityTypes: [AvailabilityType.FULL_TIME],
    salaryExpectation: 0,
    currentSalary: 0,
    hourlyRate: 0,
    currentHourlyRate: 0,
    noticePeriod: '',
    experience: [],
    education: []
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max 10MB.");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setLoadingTooLong(false);

    // Show "taking longer" message after 10 seconds
    const longLoadTimer = setTimeout(() => {
      setLoadingTooLong(true);
    }, 10000);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const mimeType = file.type;
          const parsedData = await parseResumeWithOpenAI(base64String, mimeType);
          const skills = Array.isArray(parsedData?.skills) ? parsedData.skills.filter(Boolean).slice(0, 10) : [];
          const fallbackSummary = parsedData?.summary || (
            (parsedData?.role || skills.length > 0)
              ? `Experienced ${parsedData?.role || 'professional'} skilled in ${skills.slice(0, 5).join(', ') || 'multiple areas'}.`
              : ''
          );
          
          setProfile(prev => ({
            ...prev,
            ...parsedData,
            skills,
            summary: fallbackSummary,
            email: parsedData?.email || '',
            phone: parsedData?.phone || '',
            linkedinUrl: parsedData?.linkedinUrl || '',
            availabilityTypes: prev.availabilityTypes,
            resumeUrl: 'simulated_resume.pdf'
          }));
          
          setStep(2);
        } catch (err: any) {
          console.error(err);
          alert(err?.message || "Failed to parse resume. Please try manual entry.");
        } finally {
          clearTimeout(longLoadTimer);
          setLoading(false);
          setLoadingTooLong(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume. Please try manual entry.");
      clearTimeout(longLoadTimer);
      setLoading(false);
      setLoadingTooLong(false);
    }
  };

  const handleAvailabilityToggle = (type: AvailabilityType) => {
    const current = profile.availabilityTypes || [];
    if (current.includes(type)) {
      setProfile({ ...profile, availabilityTypes: current.filter(t => t !== type) });
    } else {
      setProfile({ ...profile, availabilityTypes: [...current, type] });
    }
  };

  const isFieldInvalid = (value: any) => {
    if (Array.isArray(value)) return value.length === 0;
    return !value || value === 0 || value === '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName || !profile.role || !profile.location || !profile.noticePeriod || !profile.email || !profile.phone || profile.availabilityTypes?.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const newTalent: TalentProfile = {
      id: `talent-${Date.now()}`,
      fullName: profile.fullName!,
      role: profile.role!,
      skills: profile.skills || [],
      yearsExperience: profile.yearsExperience || 0,
      location: profile.location!,
      timezone: 'UTC', 
      availabilityTypes: profile.availabilityTypes!,
      salaryExpectation: profile.salaryExpectation,
      currentSalary: profile.currentSalary,
      hourlyRate: profile.hourlyRate,
      currentHourlyRate: profile.currentHourlyRate,
      noticePeriod: profile.noticePeriod!,
      summary: profile.summary || '',
      email: profile.email || '',
      phone: profile.phone || '',
      linkedinUrl: profile.linkedinUrl,
      experience: (profile.experience || []).map((e, idx) => ({ ...e, id: `exp-${idx}` })),
      education: (profile.education || []).map((e, idx) => ({ ...e, id: `edu-${idx}` })),
      isSeeded: false,
      createdAt: new Date().toISOString()
    };

    saveTalentProfile(newTalent);
    alert("Profile submitted successfully!");
    navigate('/');
  };

  return (
    <Layout>
      {/* Parsing Modal Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Resume</h3>
            <p className="text-slate-500 mb-4">OpenAI is extracting your skills, experience, and education...</p>
            {loadingTooLong && (
              <p className="text-amber-600 font-medium mb-4 animate-pulse">Taking longer than expected, hang tight!</p>
            )}
             <div className="space-y-4">
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 animate-[loading_2s_ease-in-out_infinite]"></div>
               </div>
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>Scanning Layout</span>
                 <span>Extracting Text</span>
                 <span>Mapping Schema</span>
               </div>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Join the Talent Network</h1>
          <p className="text-slate-500 mt-2">Upload your resume and we'll extract your professional profile instantly.</p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-16 text-center hover:bg-indigo-50 transition-all group relative overflow-hidden shadow-sm">
            <input 
              type="file" 
              accept="application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={loading}
            />
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Upload Resume (PDF or Image)</h3>
              <p className="text-slate-500 text-base max-w-sm mx-auto mb-6">
                Drag & drop or click to browse. Max 10MB. 
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
                 <FileText className="w-4 h-4" />
                 High-fidelity parsing by Gemini
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xl p-10 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <CheckCircle className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Review Your Profile</h2>
                    <p className="text-sm text-slate-500">Verified extraction from <span className="font-semibold text-slate-700">{fileName}</span></p>
                 </div>
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-indigo-600 text-sm font-semibold hover:underline">Re-upload</button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    Full Name *
                    {isFieldInvalid(profile.fullName) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                  </label>
                  <input
                    required
                    className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white placeholder:text-slate-400 ${isFieldInvalid(profile.fullName) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                    value={profile.fullName}
                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    Current Role *
                    {isFieldInvalid(profile.role) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                  </label>
                  <input
                    required
                    className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white placeholder:text-slate-400 ${isFieldInvalid(profile.role) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                    value={profile.role}
                    onChange={e => setProfile({...profile, role: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      Skills * <span className="text-[10px] text-slate-400 font-normal">(max 10)</span>
                      {isFieldInvalid(profile.skills) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                    </label>
                    <input
                      className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white placeholder:text-slate-400 ${isFieldInvalid(profile.skills) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                      value={profile.skills?.join(', ')}
                      onChange={e => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10)})}
                      placeholder="e.g. React, Node.js, Python"
                    />
                 </div>
                 <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Years Exp *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full border border-slate-300 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400"
                      value={profile.yearsExperience}
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : Math.max(0, Math.round((parseFloat(e.target.value) || 0) * 100) / 100);
                        setProfile({...profile, yearsExperience: val});
                      }}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    Location *
                    {isFieldInvalid(profile.location) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                  </label>
                  <input
                    required
                    className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white placeholder:text-slate-400 ${isFieldInvalid(profile.location) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                    value={profile.location}
                    onChange={e => setProfile({...profile, location: e.target.value})}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    Notice Period *
                    {isFieldInvalid(profile.noticePeriod) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                  </label>
                  <select
                    required
                    className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white ${isFieldInvalid(profile.noticePeriod) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                    value={profile.noticePeriod}
                    onChange={e => setProfile({...profile, noticePeriod: e.target.value})}
                  >
                    <option value="">Select Notice Period</option>
                    {NOTICE_PERIOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    Email *
                    {isFieldInvalid(profile.email) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                  </label>
                  <input
                    required
                    type="email"
                    className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white placeholder:text-slate-400 ${isFieldInvalid(profile.email) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    placeholder="name@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    Phone *
                    {isFieldInvalid(profile.phone) && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                  </label>
                  <input
                    required
                    type="tel"
                    className={`w-full border p-3 rounded-xl transition-all text-[13px] text-slate-900 bg-white placeholder:text-slate-400 ${isFieldInvalid(profile.phone) ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:ring-4 focus:ring-indigo-50'}`}
                    value={profile.phone}
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    placeholder="+1 555 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    className="w-full border border-slate-300 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400"
                    value={profile.linkedinUrl}
                    onChange={e => setProfile({...profile, linkedinUrl: e.target.value})}
                    placeholder="https://www.linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Include Full-Time and Contract options */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <label className="block text-[13px] font-bold text-slate-700 mb-4 flex items-center gap-2">
                  Roles you are open to *
                  {isFieldInvalid(profile.availabilityTypes) && <AlertCircle className="w-4 h-4 text-red-500" />}
                </label>
                <div className="flex flex-wrap gap-4">
                   {[AvailabilityType.FULL_TIME, AvailabilityType.CONTRACT].map(type => (
                     <label key={type} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer flex-1 min-w-[150px] ${
                        profile.availabilityTypes?.includes(type) 
                          ? 'border-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600' 
                          : 'border-slate-200 bg-white hover:border-indigo-200'
                     }`}>
                        <input type="checkbox" className="hidden" checked={profile.availabilityTypes?.includes(type)} onChange={() => handleAvailabilityToggle(type)} />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          profile.availabilityTypes?.includes(type) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                        }`}>
                          {profile.availabilityTypes?.includes(type) && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-[13px] font-semibold text-slate-800">{type}</span>
                     </label>
                   ))}
                </div>
              </div>

              <div className="space-y-6">
                {profile.availabilityTypes?.includes(AvailabilityType.FULL_TIME) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Current Annual CTC (USD)</label>
                      <input type="number" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400" value={profile.currentSalary || ''} placeholder="0" onChange={e => setProfile({...profile, currentSalary: e.target.value === '' ? 0 : parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Expected Annual CTC (USD)</label>
                      <input type="number" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400" value={profile.salaryExpectation || ''} placeholder="0" onChange={e => setProfile({...profile, salaryExpectation: e.target.value === '' ? 0 : parseInt(e.target.value) || 0})} />
                    </div>
                  </div>
                )}
                {/* Show hourly rate fields for Contract roles */}
                {profile.availabilityTypes?.includes(AvailabilityType.CONTRACT) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Current Hourly Rate (USD)</label>
                      <input type="number" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400" value={profile.currentHourlyRate || ''} placeholder="0" onChange={e => setProfile({...profile, currentHourlyRate: e.target.value === '' ? 0 : parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Expected Hourly Rate (USD)</label>
                      <input type="number" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400" value={profile.hourlyRate || ''} placeholder="0" onChange={e => setProfile({...profile, hourlyRate: e.target.value === '' ? 0 : parseInt(e.target.value) || 0})} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Professional Summary</label>
                <textarea className="w-full border border-slate-300 p-3 rounded-xl h-32 focus:ring-4 focus:ring-indigo-50 text-[13px] text-slate-900 bg-white placeholder:text-slate-400" value={profile.summary} onChange={e => setProfile({...profile, summary: e.target.value})} />
              </div>

              <div className="pt-8 flex justify-between items-center border-t border-slate-100">
                 <button type="button" onClick={() => setStep(1)} className="text-[13px] text-slate-500 font-semibold hover:text-slate-800">Start Over</button>
                 <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-[13px] font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
                    Submit Profile <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Layout>
  );
};

export default TalentOnboarding;