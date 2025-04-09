
import React from 'react';
import { AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Booking } from '@/context/BookingContext';

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookings: Booking[];
  onConfirmAttendance: (id: string) => void;
  onNoShow: (id: string) => void;
}

const AttendanceDialog = ({
  open,
  onOpenChange,
  bookings,
  onConfirmAttendance,
  onNoShow
}: AttendanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            Conferma presenza clienti
          </DialogTitle>
          <DialogDescription>
            Le seguenti prenotazioni sono passate da più di un&apos;ora e necessitano di verifica presenza.
          </DialogDescription>
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
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => onNoShow(booking.id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      No Show
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-green-600"
                      onClick={() => onConfirmAttendance(booking.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Presente
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Verifica più tardi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
