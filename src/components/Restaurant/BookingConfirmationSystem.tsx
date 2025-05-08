
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/context/BookingContext';
import { Booking } from '@/context/BookingContext';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface BookingConfirmationSystemProps {
  restaurantId: string;
}

const BookingConfirmationSystem: React.FC<BookingConfirmationSystemProps> = ({ restaurantId }) => {
  const { bookings, updateBooking, getBookingsByRestaurantId } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Ottieni solo le prenotazioni per questo ristorante
  const restaurantBookings = getBookingsByRestaurantId(restaurantId);
  
  // Filtra le prenotazioni confermate ma senza conferma di arrivo
  const pendingArrivalBookings = restaurantBookings.filter(
    booking => booking.status === 'confirmed' && !booking.attendance
  );
  
  // Filtra le prenotazioni di oggi
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = pendingArrivalBookings.filter(
    booking => booking.date.startsWith(today)
  );

  const handleOpenDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleConfirmAttendance = (confirmed: boolean) => {
    if (selectedBooking) {
      // Se confermata la presenza, impostiamo attendance a 'confirmed'
      // altrimenti a 'no-show'
      const attendance = confirmed ? 'confirmed' : 'no-show';
      
      // Se confermiamo la presenza, generiamo anche il codice per la recensione
      if (confirmed) {
        // Genera il codice per recensione ristorante -> cliente
        const restaurantReviewCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        updateBooking(selectedBooking.id, { 
          attendance, 
          restaurantReviewCode
        });
        
        toast.success(`Presenza confermata per ${selectedBooking.customerName}`);
      } else {
        updateBooking(selectedBooking.id, { attendance });
        toast.info(`Cliente ${selectedBooking.customerName} segnato come non presentato`);
      }
      
      setIsDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  if (todayBookings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-gray-500">Nessuna prenotazione da confermare per oggi</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3">Conferma arrivi di oggi</h3>
      <div className="space-y-3">
        {todayBookings.map((booking) => (
          <div key={booking.id} className="bg-white shadow rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{booking.customerName}</p>
              <p className="text-sm text-gray-500">
                {new Date(booking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {booking.people} persone
              </p>
            </div>
            <Button 
              onClick={() => handleOpenDialog(booking)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>Conferma</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Dialog per conferma arrivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma presenza cliente</DialogTitle>
            <DialogDescription>
              {selectedBooking ? (
                <div className="py-2">
                  <p><strong>Cliente:</strong> {selectedBooking.customerName}</p>
                  <p><strong>Data:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                  <p><strong>Orario:</strong> {new Date(selectedBooking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p><strong>Persone:</strong> {selectedBooking.people}</p>
                </div>
              ) : 'Seleziona una prenotazione'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="destructive" 
              className="flex-1 flex items-center justify-center" 
              onClick={() => handleConfirmAttendance(false)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cliente non presentato
            </Button>
            <Button 
              variant="default" 
              className="flex-1 flex items-center justify-center"
              onClick={() => handleConfirmAttendance(true)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Conferma presenza
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingConfirmationSystem;
