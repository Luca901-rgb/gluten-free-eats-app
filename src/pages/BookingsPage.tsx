
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { CalendarClock, History, ChevronRight, MapPin, Check, Clock, Calendar, CalendarDays, User, Info, FileCode } from 'lucide-react';
import { useBookings, Booking } from '@/context/BookingContext';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';
import { it } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface BookingItemProps {
  booking: Booking;
  isExpandable?: boolean;
  onViewCodeClick?: () => void;
  onCancelClick?: () => void;
  showButtons?: boolean;
}

const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  isExpandable = true,
  onViewCodeClick,
  onCancelClick,
  showButtons = true
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedDate = format(parseISO(booking.date), 'EEEE d MMMM yyyy', { locale: it });
  const formattedTime = format(parseISO(booking.date), 'HH:mm');
  const isPast = isBefore(parseISO(booking.date), new Date());
  const isWithinTwoHours = isBefore(new Date(), addHours(parseISO(booking.date), -2));
  const canCancel = isWithinTwoHours && !isPast && booking.status !== 'cancelled' && booking.status !== 'completed';
  
  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    } else if (booking.restaurantId) {
      navigate(`/restaurant/${booking.restaurantId}`);
    }
  };
  
  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCancelClick) onCancelClick();
  };
  
  const handleViewCodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewCodeClick) onViewCodeClick();
  };
  
  const getStatusLabel = () => {
    switch (booking.status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'completed': return 'Completata';
      case 'cancelled': return 'Cancellata';
      default: return 'Sconosciuto';
    }
  };
  
  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        isPast && booking.status !== 'cancelled' ? "border-gray-200" : "border-gray-200",
        isExpanded ? "bg-gray-50" : "bg-white",
        isExpandable ? "cursor-pointer hover:bg-gray-50" : ""
      )}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-lg">{booking.restaurantName}</h3>
              <Badge className={cn("ml-2", getStatusColor())}>
                {getStatusLabel()}
              </Badge>
            </div>
            
            <div className="mt-1 text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formattedDate}, {formattedTime}</span>
            </div>
            
            <div className="mt-1 text-gray-500 flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{booking.people} {booking.people === 1 ? 'persona' : 'persone'}</span>
            </div>
          </div>
          
          {booking.restaurantImage && (
            <div className="ml-4">
              <img 
                src={booking.restaurantImage} 
                alt={booking.restaurantName} 
                className="w-16 h-16 object-cover rounded-md"
              />
            </div>
          )}
          
          {isExpandable && (
            <ChevronRight className={`w-5 h-5 text-gray-400 ml-2 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-3 pt-4 border-t">
            {booking.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700">Note:</p>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </div>
            )}
            
            {booking.additionalOptions && booking.additionalOptions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Opzioni aggiuntive:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {booking.additionalOptions.map((option, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-700">Codice prenotazione:</p>
              <p className="text-sm font-mono">{booking.bookingCode}</p>
            </div>
            
            {booking.restaurantReviewCode && (
              <div>
                <p className="text-sm font-medium text-gray-700">Codice recensione:</p>
                <p className="text-sm font-mono">{booking.restaurantReviewCode}</p>
              </div>
            )}
            
            {showButtons && (
              <div className="flex flex-wrap gap-2 pt-2">
                {booking.restaurantReviewCode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={handleViewCodeClick}
                  >
                    <FileCode className="w-3 h-3 mr-1" />
                    Codici recensione
                  </Button>
                )}
                
                {canCancel && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCancelClick}
                  >
                    Cancella prenotazione
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const BookingsPage: React.FC = () => {
  const { bookings, cancelBooking } = useBookings();
  const navigate = useNavigate();
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const upcomingBookings = sortedBookings.filter(booking => 
    isAfter(parseISO(booking.date), new Date()) && 
    booking.status !== 'cancelled'
  );
  
  const pastBookings = sortedBookings.filter(booking => 
    isBefore(parseISO(booking.date), new Date()) || 
    booking.status === 'cancelled'
  );
  
  const handleCancelBooking = () => {
    if (activeBookingId) {
      cancelBooking(activeBookingId);
      setShowCancelDialog(false);
      toast.success("Prenotazione cancellata con successo");
    }
  };
  
  const handleViewRestaurant = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };
  
  const handleLeaveReview = (booking: Booking) => {
    navigate(`/restaurant/${booking.restaurantId}?tab=reviews&bookingCode=${booking.bookingCode}&restaurantCode=${booking.restaurantReviewCode || ''}`);
  };
  
  const emptyState = (
    <div className="text-center py-10 text-gray-500">
      <CalendarClock size={48} className="mx-auto opacity-20 mb-4" />
      <p className="text-lg">Non hai ancora effettuato prenotazioni</p>
      <p className="text-sm mt-2">Trova un ristorante e prenota un tavolo</p>
    </div>
  );
  
  const activeBooking = bookings.find(b => b.id === activeBookingId);

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Le mie prenotazioni</h1>
        
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Prossime</TabsTrigger>
            <TabsTrigger value="past">Passate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => (
                <BookingItem 
                  key={booking.id} 
                  booking={booking} 
                  onCancelClick={() => {
                    setActiveBookingId(booking.id);
                    setShowCancelDialog(true);
                  }}
                  onViewCodeClick={() => {
                    setActiveBookingId(booking.id);
                    setShowCodeDialog(true);
                  }}
                />
              ))
            ) : (
              emptyState
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map(booking => (
                <BookingItem 
                  key={booking.id} 
                  booking={booking} 
                  onViewCodeClick={() => {
                    setActiveBookingId(booking.id);
                    setShowCodeDialog(true);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <History size={48} className="mx-auto opacity-20 mb-4" />
                <p className="text-lg">Nessuna prenotazione passata</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog per conferma cancellazione */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancella prenotazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler cancellare questa prenotazione? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancella prenotazione
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog per visualizzare i codici */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Codici recensione</DialogTitle>
            <DialogDescription>
              Utilizza questi codici per lasciare una recensione verificata al ristorante
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-medium">Codice cliente</p>
                  <p className="col-span-2 font-mono bg-background p-1 rounded border text-sm">
                    {activeBooking?.bookingCode}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-medium">Codice ristorante</p>
                  <p className="col-span-2 font-mono bg-background p-1 rounded border text-sm">
                    {activeBooking?.restaurantReviewCode || 'Non disponibile'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800">
                  Il codice ristorante viene fornito quando completi la tua visita. Se non hai ancora ricevuto il codice, chiedi al ristoratore di fornirti il codice alla fine del tuo pasto.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="sm:flex-1"
              onClick={() => setShowCodeDialog(false)}
            >
              Chiudi
            </Button>
            
            {activeBooking && activeBooking.restaurantReviewCode && (
              <Button 
                className="sm:flex-1"
                onClick={() => {
                  setShowCodeDialog(false);
                  handleLeaveReview(activeBooking);
                }}
              >
                Lascia recensione
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BookingsPage;
