'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';

export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  setIsActivated(7);
  return <div></div>;
}
