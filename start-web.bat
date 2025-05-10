
@echo off
echo Avvio dell'applicazione web...

REM Impostazione variabili d'ambiente per evitare moduli nativi
set ROLLUP_NATIVE=false
set ROLLUP_NATIVE_BUILD=false
set npm_config_rollup_native_build=false

REM Avvio dell'applicazione
echo Avvio con disabilitazione esplicita dei moduli nativi di Rollup...
call npm run dev

pause
