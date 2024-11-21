/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React from 'react';
import { ChatList, Messages } from '@/components/chat/chatCompos';

const app = () => {
  return (
    <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-full px-11 py-8">
      <div className="grid size-full grid-cols-3 gap-6 overflow-hidden p-3">
        {/* actual chat-room */}
        <Messages />
        <ChatList />
      </div>
    </div>
  );
};

export default app;
