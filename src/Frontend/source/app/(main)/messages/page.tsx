/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React from 'react';
import { ChatList, Messages } from '@/components/chat/chatCompos';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';

const App = () => {
  const {} = useContext(SideBarContext);
  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2  w-full pl-4">
      <div className="grid size-full grid-cols-3 gap-6 overflow-hidden p-[12px]">
        <Messages />
        <ChatList />
      </div>
    </div>
  );
};

export default App;
