
import React, { createContext, useState, useContext, ReactNode } from 'react';

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
  
  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  
  if (context === undefined) {
    throw new Error('useTab deve essere usato all\'interno di un TabProvider');
  }
  
  return context;
};
