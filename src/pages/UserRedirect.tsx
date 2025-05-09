
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import safeStorage from '@/lib/safeStorage';

const UserRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check user type and redirect accordingly
    const userType = safeStorage.getItem('userType');
    
    if (userType === 'restaurant') {
      navigate('/restaurant-dashboard');
    } else {
      // Default to regular user home
      navigate('/');
    }
  }, [navigate]);
  
  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Reindirizzamento in corso...</p>
      </div>
    </div>
  );
};

export default UserRedirect;
