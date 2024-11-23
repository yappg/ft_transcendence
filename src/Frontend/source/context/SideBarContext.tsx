'use client';
import React, { createContext, useState } from 'react';

interface SideBarContextProps {
  isActivated: number;
  setIsActivated: React.Dispatch<React.SetStateAction<number>>;
  activeIndex:number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const SideBarContext = createContext<SideBarContextProps>({
  isActivated: 0,
  setIsActivated: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
});

export const SideBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActivated, setIsActivated] = useState<number>(1);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <SideBarContext.Provider value={{ isActivated, setIsActivated, activeIndex, setActiveIndex }}>
      {children}
    </SideBarContext.Provider>
  );
};
