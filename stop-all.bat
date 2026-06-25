@echo off
title PharmPlus - Stopping System...
color 0C
echo.
echo ╔══════════════════════════════════════════╗
echo ║       PHARMPLUS PHARMACY SYSTEM          ║
echo ║           Stopping...                     ║
echo ╚══════════════════════════════════════════╝
echo.

echo [1/2] Stopping Django Backend...
taskkill /f /im python.exe >nul 2>&1
echo       Backend stopped.

echo [2/2] Stopping Frontend...
taskkill /f /im node.exe >nul 2>&1
echo       Frontend stopped.

echo.
echo ╔══════════════════════════════════════════╗
echo ║    PharmPlus Stopped Successfully!       ║
echo ╚══════════════════════════════════════════╝
echo.
pause
