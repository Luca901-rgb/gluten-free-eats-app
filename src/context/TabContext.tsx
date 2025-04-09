
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabContextType {
  activeTab: string;
  navigateToTab: (tabId: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};

interface TabProviderProps {
  children: ReactNode;
  defaultTab?: string;
}

export const TabProvider: React.FC<TabProviderProps> = ({ 
  children, 
  defaultTab = 'home' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    
    // Scroll to the selected tab
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <TabContext.Provider value={{ activeTab, navigateToTab }}>
      {children}
    </TabContext.Provider>
  );
};
