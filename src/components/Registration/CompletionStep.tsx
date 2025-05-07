
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import safeStorage from '@/lib/safeStorage';

const CompletionStep = () => {
  const { getValues } = useFormContext();
  const navigate = useNavigate();
  
  // Make sure the registration data is saved in localStorage and user is marked as restaurant owner
  useEffect(() => {
    try {
      const formData = getValues();
      // Save registration data to localStorage if not already saved
      if (!localStorage.getItem('restaurantRegistrationData')) {
        console.log("Saving registration data to localStorage");
        localStorage.setItem('restaurantRegistrationData', JSON.stringify(formData));
      }
      
      // Set flags to identify the user as a restaurant owner
      safeStorage.setItem('isRestaurantOwner', 'true');
      safeStorage.setItem('userType', 'restaurant');
    } catch (error) {
      console.error("Error saving registration data:", error);
    }
  }, [getValues]);
  
  const handleGoToDashboard = () => {
    try {
      // Ensure user is marked as restaurant owner before navigating
      safeStorage.setItem('isRestaurantOwner', 'true'); 
      safeStorage.setItem('userType', 'restaurant');
      safeStorage.setItem('isAuthenticated', 'true');
      
      console.log("Navigating to restaurant dashboard");
      navigate('/restaurant-dashboard?tab=home');
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback if navigation fails
      window.location.href = '/restaurant-dashboard?tab=home';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-3 py-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Registrazione completata con successo!</h2>
        <p className="text-gray-600">
          Grazie per aver registrato il tuo ristorante su Gluten Free Eats.
          Il tuo profilo è stato creato e sarà verificato a breve.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-800">Prossimi passaggi</h3>
            <ul className="mt-2 space-y-2 text-blue-700 text-sm">
              <li>✅ Il tuo account è stato creato</li>
              <li>✅ Le informazioni del tuo ristorante sono state salvate</li>
              <li>⏱️ Il nostro team verificherà le informazioni entro 24-48 ore</li>
              <li>🚀 Dopo l'approvazione, il tuo ristorante sarà visibile nell'app</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <p className="text-gray-700 text-center">
          Puoi già accedere alla tua dashboard per completare il tuo profilo
          o aggiungere ulteriori informazioni.
        </p>
        
        <div className="flex justify-center">
          <Button onClick={handleGoToDashboard}>
            Vai alla Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
