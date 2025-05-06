
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, AlertCircle, CheckCircle } from 'lucide-react';
import { useBookings } from '@/context/BookingContext';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  bookingCode?: string;
  restaurantCode?: string;
  onSubmitSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  restaurantId,
  restaurantName,
  bookingCode: initialBookingCode = '',
  restaurantCode: initialRestaurantCode = '',
  onSubmitSuccess
}) => {
  // Form state
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [bookingCode, setBookingCode] = useState<string>(initialBookingCode);
  const [restaurantCode, setRestaurantCode] = useState<string>(initialRestaurantCode);
  const [userName, setUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>('');
  const [bookingVerified, setBookingVerified] = useState<boolean>(false);
  
  const { bookings, getBookingByCode } = useBookings();
  
  // Check if we have initial codes and verify them
  useEffect(() => {
    if (initialBookingCode && initialRestaurantCode) {
      verifyBooking();
    }
  }, [initialBookingCode, initialRestaurantCode]);
  
  const verifyBooking = () => {
    setIsVerifying(true);
    setVerificationError('');

    // Basic validation
    if (!bookingCode.trim()) {
      setVerificationError('Inserisci il codice di prenotazione');
      setIsVerifying(false);
      return;
    }

    if (!restaurantCode.trim()) {
      setVerificationError('Inserisci il codice del ristorante');
      setIsVerifying(false);
      return;
    }

    // Find the booking
    const booking = getBookingByCode(bookingCode);

    if (!booking) {
      setVerificationError('Codice di prenotazione non valido');
      setIsVerifying(false);
      return;
    }

    if (booking.restaurantId !== restaurantId) {
      setVerificationError('La prenotazione non appartiene a questo ristorante');
      setIsVerifying(false);
      return;
    }

    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
      setVerificationError('La prenotazione non è stata confermata');
      setIsVerifying(false);
      return;
    }

    if (booking.attendance !== 'confirmed') {
      setVerificationError('La tua presenza al ristorante non è stata confermata');
      setIsVerifying(false);
      return;
    }
    
    // Verify restaurant code
    if (booking.restaurantReviewCode !== restaurantCode) {
      setVerificationError('Codice del ristorante non valido');
      setIsVerifying(false);
      return;
    }
    
    // If we get here, both codes are valid
    setIsVerified(true);
    setBookingVerified(true);
    setUserName(booking.customerName || '');
    setIsVerifying(false);
    toast.success('Codici verificati con successo!');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      verifyBooking();
      return;
    }

    if (rating === 0) {
      toast.error('Seleziona una valutazione in stelle');
      return;
    }

    if (comment.trim() === '') {
      toast.error('Inserisci un commento per la tua recensione');
      return;
    }

    setIsSubmitting(true);

    // Simulating submission
    setTimeout(() => {
      toast.success('Recensione pubblicata con successo!');
      setIsSubmitting(false);
      
      // Reset form
      setRating(0);
      setComment('');
      setBookingCode('');
      setRestaurantCode('');
      setIsVerified(false);
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scrivi una recensione</CardTitle>
        <CardDescription>
          Condividi la tua esperienza presso {restaurantName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification section */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-md font-medium mb-2">Verifica la tua visita</h3>
              <p className="text-sm text-slate-600 mb-4">
                Per lasciare una recensione verificata, inserisci il codice di prenotazione ricevuto al momento della prenotazione e il codice fornito dal ristorante alla fine della tua visita.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingCode">Codice Prenotazione</Label>
                  <Input
                    id="bookingCode"
                    placeholder="Es. ABC123"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    disabled={isVerified || isVerifying}
                    className="uppercase"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="restaurantCode">Codice Ristorante</Label>
                  <Input
                    id="restaurantCode"
                    placeholder="Es. 1234"
                    value={restaurantCode}
                    onChange={(e) => setRestaurantCode(e.target.value)}
                    disabled={isVerified || isVerifying}
                  />
                </div>
              </div>
              
              {!isVerified && (
                <Button
                  type="button"
                  onClick={verifyBooking}
                  disabled={isVerifying || isVerified}
                  className="mt-4"
                  variant="secondary"
                >
                  {isVerifying ? 'Verifica in corso...' : 'Verifica codici'}
                </Button>
              )}
              
              {isVerified && (
                <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Visita verificata con successo! Ora puoi scrivere la tua recensione.
                  </AlertDescription>
                </Alert>
              )}
              
              {verificationError && (
                <Alert className="mt-4 border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>{verificationError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Rating and review form */}
          <div className={`space-y-4 transition-opacity duration-300 ${isVerified ? 'opacity-100' : 'opacity-50'}`}>
            <div className="space-y-2">
              <Label>Valutazione</Label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      (hoverRating || rating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onMouseEnter={() => !isSubmitting && setHoverRating(star)}
                    onMouseLeave={() => !isSubmitting && setHoverRating(0)}
                    onClick={() => !isSubmitting && isVerified && setRating(star)}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {rating > 0 ? `${rating} ${rating === 1 ? 'stella' : 'stelle'}` : 'Seleziona una valutazione'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Il tuo nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting || !isVerified}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">La tua recensione</Label>
              <Textarea
                id="comment"
                placeholder="Racconta la tua esperienza..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting || !isVerified}
                className="min-h-[120px]"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isVerified || rating === 0 || comment.trim() === ''}
            >
              {isSubmitting ? 'Invio in corso...' : 'Pubblica recensione'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
