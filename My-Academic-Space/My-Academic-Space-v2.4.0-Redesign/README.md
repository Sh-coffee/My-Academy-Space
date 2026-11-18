# My Academic Space v2.4.0 — UI refresh & cloud library guide

## Jalankan lokal (Windows / macOS / Linux)
1. Ekstrak ZIP.
2. Pasang Node.js 20 atau lebih baru.
3. Buka terminal pada folder yang berisi `package.json`.
4. Jalankan `npm install`.
5. Jalankan `npm run dev`, lalu buka URL yang ditampilkan Vite (umumnya `http://localhost:5173`).

Jangan gunakan `python -m http.server`: aplikasi menggunakan Vite dan package Supabase.

## Build production
Jalankan berurutan:

```bash
npm install
npm run build
npm run preview
```

Build Vite yang sukses membuat folder `dist/`. Preview biasanya tersedia di `http://localhost:4173`. Build belum dianggap terverifikasi sampai `npm run build` selesai tanpa error di komputer atau CI yang memiliki dependency terpasang.

## Deploy Vercel
- Framework Preset: Vite (atau Other jika deteksi otomatis tidak tersedia).
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Root Directory: folder project (folder yang memuat `package.json`).
- API function tetap berada di `api/tutor.js`.
- Atur Environment Variables untuk Production, Preview, dan Development sesuai kebutuhan, lalu redeploy.

## Environment variables
Frontend (Vite; nilainya akan masuk ke bundle browser, jadi hanya gunakan URL dan anon/publishable key):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend Vercel saja (jangan beri prefix `VITE_`):
- `AI_API_URL` — endpoint OpenAI-compatible Chat Completions lengkap.
- `AI_API_KEY` — secret API key.
- `AI_MODEL` — model ID provider.

Salin `.env.example` menjadi `.env.local` untuk pengembangan lokal. Jangan commit `.env.local` dan jangan pernah menaruh `service_role` key atau AI secret di frontend.

## Aktifkan Cloud Progress dan Cloud Library
1. Buka Supabase Dashboard dan pilih project yang digunakan aplikasi.
2. Pada Authentication → Sign In / Providers, aktifkan Anonymous Sign-ins.
3. Buka SQL Editor → New query.
4. Salin dan jalankan seluruh `supabase/schema.sql`. Script membuat/memperbarui tabel `academic_progress`, mengaktifkan RLS per user, membuat private Storage bucket `academic-library` (maksimum 50 MB/file), dan policy folder berbasis `auth.uid()`.
5. Pada Vercel → Project → Settings → Environment Variables, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan Project URL serta anon/publishable key. Jangan gunakan `service_role`.
6. Redeploy aplikasi.
7. Buka aplikasi, pastikan status cloud tersambung, lalu buka Perpustakaan. Impor file lokal jika perlu, kemudian tekan Upload cloud pada file tersebut. File yang telah diunggah muncul pada bagian File pribadi · Supabase Cloud.

Catatan: file lokal lama di IndexedDB tidak otomatis dipindahkan ke cloud. Upload cloud dilakukan per file. Anonymous Auth mengikat file dan progress ke identitas anonim pada browser itu; perangkat/browser lain mendapat identitas berbeda. Sinkronisasi lintas perangkat permanen memerlukan register/login dan mekanisme pengaitan identitas/migrasi yang belum termasuk.

## Fitur yang ada pada ZIP ini
- Dashboard dengan kartu target, progress, streak, kalender ringkas, roadmap, materi aktif, ringkasan progress, dan akses cepat.
- Ruang Belajar dengan pencarian, filter level, kartu learning path, detail modul, praktik, dan penandaan selesai.
- Pengaturan preferensi tema (terang/gelap/ikuti perangkat), bahasa aplikasi, bahasa belajar, notifikasi, backup/restore.
- Kalender, agenda, target, roadmap, progress, laporan, Focus Timer.
- Perpustakaan katalog, impor PDF/EPUB/TXT/MD/HTML, ZIP opsional, IndexedDB lokal, Cloud Library Supabase, reader dasar, bookmark halaman, catatan.
- Supabase Cloud Progress dan private Storage Cloud Library dengan RLS.
- AI Tutor melalui `/api/tutor.js` dan OpenAI-compatible adapter.

## Batasan yang masih perlu tahap pengembangan berikutnya
- Kurikulum lengkap per negara/jenjang/kelas/semester/mata pelajaran belum diisi; Learning Paths saat ini berisi 7 jalur dan modul ringkas yang sudah ada.
- Belum tersedia sistem manajemen video lesson lengkap, bank soal terstruktur, ujian berwaktu, penilaian otomatis, sertifikat, atau gradebook.
- Reader PDF/EPUB masih dasar; pencarian teks penuh, TOC universal, highlight/anotasi terintegrasi, dan resume posisi lintas format belum lengkap.
- AI Tutor belum otomatis mengindeks file buku (RAG/Ask My Book).
- Akun permanen dan cloud sync lintas perangkat belum tersedia; saat ini memakai Supabase Anonymous Auth.
- Tema dan pilihan bahasa disimpan, tetapi terjemahan seluruh antarmuka ke English belum selesai.

## Pengujian
Jalankan `npm install`, `npm run build`, lalu `npm run preview`. Jika instalasi dependency timeout, coba lagi dari jaringan yang stabil atau gunakan `npm ci` bila `package-lock.json` tersedia. Jangan menganggap build sukses sebelum terminal menampilkan hasil build Vite tanpa error.
