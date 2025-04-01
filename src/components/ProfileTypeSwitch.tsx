
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, User } from 'lucide-react';

const ProfileTypeSwitch = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(localStorage.getItem('userType') || 'customer');
  
  useEffect(() => {
    // Aggiorna lo stato quando cambia il localStorage
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);
  
  const switchToRestaurant = () => {
    localStorage.setItem('userType', 'restaurant');
    setUserType('restaurant');
    navigate('/restaurant-dashboard');
  };
  
  const switchToCustomer = () => {
    localStorage.setItem('userType', 'customer');
    setUserType('customer');
    navigate('/');
  };
  
  return (
    <div className="flex items-center gap-2 mb-4">
      {userType === 'customer' ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={switchToRestaurant}
          className="flex items-center gap-2 text-sm"
        >
          <Store size={16} />
          Passa a vista ristorante
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={switchToCustomer}
          className="flex items-center gap-2 text-sm"
        >
          <User size={16} />
          Passa a vista cliente
        </Button>
      )}
    </div>
  );
};

export default ProfileTypeSwitch;
