# My Academic Space — v2.4.0

## v2.4.0 — visual refresh
- Redesigned dashboard to align with supplied reference: blue academic palette, metric cards, calendar and today's agenda, learning roadmap, current learning, progress summary, quick links, responsive layout.
- Redesigned Learning Paths as searchable/filterable course cards with course detail and module practice/completion.
- Redesigned Personal Settings with theme cards, language preferences, notifications, cloud integration information, and data actions.
- Preserved Vite, `dist`, Supabase progress, SQL/RLS, `/api/tutor`, OpenAI-compatible adapter, GitHub/Vercel configuration, and `.env.example`.
- Added Cloud Library and production build setup instructions to README.

## Existing capabilities retained
- Supabase anonymous auth progress sync and per-user RLS.
- Private Storage bucket `academic-library`, file listing/upload/download/delete.
- IndexedDB local fallback and document import.
- Existing AI Tutor serverless endpoint and backend-only environment variables.

## Verification status
- JavaScript syntax check: passed (`node --check src/main.js`).
- `npm install`: timed out in the build environment.
- `npm run build`: could not run because Vite dependency was not installed (`vite: not found`).
- Production build therefore remains **not verified**. Run `npm install` and `npm run build` locally or in Vercel.

## Known limitations (not represented as completed)
- No permanent account registration/login or cross-device identity linking.
- No full curriculum authoring hierarchy, video lesson management, graded quiz/exam engine, or gradebook.
- PDF/EPUB full text search, TOC, annotations/highlights, and document-aware RAG remain future work.
- AI Tutor requires provider configuration; uploaded books are not automatically indexed.
- Interface translation is partial; selected language preference is stored but not all strings are translated.
