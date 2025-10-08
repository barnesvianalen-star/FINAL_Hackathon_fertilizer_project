# ECO Tracker - Google Cloud Deployment Script
# This script deploys the ECO Tracker application to Google App Engine

Write-Host "🚀 ECO Tracker - Google Cloud Deployment" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Check if gcloud CLI is installed
Write-Host "`n📋 Checking Google Cloud CLI installation..." -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud version --format="value(Google Cloud SDK)"
    Write-Host "✅ Google Cloud CLI found: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud CLI not found!" -ForegroundColor Red
    Write-Host "`n📥 Please install Google Cloud CLI first:" -ForegroundColor Yellow
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    Write-Host "`n🔧 Quick install command:" -ForegroundColor Yellow
    Write-Host "   Invoke-WebRequest -Uri https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe -OutFile GoogleCloudSDKInstaller.exe; ./GoogleCloudSDKInstaller.exe" -ForegroundColor Cyan
    exit 1
}

# Check authentication status
Write-Host "`n🔐 Checking authentication status..." -ForegroundColor Yellow
try {
    $currentAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)"
    if ($currentAccount) {
        Write-Host "✅ Authenticated as: $currentAccount" -ForegroundColor Green
    } else {
        Write-Host "❌ Not authenticated with Google Cloud" -ForegroundColor Red
        Write-Host "`n🔑 Please authenticate first:" -ForegroundColor Yellow
        Write-Host "   gcloud auth login" -ForegroundColor Cyan
        $auth = Read-Host "`nWould you like to authenticate now? (y/n)"
        if ($auth -eq 'y' -or $auth -eq 'Y') {
            gcloud auth login
        } else {
            exit 1
        }
    }
} catch {
    Write-Host "❌ Error checking authentication" -ForegroundColor Red
    exit 1
}

# Check if project is set
Write-Host "`n📂 Checking project configuration..." -ForegroundColor Yellow
try {
    $currentProject = gcloud config get-value project 2>$null
    if ($currentProject) {
        Write-Host "✅ Current project: $currentProject" -ForegroundColor Green
        $useProject = Read-Host "`nUse this project? (y/n)"
        if ($useProject -eq 'n' -or $useProject -eq 'N') {
            $newProject = Read-Host "Enter project ID to use"
            gcloud config set project $newProject
        }
    } else {
        Write-Host "❌ No project set" -ForegroundColor Red
        Write-Host "`n🆕 Available options:" -ForegroundColor Yellow
        Write-Host "   1. Create a new project" -ForegroundColor Cyan
        Write-Host "   2. Use existing project" -ForegroundColor Cyan
        
        $option = Read-Host "`nChoose option (1 or 2)"
        
        if ($option -eq '1') {
            $projectId = Read-Host "Enter new project ID (lowercase, numbers, hyphens only)"
            $projectName = Read-Host "Enter project name (display name)"
            
            Write-Host "`n🆕 Creating new project..." -ForegroundColor Yellow
            gcloud projects create $projectId --name="$projectName"
            gcloud config set project $projectId
            
            # Enable billing (required for App Engine)
            Write-Host "`n💳 Please enable billing for your project in the Cloud Console:" -ForegroundColor Yellow
            Write-Host "   https://console.cloud.google.com/billing/linkedaccount?project=$projectId" -ForegroundColor Cyan
            Read-Host "Press Enter after enabling billing..."
            
        } elseif ($option -eq '2') {
            $projectId = Read-Host "Enter existing project ID"
            gcloud config set project $projectId
        } else {
            Write-Host "❌ Invalid option" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "❌ Error with project configuration" -ForegroundColor Red
    exit 1
}

# Get current project for deployment
$deployProject = gcloud config get-value project

# Enable required APIs
Write-Host "`n🔧 Enabling required Google Cloud APIs..." -ForegroundColor Yellow
try {
    gcloud services enable appengine.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    Write-Host "✅ APIs enabled successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: Could not enable APIs automatically" -ForegroundColor Yellow
    Write-Host "   Please enable App Engine API manually in the Cloud Console" -ForegroundColor Cyan
}

# Initialize App Engine (if not already done)
Write-Host "`n🏗️ Initializing App Engine..." -ForegroundColor Yellow
try {
    $appExists = gcloud app describe 2>$null
    if (!$appExists) {
        Write-Host "🌍 Available App Engine regions:" -ForegroundColor Cyan
        Write-Host "   us-central1    (Iowa, USA)" -ForegroundColor Gray
        Write-Host "   us-east1       (South Carolina, USA)" -ForegroundColor Gray
        Write-Host "   europe-west1   (Belgium)" -ForegroundColor Gray
        Write-Host "   asia-south1    (Mumbai, India) - Recommended for Indian users" -ForegroundColor Yellow
        Write-Host "   asia-southeast1 (Singapore)" -ForegroundColor Gray
        
        $region = Read-Host "`nEnter region (recommend: asia-south1 for India)"
        if (!$region) { $region = "asia-south1" }
        
        gcloud app create --region=$region
        Write-Host "✅ App Engine initialized in region: $region" -ForegroundColor Green
    } else {
        Write-Host "✅ App Engine already initialized" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error initializing App Engine" -ForegroundColor Red
    Write-Host "   You may need to enable billing first" -ForegroundColor Yellow
    exit 1
}

# Prepare files for deployment
Write-Host "`n📋 Preparing files for deployment..." -ForegroundColor Yellow

# Check if all required files exist
$requiredFiles = @(
    "index.html",
    "landing.html", 
    "auth.html",
    "dashboard.html",
    "app.html",
    "admin.html",
    "admin-login.html",
    "database.js",
    "google-oauth.js",
    "manifest.json",
    "sw.js",
    "app.yaml"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    exit 1
}

Write-Host "✅ All required files found" -ForegroundColor Green

# Show deployment summary
Write-Host "`n📊 Deployment Summary:" -ForegroundColor Yellow
Write-Host "   Project ID: $deployProject" -ForegroundColor Cyan
Write-Host "   Service: default" -ForegroundColor Cyan
Write-Host "   Runtime: python39" -ForegroundColor Cyan
Write-Host "   Instance Class: F1 (Free Tier)" -ForegroundColor Cyan
Write-Host "   Files to deploy: $($requiredFiles.Count)" -ForegroundColor Cyan

# Confirm deployment
$confirm = Read-Host "`n🚀 Ready to deploy? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 1
}

# Deploy to App Engine
Write-Host "`n🚀 Deploying to Google App Engine..." -ForegroundColor Yellow
Write-Host "   This may take several minutes..." -ForegroundColor Gray

try {
    gcloud app deploy app.yaml --quiet
    
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    
    # Get the app URL
    $appUrl = gcloud app browse --no-launch-browser
    
    Write-Host "`n🌐 Your ECO Tracker application is now live at:" -ForegroundColor Yellow
    Write-Host "   $appUrl" -ForegroundColor Cyan
    Write-Host "`n📱 Direct links:" -ForegroundColor Yellow
    Write-Host "   Landing Page: $appUrl" -ForegroundColor Cyan
    Write-Host "   Authentication: $appUrl/auth.html" -ForegroundColor Cyan
    Write-Host "   Dashboard: $appUrl/dashboard.html" -ForegroundColor Cyan
    Write-Host "   Admin Panel: $appUrl/admin-login.html" -ForegroundColor Cyan
    
    # Launch browser
    $launch = Read-Host "`n🌐 Open in browser? (y/n)"
    if ($launch -eq 'y' -or $launch -eq 'Y') {
        Start-Process $appUrl
    }
    
    Write-Host "`n🎉 ECO Tracker deployed successfully to Google Cloud!" -ForegroundColor Green
    Write-Host "`n📈 Free tier usage:" -ForegroundColor Yellow
    Write-Host "   - 28 instance hours per day" -ForegroundColor Cyan
    Write-Host "   - 1 GB storage" -ForegroundColor Cyan
    Write-Host "   - 1 GB network egress per day" -ForegroundColor Cyan
    
    Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Test your application thoroughly" -ForegroundColor Cyan
    Write-Host "   2. Set up custom domain (optional)" -ForegroundColor Cyan
    Write-Host "   3. Configure Google OAuth with production URL" -ForegroundColor Cyan
    Write-Host "   4. Monitor usage in Cloud Console" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n🔧 Common solutions:" -ForegroundColor Yellow
    Write-Host "   1. Check if billing is enabled" -ForegroundColor Cyan
    Write-Host "   2. Verify project permissions" -ForegroundColor Cyan
    Write-Host "   3. Ensure App Engine API is enabled" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n🏁 Deployment script completed!" -ForegroundColor Green