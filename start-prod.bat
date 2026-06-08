@echo off
:: KnowledgeBase Production Build + Start
:: - Kills any existing process on port 3006
:: - Runs: npm run build
:: - Starts: npm start  (next start -p 3006)
::
:: Scheduled: Windows Task Scheduler "KnowledgeBase Prod Deploy" at 1:00 PM daily
:: Ad hoc:    Double-click or run from any terminal
::
:: Log written to: logs\prod-deploy-YYYY-MM-DD.log

setlocal

set ROOT=C:\My stuff\My Vibe Coding Projects\Knowledge base
cd /d "%ROOT%"

:: Get today's date via Node (locale-safe)
for /f %%d in ('node -e "process.stdout.write(new Date().toISOString().slice(0,10))"') do set TODAY=%%d
set LOG=%ROOT%\logs\prod-deploy-%TODAY%.log

:: ----------------------------------------------------------------
echo [%date% %time%] ============================================================
echo [%date% %time%] KnowledgeBase Prod Deploy -- %TODAY%
echo [%date% %time%] ============================================================
echo.

call :logmsg "============================================================"
call :logmsg "KnowledgeBase Prod Deploy -- %TODAY%"
call :logmsg "============================================================"

:: ----------------------------------------------------------------
:: Kill any existing Next.js server on port 3006
:: ----------------------------------------------------------------
echo Checking for existing server on port 3006...
set KILLED=0
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr "LISTENING" ^| findstr ":3006"') do (
    echo   Killing PID %%a (was listening on :3006)
    call :logmsg "Killing PID %%a (was listening on :3006)"
    taskkill /PID %%a /F >nul 2>&1
    set KILLED=1
)
if "%KILLED%"=="0" (
    echo   No existing process found on port 3006.
    call :logmsg "No existing process on port 3006."
)

:: Brief pause to let the port release
timeout /t 3 /nobreak >nul
echo.

:: ----------------------------------------------------------------
:: Build
:: ----------------------------------------------------------------
echo [%date% %time%] Running npm run build...
call :logmsg "Running npm run build..."
echo (This takes 2-5 minutes. Build output is written to the log file.)
echo.

call npm run build >> "%LOG%" 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [%date% %time%] BUILD FAILED. Check log:
    echo   %LOG%
    call :logmsg "BUILD FAILED (exit code %ERRORLEVEL%)"
    pause
    exit /b 1
)

echo [%date% %time%] Build succeeded!
call :logmsg "Build succeeded."
echo.

:: ----------------------------------------------------------------
:: Start prod server in a new titled window (keeps running after this bat exits)
:: ----------------------------------------------------------------
echo [%date% %time%] Starting prod server on port 3006...
call :logmsg "Starting prod server (next start -p 3006)..."

start "KnowledgeBase Prod :3006" cmd /k "cd /d "%ROOT%" && npm start"

:: Small wait to let the server window appear
timeout /t 2 /nobreak >nul

echo.
echo [%date% %time%] Done!
echo   Prod server:  http://localhost:3006
echo   Log file:     %LOG%
echo.
call :logmsg "start-prod.bat complete. Server window opened."

pause
exit /b 0

:: ----------------------------------------------------------------
:logmsg
echo [%date% %time%] %~1 >> "%LOG%"
exit /b 0
