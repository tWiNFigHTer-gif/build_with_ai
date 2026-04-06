# AI_Instructions.md: LearnSync Build Commands

## 1. Role & Context
You are an elite Full-Stack AI Engineer and Pedagogical Architect. [cite_start]Your task is to build **LearnSync**, a cognitive study ecosystem, by strictly following the blueprint provided in the `/project-docs` folder [cite: 92, 113-115].

---

## 2. Master Generation Prompt
**Paste this into the AI Chat to begin:**
> [cite_start]"Read all files inside `/project-docs`. Generate a production-ready full-stack project based on these documents. Ensure a modular architecture, secure APIs, and a scalable structure using Next.js and Firebase [cite: 91-97]. [cite_start]Follow the build phases in `AI_Instructions.md` step-by-step"[cite: 117].

---

## 3. Build Phase 1: Foundation & Scaffold (Hour 1-2)
* [cite_start]**Task:** Initialize the Next.js project and Firebase configuration[cite: 112].
* [cite_start]**Prompt:** "Initialize the Next.js App Router project with Tailwind CSS and Shadcn UI. Create the Firebase configuration utility using environment variables as specified in `Security.md`. Scaffold the folder structure for `/components`, `/api`, and `/lib`" [cite: 95, 119-122].

---

## 4. Build Phase 2: Intelligence & Data Loop (Hour 3-5)
* **Task:** Connect Gemini 1.5 Flash and implement the Socratic loop.
* **Prompt:** "Generate the `/api/doubt` route handler using Gemini 1.5 Flash Vision. It must:
  1. Receive a base64 image.
  2. Use the hardcoded syllabus in `PRD.md` as context.
  3. Return a Socratic hint (no answers) and a JSON 'Topic Tag'.
  4. [cite_start]Save the tag and difficulty to the Firestore `doubts` collection immediately" [cite: 119-120].

---

## 5. Build Phase 3: Student HUD & Dynamic Logic (Hour 5-7)
* **Task:** Build the focus UI and the adaptive To-Do list.
* **Prompt:** "Generate the Student Study HUD component. Include:
  1. A glowing digital timer (client-side state).
  2. A 'Peer Pulse' counter fetching from Firebase Realtime DB.
  3. An Adaptive To-Do List that listens for `UPDATE_TODO` JSON commands from the `/api/doubt` response to inject new review tasks".

---

## 6. Build Phase 4: Teacher Analytics & PDF (Hour 7-8)
* **Task:** Build the heatmap and export functionality.
* **Prompt:** "Build the Teacher Oracle Dashboard. Create a Bar Chart using Recharts that aggregates doubt counts from Firestore by topic. Add a button to trigger `jsPDF` for generating a 'Sustainable Report Card' based on the student's logged study metrics".

---

## 7. Global Coding Rules & Debugging
* **JSON Mode:** "Every AI call must be instructed to return structured JSON to ensure the UI can parse data without errors".
* [cite_start]**Error Correction:** "If a build error occurs, analyze the stack trace, refer to `Architecture.md`, and fix the bug while maintaining security best practices" [cite: 123-129].
* [cite_start]**Security Lockdown:** "Never hardcode API keys. Always use environment variables as per `Security.md`"[cite: 87].
* **Vibe Check:** "Prioritize a minimalist, dark-mode 'Deep Work' aesthetic for the student HUD using Shadcn UI components".