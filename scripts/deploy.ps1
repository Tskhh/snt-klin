# Deploy СНТ «Клин» to Vercel + Neon PostgreSQL
#
# Before running:
# 1. Create free DB at https://neon.tech → copy connection string
# 2. Login to Vercel: npx vercel login
#
# Usage:
#   .\scripts\deploy.ps1 -DatabaseUrl "postgresql://..." -JwtSecret "long-random-secret"

param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl,

  [Parameter(Mandatory = $true)]
  [string]$JwtSecret
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "Checking Vercel login..." -ForegroundColor Cyan
npx vercel whoami | Out-Null

Write-Host "Linking project..." -ForegroundColor Cyan
npx vercel link --yes

Write-Host "Setting environment variables..." -ForegroundColor Cyan
$DatabaseUrl | npx vercel env add DATABASE_URL production --force
$JwtSecret | npx vercel env add JWT_SECRET production --force
$DatabaseUrl | npx vercel env add DATABASE_URL preview --force
$JwtSecret | npx vercel env add JWT_SECRET preview --force

Write-Host "Deploying to production..." -ForegroundColor Cyan
npx vercel deploy --prod --yes

Write-Host ""
Write-Host "Seeding demo data..." -ForegroundColor Cyan
$env:DATABASE_URL = $DatabaseUrl
$env:JWT_SECRET = $JwtSecret
npm run db:seed

Write-Host ""
Write-Host "Done! Open your Vercel URL from the output above." -ForegroundColor Green
Write-Host "Demo login: admin@snt-klin.ru / admin123" -ForegroundColor Yellow
