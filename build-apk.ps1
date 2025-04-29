
# Script PowerShell per costruire l'APK di Gluten Free Eats

Write-Host "Iniziando il processo di build per Gluten Free Eats..." -ForegroundColor Green

# Step 1: Installazione delle dipendenze
Write-Host "Installazione delle dipendenze..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Errore durante l'installazione delle dipendenze!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Step 2: Build dell'applicazione web
Write-Host "Build dell'applicazione web..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Errore durante la build dell'applicazione web!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Step 3: Verificare se la directory android esiste
if (-not (Test-Path -Path ".\android")) {
    Write-Host "Configurazione del progetto Android..." -ForegroundColor Yellow
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Errore durante la configurazione del progetto Android!" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
else {
    Write-Host "Sincronizzazione con il progetto Android..." -ForegroundColor Yellow
    npx cap sync android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Errore durante la sincronizzazione del progetto Android!" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

# Step 4: Build dell'APK
Write-Host "Build dell'APK..." -ForegroundColor Yellow

$gradlePath = ".\android\gradlew.bat"
$buildCommand = "assembleDebug"

# Verificare se il file gradlew.bat esiste
if (Test-Path -Path $gradlePath) {
    # Cambiare alla directory android e eseguire gradlew assembleDebug
    Set-Location -Path ".\android"
    
    # Pulire prima la build
    Write-Host "Pulizia delle build precedenti..." -ForegroundColor Yellow
    & ".\gradlew.bat" clean
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Errore durante la pulizia delle build precedenti!" -ForegroundColor Red
        Set-Location -Path ".."
        exit $LASTEXITCODE
    }
    
    # Build dell'APK
    Write-Host "Creazione dell'APK..." -ForegroundColor Yellow
    & ".\gradlew.bat" $buildCommand
    $buildResult = $LASTEXITCODE
    
    # Tornare alla directory principale
    Set-Location -Path ".."
    
    if ($buildResult -ne 0) {
        Write-Host "Errore durante la build dell'APK!" -ForegroundColor Red
        exit $buildResult
    }
}
else {
    Write-Host "Errore: Il file gradlew.bat non è stato trovato in .\android\" -ForegroundColor Red
    exit 1
}

# Step 5: Verificare se l'APK è stato creato correttamente
$apkPath = ".\android\app\build\outputs\apk\debug\app-debug.apk"

if (Test-Path -Path $apkPath) {
    Write-Host "APK creato con successo in: $apkPath" -ForegroundColor Green
    
    # Copia l'APK nella directory principale per un facile accesso
    Copy-Item -Path $apkPath -Destination ".\gluten-free-eats.apk" -Force
    Write-Host "APK copiato nella directory principale come gluten-free-eats.apk" -ForegroundColor Green
    
    Write-Host "`nPer installare l'APK sul tuo dispositivo Android:" -ForegroundColor Cyan
    Write-Host "1. Trasferisci il file gluten-free-eats.apk al tuo dispositivo" -ForegroundColor Cyan
    Write-Host "2. Sul dispositivo, naviga fino al file e toccalo per installarlo" -ForegroundColor Cyan
    Write-Host "3. Potrebbe essere necessario abilitare 'Installazione da origini sconosciute' nelle impostazioni" -ForegroundColor Cyan
}
else {
    Write-Host "Errore: APK non trovato nel percorso atteso: $apkPath" -ForegroundColor Red
    exit 1
}

Write-Host "`nProcesso di build completato!" -ForegroundColor Green
