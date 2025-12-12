# Candidate Database Information

## Overview
Generated **420 total candidates** (3 original + 417 new) with realistic, diverse profiles.

## Database Breakdown

### Experience Levels
- **Junior**: ~25% (105 candidates)
- **Mid-level**: ~37.5% (157 candidates)
- **Senior**: ~25% (105 candidates)
- **Lead/Staff**: ~12.5% (53 candidates)

### Roles Distribution
- **Frontend Engineers**: ~20%
- **Backend Engineers**: ~20%
- **Full Stack Engineers**: ~25%
- **Mobile Engineers**: ~10%
- **DevOps/SRE/Cloud**: ~10%
- **Data/ML Engineers**: ~10%
- **Product Managers**: ~5% (21 candidates)

### Geographic Distribution
- **US-based**: ~60% (252 candidates)
  - San Francisco, NYC, Seattle, Austin, Boston, LA, Chicago, Denver, Portland, Atlanta, etc.
- **India-based**: ~40% (168 candidates)
  - Bangalore, Mumbai, Pune, Hyderabad, Delhi, Chennai, Gurgaon, etc.

### Availability Types
- **Full-Time only**: ~60%
- **Contract only**: ~25%
- **Both Full-Time & Contract**: ~15%

### Notice Periods
- **Immediate**: ~15%
- **Less than 15 days**: ~20%
- **Less than 30 days**: ~25%
- **Less than 60 days**: ~20%
- **90 days**: ~10%
- **90+ days**: ~10%

### Compensation Ranges

#### US-based Candidates
- **Junior**: $60k - $90k (current), $75k - $126k (expected)
- **Mid**: $90k - $140k (current), $112k - $196k (expected)
- **Senior**: $140k - $200k (current), $175k - $280k (expected)
- **Lead**: $200k - $300k (current), $250k - $420k (expected)

#### India-based Candidates
- **Junior**: $18k - $27k (current), $22k - $38k (expected)
- **Mid**: $27k - $42k (current), $34k - $59k (expected)
- **Senior**: $42k - $60k (current), $52k - $84k (expected)
- **Lead**: $60k - $90k (current), $75k - $126k (expected)

*Expected compensation is 25-40% higher than current*

### Skills Coverage
Each candidate has 6-10 skills from:
- **Frontend**: React, TypeScript, JavaScript, Next.js, Tailwind CSS, Redux, HTML, CSS
- **Backend**: Node.js, Python, PostgreSQL, MongoDB, Redis, Express.js, REST APIs, GraphQL
- **Mobile**: React Native, Swift, Kotlin, iOS, Android, Flutter
- **DevOps**: AWS, Docker, Kubernetes, Terraform, CI/CD, Jenkins, Linux
- **Data/ML**: Python, SQL, Machine Learning, TensorFlow, PyTorch, Data Science
- **PM**: Product Management, Agile, Scrum, Roadmapping, User Research, Analytics

### Work Experience
- **1-2 experiences**: Junior candidates
- **2-3 experiences**: Mid-level candidates
- **3-4 experiences**: Senior candidates
- **4-5 experiences**: Lead candidates

Each experience includes:
- Company name (mix of real tech companies like Google, Meta, Amazon and fictional ones)
- Role title matching seniority
- Start/end dates (most recent marked as "Present")
- 2-4 bullet points describing responsibilities and achievements

### Education
- **1-3 degrees** per candidate
- Mix of B.S./B.Tech and M.S./M.Tech degrees
- Universities include: Stanford, MIT, UC Berkeley, IITs, NITs, and other top institutions
- Degrees in Computer Science, Software Engineering, Information Technology, etc.

### Contact Information
All candidates have realistic:
- **Email**: `firstname.lastname@domain.com` format
- **Phone**: US format `+1 XXX-XXX-XXXX` or India format `+91 XXXXX XXXXX`
- **LinkedIn**: `linkedin.com/in/firstname-lastname-XXXXXX` format

## Data Storage
- All candidates stored in `SEEDED_TALENT` array in `/constants.ts`
- Generator utility in `/utils/generateCandidates.ts`
- Can regenerate with different parameters if needed

## Usage
The candidates are automatically loaded when the app starts and are available for:
- Talent search and filtering
- Job matching
- Profile viewing
- Resume display

## Notes
- All data is fictional and generated programmatically
- Contact information is realistic-looking but not real
- Company names are a mix of real tech companies and fictional ones
- Candidates are marked as `isSeeded: true` to distinguish from user-created profiles
