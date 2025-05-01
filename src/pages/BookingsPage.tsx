
import React from 'react';
import Layout from '@/components/Layout';
import { CalendarClock } from 'lucide-react';

const BookingsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Le mie prenotazioni</h1>
        
        <div className="text-center py-10 text-gray-500">
          <CalendarClock size={48} className="mx-auto opacity-20 mb-4" />
          <p className="text-lg">Non hai ancora effettuato prenotazioni</p>
          <p className="text-sm mt-2">Trova un ristorante e prenota un tavolo</p>
        </div>
      </div>
    </Layout>
  );
};

export default BookingsPage;
