"use client";
import React, { createContext, useState } from "react";

interface SideBarContextProps {
  isActivated: number;
  setIsActivated: React.Dispatch<React.SetStateAction<number>>;
}

export const SideBarContext = createContext<SideBarContextProps>({
  isActivated: 0,
  setIsActivated: () => {},
});

export const SideBarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isActivated, setIsActivated] = useState<number>(1);

  return (
    <SideBarContext.Provider value={{ isActivated, setIsActivated }}>
      {children}
    </SideBarContext.Provider>
  );
};
