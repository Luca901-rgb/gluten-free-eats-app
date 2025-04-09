
import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardNavigation from '@/components/Restaurant/DashboardNavigation';
import DashboardContent from '@/components/Restaurant/DashboardContent';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  const restaurantData = {
    name: 'La Trattoria Senza Glutine',
    description: 'Ristorante 100% gluten free specializzato in cucina italiana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
    address: 'Via Roma 123, Milano, 20100',
    phone: '+39 02 1234567',
    email: 'info@trattoriasenzaglutine.it',
    website: 'www.trattoriasenzaglutine.it',
    openingHours: [
      { days: 'Lunedì', hours: 'Chiuso' },
      { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
      { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
      { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
    ],
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  };

  const isRestaurantOwner = true;

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabsContainerRef.current) {
      const selectedButton = tabsContainerRef.current.querySelector(`[data-tab="${tabId}"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <Layout>
      <div className="relative">
        <DashboardHeader restaurantData={restaurantData} />
        <DashboardNavigation activeTab={activeTab} onNavigate={navigateToTab} />
        <DashboardContent 
          activeTab={activeTab} 
          restaurantData={restaurantData} 
          isRestaurantOwner={isRestaurantOwner} 
        />
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
