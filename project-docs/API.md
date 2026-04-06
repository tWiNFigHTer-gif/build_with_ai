# API.md: Sutra.AI Specification

## 1. Overview
This document defines the RESTful API endpoints for the Sutra.AI platform. [cite_start]To ensure an 8-hour delivery, all endpoints are implemented as **Next.js Route Handlers** using a **Node.js + Express-style** structure [cite: 77-78].

**Base URL:** `/api`

---

## 2. Authentication (Mocked for Hackathon)
To stay within the 8-hour sprint, standard JWT and Bcrypt hashing are bypassed in favor of hardcoded session simulation.

### POST /login (Simulated)
* **Purpose:** Bypasses actual auth to provide a demo-ready session.
* **Request:** `{ "username": "student_demo" | "teacher_demo" }`
* **Response:** `{ "status": "success", "role": "student" | "teacher", "token": "mock_jwt_token" }`

---

## 3. Core Student Endpoints

### POST /doubt (Gemini Vision Integration)
* **Purpose:** Processes multimodal student queries to provide Socratic hints and log friction points.
* **AI Engine:** Google Gemini 1.5 Flash (Vision).
* **Input:** - `image`: Base64 string of the handwritten problem.
  - `studentId`: String.
* **Output:**
  ```json
  {
    "hint": "The Socratic hint to guide the student...",
    "topic": "Integration by Parts",
    "recoveryTask": "Review basic substitution rules",
    "difficulty": 4
  }