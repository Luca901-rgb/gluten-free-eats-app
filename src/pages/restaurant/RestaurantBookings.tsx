
import React, { useState } from 'react';
import { useRestaurantBookings } from '@/hooks/useRestaurantBookings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, CheckCircle, XCircle, Users } from 'lucide-react';
import BookingConfirmationSystem from '@/components/Restaurant/BookingConfirmationSystem';
import ReviewCodeDialog from '@/components/Bookings/ReviewCodeDialog';
import { formatBookingDate, isBookingPast } from '@/components/Bookings/BookingUtils';
import { useNavigate } from 'react-router-dom';

const RestaurantBookings = () => {
  const restaurantId = '1'; // In un'app reale, questo verrebbe dal contesto o da un parametro
  const navigate = useNavigate();
  const {
    bookings,
    isLoading,
    showReviewCodeDialog,
    setShowReviewCodeDialog,
    generatedReviewCode,
    handleCopyCode
  } = useRestaurantBookings(restaurantId);
  
  const [activeTab, setActiveTab] = useState('upcoming');

  // Filtra le prenotazioni per le tab
  const upcomingBookings = bookings.filter(booking => 
    (booking.status === 'confirmed' || booking.status === 'pending') && 
    !isBookingPast(booking.date)
  );
  
  const completedBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && 
    booking.attendance === 'confirmed' && 
    isBookingPast(booking.date)
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled' || 
    booking.attendance === 'no-show'
  );
  
  const handleViewReviews = () => {
    navigate('/restaurant-dashboard?tab=reviews');
    setShowReviewCodeDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Gestione prenotazioni</h2>
      
      {/* Sistema di conferma presenze */}
      <BookingConfirmationSystem restaurantId={restaurantId} />
      
      {/* Tabs per filtrare le prenotazioni */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upcoming">
            In arrivo ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completate ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancellate ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">Nessuna prenotazione in arrivo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className={`overflow-hidden ${
                  booking.status === 'pending' ? 'border-amber-300' : 'border-green-300'
                }`}>
                  <CardContent className="p-0">
                    <div className={`px-4 py-2 ${
                      booking.status === 'pending' ? 'bg-amber-50' : 'bg-green-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${
                          booking.status === 'pending' ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {booking.status === 'pending' ? 'In attesa di conferma' : 'Confermata'}
                        </span>
                        <span className="text-sm text-gray-500">
                          Codice: {booking.bookingCode}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{booking.customerName}</h3>
                      
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatBookingDate(booking.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{booking.people} persone</span>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-2 text-sm text-gray-600 border-l-2 border-gray-200 pl-2">
                          {booking.notes}
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        {booking.status === 'pending' ? (
                          <>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span>Rifiuta</span>
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Conferma</span>
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm">
                            Contatta cliente
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : completedBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">Nessuna prenotazione completata</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.customerName}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatBookingDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{booking.people} persone</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Completata
                        </span>
                        {booking.hasReview && (
                          <div className="text-xs mt-1 text-blue-600">
                            Recensione ricevuta
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : cancelledBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">Nessuna prenotazione cancellata</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cancelledBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.customerName}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatBookingDate(booking.date)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {booking.attendance === 'no-show' ? 'No show' : 'Cancellata'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog per il codice recensione */}
      <ReviewCodeDialog
        open={showReviewCodeDialog}
        onOpenChange={setShowReviewCodeDialog}
        reviewCode={generatedReviewCode}
        onCopyCode={handleCopyCode}
        onViewReviews={handleViewReviews}
      />
    </div>
  );
};

export default RestaurantBookings;
