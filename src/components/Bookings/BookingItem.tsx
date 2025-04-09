
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle, XCircle, CreditCard, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Booking } from '@/context/BookingContext';

interface BookingItemProps {
  booking: Booking;
  isUnread: boolean;
  isAttendancePending: boolean;
  onConfirmBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onConfirmAttendance: (id: string) => void;
  onNoShow: (id: string) => void;
}

const BookingItem = ({
  booking,
  isUnread,
  isAttendancePending,
  onConfirmBooking,
  onCancelBooking,
  onConfirmAttendance,
  onNoShow
}: BookingItemProps) => {
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confermata</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">In attesa</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancellata</Badge>;
      default:
        return null;
    }
  };

  const getAttendanceBadge = (attendance: string | null) => {
    if (!attendance) return null;
    switch(attendance) {
      case 'confirmed':
        return <Badge className="bg-green-500">Presenza confermata</Badge>;
      case 'no-show':
        return <Badge className="bg-red-500">No-show</Badge>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow p-4",
        isUnread && booking.status === 'pending' && "border-2 border-primary",
        isAttendancePending && "border-2 border-amber-500"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{booking.customerName}</h3>
          <div className="text-sm text-gray-500 mt-1 space-y-1">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {new Date(booking.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              {booking.people} {booking.people === 1 ? 'persona' : 'persone'}
            </div>
            <div>
              <span className="text-primary">Codice prenotazione: {booking.bookingCode}</span>
            </div>
            {booking.hasGuarantee && (
              <div className="flex items-center text-green-600">
                <CreditCard className="mr-2 h-4 w-4" />
                Carta di garanzia registrata
              </div>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col gap-2">
          {getStatusBadge(booking.status)}
          {getAttendanceBadge(booking.attendance)}
          
          {booking.restaurantReviewCode && (
            <div className="text-xs text-green-700 flex items-center">
              <CheckCheck className="h-3 w-3 mr-1" />
              Codice recensione generato
            </div>
          )}
        </div>
      </div>
      
      {booking.status === 'pending' && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => onCancelBooking(booking.id)}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Rifiuta
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onConfirmBooking(booking.id)}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Conferma
          </Button>
        </div>
      )}

      {booking.status === 'confirmed' && booking.attendance === null && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => onNoShow(booking.id)}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Segna No-Show
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onConfirmAttendance(booking.id)}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Conferma Presenza
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingItem;
