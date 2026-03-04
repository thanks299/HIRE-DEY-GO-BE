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

| Advantage                              | Description                                                             |
| -------------------------------------- | ----------------------------------------------------------------------- |
| **Skill-based filtering**              | Candidates are assessed before interviews — not just screened by CV     |
| **Transparent job-fit scoring**        | Both recruiters and candidates see how well skills match the role       |
| **Reduced manual screening time**      | Automatic ranking means recruiters focus only on top candidates         |
| **Improved hiring accuracy**           | Data-driven scores replace gut-feeling shortlisting                     |
| **Structured candidate feedback**      | Candidates receive score breakdowns and actionable improvement tips     |
| **Automatic CV parsing & ranking**     | Resumes are parsed to extract skills, experience — then ranked by fit   |

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

**Step-by-step:**

1. **Post a job** — define title, description, requirements, and select the required skills for the role.
2. **Attach assessments** — choose or create short skill assessments (MCQ, coding, situational) tied to the job.
3. **Candidates apply & assess** — applicants complete the assessments as part of the application.
4. **Scores generated** — the platform calculates a job-fit score per candidate (assessment results + CV match + skill overlap).
5. **Ranked shortlist** — candidates are auto-sorted by score. Recruiter sees top talent first.
6. **Schedule interviews** — shortlisted candidates are invited to interview directly from the dashboard.

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

**Step-by-step:**

1. **Apply** — browse jobs, filter by category/location/type, and submit an application.
2. **Complete assessment** — take a short skill assessment tied to the job (timed, auto-graded).
3. **Receive score & feedback** — get a job-fit score breakdown and tips on where to improve.
4. **Track status** — follow application progress: Applied → Assessed → Shortlisted → Interview → Hired/Rejected.
5. **Dashboard** — view all applications, scores, saved jobs, and profile completeness from one place.

---

## MVP Features

### Authentication & Authorization
- [x] User registration (Candidate / Recruiter)
- [x] Email verification (OTP or magic link)
- [x] Login with JWT (access + refresh tokens)
- [x] Password reset (forgot/reset flow)
- [x] Role-based access control (Candidate, Recruiter, Admin)

### Candidate
- [x] Create and update profile (bio, skills, experience, education)
- [x] Upload resume (PDF) with **automatic CV parsing**
- [x] Search and filter job listings (keyword, location, category, job type)
- [x] Apply to jobs with cover letter
- [x] **Complete skill assessments** as part of application
- [x] **Receive job-fit score and feedback** after assessment
- [x] Track application status (Applied → Assessed → Shortlisted → Interview → Hired / Rejected)
- [x] Save/bookmark jobs
- [x] Candidate dashboard (applications, scores, saved jobs, profile completeness)

### Recruiter / Employer
- [x] Create and manage company profile (logo, description, website)
- [x] Post, edit, and close job listings
- [x] **Select required skills per job posting**
- [x] **Create / attach skill assessments to jobs** (MCQ, short answer)
- [x] View and manage received applications
- [x] **View auto-ranked candidate list** sorted by job-fit score
- [x] Update application status
- [x] **Schedule interviews** through the dashboard
- [x] Search candidates (basic filter by skills, score)
- [x] Recruiter dashboard (active jobs, applications, top candidates, basic analytics)

### Assessments & Scoring
- [x] Short skill assessments (MCQ, short answer, situational)
- [x] Timed assessment sessions
- [x] Auto-grading engine
- [x] **Job-fit score calculation** (assessment score + skill match + CV relevance)
- [x] Candidate ranking per job (sorted by composite score)
- [x] Score breakdown and feedback for candidates

### CV Parsing & Ranking
- [x] Automatic resume parsing (extract skills, experience, education from PDF)
- [x] Skill matching against job requirements
- [x] CV-based relevance score (feeds into overall job-fit score)

### Job Listings
- [x] Title, description, requirements, salary range, location
- [x] Job type (Full-time, Part-time, Contract, Remote, Internship)
- [x] **Required skills** (tags linked to assessments)
- [x] Category/industry tags
- [x] Application deadline
- [x] Pagination, sorting, and filtering

### Admin
- [x] Dashboard stats (total users, jobs, applications, assessments taken)
- [x] Approve/reject job posts (moderation)
- [x] Ban/suspend users
- [x] Manage categories, tags, and skill library
- [x] Monitor assessment integrity

### Notifications
- [x] Email notifications (application received, assessment invite, score ready, status update, interview scheduled)

### MVP Summary

> **Lean. Functional. Scalable.**
>
> Version 1 includes: Recruiter dashboard, Candidate dashboard, Automatic CV parsing and ranking, Short skill assessments, Job-fit scoring system, Interview scheduling, Basic analytics.

---

## Tech Stack

| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| **Runtime**         | Node.js                                 |
| **Framework**       | Express.js                              |
| **Language**        | JavaScript (ES6+)                       |
| **Database**        | MongoDB                                 |
| **ODM**             | Mongoose                                |
| **Auth**            | JWT (jsonwebtoken) + bcrypt             |
| **File Upload**     | Cloudinary / AWS S3 *(still in thought)*|
| **CV Parsing**      | pdf-parse + custom extraction logic     |
| **Email**           | Nodemailer (SMTP / SendGrid)            |
| **Validation**      | Zod                                     |
| **Docs**            | Swagger (swagger-jsdoc + swagger-ui)    |
| **Testing**         | Jest + Supertest                        |
| **Deployment**      | Docker + Railway / Render               |

---

## Architecture

```
Client (Web / Mobile)
    │
    ▼
   API Gateway (Express.js)
    │
    ├── Auth Module ─────────── Registration, Login, JWT, Password Reset
    ├── User Module ─────────── Profile CRUD, CV Upload & Parsing
    ├── Job Module ──────────── Job CRUD, Search, Filters, Required Skills
    ├── Assessment Module ───── Create Assessments, Manage Questions
    ├── Scoring Module ──────── Auto-Grading, Job-Fit Score, Ranking
    ├── Application Module ──── Apply, Track Status, Interview Scheduling
    ├── Company Module ──────── Company Profiles
    ├── Bookmark Module ─────── Save / Unsave Jobs
    ├── Notification Module ─── Email Triggers (assessment, status, interview)
    └── Admin Module ────────── Moderation, Analytics, Skill Library
          │
          ▼
       MongoDB (Mongoose ODM)
          │
          ▼
     Cloudinary / S3 (File Storage — Resumes, Logos)
```

---

## API Endpoints

### Auth
| Method | Endpoint                           | Description               | Access  |
| ------ | ---------------------------------- | ------------------------- | ------- |
| POST   | `/api/v1/auth/register`            | Register a new user       | Public  |
| POST   | `/api/v1/auth/login`               | Login & get tokens        | Public  |
| POST   | `/api/v1/auth/refresh`             | Refresh access token      | Public  |
| POST   | `/api/v1/auth/verify-email`        | Verify email address      | Public  |
| POST   | `/api/v1/auth/forgot-password`     | Request password reset    | Public  |
| POST   | `/api/v1/auth/reset-password`      | Reset password            | Public  |

### Jobs
| Method | Endpoint                           | Description                  | Access    |
| ------ | ---------------------------------- | ---------------------------- | --------- |
| GET    | `/api/v1/jobs`                     | List/search jobs (paginated) | Public    |
| GET    | `/api/v1/jobs/:id`                 | Get job details              | Public    |
| POST   | `/api/v1/jobs`                     | Create a job posting         | Recruiter |
| PUT    | `/api/v1/jobs/:id`                 | Update a job posting         | Recruiter |
| DELETE | `/api/v1/jobs/:id`                 | Delete a job posting         | Recruiter |
| PATCH  | `/api/v1/jobs/:id/close`           | Close a job listing          | Recruiter |

### Assessments
| Method | Endpoint                                  | Description                          | Access    |
| ------ | ----------------------------------------- | ------------------------------------ | --------- |
| POST   | `/api/v1/assessments`                     | Create an assessment                 | Recruiter |
| GET    | `/api/v1/assessments/:id`                 | Get assessment details               | Auth      |
| PUT    | `/api/v1/assessments/:id`                 | Update an assessment                 | Recruiter |
| DELETE | `/api/v1/assessments/:id`                 | Delete an assessment                 | Recruiter |
| POST   | `/api/v1/jobs/:jobId/assessments/:assessmentId` | Attach assessment to a job    | Recruiter |
| GET    | `/api/v1/jobs/:jobId/assessment`          | Get assessment for a job             | Auth      |
| POST   | `/api/v1/assessments/:id/submit`          | Submit assessment answers            | Candidate |
| GET    | `/api/v1/assessments/:id/result`          | Get my assessment result & feedback  | Candidate |

### Applications
| Method | Endpoint                                  | Description                          | Access    |
| ------ | ----------------------------------------- | ------------------------------------ | --------- |
| POST   | `/api/v1/jobs/:id/apply`                  | Apply to a job                       | Candidate |
| GET    | `/api/v1/applications`                    | Get my applications                  | Candidate |
| GET    | `/api/v1/jobs/:id/applications`           | Get applications for a job (ranked)  | Recruiter |
| PATCH  | `/api/v1/applications/:id/status`         | Update application status            | Recruiter |
| POST   | `/api/v1/applications/:id/schedule-interview` | Schedule an interview            | Recruiter |

### Scoring & Ranking
| Method | Endpoint                                  | Description                          | Access    |
| ------ | ----------------------------------------- | ------------------------------------ | --------- |
| GET    | `/api/v1/jobs/:id/rankings`               | Get ranked candidates for a job      | Recruiter |
| GET    | `/api/v1/applications/:id/score`          | Get job-fit score breakdown          | Auth      |

### Profile
| Method | Endpoint                           | Description                  | Access    |
| ------ | ---------------------------------- | ---------------------------- | --------- |
| GET    | `/api/v1/profile`                  | Get my profile               | Auth      |
| PUT    | `/api/v1/profile`                  | Update my profile            | Auth      |
| POST   | `/api/v1/profile/resume`           | Upload & parse resume (PDF)  | Candidate |
| GET    | `/api/v1/profile/:id`              | View a user's public profile | Public    |

### Company
| Method | Endpoint                           | Description               | Access    |
| ------ | ---------------------------------- | ------------------------- | --------- |
| POST   | `/api/v1/companies`                | Create company profile    | Recruiter |
| GET    | `/api/v1/companies/:id`            | Get company details       | Public    |
| PUT    | `/api/v1/companies/:id`            | Update company profile    | Recruiter |

### Bookmarks
| Method | Endpoint                           | Description           | Access    |
| ------ | ---------------------------------- | --------------------- | --------- |
| POST   | `/api/v1/bookmarks/:jobId`        | Bookmark a job        | Candidate |
| DELETE | `/api/v1/bookmarks/:jobId`        | Remove bookmark       | Candidate |
| GET    | `/api/v1/bookmarks`               | Get saved jobs        | Candidate |

### Admin
| Method | Endpoint                              | Description                   | Access |
| ------ | ------------------------------------- | ----------------------------- | ------ |
| GET    | `/api/v1/admin/dashboard`             | Platform stats & analytics    | Admin  |
| GET    | `/api/v1/admin/users`                 | List all users                | Admin  |
| PATCH  | `/api/v1/admin/users/:id/ban`         | Ban/suspend user              | Admin  |
| PATCH  | `/api/v1/admin/jobs/:id/approve`      | Approve/reject job post       | Admin  |
| GET    | `/api/v1/admin/assessments`           | List all assessments          | Admin  |
| GET    | `/api/v1/admin/skills`                | Manage skill library          | Admin  |

---

## Database Schema

### Core Models (MongoDB / Mongoose)

```
User
├── _id (ObjectId)
├── email (unique)
├── password (hashed)
├── role (CANDIDATE | RECRUITER | ADMIN)
├── isVerified (boolean)
├── createdAt / updatedAt

Profile (1:1 → User)
├── userId (ObjectId, ref: User)
├── firstName, lastName
├── phone, location, bio
├── skills (string[])                  ← extracted from CV or manually entered
├── experience (array of objects)
├── education (array of objects)
├── resumeUrl
├── parsedResume (object)              ← auto-extracted data from CV parsing
├── avatarUrl

Company (1:1 → User/Recruiter)
├── _id (ObjectId)
├── userId (ObjectId, ref: User)
├── name, description
├── website, logoUrl
├── industry, size, location

Job (N:1 → Company)
├── _id (ObjectId)
├── companyId (ObjectId, ref: Company)
├── postedBy (ObjectId, ref: User)
├── title, description, requirements
├── requiredSkills (string[])          ← skills the role demands
├── salaryMin, salaryMax, currency
├── location, isRemote
├── type (FULL_TIME | PART_TIME | CONTRACT | INTERNSHIP)
├── category, tags (string[])
├── assessmentId (ObjectId, ref: Assessment)  ← linked assessment
├── status (DRAFT | ACTIVE | CLOSED)
├── deadline
├── createdAt / updatedAt

Assessment (N:1 → User/Recruiter)
├── _id (ObjectId)
├── createdBy (ObjectId, ref: User)
├── title
├── description
├── skills (string[])                  ← which skills this assesses
├── questions (array of objects)
│   ├── questionText
│   ├── type (MCQ | SHORT_ANSWER | SITUATIONAL)
│   ├── options (string[], for MCQ)
│   ├── correctAnswer
│   └── points
├── timeLimit (minutes)
├── totalPoints
├── createdAt / updatedAt

AssessmentResult (N:1 → Assessment, N:1 → User)
├── _id (ObjectId)
├── assessmentId (ObjectId, ref: Assessment)
├── userId (ObjectId, ref: User)
├── jobId (ObjectId, ref: Job)
├── answers (array of objects)
│   ├── questionId
│   └── answer
├── score (number)
├── maxScore (number)
├── percentage (number)
├── feedback (string)                  ← auto-generated feedback
├── completedAt
├── timeTaken (seconds)

Application (N:1 → Job, N:1 → User)
├── _id (ObjectId)
├── jobId (ObjectId, ref: Job)
├── userId (ObjectId, ref: User)
├── coverLetter
├── resumeUrl
├── assessmentResultId (ObjectId, ref: AssessmentResult)
├── jobFitScore (number)               ← composite score
├── scoreBreakdown (object)
│   ├── assessmentScore (number)
│   ├── skillMatchScore (number)
│   └── cvRelevanceScore (number)
├── rank (number)                      ← position among all applicants
├── status (APPLIED | ASSESSED | SHORTLISTED | INTERVIEW | HIRED | REJECTED)
├── interviewDate (Date)
├── interviewNotes (string)
├── appliedAt

Bookmark (N:N → User ↔ Job)
├── _id (ObjectId)
├── userId (ObjectId, ref: User)
├── jobId (ObjectId, ref: Job)
├── createdAt

Skill (Platform-managed skill library)
├── _id (ObjectId)
├── name (unique)
├── category
├── createdAt
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB >= 5.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/thanks299/hire-dey-go-be.git
cd hire-dey-go-be

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

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
MONGODB_URI=mongodb://localhost:27017/hiredeygo   # (check your .env file)

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Nodemailer / SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="HireDeyGo <noreply@hiredeygo.com>"

# File Upload (Cloudinary — still in contention)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for email links)
CLIENT_URL=http://localhost:3000
```

---

## Project Structure

Full folder structure using **MongoDB (Mongoose)** with a **modular architecture** — each module follows the pattern: `routes → controller → service → model`.

```
hire-dey-go-be/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js                        # MongoDB connection (Mongoose)
│   │   ├── env.js                       # Environment variable loader & validation
│   │   ├── cors.js                      # CORS configuration
│   │   └── swagger.js                   # Swagger/OpenAPI config
│   │
│   ├── models/                          # Mongoose schema(all in one place)
│   │   ├── user.model.js                # User schema
│   │   ├── profile.model.js             # Profile schema (1:1 → User)
│   │   ├── company.model.js             # Company schema (1:1 → Recruiter)
│   │   ├── job.model.js                 # Job schema (N:1 → Company)
│   │   ├── assessment.model.js          # Assessment schema (questions, scoring)
│   │   ├── assessmentResult.model.js    # Assessment results (per candidate per job)
│   │   ├── application.model.js         # Application schema (with jobFitScore)
│   │   ├── bookmark.model.js            # Bookmark schema (User ↔ Job)
│   │   ├── skill.model.js              # Skill library schema
│   │   └── index.js                     # Barrel export for all models
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.js           # POST /register, /login, /refresh, etc.
│   │   │   ├── auth.controller.js       # Request handling
│   │   │   ├── auth.service.js          # Business logic (hash, token, verify)
│   │   │   └── auth.validation.js       # Zod schemas for auth inputs
│   │   │
│   │   ├── user/
│   │   │   ├── user.routes.js           # GET/PUT /profile, POST /resume
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js          # Profile CRUD, CV parsing trigger
│   │   │   └── user.validation.js
│   │   │
│   │   ├── job/
│   │   │   ├── job.routes.js            # CRUD /jobs, attach skills & assessments
│   │   │   ├── job.controller.js
│   │   │   ├── job.service.js           # Job CRUD, search, filters
│   │   │   └── job.validation.js
│   │   │
│   │   ├── assessment/
│   │   │   ├── assessment.routes.js     # CRUD /assessments, POST /submit
│   │   │   ├── assessment.controller.js
│   │   │   ├── assessment.service.js    # Create, attach to job, grade answers
│   │   │   └── assessment.validation.js
│   │   │
│   │   ├── scoring/
│   │   │   ├── scoring.routes.js        # GET /rankings, GET /score
│   │   │   ├── scoring.controller.js
│   │   │   ├── scoring.service.js       # Job-fit score calc, ranking, breakdown
│   │   │   └── scoring.helpers.js       # Score weights, formula helpers
│   │   │
│   │   ├── application/
│   │   │   ├── application.routes.js    # POST /apply, PATCH /status, schedule
│   │   │   ├── application.controller.js
│   │   │   ├── application.service.js   # Apply, status flow, interview scheduling
│   │   │   └── application.validation.js
│   │   │
│   │   ├── company/
│   │   │   ├── company.routes.js        # CRUD /companies
│   │   │   ├── company.controller.js
│   │   │   ├── company.service.js
│   │   │   └── company.validation.js
│   │   │
│   │   ├── bookmark/
│   │   │   ├── bookmark.routes.js       # POST/DELETE/GET /bookmarks
│   │   │   ├── bookmark.controller.js
│   │   │   └── bookmark.service.js
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.routes.js          # Dashboard, moderation, skill library
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   └── admin.validation.js
│   │   │
│   │   └── notification/
│   │       ├── notification.routes.js   # (optional) GET /notifications
│   │       ├── notification.service.js  # Email triggers (assessment, status, interview)
│   │       └── notification.templates.js # Email HTML templates
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js           # JWT verification, role guard
│   │   ├── validate.middleware.js       # Zod request validation
│   │   ├── error.middleware.js          # Global error handler
│   │   ├── upload.middleware.js         # Multer config for file uploads
│   │   └── rateLimiter.middleware.js    # Basic rate limiting
│   │
│   ├── utils/
│   │   ├── email.util.js               # Send emails via Nodemailer
│   │   ├── upload.util.js              # Cloudinary/S3 upload helper
│   │   ├── cvParser.util.js            # PDF resume parsing & skill extraction
│   │   ├── pagination.util.js          # Pagination helper for Mongoose queries
│   │   ├── token.util.js              # JWT sign/verify helpers
│   │   ├── response.util.js           # Standardized API response format
│   │   └── logger.util.js             # Winston or Pino logger
│   │
│   ├── types/
│   │   ├── express.d.js                # Express request augmentation (req.user)
│   │   ├── environment.d.js            # Typed env variables
│   │   └── index.js                    # Shared JavaScript interfaces & enums
│   │
│   ├── app.js                          # Express app setup (routes, middleware)
│   └── server.js                       # Entry point (connect DB, start server)
│
├── tests/
│   ├── unit/
│   │   ├── auth.test.js
│   │   ├── scoring.test.js
│   │   ├── assessment.test.js
│   │   └── cvParser.test.js
│   ├── integration/
│   │   ├── auth.integration.test.js
│   │   ├── job.integration.test.js
│   │   ├── application.integration.test.js
│   │   └── assessment.integration.test.js
│   └── helpers/
│       ├── setup.js                    # Test DB connection, cleanup
│       └── factories.js                # Mock data factories
│
├── docs/
│   └── api/                            # Additional API documentation (optional)
│
├── .env.example                        # Template env file (committed)
├── .env                                # Local env file (git-ignored)
├── .gitignore
├── .eslintrc.js                        # ESLint config
├── .prettierrc                         # Prettier config
├── jest.config.js                      # Jest test config
├── nodemon.json                        # Nodemon dev config
├── package.json
├── package-lock.json
└── README.md
```

---

## Agile Workflow (Scrum)

This project follows the **Scrum framework** for iterative, incremental delivery.

### Roles

| Role              | Responsibility                                                  |
| ----------------- | --------------------------------------------------------------- |
| **Product Owner** | Defines user stories, prioritizes the backlog                   |
| **Scrum Master**  | Facilitates sprints, removes blockers, ensures process          |
| **Dev Team**      | Designs, builds, tests, and delivers increments each sprint     |

### Sprint Structure

| Activity              | Cadence         | Description                                      |
| --------------------- | --------------- | ------------------------------------------------ |
| **Sprint Planning**   | Start of sprint | Select stories from backlog, define sprint goal   |
| **Daily Standup**     | Daily (15 min)  | What I did, what I'll do, any blockers            |
| **Sprint Review**     | End of sprint   | Demo completed work to stakeholders               |
| **Sprint Retro**      | End of sprint   | What went well, what to improve, action items     |
| **Sprint Duration**   | 1–2 weeks       | Short cycles for fast feedback                    |

### MVP Sprint Plan (Suggested)

| Sprint   | Goal                                      | Key Deliverables                                        |
| -------- | ----------------------------------------- | ------------------------------------------------------- |
| Sprint 1 | **Project Setup & Auth**                  | Repo setup, DB connection, User model, Register/Login   |
| Sprint 2 | **Profiles & Company**                    | Profile CRUD, CV upload, Company CRUD                   |
| Sprint 3 | **Jobs Module**                           | Job CRUD, search/filter, required skills, pagination    |
| Sprint 4 | **Assessments Engine**                    | Assessment CRUD, questions, attach to job, submit flow  |
| Sprint 5 | **Scoring & Ranking**                     | Auto-grading, job-fit score calc, candidate ranking     |
| Sprint 6 | **Applications & Interview Scheduling**   | Apply flow, status tracking, interview scheduling       |
| Sprint 7 | **CV Parsing & Bookmarks**                | Resume parsing, skill extraction, bookmark CRUD         |
| Sprint 8 | **Admin, Notifications & Polish**         | Admin dashboard, email notifications, error handling    |
| Sprint 9 | **Testing, Docs & Deployment**            | Unit/integration tests, Swagger docs, Docker, deploy    |

### User Story Format

```
As a [Recruiter / Candidate / Admin],
I want to [action],
So that [benefit].

Acceptance Criteria:
- Given [context], when [action], then [expected result].
```

### Board Columns (Kanban within Sprint)

```
BACKLOG → TODO → IN PROGRESS → CODE REVIEW → QA/TESTING → DONE
```

---

## Roadmap

### Phase 2 — Post-MVP *(when we do have time)*
- [ ] Real-time chat between recruiter and candidate
- [ ] Advanced candidate search with skill/score filters
- [ ] Job alerts (email digest for matching jobs)
- [ ] Analytics dashboard for recruiters (views, clicks, conversion, avg score)
- [ ] Social login (Google, LinkedIn OAuth)
- [ ] In-app notifications (WebSocket)
- [ ] Recruiter subscription/pricing tiers
- [ ] Assessment question bank (shared across jobs)
- [ ] Mobile API optimizations

### Phase 3 — Scale
- [ ] AI-powered job recommendations
- [ ] AI-enhanced resume parsing (NLP-based skill extraction)
- [ ] Full ATS (Applicant Tracking System) features
- [ ] Video interview integration
- [ ] Multi-language support (i18n)
- [ ] Rate limiting & abuse prevention
- [ ] Redis caching layer
- [ ] CI/CD pipeline (GitHub Actions)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

> **HIREDEYGO** — _Skills speak louder than CVs. Find your next opportunity. Hire your next star._

