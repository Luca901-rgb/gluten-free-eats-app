
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const ManagerInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informazioni Account Gestore</h3>
        <p className="text-sm text-gray-500">
          Inserisci le informazioni personali del titolare o gestore del ristorante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="manager.name">Nome e Cognome *</Label>
          <div className="relative">
            <Input
              id="manager.name"
              placeholder="Nome e Cognome"
              className="pl-10"
              {...register('manager.name', { required: "Campo obbligatorio" })}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {errors?.manager?.name && (
            <p className="text-sm text-red-500 mt-1">
              {errors.manager.name.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager.email">Email *</Label>
          <div className="relative">
            <Input
              id="manager.email"
              type="email"
              placeholder="indirizzo@email.com"
              className="pl-10"
              {...register('manager.email', {
                required: "Campo obbligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Indirizzo email non valido"
                }
              })}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {errors?.manager?.email && (
            <p className="text-sm text-red-500 mt-1">
              {errors.manager.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager.phone">Telefono *</Label>
          <div className="relative">
            <Input
              id="manager.phone"
              placeholder="+39 123 456 7890"
              className="pl-10"
              {...register('manager.phone', { required: "Campo obbligatorio" })}
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {errors?.manager?.phone && (
            <p className="text-sm text-red-500 mt-1">
              {errors.manager.phone.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager.password">Password *</Label>
          <div className="relative">
            <Input
              id="manager.password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10"
              {...register('manager.password', {
                required: "Campo obbligatorio",
                minLength: {
                  value: 8,
                  message: "La password deve essere di almeno 8 caratteri"
                }
              })}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors?.manager?.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.manager.password.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager.confirmPassword">Conferma Password *</Label>
          <div className="relative">
            <Input
              id="manager.confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10"
              {...register('manager.confirmPassword', {
                required: "Campo obbligatorio",
                validate: (value, formValues) => 
                  value === formValues.manager.password || "Le password non corrispondono"
              })}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors?.manager?.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.manager.confirmPassword.message as string}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="manager.acceptTerms"
            {...register('manager.acceptTerms', { required: "Devi accettare i termini e le condizioni" })}
          />
          <label
            htmlFor="manager.acceptTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accetto i termini e le condizioni e l'informativa sulla privacy
          </label>
        </div>
        {errors?.manager?.acceptTerms && (
          <p className="text-sm text-red-500">
            {errors.manager.acceptTerms.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagerInfoStep;
