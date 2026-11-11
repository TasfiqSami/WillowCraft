@echo off
setlocal
cd /d "%~dp0"
set "HOST=127.0.0.1"
set "PORT=4173"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 24 or newer is required. Install Node.js 24 LTS from https://nodejs.org/ then run this file again.
  pause
  exit /b 1
)
for /f "tokens=1 delims=v." %%A in ('node -v') do set NODE_MAJOR=%%A
if %NODE_MAJOR% LSS 24 (
  echo This project requires Node.js 24 or newer. Detected:
  node -v
  echo Install Node.js 24 LTS, then run this file again.
  pause
  exit /b 1
)
start "" /b node server.mjs
set /a ATTEMPTS=0
:wait_for_server
curl.exe --silent --fail http://127.0.0.1:4173/ >nul
if not errorlevel 1 goto ready
set /a ATTEMPTS+=1
if %ATTEMPTS% GEQ 15 goto failed
timeout /t 1 /nobreak >nul
goto wait_for_server
:ready
start "" http://127.0.0.1:4173
echo WillowCraft is running at http://127.0.0.1:4173
echo Leave this window open while you work on the site. Press Ctrl+C to stop the server.
node --version
pause
exit /b 0
:failed
echo Could not start the local website. Check that port 4173 is available.
pause
exit /b 1
