# Database.md: LearnSync Schema (Firestore)

## 1. Overview
**LearnSync** utilizes **Firebase Firestore** as its primary NoSQL database and **Firebase Realtime Database** for live telemetry. This architecture ensures 8-hour feasibility by removing the need for a custom backend server.

---

## 2. Collections Schema

### 2.1 Users Collection (`/users`)
Stores profile and aggregate performance data.
* `id`: string (Document ID)
* `name`: string
* `college`: string
* `total_focus_minutes`: number
* `current_status`: string ("Focusing" | "Idle")

### 2.2 Doubts Collection (`/doubts`)
Records every Socratic interaction for student history and teacher analytics.
* `id`: string (Document ID)
* [cite_start]`student_id`: reference (links to /users) [cite: 66]
* [cite_start]`image_url`: string (Storage URL for uploaded problem) [cite: 67]
* `topic_tag`: string (e.g., "Integration", "Thermodynamics")
* `socratic_hint`: string (The AI-generated hint)
* `status`: string ("Resolved" | "Stuck")
* [cite_start]`timestamp`: timestamp [cite: 69]

### 2.3 Friction Logs Collection (`/friction_logs`)
Aggregated data used specifically for the Teacher Oracle Heatmap.
* `topic`: string (Document ID / Unique Topic Name)
* `occurrence_count`: number (Total students stuck on this topic)
* `average_difficulty`: number (Scale 1-10)
* `last_updated`: timestamp

---

## 3. Realtime Telemetry (Firebase RTDB)
Used for the **"Peer Pulse"** counter to ensure zero-latency updates during the demo.
* `/active_sessions`:
    * `count`: number (Total students currently in 'Focus' mode)

---

## 4. Mocking & Simulation Strategy
To guarantee a stable 8-hour hackathon demo, the following data is pre-populated:

1. **Authentication Bypass:** Use a hardcoded `currentUser` object in the frontend to skip login logic.
2. **Historical Heatmap:** Pre-fill the `friction_logs` collection with 15 entries (e.g., "Vector Calculus": 8 hits, "Organic Chemistry": 12 hits) so the Teacher Dashboard is visually impressive upon first load.
3. **Peer Pulse Simulation:** A client-side interval that randomly increments or decrements the RTDB `active_sessions/count` by 1-2 users every 30 seconds.

---

## 5. Security Rules
* **Read:** Publicly accessible for the demo.
* [cite_start]**Write:** Restricted to the hardcoded student/teacher persona IDs to prevent database pollution[cite: 83, 88].