# Panduan setup singkat

## 1. Supabase
1. Buat project.
2. Authentication → Sign In / Providers → aktifkan Anonymous Sign-ins.
3. SQL Editor → jalankan `supabase/schema.sql` versi ZIP ini. Script juga membuat private bucket `academic-library` dan policy Storage yang membatasi file ke folder UUID pengguna.
4. Salin Project URL dan anon/publishable key.

## 2. Vercel
Import repository `MyAcademy-Space/My-Academy-Space`.
- Root Directory: `.`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `AI_API_URL`
- `AI_API_KEY`
- `AI_MODEL`

Setelah mengubah environment variables, lakukan Redeploy.

## 3. GitHub
Ekstrak ZIP, commit/push seluruh isi folder proyek ke root repository. Jangan upload folder ZIP sebagai satu file dan jangan commit `.env`.

## Catatan
Cloud progress menggunakan akun anonim per browser. Untuk sinkronisasi antarperangkat yang memakai akun orang yang sama, tahap berikutnya perlu menambahkan UI login/email OAuth. PDF yang diimpor masih tersimpan lokal di perangkat.

## Cloud Library
- Bucket `academic-library` dibuat oleh SQL schema (private, maksimum 50 MB per file).
- Storage policy membatasi read/insert/update/delete berdasarkan folder pertama = UUID `auth.uid()`.
- Upload file melalui menu Perpustakaan setelah cloud status tersambung.
- Akun Anonymous Auth per browser tidak otomatis sama antarperangkat; untuk cloud library lintas perangkat dengan akun yang sama, login permanen perlu ditambahkan kemudian.
