
import React from 'react';
import PaymentManager from '@/components/Payment/PaymentManager';

interface RestaurantRegistrationPaymentProps {
  onComplete?: (success: boolean) => void;
}

const RestaurantRegistrationPayment: React.FC<RestaurantRegistrationPaymentProps> = ({ onComplete }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PaymentManager
        amount={0.00} // No charge for registration, just card validation
        description="Registra la tua carta di credito per il servizio di prenotazione. La carta verrà addebitata quando confermi la presenza di un cliente."
        isRestaurantRegistration={true}
        onPaymentComplete={onComplete}
      />
    </div>
  );
};

export default RestaurantRegistrationPayment;
