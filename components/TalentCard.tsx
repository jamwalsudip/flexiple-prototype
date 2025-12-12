import React, { useState } from 'react';
import { TalentProfile, AvailabilityType } from '../types';
import { MapPin, Briefcase, Eye, CalendarCheck, Building, GraduationCap, Mail, Phone, Linkedin, Lock, Unlock } from 'lucide-react';

interface TalentCardProps {
  profile: TalentProfile;
  onBookCall: (profile: TalentProfile) => void;
  fullDetails?: boolean;
}

const TalentCard: React.FC<TalentCardProps> = ({ profile, onBookCall, fullDetails = false }) => {
  const [showContactCTA, setShowContactCTA] = useState(false);

  const displayName = fullDetails ? profile.fullName : `${profile.fullName.split(' ')[0]} ${profile.fullName.split(' ')[1]?.[0] || ''}.`;

  const formatSalary = (amount?: number) => amount ? `$${(amount / 1000).toFixed(0)}k/yr` : 'N/A';
  const formatHourly = (amount?: number) => amount ? `$${amount}/hr` : 'N/A';

  if (fullDetails) {
    return (
      <div className="bg-white flex flex-col relative">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="h-20 w-20 bg-white rounded-full border-4 border-white shadow-sm overflow-hidden flex-shrink-0">
              <img src={`https://i.pravatar.cc/150?u=${profile.id}`} alt={profile.fullName} className="h-full w-full object-cover" />
            </div>
            <div className="flex-grow w-full pt-0.5">
              <h2 className="text-2xl font-bold text-slate-900 mb-0.5">{profile.fullName}</h2>
              <p className="text-base text-indigo-600 font-medium mb-3">{profile.role}</p>

              {!showContactCTA ? (
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-200 text-transparent rounded-sm blur-[3px] select-none px-1 text-xs">email@example.com</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-200 text-transparent rounded-sm blur-[3px] select-none px-1 text-xs">+1 555 123 4567</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-200 text-transparent rounded-sm blur-[3px] select-none px-1 text-xs">linkedin.com/in/user</span>
                  </div>
                  <button onClick={() => setShowContactCTA(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-0.5 rounded-full transition-colors">
                    <Lock className="w-3 h-3" /> Unlock Contact
                  </button>
                </div>
              ) : (
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg w-full md:max-w-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-indigo-100 rounded-full text-indigo-600 flex-shrink-0"><Unlock className="w-4 h-4" /></div>
                      <div>
                        <h4 className="font-bold text-indigo-900 text-xs">Contact Info Locked</h4>
                        <p className="text-indigo-700 text-[10px]">Book a call to get introduced directly.</p>
                      </div>
                    </div>
                    <button onClick={() => onBookCall(profile)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 whitespace-nowrap">
                      <CalendarCheck className="w-3.5 h-3.5" /> Book Strategy Call
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Skills */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5 border-b pb-1.5 uppercase tracking-wide text-[10px]">Technical Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 10).map(skill => (
                <span key={skill} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded text-[11px] font-medium border border-indigo-100">{skill}</span>
              ))}
            </div>
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Experience</span>
              <span className="font-medium text-slate-900 text-sm">{profile.yearsExperience} Years</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</span>
              <span className="font-medium text-slate-900 text-sm">{profile.location}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Compensation</span>
              <span className="font-medium text-slate-900 text-sm">
                {profile.currentSalary ? formatSalary(profile.currentSalary) : (profile.currentHourlyRate ? formatHourly(profile.currentHourlyRate) : 'N/A')}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Notice Period</span>
              <span className="font-medium text-slate-900 text-sm">{profile.noticePeriod}</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 border-b pb-1.5 uppercase tracking-wide text-[10px]">Professional Summary</h3>
            <p className="text-slate-700 leading-relaxed text-xs">{profile.summary}</p>
          </div>

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-1.5 uppercase tracking-wide text-[10px]">Work Experience</h3>
              <div className="space-y-4">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-5 border-l-2 border-slate-200">
                    <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-slate-300 border-2 border-white"></div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-medium mb-1.5 text-[11px]">
                      <Building className="w-3 h-3" />
                      <span>{exp.company}</span>
                    </div>
                    <ul className="list-disc list-outside ml-3 space-y-0.5 text-slate-600 text-[11px]">
                      {exp.description.map((point, idx) => (<li key={idx}>{point}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-1.5 uppercase tracking-wide text-[10px]">Education</h3>
              <div className="space-y-3">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex gap-3">
                    <div className="bg-slate-100 p-1.5 rounded-md self-start"><GraduationCap className="w-4 h-4 text-slate-600" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{edu.degree}</h4>
                      <p className="text-[11px] text-slate-500 mb-0.5">{edu.institution}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full overflow-hidden">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-0.5">{displayName}</h3>
            <p className="text-indigo-600 font-medium text-xs">{profile.role}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-50 rounded-full overflow-hidden flex-shrink-0 border border-indigo-100">
            <img src={`https://i.pravatar.cc/150?u=${profile.id}`} alt={profile.fullName} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{profile.location}</span></div>
          <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /><span>{profile.yearsExperience} years experience</span></div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map(skill => (
            <span key={skill} className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-100">{skill}</span>
          ))}
          {profile.skills.length > 4 && <span className="text-slate-400 text-[10px] pt-0.5">+{profile.skills.length - 4}</span>}
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100">
        <button onClick={() => onBookCall(profile)} className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-md font-bold text-[11px] hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-1.5 shadow-sm">
          <Eye className="w-3.5 h-3.5" /> View Full Resume
        </button>
      </div>
    </div>
  );
};

export default TalentCard;
