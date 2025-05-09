
import React from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Benvenuto a Gluten Free Eats</h1>
          <p className="text-gray-600 max-w-md">
            Trova ristoranti con opzioni senza glutine vicino a te e prenota facilmente.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <Button
            onClick={() => navigate('/register')}
            className="w-full bg-primary hover:bg-primary/90 mb-4"
          >
            Registrati
          </Button>
          
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full"
          >
            Accedi
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
