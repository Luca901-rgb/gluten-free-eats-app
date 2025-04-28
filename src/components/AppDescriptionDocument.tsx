
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from './ui/button';

const AppDescriptionDocument = () => {
  const generateDocument = () => {
    const description = `# Gluten Free Eats - Descrizione Dettagliata

## Panoramica
Gluten Free Eats è un'applicazione mobile progettata specificamente per persone celiache o con intolleranza al glutine, permettendo loro di scoprire, valutare e prenotare ristoranti che offrono menù senza glutine.

## Funzionalità Principali

### Autenticazione e Gestione Utenti
- Sistema di registrazione e login per utenti normali
- Accesso separato per ristoratori e amministratori
- Profilo utente personalizzabile con preferenze alimentari

### Ricerca e Scoperta Ristoranti
- Elenco di ristoranti certificati senza glutine
- Ricerca avanzata con filtri
- Geolocalizzazione per ristoranti nelle vicinanze

### Prenotazioni
- Sistema completo di prenotazione tavoli
- Selezione di data, ora e numero di persone
- Notifiche per ristoratori
- Sistema di conferma presenza

### Menù e Offerta Gastronomica
- Visualizzazione completa dei menù
- Informazioni sugli allergeni
- Possibilità di scaricare il menù in PDF

### Recensioni e Feedback
- Sistema di valutazione dei ristoranti
- Recensioni verificate post-visita
- Valutazioni a stelle

### Contenuti Multimediali
- Galleria fotografica
- Video-ricette senza glutine
- Contenuti educativi

### Dashboard Ristoratore
- Gestione completa del ristorante
- Monitoraggio prenotazioni in tempo reale
- Gestione menù e informazioni

### Funzionalità Offline
- Funzionamento offline
- Cache intelligente
- Sincronizzazione automatica

### Aspetti Tecnici
- App nativa per Android e iOS
- Interfaccia reattiva
- Database Firebase
- Service worker per offline

## Design e Interfaccia
- Design moderno tema verde
- Layout intuitivo
- Animazioni fluide
- Icone specifiche gluten-free

## Sicurezza e Privacy
- Autenticazione sicura
- Protezione dati personali
- Separazione ruoli utente

## Integrazioni
- Google Maps
- Generazione PDF
- Condivisione social`;

    const blob = new Blob([description], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GlutenFreeEats_Descrizione.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Descrizione dell'App</h2>
      </div>
      <Button 
        onClick={generateDocument}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      >
        <Download className="w-4 h-4" />
        Scarica Descrizione
      </Button>
    </div>
  );
};

export default AppDescriptionDocument;
