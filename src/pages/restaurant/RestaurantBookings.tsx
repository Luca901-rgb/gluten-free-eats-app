
import React, { useState, useEffect } from 'react';
import { useBookings } from '@/context/BookingContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import BookingConfirmationSystem from '@/components/Restaurant/BookingConfirmationSystem';

const RestaurantBookings = () => {
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [restaurantId, setRestaurantId] = useState('1'); // In una vera app, questo verrebbe recuperato dai dati utente

  // Group bookings by date
  const groupBookingsByDate = (bookingsToGroup: any[]) => {
    const grouped = bookingsToGroup.reduce((acc, booking) => {
      const date = new Date(booking.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {});
    
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, bookings]) => ({ date, bookings }));
  };

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeTab) {
      case 'upcoming':
        return bookingDate >= today && booking.status !== 'cancelled';
      case 'past':
        return bookingDate < today || booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const groupedBookings = groupBookingsByDate(filteredBookings);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Gestione Prenotazioni</h1>
      
      <div className="mb-6">
        <BookingConfirmationSystem restaurantId={restaurantId} />
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Prossime</TabsTrigger>
          <TabsTrigger value="past">Passate</TabsTrigger>
          <TabsTrigger value="cancelled">Cancellate</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {groupedBookings.length > 0 ? (
            <div className="space-y-6">
              {groupedBookings.map(({ date, bookings }: any) => (
                <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-medium flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      {new Date(date).toLocaleDateString('it-IT', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h2>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {bookings.reduce((sum: number, b: any) => sum + b.people, 0)} persone
                    </span>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {(bookings as any[]).map((booking) => (
                      <div key={booking.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{booking.customerName}</h3>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confermata' :
                               booking.status === 'pending' ? 'In attesa' :
                               booking.status === 'completed' ? 'Completata' :
                               'Cancellata'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {booking.people} {booking.people === 1 ? 'persona' : 'persone'}
                          </p>
                          {booking.notes && (
                            <p className="text-sm text-gray-500 italic mt-1">"{booking.notes}"</p>
                          )}
                        </div>
                        
                        {/* Status indicators for attendance */}
                        <div className="flex items-center">
                          {booking.attendance === 'confirmed' && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Presente
                            </span>
                          )}
                          
                          {booking.attendance === 'no-show' && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Non presentato
                            </span>
                          )}
                          
                          {booking.restaurantReviewCode && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Codice: {booking.restaurantReviewCode}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-900">Nessuna prenotazione</h2>
              <p className="mt-1 text-gray-500">Non ci sono prenotazioni {activeTab === 'upcoming' ? 'future' : activeTab === 'past' ? 'passate' : 'cancellate'}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantBookings;
