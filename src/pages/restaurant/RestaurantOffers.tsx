
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Calendar, Percent, Bell, Trash } from 'lucide-react';
import OfferForm from '@/components/Restaurant/OfferForm';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from 'sonner';

interface Offer {
  id?: string;
  restaurantId: string;
  title: string;
  description: string;
  discount: number;
  validFrom: Date | string;
  validTo: Date | string;
  createdAt?: any;
  updatedAt?: any;
  isActive?: boolean;
  notificationSent?: boolean;
}

interface RestaurantOffersProps {
  isRestaurantOwner?: boolean;
}

const RestaurantOffers: React.FC<RestaurantOffersProps> = ({ isRestaurantOwner = true }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  useEffect(() => {
    // In una vera implementazione, qui caricherebbe le offerte dal database
    // Per ora usiamo dati di esempio
    const mockOffers: Offer[] = [
      {
        id: '1',
        restaurantId: 'rest1',
        title: 'Menù degustazione senza glutine',
        description: 'Un percorso completo con 4 portate senza glutine a prezzo speciale',
        discount: 15,
        validFrom: new Date('2025-06-01'),
        validTo: new Date('2025-06-30'),
        isActive: true,
        notificationSent: true
      },
      {
        id: '2',
        restaurantId: 'rest1',
        title: 'Pizza senza glutine 2x1',
        description: 'Ogni due pizze senza glutine, la meno cara è in omaggio',
        discount: 50,
        validFrom: new Date('2025-05-01'),
        validTo: new Date('2025-05-15'),
        isActive: true,
        notificationSent: false
      }
    ];
    
    setOffers(mockOffers);
    setIsLoading(false);
  }, []);
  
  const handleCreateOffer = () => {
    setSelectedOffer(null);
    setIsDialogOpen(true);
  };
  
  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOffer(null);
  };
  
  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    toast.success("Offerta salvata con successo");
    // In un'implementazione reale qui ricaricheremmo le offerte
  };
  
  const handleDeactivate = (offerId: string) => {
    toast.success("Offerta disattivata");
    // In un'implementazione reale qui disattiveremmo l'offerta
    setOffers(offers.map(o => o.id === offerId ? {...o, isActive: false} : o));
  };
  
  const handleDelete = (offerId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa offerta?')) {
      toast.success("Offerta eliminata");
      // In un'implementazione reale qui elimineremmo l'offerta
      setOffers(offers.filter(o => o.id !== offerId));
    }
  };
  
  const handleSendNotifications = (offerId: string) => {
    toast.success("Notifiche inviate ai clienti");
    // In un'implementazione reale qui invieremmo le notifiche
    setOffers(offers.map(o => o.id === offerId ? {...o, notificationSent: true} : o));
  };
  
  const isOfferActive = (offer: Offer): boolean => {
    if (offer.isActive === false) return false;
    
    const now = new Date();
    const validTo = offer.validTo instanceof Date ? offer.validTo : new Date(offer.validTo);
    const validFrom = offer.validFrom instanceof Date ? offer.validFrom : new Date(offer.validFrom);
    
    return validFrom <= now && validTo >= now;
  };
  
  const formatDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'dd MMMM yyyy', { locale: it });
  };
  
  if (!isRestaurantOwner) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Offerte speciali</h2>
        <p className="text-gray-500 text-sm">Le offerte speciali sono visibili solo ai clienti registrati.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Offerte Speciali</h2>
        <Button onClick={handleCreateOffer}>Crea nuova offerta</Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Nessuna offerta trovata</p>
          <Button variant="outline" onClick={handleCreateOffer}>
            Crea la tua prima offerta
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const isActive = isOfferActive(offer);
            
            return (
              <div 
                key={offer.id} 
                className={`bg-white rounded-lg shadow p-4 border ${
                  isActive ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {isActive ? (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded mr-2">
                          ATTIVA
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mr-2">
                          INATTIVA
                        </span>
                      )}
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {offer.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-3">
                      <Percent className="h-4 w-4 mr-1" />
                      <span>{offer.discount}% di sconto</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Valida dal {formatDate(offer.validFrom)} al {formatDate(offer.validTo)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOffer(offer)}
                    >
                      Modifica
                    </Button>
                    
                    {isActive && !offer.notificationSent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendNotifications(offer.id!)}
                        className="flex items-center gap-1"
                      >
                        <Bell className="h-3 w-3" />
                        <span>Notifica</span>
                      </Button>
                    )}
                    
                    {isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(offer.id!)}
                      >
                        Disattiva
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(offer.id!)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedOffer ? 'Modifica offerta' : 'Crea nuova offerta'}
            </DialogTitle>
            <DialogDescription>
              {selectedOffer 
                ? 'Modifica i dettagli dell\'offerta speciale'
                : 'Crea una nuova offerta speciale per i tuoi clienti'
              }
            </DialogDescription>
          </DialogHeader>
          
          <OfferForm 
            initialData={selectedOffer || undefined} 
            onSubmitSuccess={handleFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantOffers;
