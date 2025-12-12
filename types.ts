

export enum AvailabilityType {
  FULL_TIME = 'Full-Time',
  CONTRACT = 'Contract',
  PART_TIME = 'Part-Time',
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string; // or 'Present'
  description: string[]; // Bullet points
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface TalentProfile {
  id: string;
  fullName: string;
  role: string;
  skills: string[];
  yearsExperience: number;
  location: string;
  timezone: string;
  availabilityTypes: AvailabilityType[];
  hourlyRate?: number; // Expected
  salaryExpectation?: number; // Expected
  currentSalary?: number; // Current
  currentHourlyRate?: number; // Current
  noticePeriod: string; 
  summary: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  experience?: Experience[];
  education?: Education[];
  isSeeded: boolean;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  companyName: string;
  description: string;
  skillsRequired: string[];
  yearsExperienceMin: number;
  yearsExperienceMax: number;
  location: string;
  availabilityType: AvailabilityType;
  maxBudget: number;
  noticePeriod: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  talentId: string;
  status: 'NEW' | 'SHORTLISTED' | 'REJECTED';
  source: 'SEEDED' | 'REAL';
  appliedAt: string;
}

export interface FilterState {
  search: string;
  minExp: number;
  availability: AvailabilityType | 'ALL';
}