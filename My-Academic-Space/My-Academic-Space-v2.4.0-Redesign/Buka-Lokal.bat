@echo off
cd /d "%~dp0"
if not exist "node_modules\vite" (
  echo Dependensi Vite belum terpasang. Menjalankan npm install...
  npm install
  if errorlevel 1 (
    echo Instalasi gagal. Pastikan Node.js 20+ dan internet tersedia.
    pause
    exit /b 1
  )
)
start "My Academic Space" http://localhost:5173
npm run dev -- --host 127.0.0.1
pause
