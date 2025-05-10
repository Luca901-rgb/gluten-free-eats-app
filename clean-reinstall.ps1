
# Script PowerShell per pulire e reinstallare le dipendenze

Write-Host "Pulizia dell'ambiente di sviluppo..." -ForegroundColor Yellow

# Rimozione di node_modules
if (Test-Path -Path ".\node_modules") {
    Write-Host "Rimozione della cartella node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".\node_modules"
    Write-Host "Cartella node_modules rimossa con successo." -ForegroundColor Green
} else {
    Write-Host "La cartella node_modules non esiste." -ForegroundColor Cyan
}

# Rimozione di package-lock.json
if (Test-Path -Path ".\package-lock.json") {
    Write-Host "Rimozione del file package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force ".\package-lock.json"
    Write-Host "File package-lock.json rimosso con successo." -ForegroundColor Green
} else {
    Write-Host "Il file package-lock.json non esiste." -ForegroundColor Cyan
}

# Reinstallazione delle dipendenze
Write-Host "Reinstallazione delle dipendenze..." -ForegroundColor Yellow
npm install

Write-Host "`nPulizia e reinstallazione completate!" -ForegroundColor Green
Write-Host "Ora puoi avviare l'applicazione con 'npm run dev'" -ForegroundColor Cyan
