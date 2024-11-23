'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TabContextProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <TabContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = (): TabContextProps => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};
