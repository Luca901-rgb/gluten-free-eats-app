
@echo off
echo Avvio dell'applicazione web...

REM Impostazione variabili d'ambiente per evitare moduli nativi
set ROLLUP_NATIVE=false
set ROLLUP_NATIVE_BUILD=false

REM Avvio dell'applicazione
call npm run dev

pause
