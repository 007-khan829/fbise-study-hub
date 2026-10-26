@echo off
title FBISE Study Hub - Developed by Team Khan Hanan
color 0A
cls
echo ======================================================================
echo             FEDERAL BOARD OF INTERMEDIATE ^& SECONDARY EDUCATION
echo                      *** FBISE STUDY HUB ***
echo        Tagline: Prepare Smart. Practice Better. Achieve More.
echo                  Developed by Team Khan Hanan
echo ======================================================================
echo.

echo Checking if FBISE Study Hub server is already running on port 3000...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost:3000' -Method Head -TimeoutSec 2 -UseBasicParsing; exit 0 } catch { exit 1 }"
if %ERRORLEVEL% EQU 0 (
    echo [OK] FBISE Study Hub server is ALREADY ACTIVE!
    goto OPEN_BROWSER
)

echo [STARTING] Starting Next.js server in the background...
start /b cmd /c "npm run dev"
echo Waiting for server to initialize...
timeout /t 4 /nobreak >nul

:OPEN_BROWSER
echo.
echo [LAUNCH] Opening FBISE Study Hub in your default browser...
start http://localhost:3000
echo.
echo ======================================================================
echo   Website is running at: http://localhost:3000
echo   Public Live URL: https://benz-four-visits-warning.trycloudflare.com
echo   GitHub Pages:    https://007-khan829.github.io/fbise-study-hub/
echo   GitHub Repo:     https://github.com/007-khan829/fbise-study-hub
echo   Credentials:
echo     - Student: khan.hanan@student.fbise.edu.pk / StudentPassword123!
echo     - Admin:   admin@fbise.edu.pk / AdminPassword123!
echo   Developed by Team Khan Hanan
echo ======================================================================
echo.
echo You can keep this window open or minimize it.
pause
