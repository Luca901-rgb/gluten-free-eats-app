
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, XCircle } from 'lucide-react';

const RestaurantBookings = () => {
  // Mock bookings data
  const [bookings, setBookings] = React.useState([
    { 
      id: 1, 
      customerName: 'Mario Rossi', 
      date: '2023-09-15', 
      time: '19:30', 
      guests: 4, 
      status: 'confirmed',
      phone: '+39 123 456 7890'
    },
    { 
      id: 2, 
      customerName: 'Giulia Bianchi', 
      date: '2023-09-15', 
      time: '20:00', 
      guests: 2, 
      status: 'pending',
      phone: '+39 098 765 4321'
    },
    { 
      id: 3, 
      customerName: 'Paolo Verdi', 
      date: '2023-09-16', 
      time: '13:00', 
      guests: 6, 
      status: 'confirmed',
      phone: '+39 333 444 5555'
    },
    { 
      id: 4, 
      customerName: 'Chiara Neri', 
      date: '2023-09-17', 
      time: '20:30', 
      guests: 3, 
      status: 'cancelled',
      phone: '+39 777 888 9999'
    }
  ]);

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

  // Group bookings by date
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
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
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
      </div>
    </Layout>
  );
};

export default RestaurantBookings;
