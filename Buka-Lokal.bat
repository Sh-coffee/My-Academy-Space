@echo off
cd /d "%~dp0"
echo Menjalankan My Academic Space di http://localhost:8000
start "My Academic Space" http://localhost:8000
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8000
) else (
  python -m http.server 8000
)
pause
