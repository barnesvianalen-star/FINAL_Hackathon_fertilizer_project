# ECO Tracker Complete Website - Local Server
# Launches your complete website locally for testing

Write-Host "========================================" -ForegroundColor Green
Write-Host "  ECO Tracker Complete Website" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$WEBSITE_DIR = Get-Location

Write-Host "`nStarting local web server..." -ForegroundColor Yellow
Write-Host "Website location: $WEBSITE_DIR" -ForegroundColor Cyan

# Check for Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
    
    Write-Host "`nStarting server on http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Opening browser in 3 seconds..." -ForegroundColor Yellow
    
    # Start server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WEBSITE_DIR'; Write-Host 'ECO Tracker Server Running on http://localhost:8000' -ForegroundColor Green; Write-Host 'Press Ctrl+C to stop' -ForegroundColor Yellow; python -m http.server 8000"
    
    # Wait and open browser
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:8000"
    
    Write-Host "`nSERVER STARTED!" -ForegroundColor Green
    Write-Host "Your complete ECO Tracker website is now running at:" -ForegroundColor White
    Write-Host "http://localhost:8000" -ForegroundColor Cyan
    Write-Host "`nFeatures available:" -ForegroundColor Yellow
    Write-Host "✓ Complete mobile app ecosystem" -ForegroundColor Green
    Write-Host "✓ Professional app store" -ForegroundColor Green  
    Write-Host "✓ Graphics generator" -ForegroundColor Green
    Write-Host "✓ APK downloads" -ForegroundColor Green
    Write-Host "✓ Privacy policy" -ForegroundColor Green
    Write-Host "✓ Mobile responsive design" -ForegroundColor Green
    
    Write-Host "`nTo stop the server, close the server window or press Ctrl+C" -ForegroundColor Gray
    
} catch {
    Write-Host "Python not found. Opening website directly..." -ForegroundColor Yellow
    Start-Process "$WEBSITE_DIR\index.html"
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")