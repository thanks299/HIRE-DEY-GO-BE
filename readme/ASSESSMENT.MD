# Assessment Management API

This module provides RESTful APIs to create, manage, and evaluate job assessments in a recruitment system. It allows recruiters to create assessments, attach them to job postings, and enables candidates to start, submit, and view assessment results. Built with **Node.js**, **Express**, and **MongoDB**.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
  - [Create Assessment](#create-assessment)  
  - [Update Assessment](#update-assessment)  
  - [Delete Assessment](#delete-assessment)  
  - [Attach Assessment to Job](#attach-assessment-to-job)  
  - [Start Assessment](#start-assessment)  
  - [Submit Assessment](#submit-assessment)  
  - [Get Assessment Result](#get-assessment-result)  
- [Error Handling](#error-handling)  

---

## Features

- Recruiters can **create, update, and delete assessments**.  
- Assessments can include multiple **question types**: MCQ, Short Answer, Situational.  
- Assessments can be **attached to specific job postings**.  
- Candidates can **start assessments**, which records the start time.  
- Automatic **scoring and grading** of submitted assessments.  
- Feedback based on performance, including pass/fail status.  
- View assessment results per candidate.

---

## Tech Stack

- **Node.js**  
- **Express.js**  
- **MongoDB / Mongoose**  
- **JWT Authentication & Role-Based Authorization**  
- **Swagger Documentation**

---

## Usage

The API is structured with RESTful endpoints. All endpoints require JWT authentication. Certain actions are role-restricted:

- **RECRUITER:** Create, update, delete assessments, attach assessments to jobs.  
- **CANDIDATE:** Start assessments, submit answers, view results.

---

## API Endpoints

### Create Assessment
- **POST** `/api/v1/assessments`  
- **Role:** RECRUITER  

**Request Body Example:**
```json
{
  "title": "Frontend Developer Test",
  "description": "React and JavaScript assessment",
  "skills": ["React", "JavaScript"],
  "timeLimit": 30,
  "questions": [
    {
      "questionText": "What is React?",
      "type": "MCQ",
      "options": ["Library", "Database", "Framework"],
      "correctAnswer": "Library",
      "points": 5
    }
  ]
}
```
**Response:** `201 Created`

### Update Assessment
**PATCH** `/api/v1/assessments/:id`

**Role:** RECRUITER

**Request Body:** `Any assessment fields to update`

**Response:** `200 OK`

### Delete Assessment
**DELETE** `/api/v1/assessments/:id`

**Role:** RECRUITER

**Response:** `200 OK, Assessment deleted successfully`

###Attach Assessment to Job
**POST** `/api/v1/jobs/:jobId/assessments/:assessmentId`

**Role:** RECRUITER

**Response:** `200 OK, Assessment attached to job`

### Start Assessment
**GET** `/api/v1/jobs/:jobId/assessment`

**Role:** CANDIDATE

**Response Example:**
```JSON
{
  "success": true,
  "resultId": "643f123abc456",
  "startTime": "2026-03-15T10:00:00.000Z",
  "timeLimit": 30,
  "assessmentId": "643f987abc456",
  "title": "Frontend Developer Test",
  "questions": [
    {
      "_id": "643faa111bbb",
      "questionText": "What is React?",
      "type": "MCQ",
      "options": ["Library", "Database", "Framework"],
      "points": 5
    }
  ]
}
```
**Error Responses:** `Already taken assessment (400), Assessment not available (404)`

### Submit Assessment
**POST** `/api/v1/assessments/:assessmentId/submit`

**Role:** CANDIDATE

**Request Body Example:**
```JSON
{
  "jobId": "665f123abc123",
  "answers": [
    { "questionId": "665faaa111bbb", "answer": "Library" }
  ]
}
```

**Response:** `201 Created, includes score, percentage, feedback`

### Get Assessment Result
**GET** `/api/v1/assessments/:id/result`

**Role:** CANDIDATE

**Response Example:**
```JSON
{
  "success": true,
  "data": {
    "_id": "643f123abc456",
    "score": 25,
    "percentage": 83.3,
    "status": "completed",
    "feedback": "Passed, prepare for an interview"
  }
}
```
##Error Handling
###Returns appropriate HTTP status codes:

**400 Bad Request:** `Already submitted, invalid request`

**403 Forbidden:** `Unauthorized action`

**404 Not Found:** `Assessment or Job not found`

**500 Internal Server Error:** `Server issues`
