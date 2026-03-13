# Applications & Profile API

This module handles **job applications** and **user profiles** for the HireDeyGo platform.

It allows candidates to:

- Apply for jobs
- Manage their job applications
- View application details
- Update or delete applications
- Create and manage their professional profile

All endpoints require authentication using `verifyToken`.

---

# Applications API

This set of endpoints allows **candidates to apply to jobs and manage their applications**.

---

## Create Application

Create a new application for a job.

### Endpoint

POST /applications


### Authorization

CANDIDATE


### Request Body

```json
{
  "jobId": "65f8a9c123abc45612345678",
  "coverLetter": "I am interested in this position...",
  "resumeUrl": "https://example.com/resume.pdf"
}
Validation
jobId is required

jobId must be a valid MongoDB ObjectId

A user cannot apply to the same job twice

Success Response
{
  "success": true,
  "message": "Application created successfully",
  "data": {
    "_id": "applicationId",
    "jobId": "jobId",
    "userId": "userId",
    "coverLetter": "I am interested...",
    "resumeUrl": "resume link"
  }
}
Error Responses
Status	Reason
400	Missing or invalid jobId
409	Duplicate application
500	Server error
Get My Applications
Fetch all applications submitted by the authenticated user.

Endpoint
GET /applications
Authorization
CANDIDATE
Behavior
The response includes populated fields:

Job details

User details

Assessment results

Success Response
{
  "success": true,
  "message": "Applications fetched successfully",
  "count": 2,
  "data": [
    {
      "_id": "applicationId",
      "jobId": { "title": "Backend Engineer" },
      "userId": { "email": "user@example.com" },
      "assessmentResultId": {}
    }
  ]
}
Sorting
Applications are returned newest first.

Get Single Application
Fetch details for a specific application.

Endpoint
GET /applications/:id
Authorization
CANDIDATE
Validation
id must be a valid MongoDB ObjectId

The application must belong to the authenticated user

Success Response
{
  "success": true,
  "message": "Application fetched successfully",
  "data": {
    "_id": "applicationId",
    "jobId": {},
    "userId": {},
    "assessmentResultId": {}
  }
}
Error Responses
Status	Reason
400	Invalid application ID
404	Application not found
500	Server error
Update Application
Update application details such as the cover letter or resume.

Endpoint
PUT /applications/:id
Authorization
CANDIDATE
Request Body
{
  "coverLetter": "Updated cover letter",
  "resumeUrl": "https://example.com/new-resume.pdf"
}
Success Response
{
  "success": true,
  "message": "Application updated successfully",
  "data": {}
}
Validation
Only the owner of the application can update it.

Delete Application
Delete a previously submitted job application.

Endpoint
DELETE /applications/:id
Authorization
CANDIDATE
Validation
id must be a valid MongoDB ObjectId

Application must belong to the authenticated user

Success Response
{
  "success": true,
  "message": "Application deleted successfully"
}
Profile API
This module allows users to create, update, and retrieve their professional profile.

Profiles contain information such as:

Personal details

Skills

Work experience

Education

Resume

Avatar

Get My Profile
Retrieve the authenticated user's profile.

Endpoint
GET /profile
Authorization
CANDIDATE | RECRUITER
Success Response
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "skills": ["Node.js", "MongoDB"],
    "location": "Nigeria"
  }
}
Error Responses
Status	Reason
404	Profile not found
500	Server error
Create or Update Profile
Create a new profile or update an existing one.

Endpoint
PUT /profile
Authorization
CANDIDATE | RECRUITER
Request Body
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348000000000",
  "location": "Lagos",
  "bio": "Backend Developer",
  "skills": ["Node.js", "MongoDB"],
  "experience": [],
  "education": [],
  "resumeUrl": "https://example.com/resume.pdf",
  "avatarUrl": "https://example.com/avatar.png"
}
Behavior
If a profile does not exist, it is created

If a profile exists, it is updated

This uses MongoDB upsert functionality.

Success Response
{
  "success": true,
  "message": "Profile saved successfully",
  "data": {}
}
Security & Access Control
Authentication is required for all routes using:

verifyToken
Role-based access control is enforced using:

authorize("CANDIDATE")
authorize("RECRUITER")
Application routes are restricted to candidates

Profile routes are accessible to both candidates and recruiters

#Key Features#
- Prevents duplicate job applications

- Validates MongoDB ObjectIds

- Populates related documents (Job, User, Assessment Results)

- Supports profile upsert

- Secure ownership checks for applications