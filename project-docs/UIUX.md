# UIUX.md: LearnSync Design System

## 1. Design Philosophy
**Theme:** "The Flow State".
**Visual Style:** High-fidelity Glassmorphism with a focus on "Surgical Professionalism" for teachers and "Monk-Mode Minimalism" for students.
**Core Principles:**
* **Zero Distraction:** Eliminate unnecessary buttons during study sessions.
* **Visual Data:** Use color and motion to convey student struggle and success.

---

## 2. Color Palette & Typography
### 2.1 Color Palette
* **Primary (Deep Work):** `#0F172A` (Slate 950 - Background).
* **Accent (Flow):** `#22D3EE` (Cyan 400 - Glowing elements).
* **Alert (Friction):** `#F43F5E` (Rose 500 - Teacher Heatmap "Red Zones").
* **Success (Mastery):** `#10B981` (Emerald 500 - Completed To-Do items).

### 2.2 Typography
* **Font Family:** `Inter` or `Geist Sans` (Modern, highly readable).
* **Heads-Up Display:** `JetBrains Mono` (For timers and "Peer Pulse" counters to give a technical feel).

---

## 3. Key UI Components

### 3.1 The "Pulse" Ring (Student HUD)
* **Visual:** A thin, glowing cyan ring surrounding the central timer.
* **Animation:** A subtle "breathing" effect (Framer Motion) that syncs with the timer's seconds.

### 3.2 Socratic Friction Cards (Teacher Oracle)
* **Visual:** Semi-transparent cards with a background blur (Glassmorphism).
* **Behavior:** Topics with high friction counts pulse in Rose 500 to grab teacher attention.

### 3.3 Dynamic To-Do Items
* **Animation:** When AI injects a new task, the item should "Slide In" from the top with a subtle glow highlight to signal the update.

---

## 4. Screen Layouts

### 4.1 Student "Monk Mode" (/study)
* **Center:** Massive digital timer (JetBrains Mono).
* **Top Right:** Peer Pulse indicator: "● 142 Active".
* **Bottom Center:** Floating Action Button (FAB) for "Doubt Capture".
* **Right Sidebar (Retractable):** The AI-Dynamic To-Do List and Syllabus Timetable.

### 4.2 Teacher "Oracle" Dashboard (/teacher)
* **Main Section:** A 2-column grid. 
    * **Left:** The "Friction Heatmap" (Bar Chart using Recharts).
    * **Right:** A feed of recent "High Struggle" student queries.
* **Top Navigation:** Buttons for "Generate Revision Sheet" and "Export Performance Reports".

---

## 5. Interactions & "Wow" Moments
* **The Socratic Reveal:** When a student uploads a doubt, show a "Scanning..." laser line animation over the image before displaying the AI hint.
* **The Logic Loop:** When a teacher clicks "Generate Revision Sheet," show a quick montage of student "Friction Points" being compiled into the PDF to visually prove the data connection.

---

## 6. Implementation Notes for AI Agent
* **Library:** Use `lucide-react` for icons.
* **Animation:** Use `framer-motion` for all transitions.
* **Charts:** Use `recharts` for the teacher's friction data.
* **Framework:** Strictly `Next.js` with `Tailwind CSS` and `Shadcn UI` components.