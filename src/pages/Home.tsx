
import React from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wheat } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-500 to-[#bfe5c0] flex flex-col">
        <div className="bg-green-500 text-white p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold flex items-center">
            <Wheat className="w-7 h-7 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#38414a] mb-4">Benvenuto a Gluten Free Eats</h1>
            <p className="text-[#38414a] max-w-md text-lg">
              Trova ristoranti con opzioni senza glutine vicino a te e prenota facilmente.
            </p>
          </div>
          
          <div className="w-full max-w-md space-y-4">
            <Button
              onClick={() => navigate('/register')}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 h-auto"
            >
              Registrati
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full bg-white border border-slate-300 text-slate-700 py-3 h-auto hover:bg-slate-50"
            >
              Accedi
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
