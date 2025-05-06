
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarCheck, Calendar as CalendarIcon, Clock, Users, FileText } from 'lucide-react';
import { BookingRequest, BookingResponse } from '@/types/restaurant';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useBookings } from '@/context/BookingContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';

interface BookingSystemProps {
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
}

const BookingSystem: React.FC<BookingSystemProps> = ({ 
  restaurantId,
  restaurantName,
  restaurantImage
}) => {
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('19:00');
  const [people, setPeople] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);

  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!date || !time || people < 1 || !name || !email || !phone) {
      toast.error('Per favore compila tutti i campi obbligatori');
      setIsSubmitting(false);
      return;
    }

    // Format date for the booking
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const bookingRequest: BookingRequest = {
      restaurantId,
      date: formattedDate,
      time,
      people,
      name,
      email,
      phone,
      notes
    };

    // Generate a unique booking code
    const bookingCode = generateBookingCode();

    try {
      // Add the booking to context
      const newBooking = addBooking({
        id: `booking-${Date.now()}`,
        restaurantId,
        restaurantName,
        date: `${formattedDate}T${time}:00`,
        time,
        people,
        notes,
        status: 'pending',
        bookingCode,
        customerName: name,
        restaurantImage: restaurantImage || '/placeholder.svg',
        hasGuarantee: false
      });

      setBookingResult({
        id: newBooking.id,
        bookingCode: newBooking.bookingCode,
        status: newBooking.status,
      });

      setShowConfirmation(true);
      toast.success('Prenotazione inviata con successo!');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Si è verificato un errore durante la prenotazione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateBookingCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleNewBooking = () => {
    setShowConfirmation(false);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setDate(new Date());
    setTime('19:00');
    setPeople(2);
  };

  const handleViewBookings = () => {
    navigate('/bookings');
  };

  if (showConfirmation && bookingResult) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <CalendarCheck className="mr-2 h-6 w-6" />
            Prenotazione Confermata!
          </CardTitle>
          <CardDescription>La tua richiesta è stata inviata al ristorante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-md border border-green-100">
            <p className="font-medium text-gray-700">Codice Prenotazione:</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{bookingResult.bookingCode}</p>
            <p className="text-sm text-gray-500 mt-2">
              Conserva questo codice. Ti servirà per lasciare una recensione verificata dopo la visita.
            </p>
          </div>

          <div className="space-y-2">
            <p><strong>Ristorante:</strong> {restaurantName}</p>
            <p><strong>Data:</strong> {date && format(date, 'EEEE d MMMM yyyy', { locale: it })}</p>
            <p><strong>Ora:</strong> {time}</p>
            <p><strong>Persone:</strong> {people}</p>
          </div>

          <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm">
            <p className="text-amber-800">
              Quando ti presenterai al ristorante, il personale confermerà la tua presenza
              e riceverai un secondo codice per lasciare una recensione verificata.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleNewBooking} 
              className="flex-1"
            >
              Nuova Prenotazione
            </Button>
            <Button 
              onClick={handleViewBookings}
              className="flex-1"
            >
              Vedi Le Mie Prenotazioni
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'EEEE d MMMM yyyy', { locale: it }) : 'Seleziona una data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time">Orario</Label>
            <div className="relative">
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="people">Persone</Label>
            <div className="relative">
              <Input
                id="people"
                type="number"
                min="1"
                max="20"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value))}
                className="pl-10"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome e Cognome</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Inserisci il tuo nome completo"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+39 123 4567890"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Note / Richieste Speciali</Label>
          <div className="relative">
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Eventuali richieste speciali o informazioni aggiuntive..."
              className="min-h-[100px] pl-10 pt-8"
            />
            <FileText className="absolute left-3 top-3 text-gray-500" size={16} />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Invio in corso...' : 'Prenota ora'}
        </Button>
      </form>
    </div>
  );
};

export default BookingSystem;
