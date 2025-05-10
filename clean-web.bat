
@echo off
echo Pulizia dell'ambiente di sviluppo per la Web App...

REM Impostazione variabili d'ambiente per evitare moduli nativi
set ROLLUP_NATIVE=false
set ROLLUP_NATIVE_BUILD=false
set npm_config_rollup_native_build=false

REM Rimozione di node_modules
if exist "node_modules" (
    echo Rimozione della cartella node_modules...
    rmdir /s /q node_modules
    echo Cartella node_modules rimossa con successo.
) else (
    echo La cartella node_modules non esiste.
)

REM Rimozione di package-lock.json
if exist "package-lock.json" (
    echo Rimozione del file package-lock.json...
    del /f package-lock.json
    echo File package-lock.json rimosso con successo.
)

REM Reinstallazione delle dipendenze
echo Reinstallazione delle dipendenze...
echo Installazione con disabilitazione esplicita dei moduli nativi di Rollup...
call npm install --no-optional --ignore-scripts

echo.
echo Pulizia e reinstallazione completate!
echo Ora puoi avviare l'app web con il comando 'npm run dev'
echo oppure usando lo script start-web.bat
pause
