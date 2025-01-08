"use client";
import React, { createContext, useState, useEffect } from "react";

interface TabContextProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const TabContext = createContext<TabContextProps>({
  activeIndex: 0,
  setActiveIndex: () => {},
});

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const savedIndex = window?.location
      ? localStorage.getItem("activeTabIndex")
      : null;
    if (savedIndex !== null) {
      setActiveIndex(Number(savedIndex));
    }
  }, []);

  const updateActiveIndex = (index: number) => {
    setActiveIndex(index);
    if (window?.location) {
      localStorage.setItem("activeTabIndex", index.toString());
    }
  };

  return (
    <TabContext.Provider
      value={{ activeIndex, setActiveIndex: updateActiveIndex }}
    >
      {children}
    </TabContext.Provider>
  );
};
