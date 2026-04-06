# TechStack.md: Sutra.AI

## 1. Frontend Architecture
* **Framework**: Next.js 14+ (App Router)
* **Styling**: Tailwind CSS (Utility-first CSS)
* **Component Library**: Shadcn UI (Radix UI + Tailwind)
* **Icons**: Lucide React
* **Animations**: Framer Motion (for "Pulse" and "Slide-in" effects)

---

## 2. Backend & Database (Serverless)
* **Platform**: Firebase (Backend-as-a-Service)
* **Primary Database**: Firestore (NoSQL for doubt logs and metadata)
* **Real-time Telemetry**: Firebase Realtime Database (for "Peer Pulse" active counts)
* **Authentication**: Bypass for MVP (Hardcoded demo personas)

---

## 3. Artificial Intelligence (Socratic Engine)
* **Model**: Google Gemini 1.5 Flash
* **Integration**: Google AI SDK for JavaScript
* **Capabilities**: 
    * **Multimodal Vision**: Analyzing handwritten doubts from images.
    * **JSON Mode**: Returning structured "Friction Tags" for teacher analytics.
    * **Socratic Prompting**: System instructions to provide hints rather than direct answers.

---

## 4. Specialized Utilities
* **Data Visualization**: Recharts (for the Teacher Friction Heatmap)
* **Document Export**: jsPDF (for auto-generating Report Cards and Revision Sheets)
* **Date Handling**: Date-fns (for Syllabus Timetable generation)

---

## 5. Deployment & Environment
* [cite_start]**Platform**: Vercel [cite: 107]
* [cite_start]**Environment Variables**: Managed via `.env` (API Keys and Firebase Config) [cite: 87]
* **Version Control**: GitHub

---

## 6. AI Agent Configuration
* [cite_start]**IDE**: Cursor or Windsurf [cite: 100-102]
* **Instruction Set**: Modular generation; [cite_start]Backend API structure first, followed by Database models and Frontend pages [cite: 119-121].