
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface TabContextType {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
  defaultTab?: string;
}

export const TabProvider: React.FC<TabProviderProps> = ({ children, defaultTab = 'home' }) => {
  const [currentTab, setCurrentTab] = useState(defaultTab);
  
  // Log per debug
  useEffect(() => {
    console.log("TabProvider: Tab corrente è", currentTab);
  }, [currentTab]);
  
  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  
  return context;
};
