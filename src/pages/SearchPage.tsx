
import React from 'react';
import Layout from '@/components/Layout';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Cerca ristoranti gluten-free</h1>
        
        <div className="relative mb-6">
          <Input 
            type="text" 
            placeholder="Inserisci il nome del ristorante..." 
            className="pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button variant="outline" className="text-sm">Per vicinanza</Button>
          <Button variant="outline" className="text-sm">Per valutazione</Button>
          <Button variant="outline" className="text-sm">Solo certificati</Button>
          <Button variant="outline" className="text-sm">Filtri avanzati</Button>
        </div>
        
        <div className="text-center py-10 text-gray-500">
          <Search size={48} className="mx-auto opacity-20 mb-4" />
          <p className="text-lg">Inizia a cercare i ristoranti gluten-free vicino a te</p>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
