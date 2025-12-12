import { TalentProfile, JobPosting, Applicant } from '../types';
import { SEEDED_TALENT, SEEDED_JOBS } from '../constants';

const KEYS = {
  TALENT: 'ts_talent',
  JOBS: 'ts_jobs',
  APPLICANTS: 'ts_applicants'
};

// --- Talent ---
export const getTalentPool = (): TalentProfile[] => {
  const stored = localStorage.getItem(KEYS.TALENT);
  const localData = stored ? JSON.parse(stored) : [];
  return [...SEEDED_TALENT, ...localData];
};

export const saveTalentProfile = (profile: TalentProfile): void => {
  const stored = localStorage.getItem(KEYS.TALENT);
  const localData: TalentProfile[] = stored ? JSON.parse(stored) : [];
  localData.push(profile);
  localStorage.setItem(KEYS.TALENT, JSON.stringify(localData));
};

// --- Jobs ---
export const getJobs = (): JobPosting[] => {
  const stored = localStorage.getItem(KEYS.JOBS);
  const localData = stored ? JSON.parse(stored) : [];
  return [...SEEDED_JOBS, ...localData];
};

export const saveJob = (job: JobPosting): void => {
  const stored = localStorage.getItem(KEYS.JOBS);
  const localData: JobPosting[] = stored ? JSON.parse(stored) : [];
  localData.push(job);
  localStorage.setItem(KEYS.JOBS, JSON.stringify(localData));
};

export const getJobById = (id: string): JobPosting | undefined => {
  return getJobs().find(j => j.id === id);
};

// --- Applicants ---
export const applyToJob = (jobId: string, talentId: string, isSeeded = false): void => {
  const stored = localStorage.getItem(KEYS.APPLICANTS);
  const applicants: Applicant[] = stored ? JSON.parse(stored) : [];
  
  // Prevent duplicate
  if (applicants.find(a => a.jobId === jobId && a.talentId === talentId)) return;

  const newApplicant: Applicant = {
    id: `app-${Date.now()}`,
    jobId,
    talentId,
    status: 'NEW',
    source: isSeeded ? 'SEEDED' : 'REAL',
    appliedAt: new Date().toISOString()
  };

  applicants.push(newApplicant);
  localStorage.setItem(KEYS.APPLICANTS, JSON.stringify(applicants));
};

export const getApplicantsForJob = (jobId: string): Applicant[] => {
  const stored = localStorage.getItem(KEYS.APPLICANTS);
  const applicants: Applicant[] = stored ? JSON.parse(stored) : [];
  
  // Also create fake applicants from seeded talent if none exist for demo purposes
  const jobApplicants = applicants.filter(a => a.jobId === jobId);
  
  if (jobApplicants.length === 0) {
      // Auto-seed some applicants for visual demo
      const demoApplicants = SEEDED_TALENT.slice(0, 2).map(t => ({
          id: `seed-app-${t.id}`,
          jobId,
          talentId: t.id,
          status: 'NEW' as const,
          source: 'SEEDED' as const,
          appliedAt: new Date().toISOString()
      }));
      return demoApplicants;
  }
  
  return jobApplicants;
};
