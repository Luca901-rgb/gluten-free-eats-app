
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface OfferFormValues {
  title: string;
  description: string;
  discount: string;
  validFrom: string;
  validTo: string;
  sendNotification: boolean;
}

interface OfferFormProps {
  onSubmitSuccess: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ onSubmitSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<OfferFormValues>({
    defaultValues: {
      title: '',
      description: '',
      discount: '',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sendNotification: true
    }
  });

  const onSubmit = (data: OfferFormValues) => {
    console.log('Offer data:', data);
    
    // In una vera app, qui si salverebbero i dati nel database
    
    // Simuliamo l'invio di una notifica push
    if (data.sendNotification) {
      toast.success('Notifica push inviata ai clienti!', {
        description: `${data.title} - ${data.discount}% di sconto`
      });
    }
    
    toast.success('Offerta creata con successo!');
    onSubmitSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Titolo offerta</Label>
        <Input
          id="title"
          {...register('title', { required: 'Il titolo è obbligatorio' })}
          placeholder="Es. Menu degustazione scontato"
        />
        {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
      </div>
      
      <div>
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'La descrizione è obbligatoria' })}
          placeholder="Descrivi brevemente l'offerta..."
          rows={3}
        />
        {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
      </div>
      
      <div>
        <Label htmlFor="discount">Percentuale sconto</Label>
        <Input
          id="discount"
          type="number"
          min="1"
          max="99"
          {...register('discount', { 
            required: 'La percentuale è obbligatoria',
            min: { value: 1, message: 'Il valore minimo è 1%' },
            max: { value: 99, message: 'Il valore massimo è 99%' }
          })}
          placeholder="Es. 20"
        />
        {errors.discount && <span className="text-sm text-red-500">{errors.discount.message}</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="validFrom">Valido dal</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="validFrom"
              type="date"
              {...register('validFrom', { required: 'La data di inizio è obbligatoria' })}
              className="pl-10"
            />
          </div>
          {errors.validFrom && <span className="text-sm text-red-500">{errors.validFrom.message}</span>}
        </div>
        
        <div>
          <Label htmlFor="validTo">Valido fino al</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="validTo"
              type="date"
              {...register('validTo', { required: 'La data di fine è obbligatoria' })}
              className="pl-10"
            />
          </div>
          {errors.validTo && <span className="text-sm text-red-500">{errors.validTo.message}</span>}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          id="sendNotification"
          type="checkbox"
          {...register('sendNotification')}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="sendNotification" className="text-sm text-gray-700">
          Invia notifica push ai clienti
        </label>
      </div>
      
      <Button type="submit" className="w-full">Crea offerta</Button>
    </form>
  );
};

export default OfferForm;
