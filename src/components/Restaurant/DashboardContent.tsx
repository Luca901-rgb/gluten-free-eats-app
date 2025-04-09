
import React from 'react';
import RestaurantInfo from './RestaurantInfo';
import MenuViewer from './MenuViewer';
import RestaurantVideos from '@/pages/restaurant/RestaurantVideos';
import RestaurantGallery from '@/pages/restaurant/RestaurantGallery';
import RestaurantBookings from '@/pages/restaurant/RestaurantBookings';
import RestaurantReviews from '@/pages/restaurant/RestaurantReviews';

interface DashboardContentProps {
  activeTab: string;
  restaurantData: any;
  isRestaurantOwner: boolean;
}

const DashboardContent = ({ activeTab, restaurantData, isRestaurantOwner }: DashboardContentProps) => {
  return (
    <div className="px-4 py-4">
      {activeTab === 'home' && <RestaurantInfo restaurantData={restaurantData} />}
      
      {activeTab === 'menu' && (
        <div className="animate-fade-in">
          <MenuViewer isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {activeTab === 'videos' && (
        <div className="animate-fade-in">
          <RestaurantVideos isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {activeTab === 'gallery' && (
        <div className="animate-fade-in">
          <RestaurantGallery />
        </div>
      )}
      
      {activeTab === 'bookings' && (
        <div className="animate-fade-in">
          <RestaurantBookings />
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div className="animate-fade-in">
          <RestaurantReviews />
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
