# Architecture.md: LearnSync System Design

## 1. High-Level System Overview
[cite_start]LearnSync follows a **Serverless Full-Stack Architecture** to minimize infrastructure management and maximize development speed[cite: 95, 99]. The system is composed of a unified Next.js environment that handles both the user interface and the intelligence-driven backend logic.



---

## 2. Component Breakdown

### 2.1 Frontend (Next.js + Tailwind CSS)
* [cite_start]**Framework:** Next.js (App Router) serves as the core for both the Student HUD and the Teacher Oracle[cite: 77].
* **Styling:** Tailwind CSS provides utility-first styling for rapid UI development and dark-mode consistency.
* **UI Components:** Shadcn UI is used for high-fidelity, accessible interface elements such as the study timer and data charts.

### 2.2 Backend & APIs (Next.js Route Handlers)
* **Logic Layer:** Backend logic is implemented via Next.js Route Handlers (Node.js environment) to avoid the overhead of separate microservices.
* [cite_start]**API Pattern:** RESTful endpoints facilitate communication between the frontend, the Firebase database, and the Gemini AI engine [cite: 70-75].

### 2.3 Database Layer (Firebase)
* **Primary Storage:** Firebase Firestore (NoSQL) stores student doubt logs, topic tags, and generated study plans.
* **Real-time Telemetry:** Firebase Realtime Database powers the "Peer Pulse" feature to show live student activity counts.
* **State Management:** The database acts as the source of truth for the Teacher Friction Heatmap.

### 2.4 AI Engine (Google Gemini 1.5 Flash)
* **Multimodal Processing:** Gemini 1.5 Flash processes handwritten student doubts via the Vision API.
* **Analytical Engine:** The AI identifies syllabus-specific topics and generates structured JSON for the Teacher Dashboard and dynamic to-do lists.
* **Content Generation:** Gemini generates 7-day study timetables and targeted model question papers based on the student friction logs.

---

## 3. Data Flow: The Socratic Loop
1. **Input:** A student captures a photo of a problem within the Study HUD.
2. **Processing:** The Next.js API route sends the image to Gemini 1.5 Flash with syllabus-locked system instructions.
3. **Storage:** Gemini returns a Socratic hint and a "Topic Tag" (e.g., "Calculus"), which are stored in the Firestore `doubts` collection.
4. **Visualization:** The Teacher Dashboard queries the `doubts` collection in real-time to update the Friction Heatmap.
5. **Feedback:** The teacher uses the heatmap to generate a revision sheet, which is then served back to the student's study space.

---

## 4. Deployment Pipeline
* [cite_start]**Environment:** The entire project is hosted on **Vercel** for continuous deployment and seamless integration with the Next.js framework[cite: 107, 141].
* **Configuration:** Environment variables (`.env`) are used to securely manage Gemini API keys and Firebase configuration strings.