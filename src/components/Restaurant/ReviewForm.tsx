import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Image, Star, Upload, X, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  bookingCode: string;
  restaurantCode: string;
  onSubmitSuccess?: () => void;
}

const reviewSchema = z.object({
  customerCode: z
    .string()
    .length(6, { message: "Il codice cliente deve essere di 6 caratteri" }),
  restaurantCode: z
    .string()
    .length(4, { message: "Il codice ristoratore deve essere di 4 cifre" })
    .regex(/^\d+$/, { message: "Il codice ristoratore deve contenere solo numeri" }),
  rating: z
    .number()
    .min(1, { message: "Seleziona almeno una stella" })
    .max(5),
  foodRating: z
    .number()
    .min(1, { message: "Valuta il cibo" })
    .max(5),
  serviceRating: z
    .number()
    .min(1, { message: "Valuta il servizio" })
    .max(5),
  atmosphereRating: z
    .number()
    .min(1, { message: "Valuta l'atmosfera" })
    .max(5),
  valueRating: z
    .number()
    .min(1, { message: "Valuta il rapporto qualità-prezzo" })
    .max(5),
  reviewText: z
    .string()
    .min(50, { message: "La recensione deve contenere almeno 50 caratteri" })
    .max(500, { message: "La recensione non può superare i 500 caratteri" }),
  authenticity: z
    .boolean()
    .refine((value) => value === true, { message: "Devi confermare l'autenticità dell'esperienza" })
});

const ReviewForm: React.FC<ReviewFormProps> = ({
  restaurantId,
  restaurantName,
  bookingCode,
  restaurantCode,
  onSubmitSuccess,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [hoverFoodRating, setHoverFoodRating] = useState<number>(0);
  const [hoverServiceRating, setHoverServiceRating] = useState<number>(0);
  const [hoverAtmosphereRating, setHoverAtmosphereRating] = useState<number>(0);
  const [hoverValueRating, setHoverValueRating] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(48 * 60); // 48h in minuti

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerCode: bookingCode || "",
      restaurantCode: restaurantCode || "",
      rating: 0,
      foodRating: 0,
      serviceRating: 0,
      atmosphereRating: 0,
      valueRating: 0,
      reviewText: "",
      authenticity: false
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) return 0;
        return prevTime - 1;
      });
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTimeRemaining = () => {
    const hours = Math.floor(timeLeft / 60);
    const minutes = timeLeft % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || images.length >= 3) return;
    
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

  const verifyCode = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      const customerCode = form.getValues('customerCode');
      const restaurantCode = form.getValues('restaurantCode');
      
      if (customerCode && restaurantCode) {
        const isValid = customerCode.length === 6 && /^\d{4}$/.test(restaurantCode);
        setIsVerified(isValid);
        
        if (isValid) {
          toast.success("Codici verificati con successo!");
        } else {
          toast.error("Codici non validi. Controlla e riprova.");
        }
      } else {
        toast.error("Inserisci entrambi i codici per procedere.");
      }
      
      setIsVerifying(false);
    }, 1000);
  };

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    if (!isVerified) {
      toast.error('Verifica i codici prima di procedere');
      return;
    }
    
    if (isPreview) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        toast.success('Recensione inviata con successo!');
        setIsSubmitting(false);
        if (onSubmitSuccess) onSubmitSuccess();
      }, 1500);
    } else {
      setIsPreview(true);
    }
  };

  const StarRatingInput = ({
    value,
    onChange,
    hoverValue,
    setHoverValue,
    label
  }: {
    value: number;
    onChange: (value: number) => void;
    hoverValue: number;
    setHoverValue: (value: number) => void;
    label?: string;
  }) => {
    return (
      <div className="space-y-1">
        {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              className={cn(
                "focus:outline-none transition-all duration-200",
                value === star && "scale-110"
              )}
            >
              <Star
                size={label ? 18 : 32}
                className={cn(
                  "transition-all",
                  (hoverValue ? hoverValue >= star : value >= star)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
          {!label && (
            <span className="ml-2 text-sm text-gray-600">
              {value > 0 ? (
                <span>
                  <span className="font-semibold">{value}</span>/5
                </span>
              ) : "Seleziona un punteggio"}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (timeLeft <= 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center space-y-3">
        <AlertCircle className="mx-auto text-yellow-500 h-10 w-10" />
        <h3 className="font-medium text-lg">Tempo scaduto</h3>
        <p className="text-gray-600">
          Sono passate più di 48 ore dalla tua prenotazione. Non è più possibile lasciare una recensione per questa esperienza.
        </p>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="font-poppins font-semibold text-lg mb-1">Anteprima Recensione</h2>
          <Button 
            variant="ghost" 
            onClick={() => setIsPreview(false)}
            className="text-sm"
          >
            Modifica
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={cn(
                    i < form.getValues('rating') 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <Check size={16} className="mr-1" />
              Verificata
            </div>
          </div>
          
          <p className="text-gray-800">
            {form.getValues('reviewText')}
          </p>
          
          {images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Foto del piatto ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <p className="font-medium">Cibo</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < form.getValues('foodRating')
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium">Servizio</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < form.getValues('serviceRating')
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium">Atmosfera</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < form.getValues('atmosphereRating')
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium">Rapporto qualità/prezzo</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < form.getValues('valueRating')
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="w-full bg-accent hover:bg-accent/90"
          disabled={isSubmitting}
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
        
        <p className="text-center text-sm text-gray-500">
          Potrai modificare questa recensione entro 24 ore dalla pubblicazione
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-poppins font-semibold text-lg mb-1">Lascia una recensione</h2>
        <p className="text-gray-600 text-sm">
          La tua recensione per {restaurantName} sarà verificata grazie ai codici di prenotazione
        </p>
        <div className="mt-2 text-sm flex items-center text-amber-600">
          <Clock size={14} className="mr-1" />
          Tempo rimanente: {formatTimeRemaining()}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 bg-secondary/10 rounded-lg space-y-4">
            <h3 className="font-medium text-base">Verifica la tua esperienza</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice cliente</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ABC123" 
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Codice alfanumerico di 6 caratteri ricevuto alla prenotazione
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="restaurantCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice ristorante</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234" 
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Codice numerico di 4 cifre fornito dal ristorante
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full", 
                isVerified && "bg-green-50 border-green-200 text-green-700"
              )}
              onClick={verifyCode}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center">
                  <Upload size={16} className="mr-2 animate-spin" />
                  Verifica in corso...
                </span>
              ) : isVerified ? (
                <span className="flex items-center justify-center">
                  <Check size={16} className="mr-2" />
                  Codici verificati
                </span>
              ) : (
                'Verifica codici'
              )}
            </Button>
          </div>
          
          <div className={cn(
            "space-y-6 transition-opacity duration-300",
            !isVerified && "opacity-50 pointer-events-none"
          )}>
            <div className="space-y-4">
              <Label className="block mb-1">Valutazione complessiva</Label>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="mb-1">
                        <StarRatingInput
                          value={field.value}
                          onChange={field.onChange}
                          hoverValue={hoverRating}
                          setHoverValue={setHoverRating}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="block">Valutazioni specifiche</Label>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="foodRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StarRatingInput
                          value={field.value}
                          onChange={field.onChange}
                          hoverValue={hoverFoodRating}
                          setHoverValue={setHoverFoodRating}
                          label="Cibo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serviceRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StarRatingInput
                          value={field.value}
                          onChange={field.onChange}
                          hoverValue={hoverServiceRating}
                          setHoverValue={setHoverServiceRating}
                          label="Servizio"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="atmosphereRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StarRatingInput
                          value={field.value}
                          onChange={field.onChange}
                          hoverValue={hoverAtmosphereRating}
                          setHoverValue={setHoverAtmosphereRating}
                          label="Atmosfera"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valueRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StarRatingInput
                          value={field.value}
                          onChange={field.onChange}
                          hoverValue={hoverValueRating}
                          setHoverValue={setHoverValueRating}
                          label="Qualità/Prezzo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="reviewText"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>La tua recensione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Racconta la tua esperienza presso questo ristorante..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500">
                    <FormDescription>Minimo 50 caratteri</FormDescription>
                    <span>{field.value.length}/500</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                  <label className="w-20 h-20 flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
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
            
            <FormField
              control={form.control}
              name="authenticity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Confermo di aver realmente visitato questo ristorante
                    </FormLabel>
                    <FormDescription>
                      La tua recensione sarà contrassegnata come verificata
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90" 
            >
              Anteprima recensione
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
