
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTab } from '@/context/TabContext';

export const useRestaurantTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTab, setCurrentTab } = useTab();
  
  useEffect(() => {
    // Ottieni il tab dai parametri nell'URL se presente
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get('tab');
    
    if (tabFromUrl && tabFromUrl !== currentTab) {
      setCurrentTab(tabFromUrl);
    } else if (!tabFromUrl && currentTab) {
      // Se c'è un tab corrente ma non è nell'URL, aggiornalo
      navigate(`/restaurant-dashboard?tab=${currentTab}`, { replace: true });
    } else if (!tabFromUrl && !currentTab) {
      // Se non c'è un tab corrente né nell'URL, imposta 'home' come predefinito
      setCurrentTab('home');
      navigate('/restaurant-dashboard?tab=home', { replace: true });
    }
  }, [location.search, currentTab, setCurrentTab, navigate]);
  
  return { currentTab, setCurrentTab };
};
