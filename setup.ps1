# Script de configuración automática para FlowPhone (Windows)

Write-Host "🚀 Configurando FlowPhone..." -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Instalar dependencias del frontend
Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del frontend" -ForegroundColor Red
    exit 1
}

# Instalar dependencias del backend
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del backend" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "✅ Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Para iniciar el proyecto:" -ForegroundColor Cyan
Write-Host "   npm run dev      - Inicia frontend y backend" -ForegroundColor White
Write-Host "   npm start        - Solo frontend" -ForegroundColor White
Write-Host "   npm run backend  - Solo backend" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs de acceso:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3002" -ForegroundColor White
Write-Host "   API:      http://localhost:3002/api" -ForegroundColor White
