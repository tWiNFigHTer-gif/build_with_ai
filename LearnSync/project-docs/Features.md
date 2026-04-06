# Features.md: Sutra.AI Functional Specification

## 1. Student "Deep Work" HUD (The Monk Mode)
Designed to eliminate "Planning Paralysis" and maintain high-density focus.

### 1.1 Minimalist Focus Timer
* **Description:** A distraction-free digital countdown timer for structured study sessions.
* **Trigger:** Manual "Start" button; triggers the "Monk Mode" UI overlay.
* **Value:** Visualizes time-blocking and prevents phone-checking during study.

### 1.2 Peer Pulse (Live Telemetry)
* **Description:** A real-time counter showing active peers studying within the same syllabus branch.
* **Technical Trigger:** Firebase Realtime Database listener incrementing/decrementing on session start/end.
* **Value:** Creates a sense of communal accountability and healthy competition.

### 1.3 AI-Dynamic To-Do List (Adaptive Tasks)
* **Description:** A task manager that the AI automatically edits based on study performance.
* **Technical Trigger:** When a student resolves a doubt, the `/api/doubt` response sends a `RECOVERY_TASK` JSON object to update the local list.
* **Value:** Ensures that "Stuck" topics are automatically scheduled for review tomorrow.

---

## 2. Socratic Intelligence Layer
The "Brain" of the system, focused on deep technical validation rather than direct answers.

### 2.1 Socratic Doubt Capture (Multimodal)
* **Description:** A Vision-AI interface where students upload photos of handwritten or printed problems.
* **Technical Trigger:** Gemini 1.5 Flash Vision analyzes the image and returns a Socratic hint + Topic Tag.
* **Value:** Maintains the learning loop by guiding the student toward the solution without "spoiling" it.

### 2.2 Sprint Timetable Generator
* **Description:** A one-click generator that creates a 7-day study plan.
* **Technical Trigger:** Takes an input `ExamDate` and `SyllabusContext` to output a structured JSON schedule.
* **Value:** Solves the "Where do I start?" problem by prioritizing high-weightage topics.

---

## 3. Teacher "Oracle" Dashboard
Tools to automate gap identification and reduce instructional burnout.

### 3.1 Friction Heatmap (Red Zone Analytics)
* **Description:** A visual dashboard identifying the hardest topics for the entire class.
* **Technical Trigger:** Aggregated Firestore query grouping student doubt tags into a Bar Chart (Recharts).
* **Value:** Tells the teacher exactly what to teach in the next revision session.

### 3.2 Automated Revision Sheet Generator
* **Description:** One-click generation of a targeted model question paper.
* **Technical Trigger:** Gemini generates 5 questions specifically targeting the "Red Zone" topics from the heatmap.
* **Value:** Reclaims classroom time by focusing