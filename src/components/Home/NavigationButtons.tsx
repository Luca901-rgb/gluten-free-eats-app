
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map, 
  Star, 
  Video, 
  Tag, 
  Store, 
  Info, 
  MapPin, 
  Video as VideoIcon, 
  ArrowUpDown, 
  Percent 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  isRegionAvailable?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ isRegionAvailable = false }) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      icon: <MapPin className="w-6 h-6 mb-1" />,
      label: 'Vicino a me',
      action: () => {
        if (isRegionAvailable) {
          navigate('/search?location=nearby');
        } else {
          navigate('/search');
        }
      },
      disabled: !isRegionAvailable
    },
    {
      icon: <Star className="w-6 h-6 mb-1" />,
      label: 'Più votati',
      action: () => navigate('/search?sort=rating')
    },
    {
      icon: <Video className="w-6 h-6 mb-1" />,
      label: 'Video ricette',
      action: () => navigate('/videos')
    },
    {
      icon: <Percent className="w-6 h-6 mb-1" />,
      label: 'Offerte',
      action: () => navigate('/offers')
    }
  ];
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {navigationItems.map((item, index) => (
        <Button
          key={index}
          variant="outline"
          className={`flex flex-col items-center justify-center h-24 bg-white ${
            item.disabled ? 'opacity-50' : ''
          }`}
          onClick={item.action}
          disabled={item.disabled}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default NavigationButtons;
