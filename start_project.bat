@echo off
echo ==========================================
echo      Dotix Scheduler - One Click Start
echo ==========================================

echo [1/4] Installing Root Dependencies...
call npm install

echo [2/4] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo [4/4] Starting Application...
echo Frontend will be at: http://localhost:3000
echo Backend will be at: http://localhost:5000
echo.

npm run dev
