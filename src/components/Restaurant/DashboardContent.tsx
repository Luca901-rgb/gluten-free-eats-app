
import React from 'react';
import RestaurantInfo from './RestaurantInfo';
import MenuViewer from './MenuViewer';
import TableManagement from './TableManagement';
import RestaurantVideos from '@/pages/restaurant/RestaurantVideos';
import RestaurantGallery from '@/pages/restaurant/RestaurantGallery';
import RestaurantBookings from '@/pages/restaurant/RestaurantBookings';
import RestaurantReviews from '@/pages/restaurant/RestaurantReviews';
import { useTab } from '@/context/TabContext';
import { Restaurant } from '@/types/restaurant';

interface DashboardContentProps {
  restaurantData: Restaurant | any;
  isRestaurantOwner: boolean;
}

const DashboardContent = ({ restaurantData, isRestaurantOwner }: DashboardContentProps) => {
  const { currentTab } = useTab();
  
  console.log("DashboardContent: Rendering tab", currentTab, "isRestaurantOwner:", isRestaurantOwner);
  
  return (
    <div className="px-4 py-4">
      {currentTab === 'home' && <RestaurantInfo restaurantData={restaurantData} />}
      
      {currentTab === 'menu' && (
        <div className="animate-fade-in">
          <MenuViewer isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {/* La gestione tavoli è visibile solo ai ristoratori */}
      {currentTab === 'tables' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <TableManagement restaurantId={restaurantData.id || '1'} />
        </div>
      )}
      
      {currentTab === 'videos' && (
        <div className="animate-fade-in">
          <RestaurantVideos isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {currentTab === 'gallery' && (
        <div className="animate-fade-in">
          <RestaurantGallery />
        </div>
      )}
      
      {currentTab === 'bookings' && (
        <div className="animate-fade-in">
          <RestaurantBookings />
        </div>
      )}
      
      {currentTab === 'reviews' && (
        <div className="animate-fade-in">
          <RestaurantReviews />
        </div>
      )}
      
      {/* Sezioni specifiche per i ristoratori */}
      {currentTab === 'clients' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Gestione Clienti</h2>
          <p className="text-gray-500">Qui potrai visualizzare e gestire i clienti del tuo ristorante.</p>
        </div>
      )}
      
      {currentTab === 'settings' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Impostazioni Ristorante</h2>
          <p className="text-gray-500">Qui potrai modificare le impostazioni del tuo ristorante.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
