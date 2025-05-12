
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import OfferForm from '@/components/Restaurant/OfferForm';
import { toast } from 'sonner';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  active: boolean;
}

interface RestaurantOffersProps {
  isRestaurantOwner?: boolean;
}

const RestaurantOffers: React.FC<RestaurantOffersProps> = ({ isRestaurantOwner = true }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    setIsLoading(true);
    // Simulate loading offers from an API
    setTimeout(() => {
      const sampleOffers: Offer[] = [
        { id: '1', title: 'Pizza senza glutine a metà prezzo', description: 'Ogni martedì, pizza senza glutine a metà prezzo.', discount: 50, active: true },
        { id: '2', title: 'Menù degustazione senza glutine', description: 'Menù degustazione a prezzo fisso con 5 portate senza glutine.', discount: 20, active: true },
        { id: '3', title: 'Dolce senza glutine in omaggio', description: 'Con ogni pasto completo, dolce senza glutine in omaggio.', discount: 100, active: false },
      ];
      setOffers(sampleOffers);
      setIsLoading(false);
    }, 500);
  };

  const handleOpenDialog = (offer?: Offer) => {
    setSelectedOffer(offer || null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOffer(null);
  };

  const handleFormSuccess = (newOffer: Offer) => {
    if (selectedOffer) {
      // Update existing offer
      setOffers(offers.map(offer => offer.id === newOffer.id ? newOffer : offer));
      toast.success('Offerta modificata con successo!');
    } else {
      // Add new offer
      setOffers([...offers, newOffer]);
      toast.success('Offerta creata con successo!');
    }
    handleDialogClose();
  };

  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDialogOpen(true);
  };

  const handleDeleteOffer = (offerId: string) => {
    // Simulate deleting an offer
    setOffers(offers.filter(offer => offer.id !== offerId));
    toast.success('Offerta eliminata con successo!');
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Offerte Speciali</CardTitle>
          <CardDescription>Gestisci le offerte speciali per il tuo ristorante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {isRestaurantOwner && (
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Offerta
              </Button>
            )}
          </div>
          {isLoading ? (
            <p>Caricamento offerte...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Sconto</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>{offer.title}</TableCell>
                    <TableCell>{offer.description}</TableCell>
                    <TableCell>{offer.discount}%</TableCell>
                    <TableCell>{offer.active ? 'Attiva' : 'Non attiva'}</TableCell>
                    <TableCell className="text-right">
                      {isRestaurantOwner && (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditOffer(offer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteOffer(offer.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
