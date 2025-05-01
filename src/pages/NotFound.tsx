
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pagina non trovata</h1>
        <p className="text-gray-600 mb-8">La pagina che stai cercando non esiste o è stata spostata.</p>
        <Button asChild>
          <Link to="/home">Torna alla Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
