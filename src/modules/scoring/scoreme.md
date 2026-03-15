Key Features
✅ Automatic ranking of candidates per job based on composite scores
✅ Three-component scoring system:

Assessment performance (50% weight)
Skill match analysis (30% weight)
CV relevance & profile completeness (20% weight)
✅ Detailed feedback including matched/missing skills and personalized recommendations
✅ Role-based access control (Recruiters for rankings, Authenticated users for individual scores)



# Scoring Module

## Overview
This module handles scoring logic for assessments. It provides endpoints to submit answers and receive calculated scores.

## Structure
- **scoring.controller.js**: Handles scoring requests.
- **scoring.helper.js**: Contains scoring utility functions.
- **scoring.routes.js**: Defines scoring API routes.
- **scoring.service.js**: Implements scoring business logic.

## Usage

### Endpoint
- **POST /score**
  - Accepts user answers.
  - Returns calculated score and feedback.

### Example Request
```json
{
  "answers": [
    {"questionId": "123", "answer": "A"},
    {"questionId": "124", "answer": "B"}
  ]
}
```

### Example Response
```json
{
  "score": 8,
  "feedback": "Good job!"
}
```

## How It Works
1. Controller receives answers.
2. Service processes answers using helper functions.
3. Score and feedback are returned.

## Notes
- Ensure answers are validated before scoring.
- Extend helper functions for custom scoring logic.
