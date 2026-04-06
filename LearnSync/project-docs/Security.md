# Security.md: Sutra.AI Security & Data Governance

## 1. Overview
This document outlines the security protocols for the Sutra.AI MVP. Given the 8-hour hackathon constraint, the focus is on protecting API credentials, validating student inputs, and ensuring AI safety while utilizing a simplified authentication model.

---

## 2. Core Security Implementations

### 2.1 Environment Variable Management
* [cite_start]**Strict Requirement:** All sensitive credentials, including Gemini API keys and Firebase configuration strings, MUST be stored in a `.env` file[cite: 87].
* [cite_start]**Precaution:** The `.env` file must be added to `.gitignore` to prevent accidental exposure in public repositories[cite: 87].

### 2.2 Input Validation & Sanitization
* [cite_start]**Multimodal Validation:** All image uploads in the Socratic Doubt Capture module must be validated for file type (e.g., JPEG, PNG) and size to prevent buffer overflow or DOS attacks[cite: 84].
* [cite_start]**Text Sanitization:** All text inputs for the To-Do list and chatbot must be sanitized to prevent XSS (Cross-Site Scripting) and SQL injection[cite: 84, 88].

### 2.3 Authentication (Hackathon Simulation)
* **Strategy:** Standard JWT and secure password hashing are bypassed to save development time.
* **Implementation:** Sessions are simulated using hardcoded `studentId` and `teacherId` parameters in the URL or local storage to facilitate an instant, friction-free demo.

---

## 3. AI Safety & Governance (Gemini 1.5 Flash)

### 3.1 Socratic Safe-Space Prompting
* **System Instructions:** The AI engine is strictly prompted to remain in the "Socratic Tutor" persona.
* **Guardrails:** The prompt must explicitly forbid providing direct answers, engaging in off-topic conversation, or generating harmful content.

### 3.2 Syllabus Lockdown
* **Constraint:** Every AI call includes hardcoded university syllabus text to ensure responses remain academically relevant and accurate within the curriculum.

---

## 4. Data Privacy & Handling

### 4.1 Student Data Privacy
* **Struggle Data:** "Friction Tags" and doubt logs are used exclusively for the Teacher Heatmap and are not shared with third parties.
* **Stateless Images:** Uploaded images of handwritten work are processed in real-time and are not persisted long-term to minimize the risk of data leakage.

### 4.2 Teacher Analytics
* **Purpose:** Data aggregation for the "Revision Oracle" is strictly for instructional optimization and reducing teacher burnout.

---

## 5. Hackathon-Specific Exemptions
To ensure the 1st-rank 8-hour delivery, the following are explicitly excluded from the MVP scope:
* **Production-Grade Auth:** No real-world JWT or Bcrypt implementation.
* **Rate Limiting:** Standard API rate limiting is mocked or handled via basic client-side throttling.
* **Cloud Storage Security:** Reliance on Firebase default security rules for the duration of the hackathon.