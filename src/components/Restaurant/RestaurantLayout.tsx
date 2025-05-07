
import React, { ReactNode } from 'react';
import RestaurantNavBar from './RestaurantNavBar';

interface RestaurantLayoutProps {
  children: ReactNode;
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-16 w-full">
        {children}
      </div>
      <RestaurantNavBar />
    </div>
  );
};

export default RestaurantLayout;
