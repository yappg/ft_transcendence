// 'use client';
// import React, { createContext, useState, useContext, ReactNode } from 'react';

// interface TabContextProps {
//   activeIndex: number;
//   setActiveIndex: (index: number) => void;
// }

// const TabContext = createContext<TabContextProps | undefined>(undefined);

// export const TabProvider = ({ children }: { children: ReactNode }) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   return (
//     <TabContext.Provider value={{ activeIndex, setActiveIndex }}>{children}</TabContext.Provider>
//   );
// };

// export const useTabContext = (): TabContextProps => {
//   const context = useContext(TabContext);
//   if (!context) {
//     throw new Error('useTabContext must be used within a TabProvider');
//   }
//   return context;
// };
// 'use client';
// import React, { createContext, useState } from 'react';

// interface TabContextProps {
//   activeIndex: number;
//   setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
// }

// export const TabContext = createContext<TabContextProps>({
//   activeIndex: 0,
//   setActiveIndex: () => {},
// });

// export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [activeIndex, setActiveIndex] = useState<number>(0);

//   return (
//     <TabContext.Provider value={{ activeIndex, setActiveIndex }}>{children}</TabContext.Provider>
//   );
// };
'use client';
import React, { createContext, useState, useEffect } from 'react';

interface TabContextProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const TabContext = createContext<TabContextProps>({
  activeIndex: 0,
  setActiveIndex: () => {},
});

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Load activeIndex from localStorage when the component mounts
  useEffect(() => {
    const savedIndex = localStorage.getItem('activeTabIndex');
    if (savedIndex !== null) {
      setActiveIndex(Number(savedIndex));
    }
  }, []);

  // Save activeIndex to localStorage whenever it changes
  const updateActiveIndex = (index: number) => {
    setActiveIndex(index);
    localStorage.setItem('activeTabIndex', index.toString());
  };

  return (
    <TabContext.Provider value={{ activeIndex, setActiveIndex: updateActiveIndex }}>
      {children}
    </TabContext.Provider>
  );
};

