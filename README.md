# HIREDEYGO — Skill-First Recruitment Platform (MVP)

A modern **skill-first** job board and recruitment platform that shifts hiring from CV-based screening to **ability-based assessment** — inspired by Jobberman, Indeed, and LinkedIn, but built different.

> **From high application volume to focused shortlists.**

---

## Table of Contents

- [Platform Philosophy](#platform-philosophy)
- [Overview](#overview)
- [Key Advantages](#key-advantages)
- [Recruiter Flow](#recruiter-flow)
- [Candidate Flow](#candidate-flow)
- [MVP Features](#mvp-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Agile Workflow (Scrum)](#agile-workflow-scrum)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Platform Philosophy

**HIREDEYGO** is a skill-first recruitment platform designed to:

- **Filter candidates** through short, targeted skill assessments.
- **Generate job-fit scores** based on assessment performance and profile matching.
- **Rank applicants automatically** so recruiters see the best candidates first.
- **Provide dashboards** for both recruiters and candidates with real-time insights.

It shifts hiring from CV-based to **ability-based screening** — reducing bias, saving time, and improving hiring accuracy.

---

## Overview

**HIREDEYGO** is a backend API for a skill-assessment-driven job board that enables:

- **Recruiters / Employers** to post jobs with required skills, attach assessments, review ranked candidates, and schedule interviews — all from a single dashboard.
- **Candidates / Job Seekers** to search jobs, complete skill assessments, receive scores and feedback, upload resumes (with automatic parsing), and track application status in real time.
- **Admins** to moderate listings, manage users, oversee assessments, and monitor platform analytics.

---

## Key Advantages

| Advantage | Description |
| --------- | ----------- |
| **Skill-based filtering** | Candidates are assessed before interviews — not just screened by CV |
| **Transparent job-fit scoring** | Both recruiters and candidates see how well skills match the role |
| **Reduced manual screening time** | Automatic ranking means recruiters focus only on top candidates |
| **Improved hiring accuracy** | Data-driven scores replace gut-feeling shortlisting |
| **Structured candidate feedback** | Candidates receive score breakdowns and actionable improvement tips |
| **Automatic CV parsing & ranking** | Resumes are parsed to extract skills, experience — then ranked by fit |

---

## Recruiter Flow
```
Post Job & Select Required Skills
    │
    ▼
Candidates Complete Short Assessments
    │
    ▼
Platform Generates Job-Fit Scores
    │
    ▼
Top Candidates Are Ranked Automatically
    │
    ▼
Recruiter Reviews Ranked Shortlist
    │
    ▼
Interviews Scheduled Through Dashboard
```

---

## Candidate Flow
```
Search & Apply to Jobs
    │
    ▼
Complete Skill Assessment
    │
    ▼
Receive Score & Feedback
    │
    ▼
Track Application Status
    │
    ▼
Get Shortlisted / Interview Invite
```

---

## MVP Features

### Authentication & Authorization
- [x] User registration (Candidate / Recruiter)
- [x] Email verification via OTP (sent via Resend)
- [x] Resend OTP
- [x] Login with JWT (access + refresh tokens)
- [x] Logout (invalidates refresh token)
- [x] Password reset (forgot/reset flow)
- [x] Role-based access control (Candidate, Recruiter, Admin)

### Candidate
- [x] Create and update profile (bio, skills, experience, education)
- [x] Search and filter job listings (keyword, location, category, job type)
- [x] Apply to jobs with cover letter
- [x] Complete skill assessments as part of application
- [x] Receive job-fit score and feedback after assessment
- [x] Track application status (Applied → Assessed → Shortlisted → Interview → Hired / Rejected)
- [ ] Save/bookmark jobs *(planned)*
- [ ] Upload resume (PDF) with automatic CV parsing *(planned)*

### Recruiter / Employer
- [x] Post, edit, and close job listings
- [x] Select required skills per job posting
- [x] Create / attach skill assessments to jobs
- [x] View all applications for a specific job
- [x] View auto-ranked candidate list sorted by job-fit score
- [x] Update application status
- [x] Get my posted jobs
- [ ] Create and manage company profile *(planned)*
- [ ] Schedule interviews through the dashboard *(planned)*

### Assessments & Scoring
- [x] Short skill assessments (MCQ)
- [x] Timed assessment sessions
- [x] Auto-grading engine
- [x] Job-fit score calculation (assessment score + skill match + CV relevance)
- [x] Candidate ranking per job (sorted by composite score)
- [x] Score breakdown and feedback for candidates

### Job Listings
- [x] Title, description, requirements, salary range, location
- [x] Job type (Full-time, Part-time, Contract, Internship)
- [x] Required skills (tags linked to assessments)
- [x] Pagination, sorting, and filtering
- [x] Close job posting

### Admin
- [x] Dashboard stats (total users, jobs, applications)
- [x] List all users
- [x] Suspend/ban users
- [x] Delete users
- [x] Delete job postings
- [x] Recruiter analytics
- [x] Candidate analytics
- [x] Platform analytics
- [x] Admin notifications

### Notifications
- [x] Get latest notifications
- [x] Mark single notification as read
- [x] Mark all notifications as read
- [x] Delete a notification
- [x] Notify admin on new recruiter registration
- [x] Notify admin on new candidate registration
- [x] Notify recruiter on new application
- [x] Notify candidate on application status update
- [x] Notify all candidates when a new job is posted (bulk)
- [x] Notify all candidates when a job is closed (bulk)

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Runtime** | Node.js >= 20 |
| **Framework** | Express.js |
| **Language** | JavaScript (ES6+) |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Email** | Resend |
| **Validation** | Zod |
| **Docs** | Swagger (swagger-jsdoc + swagger-ui-express) |
| **Testing** | Node.js built-in test runner + Supertest |
| **Deployment** | Render |
| **CI/CD** | GitHub Actions |

---

## Architecture
```
Client (Web / Mobile)
    │
    ▼
   API Gateway (Express.js)
    │
    ├── Auth Module ─────────── Registration, Login, Logout, JWT, OTP, Password Reset
    ├── Profile Module ──────── Profile CRUD
    ├── Job Module ──────────── Job CRUD, Search, Filters, Required Skills
    ├── Assessment Module ───── Create Assessments, Manage Questions, Submit, Grade
    ├── Scoring Module ──────── Auto-Grading, Job-Fit Score, Ranking
    ├── Application Module ──── Apply, Track Status, Update Status
    ├── Notification Module ─── Create, Read, Delete, Mark as Read
    └── Admin Module ────────── Moderation, Analytics, User Management
          │
          ▼
       MongoDB (Mongoose ODM)
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/api/v1/auth/register` | Register a new user | Public |
| POST | `/api/v1/auth/login` | Login & get tokens | Public |
| POST | `/api/v1/auth/logout` | Logout & invalidate token | Auth |
| POST | `/api/v1/auth/refresh` | Refresh access token | Public |
| POST | `/api/v1/auth/verify-email` | Verify email with OTP | Public |
| POST | `/api/v1/auth/resend-otp` | Resend OTP | Public |
| POST | `/api/v1/auth/forgot-password` | Request password reset | Public |
| POST | `/api/v1/auth/reset-password` | Reset password | Public |

### Jobs
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/v1/jobs` | List/search jobs (paginated) | Public |
| GET | `/api/v1/jobs/my-jobs` | Get my posted jobs | Recruiter |
| GET | `/api/v1/jobs/:id` | Get job details | Public |
| POST | `/api/v1/jobs` | Create a job posting | Recruiter |
| PATCH | `/api/v1/jobs/:id` | Update a job posting | Recruiter |
| DELETE | `/api/v1/jobs/:id` | Delete a job posting | Recruiter |
| PATCH | `/api/v1/jobs/:id/close` | Close a job listing | Recruiter |

### Assessments
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/api/v1/assessments` | Create an assessment | Recruiter |
| PATCH | `/api/v1/assessments/:id` | Update an assessment | Recruiter |
| DELETE | `/api/v1/assessments/:id` | Delete an assessment | Recruiter |
| POST | `/api/v1/jobs/:jobId/assessments/:assessmentId` | Attach assessment to job | Recruiter |
| GET | `/api/v1/jobs/:jobId/assessment` | Get assessment for a job | Auth |
| POST | `/api/v1/assessments/:assessmentId/submit` | Submit assessment answers | Candidate |
| GET | `/api/v1/assessments/:id/result` | Get assessment result | Candidate |

### Applications
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/api/v1/applications` | Apply to a job | Candidate |
| GET | `/api/v1/applications` | Get my applications | Candidate |
| GET | `/api/v1/applications/job/:jobId` | Get all applications for a job | Recruiter |
| GET | `/api/v1/applications/:id` | Get single application | Candidate |
| PUT | `/api/v1/applications/:id` | Update application | Candidate |
| DELETE | `/api/v1/applications/:id` | Delete application | Candidate |
| PATCH | `/api/v1/applications/:id/status` | Update application status | Recruiter |

### Scoring & Ranking
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/v1/jobs/:jobId/rankings` | Get ranked candidates for a job | Recruiter |
| GET | `/api/v1/applications/:applicationId/score` | Get job-fit score breakdown | Auth |

### Profile
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/v1/profile` | Get my profile | Auth |
| PUT | `/api/v1/profile` | Update my profile | Auth |

### Admin
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/v1/admin/dashboard` | Platform stats & analytics | Admin |
| GET | `/api/v1/admin/users` | List all users | Admin |
| GET | `/api/v1/admin/recruiters` | Recruiter analytics | Admin |
| GET | `/api/v1/admin/candidates` | Candidate analytics | Admin |
| GET | `/api/v1/admin/analytics` | Platform analytics | Admin |
| GET | `/api/v1/admin/notifications` | Get admin notifications | Admin |
| PATCH | `/api/v1/admin/users/:id/suspend` | Suspend a user | Admin |
| DELETE | `/api/v1/admin/users/:id` | Delete a user | Admin |
| DELETE | `/api/v1/admin/jobs/:id` | Delete a job posting | Admin |

### Notifications
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/v1/notifications` | Get latest notifications | Auth |
| PATCH | `/api/v1/notifications/read-all` | Mark all as read | Auth |
| PATCH | `/api/v1/notifications/:id/read` | Mark single as read | Auth |
| DELETE | `/api/v1/notifications/:id` | Delete a notification | Auth |

---

## Database Schema

### Core Models (MongoDB / Mongoose)
```
User
├── _id (ObjectId)
├── firstName, lastName
├── email (unique, indexed)
├── password (hashed, bcrypt)
├── role (CANDIDATE | RECRUITER | ADMIN)
├── isVerified (boolean)
├── otp (hashed, select: false)
├── otpExpires (Date, select: false)
├── otpAttempts (Number, select: false)
├── passwordResetToken (hashed, select: false)
├── passwordResetExpires (Date, select: false)
├── refreshToken (select: false)
├── loginAttempts (select: false)
├── lockUntil (select: false)
├── isBanned (boolean)
├── createdAt / updatedAt

Profile (1:1 → User)
├── userId (ObjectId, ref: User)
├── bio, phone, location
├── skills (string[])
├── experience (array)
├── education (array)
├── resumeUrl, avatarUrl
├── parsedResume (object)

Job (N:1 → Company)
├── companyId (ObjectId, ref: Company)
├── postedBy (ObjectId, ref: User)
├── title, description, requirements
├── requiredSkills (string[])
├── type (FULL_TIME | PART_TIME | CONTRACT | INTERNSHIP)
├── status (DRAFT | ACTIVE | CLOSED)
├── location, salary, deadline
├── createdAt / updatedAt

Assessment
├── createdBy (ObjectId, ref: User)
├── title, description
├── skills (string[])
├── questions (array — MCQ with points)
├── timeLimit, totalPoints
├── createdAt / updatedAt

AssessmentResult
├── assessmentId, userId, jobId
├── answers (array)
├── score, maxScore, feedback
├── timeTaken, completedAt

Application
├── jobId, userId
├── coverLetter, resumeUrl
├── assessmentResultId
├── jobFitScore, scoreBreakdown
├── rank, status
├── interviewDate, interviewNotes
├── appliedAt

Notification
├── type (string)
├── message (string)
├── userId (ObjectId, ref: User — null for global/admin)
├── isRead (boolean)
├── createdAt / updatedAt
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB >= 5.0
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/thanks299/hire-dey-go-be.git
cd hire-dey-go-be

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

The server will start at `http://localhost:5000`.

### API Docs

Once running, visit `http://localhost:5000/api-docs` for the Swagger UI.

---

## Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hiredeygo

# JWT
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev

# Client URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

---

## Project Structure
```
hire-dey-go-be/
│
├── src/
│   ├── config/
│   │   ├── db.js                        # MongoDB connection
│   │   └── env.js                       # Environment variable loader
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── profile.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   ├── assessment.model.js
│   │   ├── assessmentResult.model.js
│   │   ├── application.model.js
│   │   └── notification.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   ├── job/
│   │   │   ├── jobs.route.js
│   │   │   └── jobs.controller.js
│   │   ├── assessment/
│   │   │   ├── assessment.route.js
│   │   │   └── assessment.controller.js
│   │   ├── scoring/
│   │   │   ├── scoring.routes.js
│   │   │   ├── scoring.controller.js
│   │   │   ├── scoring.service.js
│   │   │   └── scoring.helpers.js
│   │   ├── applications/
│   │   │   ├── application.routes.js
│   │   │   └── application.controller.js
│   │   ├── profile/
│   │   │   ├── profile.routes.js
│   │   │   └── profile.controller.js
│   │   ├── admin/
│   │   │   ├── admin.routes.js
│   │   │   ├── admin.controller.js
│   │   │   └── admin.service.js
│   │   └── notification/
│   │       ├── notification.routes.js
│   │       ├── notification.controller.js
│   │       ├── notification.service.js
│   │       └── notification.templates.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimiter.middleware.js
│   │
│   ├── utils/
│   │   ├── mailer.js                    # Resend email integration
│   │   └── asyncHandler.js
│   │
│   ├── swagger.js
│   └── app.js
│
├── tests/
│   ├── unit/
│   │   ├── auth.unit.test.js
│   │   ├── job.unit.test.js
│   │   ├── scoring.unit.test.js
│   │   └── scoring.helper.unit.test.js
│   └── integration/
│       ├── auth.integration.test.js
│       ├── job.integration.test.js
│       ├── application.integration.test.js
│       ├── notification.integration.test.js
│       ├── scoring.integration.test.js
│       └── scoring-robustness.integration.test.js
│
├── .env.example
├── .env
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json
└── README.md
```

---

## Agile Workflow (Scrum)

### Sprint Progress

| Sprint | Goal | Status |
| ------ | ---- | ------ |
| Sprint 1 | Project Setup & Auth | ✅ Done |
| Sprint 2 | Jobs Module | ✅ Done |
| Sprint 3 | Assessments Engine | ✅ Done |
| Sprint 4 | Scoring & Ranking | ✅ Done |
| Sprint 5 | Applications & Status | ✅ Done |
| Sprint 6 | Admin & Notifications | ✅ Done |
| Sprint 7 | Testing & Docs | 🔄 In Progress |
| Sprint 8 | Company & Bookmarks | 🔲 Planned |
| Sprint 9 | CV Parsing & Deploy | 🔲 Planned |

---

## Roadmap

### Phase 2 — Post-MVP
- [ ] Job alerts (email digest for matching jobs)
- [ ] Social login (Google, LinkedIn OAuth)
- [ ] Advanced candidate search with skill/score filters
- [ ] Analytics dashboard for recruiters

### Phase 3 — Scale
- [ ] AI-powered job recommendations
- [ ] AI-enhanced resume parsing (NLP-based skill extraction)
- [ ] Full ATS (Applicant Tracking System) features
- [ ] Video interview integration
- [ ] Redis caching layer
- [ ] Multi-language support (i18n)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

> **HIREDEYGO** — _Skills speak louder than CVs. Find your next opportunity. Hire your next star._