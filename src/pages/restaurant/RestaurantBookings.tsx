import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistance } from 'date-fns';
import { it } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentForm from '@/components/Booking/PaymentForm';
import PaymentManager from '@/components/Payment/PaymentManager';

const RestaurantBookings = () => {
  const hidePayment = true;

  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      customerName: 'Mario Rossi', 
      date: '2023-09-15', 
      time: '19:30', 
      guests: 4, 
      status: 'confirmed',
      phone: '+39 123 456 7890',
      hasGuarantee: true,
      attendance: null
    },
    { 
      id: 2, 
      customerName: 'Giulia Bianchi', 
      date: '2023-09-15', 
      time: '20:00', 
      guests: 2, 
      status: 'pending',
      phone: '+39 098 765 4321',
      hasGuarantee: false,
      attendance: null
    },
    { 
      id: 3, 
      customerName: 'Paolo Verdi', 
      date: '2023-09-16', 
      time: '13:00', 
      guests: 6, 
      status: 'confirmed',
      phone: '+39 333 444 5555',
      hasGuarantee: true,
      attendance: null
    },
    { 
      id: 4, 
      customerName: 'Chiara Neri', 
      date: '2023-09-17', 
      time: '20:30', 
      guests: 3, 
      status: 'cancelled',
      phone: '+39 777 888 9999',
      hasGuarantee: false,
      attendance: null
    }
  ]);

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

  const handleConfirmBooking = (id: number) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: 'confirmed'} : booking
    ));
  };

  const handleCancelBooking = (id: number) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: 'cancelled'} : booking
    ));
  };

  const handleConfirmAttendance = (id: number) => {
    if (hidePayment) {
      setBookings(bookings.map(booking => 
        booking.id === id ? {...booking, attendance: 'confirmed'} : booking
      ));
      toast.success('Presenza cliente confermata');
      return;
    }
    
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    
    setCurrentBookingId(id);
    setShowPaymentDialog(true);
  };

  const handleNoShow = (id: number) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, attendance: 'no-show'} : booking
    ));
    toast.success('Cliente segnato come no-show. La carta di garanzia verrà addebitata automaticamente.');
  };

  const handlePaymentComplete = (success: boolean) => {
    if (success && currentBookingId) {
      setBookings(bookings.map(booking => 
        booking.id === currentBookingId ? {...booking, attendance: 'confirmed'} : booking
      ));
      toast.success('Pagamento completato e presenza cliente confermata');
    }
    setShowPaymentDialog(false);
    setCurrentBookingId(null);
  };

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

  const bookingsByDate = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {} as Record<string, typeof bookings>);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Prenotazioni</h1>
        
        {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
          <div key={date} className="mb-6">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            
            <div className="space-y-3">
              {dateBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{booking.customerName}</h3>
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {booking.time}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          {booking.guests} {booking.guests === 1 ? 'persona' : 'persone'}
                        </div>
                        <div>
                          <a href={`tel:${booking.phone}`} className="text-primary underline">{booking.phone}</a>
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
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Rifiuta
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleConfirmBooking(booking.id)}
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
                        onClick={() => handleNoShow(booking.id)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Segna No-Show
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleConfirmAttendance(booking.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {hidePayment ? 'Conferma Presenza' : 'Conferma Presenza e Paga'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {bookings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Nessuna prenotazione disponibile</p>
          </div>
        )}

        {!hidePayment && (
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pagamento servizio di prenotazione</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <PaymentManager 
                  amount={0.99} 
                  description="Pagamento del servizio di prenotazione. Questo importo verrà addebitato per ogni presenza confermata."
                  isRestaurantPayment={true}
                  onPaymentComplete={handlePaymentComplete}
                  hidePayment={hidePayment}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantBookings;
