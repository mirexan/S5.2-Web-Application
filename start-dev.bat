@echo off
TITLE Boticarium Launcher
echo ==========================================
echo 🚀 INICIANDO BOTICARIUM (Backend + Front)
echo ==========================================

:: 1. Intentar arrancar Docker (si no está arrancado ya)
echo [1/3] Verificando Docker...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
:: Esperamos 5 segundos
timeout /t 5 >nul

:: 2. Arrancar Backend (Java)
echo [2/3] Arrancando Backend (Puerto 8080)...
:: IMPORTANTE: Como el backend está en la raíz, usamos "%~dp0" (carpeta actual)
:: Ejecutamos "mvnw" directamente.
start "LOGS BACKEND (Spring Boot)" /d "%~dp0" cmd /k "mvnw spring-boot:run"

:: 3. Arrancar Frontend (React)
echo [3/3] Arrancando Frontend (Puerto 5173)...
:: Aquí sí entramos en la carpeta "boticarium-front"
start "LOGS FRONTEND (React)" /d "%~dp0boticarium-front" cmd /k "npm run dev"

echo.
echo ✅ TODO LISTO. Minimiza esta ventana (no la cierres).
echo ------------------------------------------
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ------------------------------------------
pause