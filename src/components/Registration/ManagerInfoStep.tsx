
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RestaurantRegistrationForm } from '@/types/restaurantRegistration';
import { Eye, EyeOff } from 'lucide-react';

const ManagerInfoStep = () => {
  const { control, register, watch, formState: { errors } } = useFormContext<RestaurantRegistrationForm>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // Controlla se le password corrispondono
  const password = watch('manager.password');
  const confirmPassword = watch('manager.confirmPassword');
  const passwordsMatch = !confirmPassword || password === confirmPassword;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="text-blue-700 font-medium mb-2">Informazioni personali</h3>
        <p className="text-blue-600 text-sm">
          Inserisci i tuoi dati personali per la registrazione come gestore del ristorante.
          Questi dati saranno utilizzati solo per la gestione del tuo account.
        </p>
      </div>
      
      <FormField
        control={control}
        name="manager.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo</FormLabel>
            <FormControl>
              <Input placeholder="Mario Rossi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="esempio@email.com" {...field} />
            </FormControl>
            <FormDescription>Utilizzeremo questa email per il tuo account</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefono</FormLabel>
            <FormControl>
              <Input placeholder="+39 123 456 7890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager.password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...field} 
                />
                <button 
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager.confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conferma Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...field}
                  className={!passwordsMatch ? "border-red-500" : ""}
                />
                <button 
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormControl>
            {!passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">Le password non corrispondono</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager.acceptTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Accetto i termini e le condizioni
              </FormLabel>
              <FormDescription>
                Acconsento al trattamento dei dati personali secondo la Privacy Policy
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ManagerInfoStep;
