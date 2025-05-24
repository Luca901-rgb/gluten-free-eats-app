
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  active: boolean;
}

interface OfferFormProps {
  initialData?: Offer;
  onSubmitSuccess: (offer: Offer) => void;
  onCancel: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ initialData, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    discount: initialData?.discount || 0,
    active: initialData?.active || true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offer: Offer = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...formData,
    };
    
    onSubmitSuccess(offer);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titolo offerta</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Es. Pizza senza glutine a metà prezzo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descrivi l'offerta in dettaglio..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount">Sconto (%)</Label>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={formData.discount}
          onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
          placeholder="0"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => handleInputChange('active', checked)}
        />
        <Label htmlFor="active">Offerta attiva</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit">
          {initialData ? 'Modifica offerta' : 'Crea offerta'}
        </Button>
      </div>
    </form>
  );
};

export default OfferForm;
