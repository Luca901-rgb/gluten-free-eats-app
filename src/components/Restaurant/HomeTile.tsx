
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTab } from '@/context/TabContext';

interface HomeTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  tabId: string;
}

const HomeTile: React.FC<HomeTileProps> = ({ icon: Icon, title, description, color, tabId }) => {
  const navigate = useNavigate();
  const { setCurrentTab } = useTab();
  
  const handleClick = () => {
    setCurrentTab(tabId);
    navigate(`/restaurant-dashboard?tab=${tabId}`);
  };
  
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1" 
      onClick={handleClick}
    >
      <CardContent className="p-4 flex items-start">
        <div 
          className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeTile;
