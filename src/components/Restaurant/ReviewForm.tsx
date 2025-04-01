
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Image, Star, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  bookingCode: string;
  restaurantCode: string;
  onSubmitSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  restaurantId,
  restaurantName,
  bookingCode,
  restaurantCode,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || images.length >= 3) return;
    
    // In a real app, this would upload to a server
    // For now we'll just simulate with local URLs
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImages([...images, e.target.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Seleziona un punteggio per la recensione');
      return;
    }
    
    if (reviewText.length < 50) {
      toast.error('La recensione deve contenere almeno 50 caratteri');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Recensione inviata con successo!');
      setIsSubmitting(false);
      if (onSubmitSuccess) onSubmitSuccess();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-poppins font-semibold text-lg mb-1">Lascia una recensione</h2>
        <p className="text-gray-600 text-sm">
          La tua recensione per {restaurantName} sarà verificata grazie ai codici di prenotazione
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Valutazione</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  className={cn(
                    "transition-all",
                    (hoverRating ? hoverRating >= star : rating >= star)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? (
                <span>
                  <span className="font-semibold">{rating}</span>/5
                </span>
              ) : "Seleziona un punteggio"}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reviewText">La tua recensione</Label>
          <Textarea
            id="reviewText"
            placeholder="Racconta la tua esperienza presso questo ristorante..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-[120px]"
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Minimo 50 caratteri</span>
            <span>{reviewText.length}/500</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Foto (opzionale)</Label>
          <div className="flex flex-wrap gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={img}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-black/60 rounded-full p-0.5"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ))}
            
            {images.length < 3 && (
              <label className="w-20 h-20 flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <Image size={18} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Aggiungi</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500">Massimo 3 immagini</p>
        </div>
        
        <div className="space-y-2">
          <Label>Codici di verifica</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-md bg-secondary/20">
              <p className="text-xs text-gray-600">Codice prenotazione</p>
              <p className="font-mono font-medium">{bookingCode}</p>
            </div>
            <div className="p-3 rounded-md bg-secondary/20">
              <p className="text-xs text-gray-600">Codice ristorante</p>
              <p className="font-mono font-medium">{restaurantCode}</p>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90" 
          disabled={isSubmitting || rating === 0 || reviewText.length < 50}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Upload size={16} className="mr-2 animate-spin" />
              Invio in corso...
            </span>
          ) : (
            'Pubblica recensione'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
