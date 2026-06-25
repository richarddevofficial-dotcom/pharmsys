@echo off
title PharmPlus - Starting System...
color 0E
echo.
echo ╔══════════════════════════════════════════╗
echo ║       PHARMPLUS PHARMACY SYSTEM          ║
echo ║           Starting Up...                  ║
echo ╚══════════════════════════════════════════╝
echo.

:: Start Django Backend
echo [1/3] Starting Django Backend...
start "PharmPlus Backend" cmd /c "cd /d C:\Users\iTECH SOLUTIONS\Desktop\pharmsys\backend && venv\Scripts\activate && python manage.py runserver"
echo       Backend starting on http://localhost:8000

:: Wait for backend
timeout /t 5 /nobreak >nul

:: Start Frontend
echo [2/3] Starting Frontend...
start "PharmPlus Frontend" cmd /c "cd /d C:\Users\iTECH SOLUTIONS\Desktop\pharmsys\frontend && npm run dev"
echo       Frontend starting on http://localhost:3000

:: Wait and open browser
echo [3/3] Opening Browser...
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo ╔══════════════════════════════════════════╗
echo ║    PharmPlus is Ready!                   ║
echo ║    Login: admin / admin123               ║
echo ║    URL: http://localhost:3000            ║
echo ╚══════════════════════════════════════════╝
echo.
echo Close this window when done.
pause
