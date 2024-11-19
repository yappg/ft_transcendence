'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';

export default function Home_TFA() {
  const { setIsActivated } = useContext(SideBarContext);
  setIsActivated(1);
  return <div></div>;
}
