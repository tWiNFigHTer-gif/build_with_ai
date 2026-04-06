# LearnSync Cloud Migration Checklist

## 1. Firebase Manual Setup (Required First)

1. Create a Firebase project.
2. Add a Web App and copy Firebase config values.
3. Enable Realtime Database.
4. Add Firebase values to `.env.local` using `.env.example` as reference.
5. For development only, use permissive DB rules temporarily.
6. Confirm timer updates `pulse/syllabus-main/activeCount` in Realtime Database.

## 2. Google Cloud / Vertex AI Manual Setup

1. Create or select a Google Cloud project.
2. Enable Vertex AI API.
3. Set up authentication for local development with Application Default Credentials:
   - `gcloud auth application-default login`
4. Define in `.env.local`:
   - `MODEL_PROVIDER=vertex`
   - `GCP_PROJECT_ID=<your-project-id>`
   - `GCP_LOCATION=<your-region>`
   - `VERTEX_MODEL_NAME=gemini-1.5-flash` (or your chosen model)

## 3. Code Follow-up After You Confirm Setup

1. Implement Vertex call in `src/lib/model/provider.ts` in `getVertexInsight()`.
2. Keep frontend unchanged; it already calls `/api/doubt`.
3. Validate end-to-end flow:
   - Upload syllabus
   - Snap doubt
   - Receive hint + recovery task
   - To-Do updates instantly

## 4. Security Hardening (After Functional Validation)

1. Tighten Firebase Realtime Database rules.
2. Use service account / workload identity in deployment.
3. Avoid static credentials in source-controlled files.
