import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon, Clock, Users, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useBookings } from '@/context/BookingContext';
import { addDays, format as dateFormat } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import GuaranteeRulesDialog from './GuaranteeRulesDialog';

interface BookingFormProps {
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  onBookingComplete?: (newBookingCode: string, newRestaurantCode: string) => void;
}

const generateAvailableTimes = () => {
  const times = [];
  for (let h = 12; h <= 14; h++) {
    for (let m = 0; m <= 45; m += 15) {
      if (h === 14 && m > 30) continue;
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  for (let h = 19; h <= 22; h++) {
    for (let m = 0; m <= 45; m += 15) {
      if (h === 22 && m > 30) continue;
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return times;
};

const availableTimes = generateAvailableTimes();

const BookingForm: React.FC<BookingFormProps> = ({ 
  restaurantId, 
  restaurantName, 
  restaurantImage,
  onBookingComplete
}) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<number>(2);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [showGuaranteeDialog, setShowGuaranteeDialog] = useState(false);

  const [highChair, setHighChair] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [outdoorTable, setOutdoorTable] = useState(false);
  const [specialOccasion, setSpecialOccasion] = useState<string | undefined>(undefined);

  const { addBooking } = useBookings();

  const handleSliderChange = (value: number[]) => {
    setPeople(value[0]);
  };

  const limitedAvailabilityDates = [
    addDays(new Date(), 3),
    addDays(new Date(), 5),
    addDays(new Date(), 8)
  ];

  const isLimitedAvailability = (date: Date) => {
    return limitedAvailabilityDates.some(
      limitedDate => 
        limitedDate.getDate() === date.getDate() && 
        limitedDate.getMonth() === date.getMonth() &&
        limitedDate.getFullYear() === date.getFullYear()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error('Seleziona data e ora per la prenotazione');
      return;
    }
    
    processBooking();
  };

  const processBooking = async () => {
    setIsLoading(true);

    try {
      const dateTime = new Date(date!);
      const [hours, minutes] = time!.split(':').map(Number);
      dateTime.setHours(hours, minutes);
      
      const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const additionalOptions = [];
      if (highChair) additionalOptions.push('Seggiolone bambini');
      if (accessibility) additionalOptions.push('Accessibilità disabili');
      if (outdoorTable) additionalOptions.push('Tavolo all\'aperto');
      if (specialOccasion) additionalOptions.push(`Occasione speciale: ${specialOccasion}`);
      
      const newBooking = {
        id: `b${Date.now()}`,
        restaurantId,
        restaurantName,
        restaurantImage,
        date: dateTime.toISOString(),
        people: people,
        notes,
        additionalOptions,
        status: 'pending' as const,
        bookingCode,
        customerName: localStorage.getItem('userName') || 'Cliente',
        hasGuarantee: false
      };
      
      setBookingData(newBooking);
      
      addBooking(newBooking);
      
      toast.info(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Notifica inviata al ristorante</span>
          <span className="text-sm">Il ristorante riceverà una notifica per confermare la tua prenotazione</span>
        </div>,
        { duration: 5000 }
      );
      
      if (onBookingComplete) {
        onBookingComplete(newBooking.bookingCode, '');
      }
      
      setShowConfirmation(true);
    } catch (error) {
      toast.error('Errore durante la prenotazione. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    toast.success('Evento aggiunto al tuo calendario');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNewReservation = () => {
    setShowConfirmation(false);
    setDate(undefined);
    setTime(undefined);
    setPeople(2);
    setNotes('');
    setHighChair(false);
    setAccessibility(false);
    setOutdoorTable(false);
    setSpecialOccasion(undefined);
  };

  if (showConfirmation && bookingData) {
    return (
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">Prenotazione Confermata</CardTitle>
          <CardDescription>La tua prenotazione è stata ricevuta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="space-y-2 text-center">
              <p className="font-semibold text-lg">{restaurantName}</p>
              <p>{dateFormat(new Date(bookingData.date), 'EEEE d MMMM yyyy', { locale: it })}</p>
              <p>Ore {dateFormat(new Date(bookingData.date), 'HH:mm')}</p>
              <p>{bookingData.people} {bookingData.people === 1 ? 'persona' : 'persone'}</p>
              <p className="text-sm font-mono mt-2 border border-dashed border-gray-300 py-1 px-2 rounded inline-block">
                Codice prenotazione: <span className="font-bold">{bookingData.bookingCode}</span>
              </p>
            </div>
          </div>
          
          {bookingData.additionalOptions?.length > 0 && (
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-sm font-medium mb-1">Opzioni richieste:</p>
              <ul className="text-sm">
                {bookingData.additionalOptions.map((option: string, idx: number) => (
                  <li key={idx} className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-green-600" /> {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {bookingData.notes && (
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-sm font-medium">Note:</p>
              <p className="text-sm italic">"{bookingData.notes}"</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">
                Presenta questo codice al ristorante all'arrivo oppure visualizza la prenotazione nella sezione "Le mie prenotazioni" dell'app.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleAddToCalendar} 
            variant="outline" 
            className="w-full"
          >
            <CalendarIcon className="mr-2 h-4 w-4" /> Aggiungi al calendario
          </Button>
          <Button 
            onClick={handleNewReservation} 
            variant="outline"
            className="w-full"
          >
            Nuova prenotazione
          </Button>
          <Button 
            onClick={handleBackToHome}
            variant="ghost"
            className="w-full"
          >
            Torna alla homepage
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <GuaranteeRulesDialog 
        open={showGuaranteeDialog} 
        onOpenChange={setShowGuaranteeDialog} 
      />
      
      <div>
        <h2 className="font-poppins font-semibold text-lg mb-2">
          Prenota un tavolo presso {restaurantName}
        </h2>
        <p className="text-gray-600 text-sm">
          Compila il form per prenotare il tuo tavolo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="font-medium">Data</Label>
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
                  {date ? format(date, 'EEEE d MMMM yyyy', { locale: it }) : <span>Seleziona data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  modifiers={{
                    limited: (date) => isLimitedAvailability(date)
                  }}
                  modifiersStyles={{
                    limited: { backgroundColor: 'rgba(255, 204, 0, 0.1)', fontWeight: 'bold', color: '#FF9800', borderRadius: '0' }
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="p-3 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    <span>Data selezionata</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-[rgba(255,204,0,0.1)] border border-[#FF9800] rounded-sm"></div>
                    <span>Disponibilità limitata</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="font-medium">Orario</Label>
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
                <div className="max-h-[240px] overflow-y-auto">
                  {availableTimes.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {timeOption}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Numero di persone</Label>
            <span className="text-base font-semibold bg-secondary/20 px-2 rounded">
              {people}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Users size={24} className="text-gray-500" />
            <Slider
              defaultValue={[2]}
              min={1}
              max={20}
              step={1}
              onValueChange={handleSliderChange}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="font-medium">Opzioni aggiuntive</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Checkbox id="highchair" checked={highChair} onCheckedChange={(checked) => setHighChair(checked === true)} />
              <div className="grid gap-1">
                <Label htmlFor="highchair">Seggiolone bambini</Label>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="accessibility" checked={accessibility} onCheckedChange={(checked) => setAccessibility(checked === true)} />
              <div className="grid gap-1">
                <Label htmlFor="accessibility">Accessibilità disabili</Label>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="outdoor" checked={outdoorTable} onCheckedChange={(checked) => setOutdoorTable(checked === true)} />
              <div className="grid gap-1">
                <Label htmlFor="outdoor">Tavolo all'aperto</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialOccasion" className="font-medium">Occasione speciale</Label>
            <Select value={specialOccasion} onValueChange={setSpecialOccasion}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona (opzionale)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compleanno">Compleanno</SelectItem>
                <SelectItem value="anniversario">Anniversario</SelectItem>
                <SelectItem value="laurea">Laurea</SelectItem>
                <SelectItem value="altro">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="font-medium">Note speciali (opzionale)</Label>
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
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Puoi modificare o cancellare la tua prenotazione fino a 2 ore prima dell'orario scelto</p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
