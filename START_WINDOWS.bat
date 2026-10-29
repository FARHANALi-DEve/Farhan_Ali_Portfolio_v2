@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo This version uses Three.js and requires Node.js LTS. Install it from https://nodejs.org/
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (echo npm not found. & pause & exit /b 1)
if not exist "node_modules\three\build\three.module.js" (
  echo Installing Three.js dependency...
  call npm install --no-audit --no-fund
  if errorlevel 1 (echo npm failed: please check internet access. & pause & exit /b 1)
)
echo Downloading the actual licensed original 3D scene assets...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0GET_ORIGINAL_ASSETS.ps1"
if errorlevel 1 (echo Could not download licensed assets. The original-model site will not render without them. & pause & exit /b 1)
echo Launching http://localhost:5173
start "" "http://localhost:5173"
node server.cjs
pause
