
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, MessageSquare, Trash2, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { format, isBefore, isPast, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useBookings } from '@/context/BookingContext';

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "d MMMM yyyy 'alle' HH:mm", { locale: it });
  } catch (error) {
    return dateString;
  }
};

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { bookings, cancelBooking, updateBooking } = useBookings();

  const upcomingBookings = bookings.filter(booking => 
    !isPast(parseISO(booking.date)) && 
    (booking.status === 'confirmed' || booking.status === 'pending')
  );
  
  const pastBookings = bookings.filter(booking => 
    isPast(parseISO(booking.date)) || booking.status === 'completed'
  );

  const addReviewCode = (bookingId: string, reviewCode: string) => {
    updateBooking(bookingId, { reviewCode: reviewCode, hasReview: false });
    toast.success('Codice recensione salvato! Ora puoi lasciare una recensione');
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const isPending = booking.status === 'pending';
    const isCompleted = booking.status === 'completed' || isPast(parseISO(booking.date));
    const isUpcoming = !isCompleted && !isPending;
    const canBeReviewed = isCompleted && booking.reviewStatus !== 'completed';
    const [reviewCode, setReviewCode] = useState('');
    
    return (
      <Card className="overflow-hidden animate-fade-in">
        <div className="h-32 overflow-hidden">
          <img 
            src={booking.restaurantImage} 
            alt={booking.restaurantName} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{booking.restaurantName}</CardTitle>
              <CardDescription>{formatDate(booking.date)}</CardDescription>
            </div>
            <Badge 
              className={cn(
                "capitalize",
                isPending ? "bg-yellow-500" : 
                isUpcoming ? "bg-green-500" : "bg-gray-500"
              )}
            >
              {isPending ? "In attesa" : isUpcoming ? "Confermata" : "Completata"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3 space-y-2.5">
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{booking.people} {booking.people === 1 ? 'persona' : 'persone'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>Codice prenotazione: {booking.bookingCode}</span>
          </div>
          {booking.notes && (
            <div className="flex items-start text-sm text-gray-600">
              <MessageSquare size={16} className="mr-2 mt-0.5" />
              <span>{booking.notes}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          {!isCompleted && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50">
                  <Trash2 size={16} className="mr-2" /> 
                  Cancella prenotazione
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Stai per cancellare la prenotazione presso {booking.restaurantName} del {formatDate(booking.date)}. Questa azione non può essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancella prenotazione
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {canBeReviewed && (
            <div className="w-full">
              {booking.reviewStatus === 'pending' && (
                <div className="space-y-2 w-full">
                  <p className="text-sm text-gray-600">
                    Inserisci il codice fornito dal ristorante per lasciare una recensione:
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Codice recensione" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={reviewCode}
                      onChange={(e) => setReviewCode(e.target.value)}
                    />
                    <Button 
                      disabled={!reviewCode.trim()} 
                      onClick={() => addReviewCode(booking.id, reviewCode)}
                      size="sm"
                    >
                      <Check size={16} className="mr-1" /> Conferma
                    </Button>
                  </div>
                </div>
              )}
              
              {booking.reviewStatus === 'ready' && (
                <Button className="w-full" onClick={() => {
                  toast.info('Funzionalità di recensione in arrivo');
                  // In a real app, this would navigate to the review form
                }}>
                  Lascia una recensione
                </Button>
              )}
              
              {booking.reviewStatus === 'completed' && (
                <Button variant="outline" className="w-full" disabled>
                  Recensione già inserita
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-poppins font-bold text-primary">Le mie prenotazioni</h1>
        
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              In programma 
              {upcomingBookings.length > 0 && (
                <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {upcomingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Passate</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {upcomingBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="bg-secondary/20 rounded-lg p-8 text-center">
                <Calendar size={32} className="mx-auto mb-3 text-primary" />
                <p className="text-gray-700 mb-2">Non hai prenotazioni in programma</p>
                <Button variant="outline" onClick={() => {
                  // In a real app, this would navigate to the search page
                  toast.info('Vai alla pagina di ricerca ristoranti');
                }}>
                  Trova un ristorante
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-4 space-y-4">
            {pastBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pastBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="bg-secondary/20 rounded-lg p-8 text-center">
                <Clock size={32} className="mx-auto mb-3 text-primary" />
                <p className="text-gray-700 mb-2">Non hai ancora prenotazioni passate</p>
                <Button variant="outline" onClick={() => setActiveTab('upcoming')}>
                  Vedi prenotazioni in programma
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BookingsPage;
