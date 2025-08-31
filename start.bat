@echo off
echo Starting Task Manager Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Application...
start "Frontend App" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
