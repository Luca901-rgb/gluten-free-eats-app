
import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Booking } from '@/context/BookingContext';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookings: Booking[];
  onConfirmBooking: (id: string) => void;
}

const NotificationDialog = ({
  open,
  onOpenChange,
  bookings,
  onConfirmBooking
}: NotificationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Nuove prenotazioni in attesa
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {bookings.map(booking => (
              <div key={booking.id} className="border rounded-md p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString('it-IT')} alle{' '}
                      {new Date(booking.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm">{booking.people} {booking.people === 1 ? 'persona' : 'persone'}</p>
                  </div>
                  <div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => onConfirmBooking(booking.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conferma
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
