@echo off
title PharmPlus Backend
echo Starting Django Backend...
cd /d "C:\Users\iTECH SOLUTIONS\Desktop\pharmsys\backend"
call venv\Scripts\activate
python manage.py runserver
pause
