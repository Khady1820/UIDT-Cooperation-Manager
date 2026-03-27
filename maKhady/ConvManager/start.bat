@echo off
echo Starting ConvManager Application...

:: Start Laravel Backend in a new window
echo Launching Backend (Laravel)...
start "ConvManager Backend" cmd /k "cd backend && php artisan serve"

:: Start React Frontend in a new window
echo Launching Frontend (React)...
start "ConvManager Frontend" cmd /k "cd frontend && npm run dev"

echo Done. Both servers are starting in separate windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
