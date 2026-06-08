@echo off
cd /d "c:\My stuff\My Vibe Coding Projects\Knowledge base"
node scripts/generate-podcast.js >> logs\generate-podcasts.log 2>&1
