Write-Host "Limpiando puertos 3000 y 3002..." -ForegroundColor Yellow

# Buscar procesos en puerto 3000
$proc3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($proc3000) {
    $processId = $proc3000.OwningProcess
    Stop-Process -Id $processId -Force
    Write-Host "Puerto 3000 liberado" -ForegroundColor Green
}

# Buscar procesos en puerto 3002  
$proc3002 = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
if ($proc3002) {
    $processId = $proc3002.OwningProcess
    Stop-Process -Id $processId -Force
    Write-Host "Puerto 3002 liberado" -ForegroundColor Green
}

Write-Host "Limpieza completada. Puedes ejecutar npm run dev" -ForegroundColor Cyan
