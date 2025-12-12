import { TalentProfile, AvailabilityType } from '../types';

// Seed data for generating realistic candidates
const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  "Priya", "Raj", "Amit", "Anjali", "Vikram", "Neha", "Arjun", "Pooja", "Rohan", "Sneha",
  "Wei", "Yuki", "Carlos", "Maria", "Ahmed", "Fatima", "Lucas", "Emma", "Noah", "Olivia",
  "Liam", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "Logan", "Mia", "Alexander", "Charlotte"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Patel", "Kumar", "Singh", "Sharma", "Gupta", "Reddy", "Rao", "Mehta", "Joshi", "Iyer",
  "Chen", "Wang", "Li", "Zhang", "Liu", "Yang", "Huang", "Zhao", "Wu", "Zhou",
  "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
  "Clark", "Lewis", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Lopez", "Hill"
];

const TECH_ROLES = [
  "Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Software Engineer",
  "Senior Frontend Developer", "Senior Backend Developer", "Senior Full Stack Developer",
  "Lead Software Engineer", "Staff Engineer", "Principal Engineer",
  "DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer", "Platform Engineer",
  "Mobile Engineer", "iOS Developer", "Android Developer", "React Native Developer",
  "Data Engineer", "ML Engineer", "AI Engineer", "Data Scientist",
  "Engineering Manager", "Technical Lead", "Solutions Architect", "Software Architect"
];

const PM_ROLES = [
  "Product Manager", "Senior Product Manager", "Lead Product Manager",
  "Technical Product Manager", "Product Owner", "Associate Product Manager"
];

const TECH_COMPANIES = [
  "Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Uber", "Airbnb",
  "Stripe", "Shopify", "Salesforce", "Oracle", "Adobe", "IBM", "Intel", "Cisco",
  "Twitter", "LinkedIn", "Snap", "Pinterest", "Dropbox", "Slack", "Zoom", "DocuSign",
  "Atlassian", "GitHub", "GitLab", "MongoDB", "Redis Labs", "Databricks", "Snowflake",
  "Coinbase", "Robinhood", "Square", "PayPal", "Intuit", "ServiceNow", "Workday"
];

const FICTIONAL_COMPANIES = [
  "TechFlow Inc", "DataStream Corp", "CloudNine Systems", "NexGen Solutions", "ByteCraft Labs",
  "CodeForge Technologies", "InnovateSphere", "DigitalWave Co", "Quantum Dynamics", "FusionTech",
  "Velocity Software", "Apex Innovations", "Horizon Technologies", "Stellar Systems", "Prism Digital",
  "Catalyst Labs", "Momentum Tech", "Vertex Solutions", "Zenith Software", "Pulse Technologies",
  "Nexus Engineering", "Orbit Systems", "Spark Innovations", "Titan Tech", "Vortex Solutions"
];

const US_LOCATIONS = [
  "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA",
  "Los Angeles, CA", "Chicago, IL", "Denver, CO", "Portland, OR", "Atlanta, GA",
  "Remote (US)", "San Diego, CA", "Phoenix, AZ", "Dallas, TX", "Miami, FL"
];

const INDIA_LOCATIONS = [
  "Bangalore, India", "Mumbai, India", "Pune, India", "Hyderabad, India", "Delhi, India",
  "Chennai, India", "Gurgaon, India", "Noida, India", "Kolkata, India", "Remote (India)"
];

const SKILL_SETS = {
  frontend: ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "Redux", "HTML", "CSS"],
  backend: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "Express.js", "REST APIs", "GraphQL"],
  fullstack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "Git"],
  mobile: ["React Native", "Swift", "Kotlin", "iOS", "Android", "Flutter", "Mobile UI/UX"],
  devops: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins", "Linux", "Python"],
  data: ["Python", "SQL", "Machine Learning", "TensorFlow", "PyTorch", "Data Science", "Pandas", "NumPy"],
  pm: ["Product Management", "Agile", "Scrum", "Roadmapping", "User Research", "Analytics", "SQL"]
};

const UNIVERSITIES = [
  "Stanford University", "MIT", "UC Berkeley", "Carnegie Mellon University", "Georgia Tech",
  "University of Washington", "UT Austin", "University of Illinois", "Cornell University",
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "BITS Pilani", "NIT Trichy",
  "University of Michigan", "Purdue University", "UCLA", "USC", "NYU"
];

const DEGREES = [
  "B.S. Computer Science", "B.Tech Computer Engineering", "M.S. Computer Science",
  "B.S. Software Engineering", "B.E. Information Technology", "M.Tech Software Systems",
  "B.S. Electrical Engineering", "MBA", "B.S. Data Science"
];

// Helper functions
const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "email.com", "protonmail.com"];
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomInt(1, 999)}`
  ];
  return `${random(formats)}@${random(domains)}`;
};

const generatePhone = (isIndia: boolean): string => {
  if (isIndia) {
    return `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`;
  }
  return `+1 ${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`;
};

const generateLinkedIn = (firstName: string, lastName: string): string => {
  const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100000, 999999)}`;
  return `https://www.linkedin.com/in/${slug}`;
};

const calculateYearsFromExperiences = (experiences: any[]): number => {
  if (experiences.length === 0) return 0;
  
  const startYear = parseInt(experiences[experiences.length - 1].startDate);
  const lastExp = experiences[0];
  const endYear = lastExp.endDate === "Present" ? new Date().getFullYear() : parseInt(lastExp.endDate);
  
  return endYear - startYear;
};

const generateExperience = (level: string, role: string, isPM: boolean) => {
  const numExperiences = level === "junior" ? randomInt(1, 2) : 
                         level === "mid" ? randomInt(2, 3) :
                         level === "senior" ? randomInt(3, 4) : randomInt(4, 5);
  
  const experiences = [];
  const currentYear = new Date().getFullYear();
  let year = currentYear;
  
  const allCompanies = [...TECH_COMPANIES, ...FICTIONAL_COMPANIES];
  
  for (let i = 0; i < numExperiences; i++) {
    const isPresent = i === 0;
    const duration = randomInt(1, 4);
    const startYear = isPresent ? year - duration : year - duration;
    const endYear = isPresent ? "Present" : year;
    
    const company = random(allCompanies);
    const seniority = i === 0 ? level : (i === 1 ? (level === "lead" ? "senior" : level) : "mid");
    
    let expRole = role;
    if (seniority === "junior") expRole = role.replace(/Senior |Lead |Staff |Principal /g, "");
    if (seniority === "mid" && !role.includes("Senior")) expRole = role;
    if (seniority === "senior" && !role.includes("Senior")) expRole = `Senior ${role}`;
    
    const descriptions = isPM ? [
      `Led product strategy for ${random(["mobile app", "web platform", "API product", "B2B SaaS"])} serving ${randomInt(100, 5000)}K+ users`,
      `Defined and executed product roadmap, resulting in ${randomInt(20, 80)}% increase in user engagement`,
      `Collaborated with engineering, design, and stakeholders to ship ${randomInt(5, 20)} major features`,
      `Conducted user research and A/B testing to validate product hypotheses and improve KPIs`
    ] : [
      `Developed and maintained ${random(["microservices", "web applications", "mobile apps", "APIs"])} using ${random(["React", "Node.js", "Python", "Java", "Go"])}`,
      `Improved system performance by ${randomInt(20, 70)}% through optimization and refactoring`,
      `Led technical design and implementation of ${randomInt(3, 15)} major features`,
      `Mentored ${randomInt(2, 5)} junior developers and conducted code reviews`,
      `Implemented CI/CD pipelines reducing deployment time by ${randomInt(30, 60)}%`,
      `Collaborated with cross-functional teams to deliver projects on time`
    ];
    
    experiences.push({
      id: `exp-${i}`,
      company,
      role: expRole,
      startDate: startYear.toString(),
      endDate: endYear.toString(),
      description: descriptions.slice(0, randomInt(2, 4))
    });
    
    year = startYear - 1;
  }
  
  return experiences;
};

const generateEducation = () => {
  const numDegrees = randomInt(1, 3);
  const education = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < numDegrees; i++) {
    const isMasters = i === 0 && Math.random() > 0.7;
    const degree = isMasters ? "M.S. Computer Science" : random(DEGREES);
    const endYear = currentYear - randomInt(2, 15);
    const duration = degree.startsWith("M.") ? 2 : 4;
    
    education.push({
      id: `edu-${i}`,
      institution: random(UNIVERSITIES),
      degree,
      startDate: (endYear - duration).toString(),
      endDate: endYear.toString()
    });
  }
  
  return education;
};

const generateSummary = (role: string, skills: string[], yearsExp: number): string => {
  const summaries = [
    `Experienced ${role.toLowerCase()} with ${yearsExp} years building scalable applications. Passionate about clean code, best practices, and delivering high-quality software.`,
    `${yearsExp}+ year ${role.toLowerCase()} specializing in ${skills.slice(0, 3).join(", ")}. Proven track record of delivering complex projects and mentoring teams.`,
    `Results-driven ${role.toLowerCase()} with expertise in ${skills.slice(0, 3).join(", ")}. Strong problem-solver with ${yearsExp} years of experience in fast-paced environments.`,
    `Passionate ${role.toLowerCase()} with ${yearsExp} years of experience. Skilled in ${skills.slice(0, 3).join(", ")} and committed to writing maintainable, efficient code.`
  ];
  return random(summaries);
};

// Main candidate generator
export const generateCandidate = (id: number, level?: string, isPM?: boolean): TalentProfile => {
  const candidateLevel = level || random(["junior", "junior", "mid", "mid", "mid", "senior", "senior", "lead"]);
  const isProductManager = isPM ?? (Math.random() < 0.05); // 5% PM
  
  const firstName = random(FIRST_NAMES);
  const lastName = random(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  
  const isIndia = Math.random() < 0.4; // 40% India, 60% US
  const location = isIndia ? random(INDIA_LOCATIONS) : random(US_LOCATIONS);
  
  const role = isProductManager ? random(PM_ROLES) : random(TECH_ROLES);
  
  // Determine skill set based on role
  let skillSet: string[];
  if (isProductManager) {
    skillSet = [...SKILL_SETS.pm];
  } else if (role.includes("Frontend") || role.includes("React")) {
    skillSet = [...SKILL_SETS.frontend];
  } else if (role.includes("Backend")) {
    skillSet = [...SKILL_SETS.backend];
  } else if (role.includes("Full Stack")) {
    skillSet = [...SKILL_SETS.fullstack];
  } else if (role.includes("Mobile") || role.includes("iOS") || role.includes("Android")) {
    skillSet = [...SKILL_SETS.mobile];
  } else if (role.includes("DevOps") || role.includes("SRE") || role.includes("Cloud")) {
    skillSet = [...SKILL_SETS.devops];
  } else if (role.includes("Data") || role.includes("ML") || role.includes("AI")) {
    skillSet = [...SKILL_SETS.data];
  } else {
    skillSet = [...SKILL_SETS.fullstack];
  }
  
  // Add some random additional skills
  const additionalSkills = ["Git", "Agile", "REST APIs", "Microservices", "Testing"];
  skillSet.push(...additionalSkills.filter(() => Math.random() > 0.5).slice(0, 2));
  
  const skills = skillSet.slice(0, Math.min(10, randomInt(6, 10)));
  
  const experience = generateExperience(candidateLevel, role, isProductManager);
  const yearsExperience = calculateYearsFromExperiences(experience);
  const education = generateEducation();
  
  // Compensation based on level and location
  const baseMultiplier = isIndia ? 0.3 : 1.0;
  let baseSalary: number;
  
  if (candidateLevel === "junior") baseSalary = randomInt(60000, 90000) * baseMultiplier;
  else if (candidateLevel === "mid") baseSalary = randomInt(90000, 140000) * baseMultiplier;
  else if (candidateLevel === "senior") baseSalary = randomInt(140000, 200000) * baseMultiplier;
  else baseSalary = randomInt(200000, 300000) * baseMultiplier;
  
  const currentSalary = Math.round(baseSalary);
  const salaryExpectation = Math.round(currentSalary * randomFloat(1.25, 1.40));
  
  const currentHourlyRate = Math.round(currentSalary / 2080);
  const hourlyRate = Math.round(currentHourlyRate * randomFloat(1.25, 1.40));
  
  // Availability
  const availabilityRand = Math.random();
  let availabilityTypes: AvailabilityType[];
  if (availabilityRand < 0.6) {
    availabilityTypes = [AvailabilityType.FULL_TIME];
  } else if (availabilityRand < 0.85) {
    availabilityTypes = [AvailabilityType.CONTRACT];
  } else {
    availabilityTypes = [AvailabilityType.FULL_TIME, AvailabilityType.CONTRACT];
  }
  
  // Notice period - mostly under 60 days
  const noticePeriodRand = Math.random();
  let noticePeriod: string;
  if (noticePeriodRand < 0.15) noticePeriod = "Immediate";
  else if (noticePeriodRand < 0.35) noticePeriod = "Less than 15 days";
  else if (noticePeriodRand < 0.60) noticePeriod = "Less than 30 days";
  else if (noticePeriodRand < 0.80) noticePeriod = "Less than 60 days";
  else if (noticePeriodRand < 0.90) noticePeriod = "90 days";
  else noticePeriod = "90+ days";
  
  const summary = generateSummary(role, skills, yearsExperience);
  
  return {
    id: `talent-gen-${id}`,
    fullName,
    role,
    skills,
    yearsExperience,
    location,
    timezone: isIndia ? "IST" : "PST",
    availabilityTypes,
    salaryExpectation,
    currentSalary,
    hourlyRate,
    currentHourlyRate,
    noticePeriod,
    summary,
    email: generateEmail(firstName, lastName),
    phone: generatePhone(isIndia),
    linkedinUrl: generateLinkedIn(firstName, lastName),
    experience,
    education,
    isSeeded: true,
    createdAt: new Date(Date.now() - randomInt(1, 365) * 24 * 60 * 60 * 1000).toISOString()
  };
};

// Generate batch of candidates
export const generateCandidateBatch = (count: number): TalentProfile[] => {
  const candidates: TalentProfile[] = [];
  
  // Ensure we have some PMs (about 5%)
  const pmCount = Math.floor(count * 0.05);
  
  for (let i = 0; i < count; i++) {
    const isPM = i < pmCount;
    candidates.push(generateCandidate(i + 1, undefined, isPM));
  }
  
  return candidates;
};
