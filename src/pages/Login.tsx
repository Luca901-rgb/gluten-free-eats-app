
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/Authentication/LoginForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Store } from 'lucide-react';

const Login = () => {
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');

  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {userType === 'restaurant' ? 'Area Ristoratori' : 'Accedi'}
            </h1>
            
            {userType === 'restaurant' && (
              <p className="text-gray-600 mb-6 text-center">
                Accedi alla tua dashboard per gestire il tuo ristorante,
                prenotazioni, menu e recensioni.
              </p>
            )}
            
            {userType === 'customer' && (
              <p className="text-gray-600 mb-6 text-center">
                Benvenuto su Gluten Free Eats
              </p>
            )}
          </div>
          
          <div className="flex mb-6 border rounded-lg overflow-hidden">
            <button
              className={`flex-1 py-3 px-4 flex justify-center items-center gap-2 ${
                userType === 'customer' ? 'bg-white text-primary' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setUserType('customer')}
            >
              <User size={18} />
              <span>Cliente</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 flex justify-center items-center gap-2 ${
                userType === 'restaurant' ? 'bg-white text-primary' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setUserType('restaurant')}
            >
              <Store size={18} />
              <span>Ristoratore</span>
            </button>
          </div>
          
          <LoginForm userType={userType} />
          
          <div className="text-center mt-6">
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">oppure</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {userType === 'customer' 
                ? "Non hai un account? Registrati come cliente" 
                : "Non hai un ristorante registrato? Registra il tuo ristorante"}
            </p>
            
            <Link to={userType === 'customer' ? '/register' : '/restaurant-register'}>
              <Button variant="outline" className="w-full">
                Registrati
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
