# Client & Talent MVP PRD (No Auth)

## Goals
- Enable clients to discover vetted talent via filtered search and to create/publish job openings with auto-generated JDs, without login.
- Enable talent to submit profiles via resume/LinkedIn upload and core persona fields, without login.

## Scope
- Client web: search/filters, candidate cards with redacted PII, profile preview, call booking redirect (cal.com), job creation form, job dashboard (session/local link) with applicants tab (seeded + real submissions).
- Talent web: intake form with resume/LinkedIn upload, OCR-backed parsing, manual review, submission success.
- Shared: core talent persona schema, backend storage of resumes + parsed persona data.

## Non-Goals
- OAuth/login, payments, contracts, time-tracking, messaging, in-app calls, advanced filters (industries, past employers, language), multi-role access, mobile app.

## User Flows
- Client search: land → set filters (skills, years exp, location/timezone, comp range, role, availability) → results list → profile preview (PII hidden) → "Book a call" → redirect to cal.com.
- Client job creation: open form → enter role/skills/exp/location/comp/availability/description/contact email → generate JD (template-based) → review & publish → job dashboard link (session/local) → applicants tab shows seeded applicants by default; real applicants append when talent applies.
- Talent onboarding: land → upload resume and/or paste LinkedIn URL → OCR/parse extracts persona fields → confirm/edit core fields → answer availability/comp basics → submit profile → success.

## Core Talent Persona (shared)
- Required: role/title, primary skills (multi-select), years of experience, location/timezone, availability (FT/PT/contract, hours/week, earliest start), expected compensation range.
- Derived/optional: summary headline, seniority band, secondary skills/keywords, relocation/remote preference, link to resume, LinkedIn URL.

## Functional Requirements
- Sessionless UX; persist job dashboard link in local storage and show a copy/share link. Capture contact email on job creation.
- Filters: skills (multi-select), years experience (range slider), location/timezone (select), expected comp range (range), role (select), availability (FT/PT/contract, hours per week, start date).
- Search results: paginated cards showing role, skills, years, location/timezone, availability, comp band, short summary, link to resume view; name/contact redacted everywhere.
- Profile preview: richer detail but still redacted; allow viewing/downloading resume; show "Book a call" CTA.
- Call booking: CTA opens modal with context then redirects to provided cal.com link.
- Job creation: required core fields + contact email; JD auto-generation via template; publish marks job "open"; jobs list scoped to session.
- Applicants tab: show seeded applicants (flagged as "seeded") plus real applicants linked to the job; default sort by recency; display source badge.
- Talent intake: upload PDF/DOCX + optional LinkedIn URL; backend OCR/parsing to extract core fields; require manual confirmation before submit; store structured persona.
- Validation: required fields enforced; file size/type checks (PDF/DOCX, e.g., max 5–10MB).

## Data Model (conceptual)
- Talent: id, role, skills[], years_exp, location, timezone, availability{type, hours_per_week, start_date}, comp_range{min,max,currency,period}, summary, seniority, relocation_pref, remote_pref, resume_url, linkedin_url, source (seeded|real), created_at.
- Job: id, role, skills[], years_exp_range, location, timezone, availability, comp_range, description, jd_generated (text), contact_email, status (open|closed), dashboard_token, created_at.
- Applicant: id, job_id, talent_id, status (new|shortlisted|rejected), source (seeded|real), notes?, created_at.

## Applicants: seeded + real
- Seeded dataset displayed by default for each job; source badge "seeded". Real applicants append in same list with source "real".
- Filter chips: source (all/seeded/real), status (new/shortlisted/rejected).
- Minimal actions for MVP: change status, view profile/resume, book call.

## JD Generation
- MVP: template-based generator filling role, skills, experience, location, availability, comp, brief summary. Optional: add a short bullet list of responsibilities/requirements derived from form inputs.
- Stretch: prompt-based refinement (LLM) if time permits.

## Parsing/OCR Pipeline (backend)
- Upload handling: store raw files in object storage (e.g., Supabase Storage/S3). Generate signed URL for resume view.
- Text extraction: PDF via pdf-parse; DOCX via mammoth; images via Tesseract OCR. Fallback to plain OCR for scanned PDFs.
- Field extraction: rule/regex-based heuristics for skills (lookup list), years (date math on employment entries), role/title (top heading), location/timezone (regex + lookup), availability/comp if present.
- Post-processing: dedupe skills, clamp years range, map to canonical skills list.
- Human confirmation step before saving persona.

## Stack/Hosting (recommended)
- Frontend: Next.js (React) for fast prototyping; deploy on Vercel.
- Backend: Next.js API routes or lightweight Node/Express service (or Ruby if preferred) deployed on Render/Fly/Heroku equivalent.
- DB/Object storage: Supabase (Postgres + Storage) for simplicity. Alternative: Firebase/Firestore + Storage.

## UX Notes
- Redaction copy: "Name/contact shared after a call." prominently.
- Empty states for search, jobs, applicants; suggest broadening filters.
- Resume links open in new tab with PDF viewer if available.

## Metrics
- Client: search→profile-view rate; profile-view→call-click rate; job creation completion rate; applicant status updates.
- Talent: resume upload completion; parser confirmation rate; profile submission rate.

## Risks & Mitigations
- Parser accuracy: manual confirmation; allow quick edits to core fields.
- Sessionless persistence: warn users to keep/share dashboard link; optionally email link using contact email later.
- Scheduling drop-off: cal.com link always visible in profile and applicant rows.
