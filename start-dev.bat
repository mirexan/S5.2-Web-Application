@echo off
TITLE Boticarium Launcher
CLS
echo ==========================================
echo 🚀 INICIANDO BOTICARIUM (Backend + Front)
echo ==========================================

:: --- PASO 0: CARGA DE VARIABLES DE ENTORNO (Google OAuth) ---
set "GOOGLE_CLIENT_ID="

:: Buscamos el archivo .env.local
if exist "%~dp0boticarium-front\.env.local" (
    echo [0/3] Leyendo .env.local...
    
    :: Leemos el archivo buscando la linea que empieza por VITE_GOOGLE_CLIENT_ID
    for /f "usebackq tokens=1,* delims==" %%A in ("%~dp0boticarium-front\.env.local") do (
        if /I "%%A"=="VITE_GOOGLE_CLIENT_ID" set "GOOGLE_CLIENT_ID=%%B"
    )
)

:: Verificamos si lo hemos encontrado
if defined GOOGLE_CLIENT_ID (
    echo    OK! Google Client ID detectado: %GOOGLE_CLIENT_ID:~0,10%...
) else (
    echo    WARNING: No se encontro VITE_GOOGLE_CLIENT_ID. El login de Google podria fallar en el Backend.
)

:: --- PASO 1: DOCKER ---
echo.
echo [1/3] Verificando Docker...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
timeout /t 3 >nul


:: --- PASO 2: BACKEND (Java) ---
echo.
echo [2/3] Arrancando Backend (Puerto 8080)...
:: Truco: Inyectamos la variable directamente en la nueva ventana para asegurar que Java la vea
start "LOGS BACKEND (Spring Boot)" /d "%~dp0" cmd /k "set GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID% && echo ID Inyectado: %GOOGLE_CLIENT_ID% && mvnw spring-boot:run"


:: --- PASO 3: FRONTEND (React) ---
echo.
echo [3/3] Arrancando Frontend (Puerto 5173)...

:: Entramos a la carpeta para verificar cosas
pushd "%~dp0boticarium-front"

:: Si no existe node_modules, instalamos
if not exist "node_modules" (
    echo    [Frontend] Primera vez detectada. Instalando dependencias...
    call npm install
) else (
    :: Si ya existe, verificamos si falta la libreria nueva de Google
    if not exist "node_modules\@react-oauth\google" (
        echo    [Frontend] Libreria Google OAuth faltante. Instalando...
        call npm install
    )
)

popd

:: Lanzamos el servidor de desarrollo
start "LOGS FRONTEND (React)" /d "%~dp0boticarium-front" cmd /k "npm run dev"

echo.
echo ==========================================
echo ✅ TODO LISTO.
echo ------------------------------------------
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ==========================================
echo Minimiza esta ventana (no la cierres).
pause