@echo off
:: KnowledgeBase Continuous Processing Loop
:: Imports up to LIMIT liked tweets then runs the full pipeline.
:: Waits WAIT_MINS minutes between cycles, then repeats.
::
:: Usage:
::   run-loop.bat              (default: 10 tweets, 10 min wait)
::   run-loop.bat 20 5         (20 tweets per cycle, 5 min wait)
::
:: To run silently in the background:
::   Start-Process -FilePath "scripts\run-loop.bat" -WindowStyle Hidden
::
:: To stop: close this window or kill the cmd.exe process from Task Manager.

cd /d "C:\My stuff\My Vibe Coding Projects\Knowledge base"

set LIMIT=%1
set WAIT_MINS=%2
if "%LIMIT%"=="" set LIMIT=10
if "%WAIT_MINS%"=="" set WAIT_MINS=10

set /a WAIT_SECS=%WAIT_MINS%*60

echo ============================================================
echo  KnowledgeBase Continuous Loop
echo  Tweets per cycle : %LIMIT%
echo  Wait between runs: %WAIT_MINS% minutes
echo  Log: logs\run-loop.log
echo  Started: %date% %time%
echo ============================================================

:loop
echo.
echo [%date% %time%] ---- Starting cycle ----
echo [%date% %time%] ---- Starting cycle ---- >> logs\run-loop.log 2>&1

echo [%date% %time%] Step 1: Importing %LIMIT% liked tweets...
node scripts/import-x-likes.js --limit %LIMIT% >> logs\run-loop.log 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo [%date% %time%] WARNING: Import step failed (check X cookies). Skipping cycle.
  echo [%date% %time%] WARNING: Import step failed >> logs\run-loop.log 2>&1
  goto wait
)

echo [%date% %time%] Step 2: Running pipeline (extract, classify, courses, summary, graph)...
node scripts/run-pipeline.js --limit %LIMIT% >> logs\run-loop.log 2>&1

echo [%date% %time%] ---- Cycle done. Waiting %WAIT_MINS% minutes ----
echo [%date% %time%] ---- Cycle done. Waiting %WAIT_MINS% min ---- >> logs\run-loop.log 2>&1

:wait
timeout /t %WAIT_SECS% /nobreak > nul
goto loop
