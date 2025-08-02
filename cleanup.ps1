# Script para limpiar procesos de FlowPhone

Write-Host "🧹 Limpiando procesos de FlowPhone..." -ForegroundColor Yellow

# Buscar y terminar procesos de Node.js en los puertos 3000 y 3002
$processes = @(3000, 3002)

foreach ($port in $processes) {
    $processInfo = netstat -ano | findstr ":$port "
    if ($processInfo) {
        Write-Host "🔍 Encontrado proceso en puerto $port" -ForegroundColor Cyan
        $processInfo | ForEach-Object {
            $parts = $_ -split '\s+'
            $processId = $parts[-1]
            if ($processId -match '^\d+$') {
                try {
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Proceso $processId terminado" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️  No se pudo terminar proceso $processId" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "✅ Puerto $port libre" -ForegroundColor Green
    }
}

Write-Host "🎉 Limpieza completada!" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar: npm run dev" -ForegroundColor Cyan
