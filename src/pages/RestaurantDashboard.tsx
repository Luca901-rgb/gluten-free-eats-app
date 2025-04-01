
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  Clock,
  Users,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Eye,
  Video,
  FileText,
  Camera,
  Copy,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data
const restaurant = {
  id: '1',
  name: 'La Trattoria Senza Glutine',
  address: 'Via Roma 123, Milano, 20100',
  phone: '+39 02 1234567',
  email: 'info@trattoriasenzaglutine.it',
  logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
};

const bookings = [
  {
    id: 'b1',
    customerName: 'Mario Rossi',
    date: '2023-11-25T19:30:00',
    people: 2,
    notes: 'Tavolo vicino alla finestra se possibile',
    status: 'confirmed',
    bookingCode: 'TRA123',
    reviewCode: 'RES456',
  },
  {
    id: 'b2',
    customerName: 'Laura Bianchi',
    date: '2023-11-22T20:00:00',
    people: 4,
    notes: 'Compleanno',
    status: 'pending',
    bookingCode: 'TRA124',
  },
  {
    id: 'b3',
    customerName: 'Giovanni Verdi',
    date: '2023-11-20T13:00:00',
    people: 3,
    notes: '',
    status: 'completed',
    bookingCode: 'TRA125',
    reviewCode: 'RES457',
    hasReview: true,
  },
  {
    id: 'b4',
    customerName: 'Francesca Neri',
    date: '2023-11-18T19:30:00',
    people: 2,
    notes: '',
    status: 'completed',
    bookingCode: 'TRA126',
  },
];

const reviews = [
  {
    id: 'r1',
    customerName: 'Giovanni Verdi',
    rating: 4,
    date: '2023-11-21',
    text: 'Ottimo ristorante, cibo delizioso e personale gentilissimo. La pasta era davvero eccellente e il tiramisù fantastico. Torneremo sicuramente!',
    response: 'Grazie per la recensione positiva! Siamo felici che ti sia piaciuto il nostro ristorante e speriamo di rivederti presto.',
    photos: [
      'https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    ],
  },
  {
    id: 'r2',
    customerName: 'Elisa Russo',
    rating: 5,
    date: '2023-11-15',
    text: 'Finalmente un ristorante dove posso mangiare tranquillamente senza preoccuparmi del glutine! La pizza era croccante e saporita, sembrava una normale pizza con glutine. Complimenti!',
    response: '',
    photos: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    ],
  },
  {
    id: 'r3',
    customerName: 'Marco Blu',
    rating: 3,
    date: '2023-11-10',
    text: "Il cibo era buono ma il servizio un po' lento. Abbiamo aspettato quasi un'ora per i primi piatti. Spero migliorerà in futuro perché la qualità del cibo è comunque alta.",
    response: "Ci scusiamo per l'attesa. Stiamo lavorando per migliorare i tempi di servizio. Grazie per il feedback costruttivo!",
    photos: [],
  },
];

const statistics = {
  dailyBookings: 8,
  weeklyBookings: 42,
  averageRating: 4.3,
  totalReviews: 27,
  profileViews: 156,
};

const videos = [
  {
    id: 'v1',
    title: 'Pizza Senza Glutine Fatta in Casa',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    views: 245,
    duration: '12:45',
    uploadDate: '2023-10-15',
  },
  {
    id: 'v2',
    title: 'Pasta Fresca Senza Glutine',
    thumbnail: 'https://images.unsplash.com/photo-1603729362760-408f86a48177?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    views: 187,
    duration: '18:20',
    uploadDate: '2023-09-28',
  },
];

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "d MMMM yyyy 'alle' HH:mm", { locale: it });
  } catch (error) {
    return dateString;
  }
};

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookingsList, setBookingsList] = useState(bookings);
  const [reviewsList, setReviewsList] = useState(reviews);
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);
  const [responseText, setResponseText] = useState('');

  const generateReviewCode = (bookingId: string) => {
    const booking = bookingsList.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Generate random code
    const reviewCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Update booking with review code
    setBookingsList(bookingsList.map(b => 
      b.id === bookingId ? { ...b, reviewCode } : b
    ));
    
    toast.success('Codice recensione generato con successo');
    
    return reviewCode;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Codice copiato negli appunti');
  };

  const handleStatusChange = (bookingId: string, status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    setBookingsList(bookingsList.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
    toast.success(`Stato della prenotazione aggiornato a: ${status}`);
  };

  const submitReviewResponse = (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error('Inserisci una risposta alla recensione');
      return;
    }
    
    setReviewsList(reviewsList.map(review => 
      review.id === reviewId ? { ...review, response: responseText } : review
    ));
    
    toast.success('Risposta alla recensione inviata con successo');
    setResponseText('');
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-poppins font-bold text-primary">
                Dashboard Ristorante
              </h1>
              <p className="text-gray-600 text-sm">{restaurant.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            toast.info('Funzionalità di modifica profilo in arrivo');
          }}>
            Modifica profilo
          </Button>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
            <TabsTrigger value="content">Contenuti</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Prenotazioni</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-2xl font-bold">{statistics.dailyBookings}</p>
                      <p className="text-xs text-gray-500">Oggi</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{statistics.weeklyBookings}</p>
                      <p className="text-xs text-gray-500">Questa settimana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Valutazioni</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{statistics.averageRating}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(statistics.averageRating) ? "fill-yellow-400" : ""}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{statistics.totalReviews} recensioni totali</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Visualizzazioni profilo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold">{statistics.profileViews}</p>
                  <p className="text-xs text-gray-500">Ultimi 30 giorni</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prenotazioni recenti</CardTitle>
                  <CardDescription>Ultime 5 prenotazioni</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Persone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingsList.slice(0, 5).map(booking => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{format(parseISO(booking.date), "dd/MM HH:mm")}</TableCell>
                          <TableCell>{booking.people}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('bookings')}>
                    Vedi tutte le prenotazioni
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recensioni recenti</CardTitle>
                  <CardDescription>Ultime 3 recensioni</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviewsList.slice(0, 3).map(review => (
                    <div key={review.id} className="border-b pb-3 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.customerName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.text}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('reviews')}>
                    Vedi tutte le recensioni
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Prenotazioni</CardTitle>
                <CardDescription>Visualizza e gestisci le prenotazioni dei tuoi clienti</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Persone</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Codice</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookingsList.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.customerName}</TableCell>
                        <TableCell>{format(parseISO(booking.date), "dd/MM/yyyy HH:mm")}</TableCell>
                        <TableCell>{booking.people}</TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                            booking.status === 'completed' ? 'outline' : 'destructive'
                          }>
                            {booking.status === 'confirmed' ? 'Confermata' :
                             booking.status === 'pending' ? 'In attesa' :
                             booking.status === 'completed' ? 'Completata' : 'Cancellata'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono">{booking.bookingCode}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCopyCode(booking.bookingCode)}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye size={16} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {booking.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                                    Conferma prenotazione
                                  </DropdownMenuItem>
                                )}
                                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                                    Segna come completata
                                  </DropdownMenuItem>
                                )}
                                {booking.status === 'completed' && !booking.reviewCode && (
                                  <DropdownMenuItem onClick={() => generateReviewCode(booking.id)}>
                                    Genera codice recensione
                                  </DropdownMenuItem>
                                )}
                                {booking.reviewCode && (
                                  <DropdownMenuItem onClick={() => handleCopyCode(booking.reviewCode!)}>
                                    Copia codice recensione
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Booking Details Dialog */}
            {selectedBooking && (
              <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dettagli Prenotazione</DialogTitle>
                    <DialogDescription>Prenotazione #{selectedBooking.bookingCode}</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Cliente</p>
                        <p className="font-medium">{selectedBooking.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Stato</p>
                        <Badge variant={
                          selectedBooking.status === 'confirmed' ? 'default' :
                          selectedBooking.status === 'pending' ? 'secondary' :
                          selectedBooking.status === 'completed' ? 'outline' : 'destructive'
                        }>
                          {selectedBooking.status === 'confirmed' ? 'Confermata' :
                           selectedBooking.status === 'pending' ? 'In attesa' :
                           selectedBooking.status === 'completed' ? 'Completata' : 'Cancellata'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Data e ora</p>
                        <p className="font-medium">{formatDate(selectedBooking.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Numero di persone</p>
                        <p className="font-medium">{selectedBooking.people}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Note</p>
                        <p>{selectedBooking.notes || '(Nessuna nota)'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Codice prenotazione</p>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono">{selectedBooking.bookingCode}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopyCode(selectedBooking.bookingCode)}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Codice recensione</p>
                        {selectedBooking.reviewCode ? (
                          <div className="flex items-center space-x-2">
                            <p className="font-mono">{selectedBooking.reviewCode}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCopyCode(selectedBooking.reviewCode!)}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={selectedBooking.status !== 'completed'}
                            onClick={() => {
                              const code = generateReviewCode(selectedBooking.id);
                              if (code) {
                                setSelectedBooking({...selectedBooking, reviewCode: code});
                              }
                            }}
                          >
                            Genera codice
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="gap-2 sm:gap-0">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {selectedBooking.status === 'pending' && (
                        <Button
                          variant="default"
                          onClick={() => {
                            handleStatusChange(selectedBooking.id, 'confirmed');
                            setSelectedBooking({...selectedBooking, status: 'confirmed'});
                          }}
                        >
                          <Check size={16} className="mr-2" />
                          Conferma prenotazione
                        </Button>
                      )}
                      {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleStatusChange(selectedBooking.id, 'completed');
                            setSelectedBooking({...selectedBooking, status: 'completed'});
                          }}
                        >
                          Segna come completata
                        </Button>
                      )}
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Recensioni</CardTitle>
                <CardDescription>Visualizza e rispondi alle recensioni dei tuoi clienti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviewsList.map(review => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{review.customerName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        Rispondi
                      </Button>
                    </div>
                    <p className="text-sm mb-3">{review.text}</p>
                    
                    {review.photos.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}
                    
                    {review.response && (
                      <div className="bg-gray-50 p-3 rounded-md mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">La tua risposta:</p>
                        <p className="text-sm text-gray-600">{review.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Review Response Dialog */}
            {selectedReview && (
              <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rispondi alla recensione</DialogTitle>
                    <DialogDescription>
                      La tua risposta sarà visibile a tutti gli utenti
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{selectedReview.customerName}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{selectedReview.text}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="response">La tua risposta</Label>
                      <Textarea
                        id="response"
                        placeholder="Scrivi una risposta alla recensione..."
                        value={responseText || selectedReview.response}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={!responseText?.trim() && !selectedReview.response}
                      onClick={() => {
                        submitReviewResponse(selectedReview.id);
                        setSelectedReview(null);
                      }}
                    >
                      {selectedReview.response ? 'Aggiorna risposta' : 'Pubblica risposta'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Menu</CardTitle>
                <CardDescription>Carica e gestisci il menu del tuo ristorante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-gray-400" />
                    <div>
                      <p className="font-medium">Menu.pdf</p>
                      <p className="text-xs text-gray-500">Caricato il 15/10/2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Sostituisci
                    </Button>
                    <Button variant="ghost" size="sm">
                      Anteprima
                    </Button>
                  </div>
                </div>
                
                <div className="border border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="menu-pdf"
                    className="hidden"
                    accept=".pdf"
                    onChange={() => toast.info('Caricamento menu in arrivo')}
                  />
                  <label htmlFor="menu-pdf" className="cursor-pointer">
                    <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-gray-700">Carica menu interattivo</p>
                    <p className="text-sm text-gray-500 mt-1">Trascina qui il file o clicca per caricare</p>
                    <Button variant="outline" className="mt-4">
                      Seleziona file
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Videoricette</CardTitle>
                <CardDescription>Gestisci i video delle ricette del tuo ristorante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {videos.map(video => (
                  <div key={video.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{video.title}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {video.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {video.views} visualizzazioni
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info('Modifica video in arrivo')}>
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Anteprima video in arrivo')}>
                          Anteprima
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Statistiche video in arrivo')}>
                          Statistiche
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                
                <div className="border border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="video-upload"
                    className="hidden"
                    accept="video/*"
                    onChange={() => toast.info('Caricamento video in arrivo')}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-gray-700">Carica nuova videoricetta</p>
                    <p className="text-sm text-gray-500 mt-1">Massimo 500MB per video</p>
                    <Button variant="outline" className="mt-4">
                      Seleziona file
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Galleria foto</CardTitle>
                <CardDescription>Gestisci le foto del tuo ristorante e dei piatti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                    alt="Restaurant"
                    className="rounded-md aspect-square object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                    alt="Food"
                    className="rounded-md aspect-square object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                    alt="Pizza"
                    className="rounded-md aspect-square object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                    alt="Interior"
                    className="rounded-md aspect-square object-cover"
                  />
                  <div className="rounded-md aspect-square border border-dashed flex items-center justify-center">
                    <input
                      type="file"
                      id="photo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={() => toast.info('Caricamento foto in arrivo')}
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                      <Camera size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Aggiungi foto</span>
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  Gestisci galleria
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
