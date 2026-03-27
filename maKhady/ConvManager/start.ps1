# ConvManager Startup PowerShell Script

Write-Host "Starting ConvManager Application..." -ForegroundColor Cyan

# Start Laravel Backend in a new window
Write-Host "Launching Backend (Laravel)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; php artisan serve"

# Start React Frontend in a new window
Write-Host "Launching Frontend (React)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nDone. Both servers are starting in separate windows." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
