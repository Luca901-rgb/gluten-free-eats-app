
@echo off
echo Pulizia dell'ambiente di sviluppo...

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
) else (
    echo Il file package-lock.json non esiste.
)

REM Reinstallazione delle dipendenze
echo Reinstallazione delle dipendenze...
call npm install

echo.
echo Pulizia e reinstallazione completate!
echo Ora puoi avviare l'applicazione con 'npm run dev'
pause
