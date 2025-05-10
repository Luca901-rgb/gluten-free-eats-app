
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Layout from '@/components/Layout';
import { RestaurantRegistrationForm, RegistrationStep } from '@/types/restaurantRegistration';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Store, 
  Clock, 
  BellPlus,
  Settings, 
  FileText, 
  Image, 
  Calendar
} from 'lucide-react';

// Import the step components
import ManagerInfoStep from '@/components/Registration/ManagerInfoStep';
import RestaurantInfoStep from '@/components/Registration/RestaurantInfoStep';
import OperationsStep from '@/components/Registration/OperationsStep';
import FeaturesStep from '@/components/Registration/FeaturesStep';
import MediaStep from '@/components/Registration/MediaStep';
import ContentStep from '@/components/Registration/ContentStep';
import BookingsStep from '@/components/Registration/BookingsStep';
import PromotionsStep from '@/components/Registration/PromotionsStep';
import CompletionStep from '@/components/Registration/CompletionStep';
import safeStorage from '@/lib/safeStorage';
import { createRestaurant } from '@/services/restaurantService';

// Default values for the form
const defaultValues: RestaurantRegistrationForm = {
  manager: {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  },
  restaurant: {
    name: '',
    address: '',
    zipCode: '',
    city: '',
    province: '',
    email: '',
    phone: '',
    website: '',
    taxId: ''
  },
  operations: {
    openingHours: {
      monday: { open: true, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] },
      tuesday: { open: true, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] },
      wednesday: { open: true, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] },
      thursday: { open: true, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] },
      friday: { open: true, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] },
      saturday: { open: true, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] },
      sunday: { open: false, shifts: [{ from: '12:00', to: '15:00' }, { from: '19:00', to: '23:00' }] }
    },
    priceRange: '',
    capacity: 0
  },
  features: {
    type: '',
    services: [],
    hasGlutenFreeOptions: true
  },
  media: {
    gallery: {
      environment: [],
      dishes: []
    },
    videos: []
  },
  content: {
    description: '',
    hasGlutenFreeMenu: true
  },
  bookings: {
    tables: {
      lunch: 0,
      dinner: 0
    },
    cancellationPolicy: '2hours',
    requiresDeposit: false
  },
  promotions: {
    enableNotifications: true
  }
};

const RestaurantRegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('manager');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
  // Check if registration was already completed
  useEffect(() => {
    const registrationData = safeStorage.getItem('restaurantRegistrationData');
    const existingRestaurantId = safeStorage.getItem('restaurantId');
    
    if (existingRestaurantId) {
      setRestaurantId(existingRestaurantId);
      setCurrentStep('complete');
    } else if (registrationData) {
      console.log("Registration data found, auto-advancing to complete step");
      setCurrentStep('complete');
    }
  }, []);
  
  const methods = useForm<RestaurantRegistrationForm>({
    defaultValues,
    mode: 'onBlur'
  });
  
  const { handleSubmit, trigger, getValues, formState: { errors } } = methods;

  const steps: RegistrationStep[] = [
    'manager',
    'restaurant',
    'operations',
    'features',
    'media',
    'content',
    'bookings',
    'promotions',
    'complete'
  ];

  const stepIndex = steps.indexOf(currentStep);
  const progress = ((stepIndex) / (steps.length - 1)) * 100;

  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 'manager':
        fieldsToValidate = ['manager.name', 'manager.email', 'manager.phone', 'manager.password', 'manager.confirmPassword', 'manager.acceptTerms'];
        break;
      case 'restaurant':
        fieldsToValidate = ['restaurant.name', 'restaurant.address', 'restaurant.zipCode', 'restaurant.city', 'restaurant.province', 'restaurant.email', 'restaurant.phone', 'restaurant.taxId'];
        break;
      case 'operations':
        fieldsToValidate = ['operations.priceRange', 'operations.capacity'];
        break;
      case 'features':
        fieldsToValidate = ['features.type'];
        break;
      case 'media':
        // Media is optional
        return true;
      case 'content':
        fieldsToValidate = ['content.description'];
        break;
      case 'bookings':
        fieldsToValidate = ['bookings.tables.lunch', 'bookings.tables.dinner', 'bookings.cancellationPolicy'];
        break;
      case 'promotions':
        // Promotions are optional
        return true;
      default:
        return true;
    }

    return await trigger(fieldsToValidate as any);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      toast.error("Per favore, compila tutti i campi obbligatori");
      return;
    }

    const currentIndex = steps.indexOf(currentStep);
    const nextStep = steps[currentIndex + 1];
    setCurrentStep(nextStep as RegistrationStep);
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    const previousStep = steps[currentIndex - 1];
    setCurrentStep(previousStep as RegistrationStep);
  };

  const onSubmit = async (data: RestaurantRegistrationForm) => {
    setIsSubmitting(true);
    
    try {
      console.log("Registration data:", data);
      
      // Salva i dati nel database
      const newRestaurantId = await createRestaurant(data);
      setRestaurantId(newRestaurantId);
      
      // Salva anche in localStorage per accesso offline
      safeStorage.setItem('restaurantRegistrationData', JSON.stringify(data));
      
      // Imposta i flag per identificare l'utente come proprietario di un ristorante
      safeStorage.setItem('isRestaurantOwner', 'true');
      safeStorage.setItem('userType', 'restaurant');
      safeStorage.setItem('restaurantId', newRestaurantId);
      
      // Avanza al passaggio di completamento
      setCurrentStep('complete');
      toast.success("Registrazione completata con successo!");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Salviamo comunque i dati in localStorage per non perdere il lavoro dell'utente
      safeStorage.setItem('restaurantRegistrationData', JSON.stringify(data));
      safeStorage.setItem('restaurantPendingCreation', 'true');
      safeStorage.setItem('isRestaurantOwner', 'true');
      safeStorage.setItem('userType', 'restaurant');
      
      toast.error(`Errore durante la registrazione: ${error.message || 'Si è verificato un errore'}. I tuoi dati sono stati salvati localmente.`);
      
      // Avanza comunque al passaggio di completamento
      setCurrentStep('complete');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 'manager':
        return <ManagerInfoStep />;
      case 'restaurant':
        return <RestaurantInfoStep />;
      case 'operations':
        return <OperationsStep />;
      case 'features':
        return <FeaturesStep />;
      case 'media':
        return <MediaStep />;
      case 'content':
        return <ContentStep />;
      case 'bookings':
        return <BookingsStep />;
      case 'promotions':
        return <PromotionsStep />;
      case 'complete':
        return <CompletionStep restaurantId={restaurantId} />;
      default:
        return null;
    }
  };

  const renderStepIcon = (step: RegistrationStep) => {
    switch (step) {
      case 'manager':
        return <User className="h-5 w-5" />;
      case 'restaurant':
        return <Store className="h-5 w-5" />;
      case 'operations':
        return <Clock className="h-5 w-5" />;
      case 'features':
        return <Settings className="h-5 w-5" />;
      case 'media':
        return <Image className="h-5 w-5" />;
      case 'content':
        return <FileText className="h-5 w-5" />;
      case 'bookings':
        return <Calendar className="h-5 w-5" />;
      case 'promotions':
        return <BellPlus className="h-5 w-5" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const renderStepTitle = (step: RegistrationStep) => {
    switch (step) {
      case 'manager':
        return "Dati Gestore";
      case 'restaurant':
        return "Dati Ristorante";
      case 'operations':
        return "Orari e Operatività";
      case 'features':
        return "Caratteristiche";
      case 'media':
        return "Foto e Video";
      case 'content':
        return "Descrizione e Menù";
      case 'bookings':
        return "Prenotazioni";
      case 'promotions':
        return "Offerte";
      case 'complete':
        return "Completato";
      default:
        return "";
    }
  };

  return (
    <Layout hideNavigation>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-2">Registrazione Ristorante</h1>
            <p className="text-gray-600 text-center mb-6">Compila tutte le informazioni per registrare il tuo ristorante</p>
            
            {currentStep !== 'complete' && (
              <div className="relative">
                <Progress value={progress} className="h-2" />
                
                <div className="flex justify-between mt-4">
                  {steps.map((step, index) => {
                    if (step === 'complete') return null; // Don't show the complete step in the navigation
                    
                    const isActive = step === currentStep;
                    const isPassed = steps.indexOf(currentStep) > index;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-primary text-white' : 
                            isPassed ? 'bg-green-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {renderStepIcon(step as RegistrationStep)}
                        </div>
                        <span className="text-xs mt-1 hidden md:block">{renderStepTitle(step as RegistrationStep)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {renderStepIcon(currentStep)}
                  {renderStepTitle(currentStep)}
                </h2>
                
                {renderStepComponent()}
                
                <div className="flex justify-between mt-8">
                  {currentStep !== 'manager' && currentStep !== 'complete' && (
                    <Button 
                      type="button" 
                      onClick={handleBack}
                      variant="outline"
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Indietro
                    </Button>
                  )}
                  
                  {currentStep === 'manager' && (
                    <div className="ml-auto"></div>
                  )}
                  
                  {currentStep !== 'complete' ? (
                    currentStep === 'promotions' ? (
                      <Button 
                        type="submit"
                        className="ml-auto flex items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Invio in corso...' : 'Completa Registrazione'}
                        <CheckCircle className="ml-1 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="button"
                        onClick={handleNext}
                        className="ml-auto flex items-center"
                      >
                        Avanti
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )
                  ) : null}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantRegistrationPage;
