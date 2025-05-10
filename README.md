
# Gluten Free Eats

## Istruzioni di sviluppo

A causa di problemi con i moduli nativi di Rollup in alcuni ambienti, utilizza i seguenti script per avviare l'applicazione:

### Windows:
```
run-dev.bat
```

### Linux/MacOS:
```
chmod +x run-dev.sh
./run-dev.sh
```

Questi script includono le patch necessarie per prevenire errori con i moduli nativi di Rollup.

## Prima configurazione

Se è la prima volta che avvii l'applicazione, o se riscontri errori nel caricamento dei moduli:

### Windows:
```
clean-reinstall.bat
```
E poi esegui:
```
run-dev.bat
```

### Linux/MacOS:
```
chmod +x make-scripts-executable.sh
./make-scripts-executable.sh
chmod +x clean-reinstall.sh
./clean-reinstall.sh
./run-dev.sh
```

## Risoluzione problemi

Se riscontri ancora errori con i moduli nativi di Rollup:

1. Assicurati che Node.js sia aggiornato a una versione recente
2. Cancella la cartella node_modules e package-lock.json
3. Esegui lo script clean-reinstall per la tua piattaforma
4. Usa lo script run-dev per avviare l'applicazione

Gli script di avvio patchati funzionano intercettando e bloccando il caricamento di moduli nativi problematici.
