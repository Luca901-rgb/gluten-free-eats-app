
import React from 'react';
import Layout from '@/components/Layout';
import { Heart } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">I miei preferiti</h1>
        
        <div className="text-center py-10 text-gray-500">
          <Heart size={48} className="mx-auto opacity-20 mb-4" />
          <p className="text-lg">Non hai ancora aggiunto ristoranti ai preferiti</p>
          <p className="text-sm mt-2">Esplora i ristoranti e aggiungi quelli che ti piacciono ai preferiti</p>
        </div>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
