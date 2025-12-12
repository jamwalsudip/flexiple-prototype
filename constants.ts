
import { TalentProfile, AvailabilityType, JobPosting } from './types';
import { generateCandidateBatch } from './utils/generateCandidates';

export const SKILL_OPTIONS = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "Go", "Rust", "Java", "C++", "C#",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQL", "NoSQL", "GraphQL",
  "Next.js", "Vue.js", "Angular", "Svelte", "Tailwind CSS", "SASS",
  "Django", "Flask", "FastAPI", "Express.js", "Spring Boot", "Ruby on Rails",
  "React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android",
  "Machine Learning", "Data Science", "AI/ML", "TensorFlow", "PyTorch",
  "DevOps", "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI",
  "UI/UX", "Figma", "Product Management", "Agile", "Scrum",
  "Blockchain", "Web3", "Solidity", "Smart Contracts"
];

export const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "Less than 15 days",
  "Less than 30 days",
  "Less than 60 days",
  "90 days",
  "90+ days"
];

// Generate 420 candidates (including the 3 original seed candidates)
const generatedCandidates = generateCandidateBatch(417);

export const SEEDED_TALENT: TalentProfile[] = [
  {
    id: "seed-1",
    fullName: "Alex Chen",
    role: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "Tailwind", "Next.js"],
    yearsExperience: 6,
    location: "San Francisco, CA",
    timezone: "PST",
    availabilityTypes: [AvailabilityType.FULL_TIME],
    salaryExpectation: 160000,
    currentSalary: 145000,
    noticePeriod: "Less than 30 days",
    summary: "Product-minded engineer with a focus on high-performance web applications. I love building intuitive UIs and optimizing core web vitals.",
    experience: [
      {
        id: "exp-1",
        company: "TechFlow Inc.",
        role: "Senior Frontend Engineer",
        startDate: "2021",
        endDate: "Present",
        description: [
          "Led the migration of a legacy Monolith to a Micro-frontend architecture using Webpack Module Federation.",
          "Improved site performance scores (Lighthouse) from 45 to 95 by optimizing bundle size and image loading strategies.",
          "Mentored 3 junior developers and established code review standards for the frontend team."
        ]
      },
      {
        id: "exp-2",
        company: "Creative Solutions",
        role: "Frontend Developer",
        startDate: "2018",
        endDate: "2021",
        description: [
          "Developed and maintained 15+ client websites using React and Gatsby.",
          "Collaborated closely with designers to implement pixel-perfect responsive designs.",
          "Integrated Stripe and PayPal payment gateways for e-commerce clients."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        institution: "University of California, Berkeley",
        degree: "B.S. Computer Science",
        startDate: "2014",
        endDate: "2018"
      }
    ],
    isSeeded: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    fullName: "Sarah Jenkins",
    role: "Backend Developer",
    skills: ["Python", "Django", "AWS", "PostgreSQL"],
    yearsExperience: 4,
    location: "Austin, TX",
    timezone: "CST",
    availabilityTypes: [AvailabilityType.CONTRACT],
    hourlyRate: 85,
    currentSalary: 120000, 
    noticePeriod: "Immediate",
    summary: "Specialized in scalable API architecture and cloud infrastructure. I help startups scale their backend from MVP to production-grade systems.",
    experience: [
      {
        id: "exp-1",
        company: "DataStream Corp",
        role: "Backend Engineer",
        startDate: "2022",
        endDate: "2024",
        description: [
          "Architected a real-time data ingestion pipeline using Python, Kafka, and AWS Lambda processing 1M+ events daily.",
          "Reduced API latency by 40% through efficient caching strategies with Redis.",
          "Designed and implemented RESTful APIs for mobile and web clients."
        ]
      },
      {
        id: "exp-2",
        company: "Startup Hub",
        role: "Junior Developer",
        startDate: "2020",
        endDate: "2022",
        description: [
          "Maintained legacy Django codebase and fixed critical production bugs.",
          "Automated deployment processes using Docker and Jenkins, reducing deployment time by 50%.",
          "Wrote unit and integration tests achieving 85% code coverage."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        institution: "University of Texas at Austin",
        degree: "B.S. Electrical Engineering",
        startDate: "2016",
        endDate: "2020"
      }
    ],
    isSeeded: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    fullName: "Michael Ross",
    role: "Full Stack Engineer",
    skills: ["Node.js", "React", "MongoDB", "Docker"],
    yearsExperience: 8,
    location: "Remote (UK)",
    timezone: "GMT",
    availabilityTypes: [AvailabilityType.FULL_TIME],
    salaryExpectation: 140000,
    currentSalary: 125000,
    noticePeriod: "90 days",
    summary: "Experienced in building end-to-end distributed systems. I have a strong background in both SQL and NoSQL databases and love working with containerized environments.",
    experience: [
      {
        id: "exp-1",
        company: "Global FinTech",
        role: "Lead Full Stack Engineer",
        startDate: "2020",
        endDate: "Present",
        description: [
          "Led a team of 5 engineers to rebuild the core banking ledger system using Node.js and MongoDB.",
          "Implemented robust security protocols including OAuth2 and 2FA, passing 3rd party security audits.",
          "Designed a microservices architecture that handles 500+ transactions per second."
        ]
      },
      {
        id: "exp-2",
        company: "Retail Giant",
        role: "Senior Developer",
        startDate: "2018",
        endDate: "2020",
        description: [
          "Built a customer loyalty dashboard used by 2M+ users.",
          "Optimized database queries reducing reporting load times from minutes to seconds.",
          "Integrated 3rd party logistics APIs for real-time order tracking."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        institution: "University of Manchester",
        degree: "M.Sc. Software Engineering",
        startDate: "2015",
        endDate: "2016"
      },
      {
        id: "edu-2",
        institution: "University of Manchester",
        degree: "B.Sc. Computer Science",
        startDate: "2012",
        endDate: "2015"
      }
    ],
    isSeeded: true,
    createdAt: new Date().toISOString(),
  },
  ...generatedCandidates
];

export const SEEDED_JOBS: JobPosting[] = [
  {
    id: "job-seed-1",
    title: "Founding Engineer",
    companyName: "Stealth Startup",
    description: "We are looking for a founding engineer to build our MVP...",
    skillsRequired: ["React", "Node.js"],
    yearsExperienceMin: 5,
    yearsExperienceMax: 10,
    location: "Remote",
    availabilityType: AvailabilityType.FULL_TIME,
    maxBudget: 200000,
    noticePeriod: "Less than 30 days",
    status: 'OPEN',
    createdAt: new Date().toISOString()
  }
];
