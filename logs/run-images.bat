@echo off
cd /d "c:\My stuff\My Vibe Coding Projects\Knowledge base"
node scripts/generate-course-assets.js --no-diagrams >> logs\generate-images.log 2>&1
