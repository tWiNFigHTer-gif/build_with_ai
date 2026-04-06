# Deployment.md: Sutra.AI Deployment & Demo Strategy

## 1. Overview
[cite_start]This document defines the deployment pipeline and high-availability strategy for the Sutra.AI MVP. To ensure maximum judge engagement, the project prioritizes a live web-accessible URL over a strictly local setup.

---

## 2. Primary Deployment Platform: Vercel
**Vercel** is the mandatory platform for deployment due to its native integration with the Next.js framework and its ability to handle serverless API routes without configuration overhead.

---

## 3. Environment Variables (.env)
[cite_start]The following secrets MUST be configured in the Vercel Dashboard or local `.env.local` file to enable the system's core intelligence[cite: 87]:
* `NEXT_PUBLIC_GEMINI_API_KEY`: Required for multimodal Socratic doubt clearance.
* `FIREBASE_CONFIG`: Stringified JSON containing API keys and Project IDs for Firestore and Realtime DB.
* `SYLLABUS_CONTEXT`: The hardcoded text string of the university syllabus to prevent AI hallucinations.

---

## 4. Deployment Workflow
1. [cite_start]**GitHub Integration:** Commit and push the final code to the main branch[cite: 141].
2. **Vercel Project Creation:** Import the repository into Vercel.
3. [cite_start]**Variable Injection:** Manually add the Environment Variables listed in Section 3[cite: 87].
4. [cite_start]**Build & Deploy:** Run the automated build process to generate the production URL[cite: 141].

---

## 5. Local Development & One-Command Run
To run Sutra.AI locally as a primary or fallback demo source:
1. **Install:** `npm install`.
2. [cite_start]**Configure:** Create a local `.env` file with necessary keys[cite: 87].
3. **Execute:** `npm run dev`.

---

## 6. Demo-Day Backup & Stability Plan
To ensure a 1st-rank presentation even in cases of unstable Wi-Fi or API latency:
* **Pre-filled Analytics:** The Firestore database will be pre-populated with 15+ "mock" doubt entries to ensure the Teacher Heatmap is visually impressive.
* **"Golden Path" Assets:** Prepare a set of pre-captured, clear photos of handwritten problems that have been pre-tested with Gemini 1.5 Flash.
* **Offline Fallback:** Maintain a 60-second screen recording (video) of the "Student-to-Teacher" loop to play if the live connection fails.
* **QR Code Generation:** Generate a QR code linked to the live Vercel URL so judges can open the Student HUD on their own mobile devices.