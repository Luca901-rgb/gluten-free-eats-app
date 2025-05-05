
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/Authentication/LoginForm';

const RestaurantLogin = () => {
  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-green-50/50">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Area Ristoratori</h1>
          <p className="text-gray-600 max-w-md">
            Accedi alla tua dashboard per gestire il tuo ristorante, prenotazioni, menu e recensioni.
          </p>
        </div>
        <LoginForm userType="restaurant" />
      </div>
    </Layout>
  );
};

export default RestaurantLogin;
