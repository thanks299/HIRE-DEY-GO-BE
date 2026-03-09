# Jobs API Module

This module handles **job posting management** for the recruitment platform. It provides endpoints to create, retrieve, update, delete, and close job postings. The module also supports **pagination, filtering, and sorting** for efficient job searching.

---

# Features

- Create job postings
- Retrieve a list of jobs with pagination
- Filter jobs by status, category, skills, company, or recruiter
- Full-text search for jobs
- Sort jobs by newest, oldest, or deadline
- Retrieve a single job
- Update job postings
- Delete job postings
- Close job postings

---

# Endpoints

## Get All Jobs

Retrieve a paginated list of jobs with optional filtering and sorting.

### Request

GET /api/v1/jobs


### Query Parameters

| Parameter | Description |
|-----------|-------------|
| page | Page number for pagination |
| status | Job status (ACTIVE, CLOSED) |
| type | Job type (FULL_TIME, PART_TIME, CONTRACT) |
| category | Job category |
| companyId | Filter jobs by company |
| postedBy | Filter jobs by recruiter |
| skill | Filter by required skill |
| search | Full-text search on job data |
| sort | Sort results (deadline, oldest, newest) |

### Example Request

GET /api/v1/jobs?page=2&status=ACTIVE&skill=Node.js


### Example Response

```json
{
  "success": true,
  "meta": {
    "total_jobs": 120,
    "current_page": 2,
    "per_page": 10,
    "total_pages": 12,
    "length": 10,
    "next_page_url": "/api/v1/jobs?page=3&limit=10"
  },
  "data": []
}
Get Single Job
Retrieve details for a specific job.

Request
GET /api/v1/jobs/:id
Example Response
{
  "success": true,
  "job": {
    "_id": "job_id",
    "title": "Backend Developer",
    "companyId": "company_id",
    "postedBy": "user_id"
  }
}
Create Job
Create a new job posting.

Authentication
Requires authentication via JWT.

The postedBy field is automatically taken from the authenticated user.

Request
POST /api/v1/jobs
Example Body
{
  "title": "Backend Developer",
  "description": "Build scalable APIs",
  "companyId": "665c8e1a9b2d4c3a1f8a1234",
  "type": "FULL_TIME"
}
Example Response
{
  "success": true,
  "data": {
    "_id": "job_id",
    "title": "Backend Developer"
  }
}
Update Job
Update an existing job posting.

Request
PATCH /api/v1/jobs/:id
Example Body
{
  "title": "Senior Backend Developer",
  "salaryMax": 900000
}
Example Response
{
  "success": true,
  "message": "Job posting updated successfully",
  "job": {}
}
Delete Job
Delete a job posting.

Request
DELETE /api/v1/jobs/:id
Example Response
{
  "success": true,
  "message": "Job posting deleted successfully"
}
Close Job Posting
Marks a job as CLOSED, preventing further applications.

Request
PATCH /api/v1/jobs/:id/close
Example Response
{
  "success": true,
  "message": "Successfully closed job posting",
  "job": {}
}
Pagination Strategy
The API uses offset pagination.

skip = (page - 1) * limit
Default values:

limit = 10

page = 1

Error Handling
Errors are passed to the global error middleware using next(error).

Example error response:

{
  "success": false,
  "error": "Job details not found"
}
Security
Protected routes require JWT authentication middleware. The authenticated user's ID is automatically used for job ownership.

Future Improvements
Possible improvements for scaling the platform:

Cursor-based pagination for large datasets

Job application tracking

Recruiter ownership checks

Redis caching for job search

ElasticSearch integration for advanced search