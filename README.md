# My Academic Space v2.1 — Integration-ready

## Jalankan lokal
1. Extract ZIP.
2. Jalankan `Buka-Lokal.bat` atau `python -m http.server 8000`.
3. Buka `http://localhost:8000`.

## Deploy Vercel
- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: folder proyek
- API function berada di `/api/tutor.js` dan akan dideteksi Vercel.

## AI Tutor gateway (belum aktif sebelum konfigurasi)
Backend `/api/tutor` disiapkan untuk provider yang kompatibel dengan OpenAI Chat Completions.
Tambahkan di Vercel → Project → Settings → Environment Variables:
- `AI_API_URL`: URL endpoint lengkap provider.
- `AI_API_KEY`: secret API key. Jangan pernah menaruhnya di file frontend.
- `AI_MODEL`: ID model dari provider.

Setelah menyimpan variabel, lakukan redeploy. Jika provider memakai format API berbeda (mis. endpoint native Gemini/Anthropic), adapter `api/tutor.js` harus disesuaikan dengan dokumentasi provider tersebut. Jangan menebak endpoint atau model.

## Database, login, dan cloud storage
Belum dipasang karena provider belum dipilih. Rekomendasi: Supabase (Auth + PostgreSQL + Storage) sebagai satu backend. Firebase juga bisa dipakai, tetapi integrasi perlu adapter tersendiri. Jangan aktifkan sinkronisasi sebelum aturan akses per-user, migrasi data lokal, dan kebijakan file diuji.

## Fitur yang dipertahankan
- Dashboard, 7 jalur belajar, roadmap, kalender, tugas, progress dan focus timer.
- Reading Gallery katalog 47 buku, impor ZIP/PDF, pembaca PDF.
- IndexedDB lokal untuk PDF; localStorage untuk progress dan catatan.
- Backup/restore JSON.

## Batasan penting
- AI Tutor tidak otomatis aktif hanya dengan deploy. Perlu endpoint provider yang tepat dan Environment Variables.
- AI Tutor saat ini belum membaca otomatis isi PDF; Ask My Book memerlukan ekstraksi teks dan retrieval/indexing.
- Login dan cloud sync belum aktif. Data lokal tidak otomatis tersinkron lintas perangkat.
- Jangan menyimpan API key rahasia dalam JavaScript frontend atau repository GitHub.


## v2.2 — Vite + Supabase progress sync

### Frontend / build
- Frontend menggunakan Vite.
- `npm run dev` untuk pengembangan lokal.
- `npm run build` menghasilkan folder `dist`.
- Vercel Build Command: `npm run build`; Output Directory: `dist`.
- API serverless tetap berada di `/api/tutor` (file `api/tutor.js`).

### Supabase cloud progress
1. Buat project Supabase.
2. Di Authentication → Providers/Sign In, aktifkan **Anonymous Sign-ins**.
3. Buka SQL Editor dan jalankan seluruh isi `supabase/schema.sql`.
4. Di Vercel → Settings → Environment Variables, isi:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon/public publishable key
5. Redeploy Vercel.

Progress modul, tugas, catatan, halaman terakhir dibaca, dan total menit belajar disinkronkan ke tabel `public.academic_progress` dengan RLS per pengguna anonim. Browser/perangkat yang berbeda akan memperoleh identitas anonim yang berbeda; sinkronisasi lintas perangkat dengan akun yang sama memerlukan fitur login/tautan akun yang belum termasuk pada tahap ini.

**File PDF/ZIP** yang diimpor tetap disimpan di IndexedDB lokal perangkat. File tersebut tidak diunggah ke Supabase pada versi ini.

### AI Tutor
Isi di Vercel (backend only):
- `AI_API_URL` — URL lengkap OpenAI-compatible Chat Completions endpoint.
- `AI_API_KEY` — secret API key.
- `AI_MODEL` — model ID provider.

Jangan beri prefix `VITE_` pada tiga variabel AI tersebut. Jangan commit `.env` atau secret ke GitHub.

### GitHub repository
Target repository: `MyAcademy-Space/My-Academy-Space`.
Ekstrak ZIP dan push seluruh isi folder proyek (file `index.html`, `src/`, `api/`, `public/`, `supabase/`, `package.json`, `vercel.json`, dan lainnya) ke root repository. ZIP ini menyiapkan berkas proyek; tidak melakukan push ke GitHub atau mengubah pengaturan akun Vercel secara otomatis.

### Catatan keamanan dan batasan
- Supabase anon/publishable key memang dipakai di frontend; keamanan data ditegakkan oleh RLS. Jangan pernah menggunakan `service_role` key di browser.
- Anonymous auth menyimpan identitas di browser yang sama. Hapus data browser dapat menghilangkan akses ke identitas anonim tersebut.
- Progress yang sudah ada di localStorage akan digabungkan dengan data cloud saat pertama kali cloud berhasil terhubung.
- Data PDF lokal, sesi AI Tutor, dan file ZIP tidak disinkronkan.
