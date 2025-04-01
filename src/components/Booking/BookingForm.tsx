
import React, { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useBookings } from '@/context/BookingContext';

interface BookingFormProps {
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
}

const availableTimes = [
  '12:00', '12:30', '13:00', '13:30', '14:00', 
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

const BookingForm: React.FC<BookingFormProps> = ({ restaurantId, restaurantName, restaurantImage }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<string>('2');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { addBooking } = useBookings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error('Seleziona data e ora per la prenotazione');
      return;
    }

    setIsLoading(true);

    try {
      // Generate a booking date by combining the selected date and time
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      dateTime.setHours(hours, minutes);
      
      // Generate a random booking code for demo
      const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create a new booking
      const newBooking = {
        id: `b${Date.now()}`,
        restaurantId,
        restaurantName,
        restaurantImage,
        date: dateTime.toISOString(),
        people: Number(people),
        notes,
        status: 'pending' as const,
        bookingCode,
        customerName: 'Cliente Attuale', // In un'app reale, prenderebbe i dati dell'utente loggato
      };
      
      // Add the booking to our context
      addBooking(newBooking);
      
      // Show success message
      toast.success('Prenotazione effettuata con successo!', {
        description: `Codice prenotazione: ${bookingCode}`
      });
      
      // Reset form
      setDate(undefined);
      setTime(undefined);
      setPeople('2');
      setNotes('');
    } catch (error) {
      toast.error('Errore durante la prenotazione. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-poppins font-semibold text-lg mb-2">
          Prenota un tavolo presso {restaurantName}
        </h2>
        <p className="text-gray-600 text-sm">
          Compila il form per prenotare il tuo tavolo gluten-free
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'd MMMM yyyy', { locale: it }) : <span>Seleziona data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Orario</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time" className="w-full">
                <SelectValue placeholder="Seleziona orario">
                  {time ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{time}</span>
                    </div>
                  ) : (
                    <span>Seleziona orario</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((timeOption) => (
                  <SelectItem key={timeOption} value={timeOption}>
                    {timeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="people">Numero di persone</Label>
          <Select value={people} onValueChange={setPeople}>
            <SelectTrigger id="people" className="w-full">
              <SelectValue placeholder="Seleziona numero persone" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(20)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1} {i + 1 === 1 ? 'persona' : 'persone'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Note speciali (opzionale)</Label>
          <Textarea
            id="notes"
            placeholder="Eventuali richieste speciali o allergie da segnalare"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={200}
            className="h-24"
          />
          <p className="text-xs text-right text-gray-500">
            {notes.length}/200 caratteri
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 mt-4" 
          disabled={isLoading || !date || !time}
        >
          {isLoading ? 'Prenotazione in corso...' : 'Conferma prenotazione'}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
