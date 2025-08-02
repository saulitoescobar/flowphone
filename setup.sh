#!/bin/bash
# Script de configuración automática para FlowPhone

echo "🚀 Configurando FlowPhone..."
echo "=============================="

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo "✅ Instalación completada!"
echo ""
echo "🎯 Para iniciar el proyecto:"
echo "   npm run dev      - Inicia frontend y backend"
echo "   npm start        - Solo frontend"
echo "   npm run backend  - Solo backend"
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3002"
echo "   API:      http://localhost:3002/api"
